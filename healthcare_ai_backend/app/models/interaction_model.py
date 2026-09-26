from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId
from app.models.user_model import PyObjectId

class InteractionModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    query: str
    module: str
    namespace: List[str]
    retrieved_docs: List[Dict]
    final_response: str
    rag_score: float = 0.0
    session_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
