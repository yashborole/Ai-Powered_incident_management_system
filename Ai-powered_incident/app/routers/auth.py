from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import LoginRequest, TokenResponse
from app.db_ops.user import UserDB
from app.core.security import verify_password, create_access_token
from app.auth.security import SECRET_KEY, ALGORITHM

from jose import jwt

router = APIRouter(prefix="/auth", tags=["Auth"])

user_db = UserDB()


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    success, user, err = user_db.get_user_by_email(credentials.email)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {err}",
        )

    if user is None or not verify_password(credentials.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.email)

    return TokenResponse(access_token=access_token, token_type="bearer")
