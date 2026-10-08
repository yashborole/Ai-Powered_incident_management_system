from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    check_sql = "SELECT column_name FROM information_schema.columns WHERE table_name='machines' AND column_name='current_job_id'"
    result = conn.execute(text(check_sql))
    exists = result.fetchone()
    if not exists:
        alter_sql = "ALTER TABLE machines ADD COLUMN current_job_id INTEGER REFERENCES jobs(id)"
        conn.execute(text(alter_sql))
        conn.commit()
        print("current_job_id column added!")
    else:
        print("current_job_id already exists.")
