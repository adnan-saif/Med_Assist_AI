from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from bson import ObjectId
from app.models.user_model import PyObjectId

class ProfileModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str  # reference to UserModel.id as string
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_conditions: List[str] = []
    medications: List[str] = []
    allergies: List[str] = []
    preferences: dict = {}

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
