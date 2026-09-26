from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    query: str
    module: Optional[str] = None   # e.g., "medical", "drug", "herbal", "diet", "fitness"
    session_id: Optional[str] = None
    top_k: int = 5

class ChatResponse(BaseModel):
    response: str
    rag_score: float = 0.0
