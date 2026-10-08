import auth
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.login import router as users_router
from app.routes.plants import router as plants_router
from app.routes.dashboard import router as dashboard_router
from app.routes.kiosk import router as kiosk_router

app = FastAPI(title="Smart Manufacturing API")
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(plants_router)
app.include_router(dashboard_router)
app.include_router(kiosk_router)