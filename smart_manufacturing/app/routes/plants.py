from fastapi import APIRouter, HTTPException
from app import schemas
from app.db_ops import plants

router = APIRouter(prefix="/plants", tags=["Plants"])


@router.post("/", status_code=201)
def create_plant(plant: schemas.PlantCreate):
    try:
        result = plants.create_plant(plant=plant)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_plants():
    try:
        result = plants.get_plants()
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{plant_id}")
def get_plant(plant_id: int):
    try:
        plant = plants.get_plant_by_id(plant_id=plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plant not found")
        if isinstance(plant, dict) and "error" in plant:
            raise HTTPException(status_code=400, detail=plant["error"])
        return plant
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user/{user_id}")
def get_user_plants(user_id: int):
    try:
        result = plants.get_plants_for_user(user_id=user_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{plant_id}/assign/{user_id}")
def assign_plant(plant_id: int, user_id: int):
    try:
        result = plants.assign_user_to_plant(user_id=user_id, plant_id=plant_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{plant_id}/machines")
def get_plant_machines_insights(plant_id: int):
    try:
        result = plants.get_machine_insights(plant_id=plant_id)
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/machines/{machine_id}")
def get_machine_detail(machine_id: int):
    try:
        result = plants.get_machine_detail(machine_id=machine_id)
        if not result:
            raise HTTPException(status_code=404, detail="Machine not found")
        if isinstance(result, dict) and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
