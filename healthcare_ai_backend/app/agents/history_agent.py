from app.services.mongo_service import MongoService
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

async def history_agent(user_id: str, mongo: MongoService, module: str = None, limit: int = 5) -> List[Dict]:
    """
    Fetch the last `limit` interactions for a specific user and module to provide context.
    """
    collection = mongo.get_collection("interactions")
    query = {"user_id": user_id}
    if module:
        query["module"] = module
    cursor = collection.find(query).sort("timestamp", -1).limit(limit)
    
    history = []
    async for doc in cursor:
        history.append({
            "query": doc.get("query"),
            "response": doc.get("final_response")
        })
    
    logger.info(f"Retrieved {len(history)} history items for user {user_id}")
    return history[::-1]
