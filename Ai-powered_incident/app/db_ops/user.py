import traceback

from app.core.database import DBOps
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserDB:

    def create_user(self, user: UserCreate):
        db_inst = DBOps()
        with db_inst as db:
            try:
                db_user = User(
                    name=user.name,
                    email=user.email,
                    hashed_password=get_password_hash(user.password),
                    role=user.role,
                )
                db.add(db_user)
                db.commit()
                db.refresh(db_user)
                return True, db_user, ""
            except Exception as e:
                err = traceback.format_exc()
                print(f"Error in create_user DB operation:\n{err}")
                return False, None, str(e)

    def get_users(self, skip: int = 0, limit: int = 100):
        db_inst = DBOps()
        with db_inst as db:
            try:
                users = db.query(User).offset(skip).limit(limit).all()
                return True, users, ""
            except Exception as e:
                err = traceback.format_exc()
                print(f"Error in get_users DB operation:\n{err}")
                return False, [], str(e)

    def get_user(self, user_id: int):
        db_inst = DBOps()
        with db_inst as db:
            try:
                user = db.query(User).filter(User.id == user_id).first()
                return True, user, ""
            except Exception as e:
                err = traceback.format_exc()
                print(f"Error in get_user DB operation:\n{err}")
                return False, None, str(e)

    def get_user_by_email(self, email: str):
        db_inst = DBOps()
        with db_inst as db:
            try:
                user = db.query(User).filter(User.email == email).first()
                return True, user, ""
            except Exception as e:
                err = traceback.format_exc()
                print(f"Error in get_user_by_email DB operation:\n{err}")
                return False, None, str(e)

    def delete_user(self, user_id: int):
        db_inst = DBOps()
        with db_inst as db:
            try:
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    return False, None, "User not found"
                db.delete(user)
                db.commit()
                return True, user, ""
            except Exception as e:
                err = traceback.format_exc()
                print(f"Error in delete_user DB operation:\n{err}")
                return False, None, str(e)
