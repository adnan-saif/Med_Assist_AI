from fastapi import Depends, HTTPException, status
from app.utils.jwt_handler import get_current_user
from app.schemas.auth_schema import TokenData

async def auth_agent(token: str = Depends(get_current_user)) -> TokenData:
    """Verifies JWT and returns user info."""
    # get_current_user already raises exception on failure
    return token
