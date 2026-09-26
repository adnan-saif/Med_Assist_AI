from fastapi import APIRouter, Depends
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.services.mongo_service import MongoService
from app.services.pinecone_service import PineconeService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.dependencies import get_mongo_service, get_pinecone_service, get_embedding_service, get_llm_service
from app.agents.auth_agent import auth_agent
from app.agents.profile_agent import profile_agent
from app.agents.intent_agent import intent_agent
from app.agents.namespace_agent import namespace_agent
from app.agents.embedding_agent import embedding_agent
from app.agents.retrieval_agent import retrieval_agent
from app.agents.history_agent import history_agent
from app.agents.reasoning_agent import reasoning_agent
from app.agents.safety_agent import safety_agent
from app.agents.response_agent import response_agent
from app.agents.logging_agent import logging_agent
from app.schemas.auth_schema import TokenData
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: TokenData = Depends(auth_agent),
    mongo: MongoService = Depends(get_mongo_service),
    pinecone: PineconeService = Depends(get_pinecone_service),
    embedding: EmbeddingService = Depends(get_embedding_service),
    llm: LLMService = Depends(get_llm_service)
):
    # 1. Profile Agent: get user profile
    users = mongo.get_collection("users")
    user = await users.find_one({"username": current_user.username})
    if not user:
        user_id = "unknown"
    else:
        user_id = str(user["_id"])
    profile = await profile_agent(user_id, mongo)

    # 2. Intent Agent: detect module
    module = intent_agent(request.query, request.module)

    # 1.5. History Agent: get recent chat history for the module
    history = await history_agent(user_id, mongo, module=module, limit=5)

    # 3. Namespace Agent: map to Pinecone namespace
    namespace = namespace_agent(module)

    # 4. Embedding Agent: embed user query
    query_vector = await embedding_agent(request.query, embedding)

    # 5. Retrieval Agent: get relevant documents
    retrieved = await retrieval_agent(query_vector, namespace, request.top_k, pinecone)

    # 6. Reasoning Agent: generate response using LLM (with history)
    raw_response = await reasoning_agent(request.query, profile, retrieved, llm, history=history)

    # 7. Safety Agent: check for dangerous content
    safe_response, warned = safety_agent(raw_response)

    # 8. Response Agent: format final output
    rag_score = sum([d["score"] for d in retrieved]) / len(retrieved) if retrieved else 0.0
    final_response = response_agent(safe_response, rag_score=rag_score)

    # 9. Logging Agent: store interaction
    await logging_agent(user_id, request.query, module, namespace, retrieved, safe_response, mongo, rag_score=rag_score, session_id=request.session_id)

    return final_response

@router.get("/history")
async def get_chat_history(
    current_user: TokenData = Depends(auth_agent),
    mongo: MongoService = Depends(get_mongo_service)
):
    users = mongo.get_collection("users")
    user = await users.find_one({"username": current_user.username})
    if not user:
        return {}
    user_id = str(user["_id"])
    
    collection = mongo.get_collection("interactions")
    cursor = collection.find({"user_id": user_id}).sort("timestamp", 1) # chronological order
    
    history_by_module_session = {}
    async for doc in cursor:
        module = doc.get("module", "medical")
        if module not in history_by_module_session:
            history_by_module_session[module] = {}
        
        session_id = doc.get("session_id") or "default"
        if session_id not in history_by_module_session[module]:
            history_by_module_session[module][session_id] = []
        
        if doc.get("query"):
            history_by_module_session[module][session_id].append({"role": "user", "content": doc.get("query")})
        if doc.get("final_response"):
            history_by_module_session[module][session_id].append({"role": "ai", "content": doc.get("final_response")})
            
    return history_by_module_session
