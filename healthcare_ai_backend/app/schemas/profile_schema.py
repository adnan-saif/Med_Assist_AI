from pydantic import BaseModel
from typing import Optional, List

class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_conditions: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    preferences: Optional[dict] = None

class ProfileResponse(BaseModel):
    user_id: str
    username: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_conditions: List[str] = []
    medications: List[str] = []
    allergies: List[str] = []
    preferences: dict = {}
