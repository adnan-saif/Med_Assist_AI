from fastapi import APIRouter, Depends, HTTPException
from app.schemas.auth_schema import UserCreate, UserLogin, Token
from app.services.mongo_service import MongoService
from app.services.auth_service import AuthService
from app.dependencies import get_mongo_service, get_auth_service
from app.models.user_model import UserModel
from passlib.context import CryptContext
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register", response_model=Token)
async def register(user: UserCreate, mongo: MongoService = Depends(get_mongo_service), auth: AuthService = Depends(get_auth_service)):
    collection = mongo.get_collection("users")
    # Check if user exists
    existing = await collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed = pwd_context.hash(user.password)
    user_doc = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed,
        "full_name": user.full_name,
        "disabled": False
    }
    result = await collection.insert_one(user_doc)
    # Create profile placeholder
    profile_col = mongo.get_collection("profiles")
    await profile_col.insert_one({"user_id": str(result.inserted_id)})
    # Generate token
    access_token = auth.create_access_token(data={"sub": user.username})
    return Token(access_token=access_token)

@router.post("/login", response_model=Token)
async def login(user: UserLogin, mongo: MongoService = Depends(get_mongo_service), auth: AuthService = Depends(get_auth_service)):
    collection = mongo.get_collection("users")
    db_user = await collection.find_one({"username": user.username})
    if not db_user or not pwd_context.verify(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": user.username})
    return Token(access_token=access_token)
