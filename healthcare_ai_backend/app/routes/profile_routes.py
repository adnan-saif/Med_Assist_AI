from fastapi import APIRouter, Depends, HTTPException
from app.schemas.profile_schema import ProfileUpdate, ProfileResponse
from app.services.mongo_service import MongoService
from app.dependencies import get_mongo_service
from app.agents.auth_agent import auth_agent
from app.schemas.auth_schema import TokenData

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/me", response_model=ProfileResponse)
async def get_profile(current_user: TokenData = Depends(auth_agent), mongo: MongoService = Depends(get_mongo_service)):
    users = mongo.get_collection("users")
    user = await users.find_one({"username": current_user.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    profiles = mongo.get_collection("profiles")
    profile = await profiles.find_one({"user_id": user_id})
    if not profile:
        # Create default
        profile = {
            "user_id": user_id,
            "age": None,
            "gender": None,
            "medical_conditions": [],
            "medications": [],
            "allergies": [],
            "preferences": {}
        }
        await profiles.insert_one(profile)
    profile["username"] = user["username"]
    return ProfileResponse(**profile)

@router.put("/me", response_model=ProfileResponse)
async def update_profile(update: ProfileUpdate, current_user: TokenData = Depends(auth_agent), mongo: MongoService = Depends(get_mongo_service)):
    users = mongo.get_collection("users")
    user = await users.find_one({"username": current_user.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = str(user["_id"])
    profiles = mongo.get_collection("profiles")
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if update_data:
        result = await profiles.update_one({"user_id": user_id}, {"$set": update_data}, upsert=True)
    updated = await profiles.find_one({"user_id": user_id})
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update profile")
    updated["username"] = user["username"]
    return ProfileResponse(**updated)
