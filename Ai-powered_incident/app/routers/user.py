import traceback
from typing import List
from fastapi import APIRouter, HTTPException, status

from app.schemas.user import UserCreate, UserResponse
from app.db_ops.user import UserDB
from fastapi import Depends

# pyrefly: ignore [missing-module-attribute]
from app.core.security import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

user_db = UserDB()


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    try:
        # Check if email is already registered
        status_ok, existing_user, err = user_db.get_user_by_email(user.email)
        if not status_ok:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {err}"
            )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create new user
        status_ok, new_user, err = user_db.create_user(user)
        if not status_ok:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create user: {err}"
            )

        return new_user

    except HTTPException:
        raise
    except Exception as e:
        err = traceback.format_exc()
        print(f"Error in create_user API endpoint:\n{err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/", response_model=List[UserResponse])
def get_users(skip: int = 0, limit: int = 100):
    try:
        status_ok, users, err = user_db.get_users(skip=skip, limit=limit)
        if not status_ok:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {err}"
            )
        return users

    except HTTPException:
        raise
    except Exception as e:
        err = traceback.format_exc()
        print(f"Error in get_users API endpoint:\n{err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int):
    try:
        status_ok, user, err = user_db.get_user(user_id)
        if not status_ok:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {err}"
            )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return user

    except HTTPException:
        raise
    except Exception as e:
        err = traceback.format_exc()
        print(f"Error in get_user API endpoint:\n{err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.delete("/{user_id}")
def delete_user(user_id: int):
    try:
        status_ok, user, err = user_db.delete_user(user_id)
        if not status_ok:
            if err == "User not found":
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {err}"
            )

        return {
            "message": "User deleted successfully",
            "id": user_id
        }

    except HTTPException:
        raise
    except Exception as e:
        err = traceback.format_exc()
        print(f"Error in delete_user API endpoint:\n{err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/me")
def get_current_user_info(
    current_user=Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }