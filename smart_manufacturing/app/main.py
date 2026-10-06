from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db_ops import dashboard, kiosk

app = FastAPI(title="Smart Manufacturing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Smart Manufacturing API is running"}


# --- Dashboard Endpoints ---

@app.get("/api/dashboard/kpis")
def get_dashboard_kpis(plant_id: int = Query(..., description="Plant ID")):
    return dashboard.get_kpis(plant_id=plant_id)


@app.get("/api/dashboard/recent-activity")
def get_recent_activity(plant_id: int = Query(..., description="Plant ID"), limit: int = 10):
    return dashboard.get_recent_activity(plant_id=plant_id, limit=limit)


@app.get("/api/dashboard/active-alerts")
def get_active_alerts(plant_id: int = Query(..., description="Plant ID")):
    return dashboard.get_active_alerts(plant_id=plant_id)


# --- Kiosk Endpoints ---

@app.get("/api/kiosk/machines")
def get_kiosk_machines(plant_id: int = Query(..., description="Plant ID")):
    return kiosk.get_kiosk_machines(plant_id=plant_id)


@app.get("/api/kiosk/machines/{machine_id}/jobs")
def get_jobs_for_machine(machine_id: int):
    return kiosk.get_jobs_for_machine(machine_id=machine_id)


@app.post("/api/kiosk/jobs")
def create_job(job_data: dict):
    return kiosk.create_job(job_data=job_data)


@app.post("/api/kiosk/jobs/{job_id}/run")
def run_job(job_id: int):
    return kiosk.run_job(job_id=job_id)


@app.post("/api/kiosk/jobs/{job_id}/complete")
def complete_job(job_id: int, units_produced: int = Query(...)):
    return kiosk.complete_job(job_id=job_id, units_produced=units_produced)


@app.post("/api/kiosk/jobs/{job_id}/cancel")
def cancel_job(job_id: int):
    return kiosk.cancel_job(job_id=job_id)


@app.post("/api/kiosk/machines/{machine_id}/status")
def set_machine_status(machine_id: int, status: str, note: str = None):
    return kiosk.set_machine_status(machine_id=machine_id, status=status, note=note)


@app.get("/api/kiosk/machines/{machine_id}/logs")
def get_machine_logs(machine_id: int, limit: int = 30):
    return kiosk.get_machine_logs(machine_id=machine_id, limit=limit)
