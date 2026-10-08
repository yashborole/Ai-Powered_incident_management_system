from fastapi import APIRouter, HTTPException
from app import schemas
from app.db_ops import login

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=schemas.UserResponse, status_code=201)
def create_user(user: schemas.UserCreate):
    return login.create_user(user=user)

@router.get("/", response_model=list[schemas.UserResponse])
def get_users():
    return login.get_users()

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int):
    user = login.get_user_by_id(user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
    
@router.post("/login")
def login_user(user_name: str, password: str):
    try:
        result = login.login(user_name=user_name, password=password)
        if "error" in result:
            raise HTTPException(status_code=401, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))