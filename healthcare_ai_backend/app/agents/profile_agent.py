from app.services.mongo_service import MongoService
from app.models.profile_model import ProfileModel

async def profile_agent(user_id: str, mongo: MongoService) -> ProfileModel:
    collection = mongo.get_collection("profiles")
    profile_doc = await collection.find_one({"user_id": user_id})
    if profile_doc:
        return ProfileModel(**profile_doc)
    # Return empty profile if not found
    return ProfileModel(user_id=user_id)
