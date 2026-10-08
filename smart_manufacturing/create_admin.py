import sys
import os
import getpass

# Add current directory to path to allow importing app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def create_admin():
    print("=== Create Admin User ===")
    username = input("Enter username: ").strip()
    email = input("Enter email: ").strip()
    password = getpass.getpass("Enter password: ").strip()
    
    if not username or not email or not password:
        print("Error: All fields are required.")
        return

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter((User.name == username) | (User.email == email)).first()
        if existing_user:
            print("Error: A user with this username or email already exists.")
            return
        hashed_password = get_password_hash(password)
        new_user = User(
            name=username,
            email=email,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        print(f"Success! Admin user '{username}' created successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
