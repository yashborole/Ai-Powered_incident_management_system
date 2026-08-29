from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine
from app.routers.user import router as user_router
from app.routers import auth
from app.routers.applications import router as applications_router
from app.routers.incidents import router as incidents_router
from app.routers.metrics import router as metrics_router
from app.routers.logs import router as logs_router
from app.routers.ai import router as ai_router
from app.routers.knowledge import router as knowledge_router

from dotenv import load_dotenv

load_dotenv()


app = FastAPI(
    title="AI Application Reliability & Incident Investigation Platform",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All Subsystem Routers
app.include_router(user_router)
app.include_router(auth.router)
app.include_router(applications_router)
app.include_router(incidents_router)
app.include_router(metrics_router)
app.include_router(logs_router)
app.include_router(ai_router)
app.include_router(knowledge_router)


@app.get("/")
def root():
    return {
        "message": "AI Incident Platform is running",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/db-test")
def database_test():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {"message": "Database connection successful", "status": "connected"}
    except Exception as e:
        return {"error": str(e), "status": "error"}
