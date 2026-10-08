from app.database import SessionLocal
from sqlalchemy import text

def reset_machine_data():
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM machine_logs"))
        db.execute(text("DELETE FROM activity_logs"))
        db.execute(text("DELETE FROM productions"))
        db.execute(text("DELETE FROM alerts"))
        db.execute(text("UPDATE machines SET status = 'Idle', current_job_id = NULL"))
        db.execute(text("DELETE FROM jobs"))
        db.commit()
        print("All machine data cleared. Machines reset to Idle.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_machine_data()
