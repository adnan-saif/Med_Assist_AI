from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, profile_routes, chat_routes
from app.services.mongo_service import MongoService
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# MongoDB connection events
@app.on_event("startup")
async def startup_db():
    from app.dependencies import mongo_service
    await mongo_service.connect()

@app.on_event("shutdown")
async def shutdown_db():
    from app.dependencies import mongo_service
    await mongo_service.close()

# Include routers
app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(chat_routes.router)

@app.get("/")
async def root():
    return {"message": "Healthcare AI Backend Running"}
