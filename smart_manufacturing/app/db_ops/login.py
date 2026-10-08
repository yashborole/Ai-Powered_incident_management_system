from app import models, schemas
from app.database import SessionLocal
from app.core.security import verify_password

def create_user(user: schemas.UserCreate):
    db = SessionLocal()
    try:
        db_user = models.User(**user.model_dump())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()

def get_users():
    db = SessionLocal()
    try:
        return db.query(models.User).all()
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

def get_user_by_id(user_id: int):
    db = SessionLocal()
    try:
        return db.query(models.User).filter(models.User.id == user_id).first()
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

def login(user_name: str, password: str):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.name == user_name).first()
        if not user or not verify_password(password, user.hashed_password):  # type: ignore
            return {"error": "Invalid username or password"}
        return {"message": "Login successful", "user_id": user.id, "name": user.name}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()
