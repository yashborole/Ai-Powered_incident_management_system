from fastapi import APIRouter, HTTPException
from app import schemas
from app.db_ops import dashboard

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/kpis/{plant_id}")
def get_kpis(plant_id: int):
    try:
        result = dashboard.get_kpis(plant_id=plant_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/activity/{plant_id}")
def get_activity(plant_id: int):
    try:
        result = dashboard.get_recent_activity(plant_id=plant_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/alerts/{plant_id}")
def get_alerts(plant_id: int):
    try:
        result = dashboard.get_active_alerts(plant_id=plant_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
