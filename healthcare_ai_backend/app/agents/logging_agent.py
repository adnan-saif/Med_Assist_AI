from app.services.mongo_service import MongoService
from app.models.interaction_model import InteractionModel
import logging

logger = logging.getLogger(__name__)

async def logging_agent(user_id: str, query: str, module: str, namespace: list, retrieved_docs: list, final_response: str, mongo: MongoService, rag_score: float = 0.0, session_id: str = None):
    interaction = InteractionModel(
        user_id=user_id,
        query=query,
        module=module,
        namespace=namespace,
        retrieved_docs=retrieved_docs,
        final_response=final_response,
        rag_score=rag_score,
        session_id=session_id
    )
    collection = mongo.get_collection("interactions")
    try:
        await collection.insert_one(interaction.model_dump(by_alias=True, exclude_none=True))
    except Exception as e:
        logger.error(f"Failed to log interaction: {e}")
