from app.services.mongo_service import MongoService
from app.services.pinecone_service import PineconeService
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService
from app.services.auth_service import AuthService
from app.config import settings

# Singleton instances
mongo_service = MongoService()
pinecone_service = PineconeService()
embedding_service = EmbeddingService()
llm_service = LLMService()
auth_service = AuthService()

async def get_mongo_service():
    return mongo_service

async def get_pinecone_service():
    return pinecone_service

async def get_embedding_service():
    return embedding_service

async def get_llm_service():
    return llm_service

async def get_auth_service():
    return auth_service
