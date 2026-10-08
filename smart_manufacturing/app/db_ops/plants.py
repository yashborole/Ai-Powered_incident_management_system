from app import schemas
from app.database import SessionLocal
from sqlalchemy import text


def create_plant(plant: schemas.PlantCreate):
    db = SessionLocal()
    try:
        query = text("""
            INSERT INTO plants (name, description, location) 
            VALUES (:name, :description, :location) 
            RETURNING *
        """)
        result = db.execute(query, {
            "name": plant.name,
            "description": plant.description,
            "location": plant.location
        })
        db.commit()
        created_plant = result.mappings().first()
        return dict(created_plant) if created_plant else None
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()


def get_plants():
    db = SessionLocal()
    try:
        query = text("SELECT * FROM plants")
        result = db.execute(query)
        return [dict(row) for row in result.mappings().all()]
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def get_plant_by_id(plant_id: int):
    db = SessionLocal()
    try:
        query = text("SELECT * FROM plants WHERE id = :plant_id")
        result = db.execute(query, {"plant_id": plant_id})
        plant = result.mappings().first()
        return dict(plant) if plant else None
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def get_plants_for_user(user_id: int):
    db = SessionLocal()
    try:
        query = text("""
            SELECT p.* 
            FROM plants p 
            JOIN user_plants up ON p.id = up.plant_id 
            WHERE up.user_id = :user_id
        """)
        result = db.execute(query, {"user_id": user_id})
        return [dict(row) for row in result.mappings().all()]
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def assign_user_to_plant(user_id: int, plant_id: int):
    db = SessionLocal()
    try:
        user_check = db.execute(text("SELECT id FROM users WHERE id = :user_id"), {"user_id": user_id}).first()
        plant_check = db.execute(text("SELECT id FROM plants WHERE id = :plant_id"), {"plant_id": plant_id}).first()

        if not user_check or not plant_check:
            return {"error": "User or Plant not found"}

        assoc_check = db.execute(text("""
            SELECT 1 FROM user_plants 
            WHERE user_id = :user_id AND plant_id = :plant_id
        """), {"user_id": user_id, "plant_id": plant_id}).first()

        if not assoc_check:
            db.execute(text("""
                INSERT INTO user_plants (user_id, plant_id) 
                VALUES (:user_id, :plant_id)
            """), {"user_id": user_id, "plant_id": plant_id})
            db.commit()

        return {"message": "User assigned to plant successfully"}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        db.close()


def get_machine_insights(plant_id: int):
    db = SessionLocal()
    try:
        query = text("""
            SELECT m.id, m.name, m.machine_type, m.status,
                   COALESCE(SUM(p.units_produced), 0) AS total_produced,
                   COALESCE(SUM(p.target_units), 0) AS target_units
            FROM machines m
            LEFT JOIN productions p ON m.id = p.machine_id
            WHERE m.plant_id = :plant_id
            GROUP BY m.id
            ORDER BY m.name
        """)
        result = db.execute(query, {"plant_id": plant_id})

        insights = []
        for row in result.mappings().all():
            total_produced = row["total_produced"]
            target_units = row["target_units"]
            efficiency = round((total_produced / target_units * 100), 1) if target_units > 0 else 0.0

            insights.append({
                "id": row["id"],
                "name": row["name"],
                "machine_type": row["machine_type"],
                "status": row["status"],
                "total_produced": total_produced,
                "target_units": target_units,
                "efficiency": efficiency
            })

        return insights
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()


def get_machine_detail(machine_id: int):
    db = SessionLocal()
    try:
        machine_query = text("""
            SELECT m.*, p.name as plant_name 
            FROM machines m
            LEFT JOIN plants p ON m.plant_id = p.id
            WHERE m.id = :machine_id
        """)
        machine = db.execute(machine_query, {"machine_id": machine_id}).mappings().first()

        if not machine:
            return None

        prod_query = text("""
            SELECT * FROM productions 
            WHERE machine_id = :machine_id 
            ORDER BY date ASC LIMIT 7
        """)
        productions = db.execute(prod_query, {"machine_id": machine_id}).mappings().all()

        history = []
        total_produced = 0
        total_target = 0

        for p in productions:
            produced = p["units_produced"] or 0
            target = p["target_units"] or 0
            eff = round((produced / target * 100), 1) if target > 0 else 0.0

            history.append({
                "date": p["date"].strftime("%Y-%m-%d") if p["date"] else "",
                "day_name": p["date"].strftime("%a") if p["date"] else "",
                "produced": produced,
                "target": target,
                "efficiency": eff
            })
            total_produced += produced
            total_target += target

        avg_efficiency = round((total_produced / total_target * 100), 1) if total_target > 0 else 0.0
        latest_prod = history[-1] if history else {"produced": 0, "target": 0, "efficiency": 0.0}

        alerts_query = text("""
            SELECT * FROM alerts 
            WHERE plant_id = :plant_id 
              AND is_active = true 
              AND message ILIKE :machine_name
            ORDER BY created_at DESC
        """)
        alerts = db.execute(alerts_query, {
            "plant_id": machine["plant_id"],
            "machine_name": f"%{machine['name']}%"
        }).mappings().all()
        machine_alerts = [dict(a) for a in alerts]

        activities_query = text("""
            SELECT * FROM activity_logs 
            WHERE plant_id = :plant_id 
              AND event ILIKE :machine_name
            ORDER BY timestamp DESC
        """)
        activities = db.execute(activities_query, {
            "plant_id": machine["plant_id"],
            "machine_name": f"%{machine['name']}%"
        }).mappings().all()
        machine_activities = [dict(a) for a in activities]

        return {
            "id": machine["id"],
            "name": machine["name"],
            "machine_type": machine["machine_type"],
            "status": machine["status"],
            "plant_id": machine["plant_id"],
            "plant_name": machine["plant_name"] or "Unknown Plant",
            "latest_production": latest_prod,
            "avg_efficiency_7d": avg_efficiency,
            "total_produced_7d": total_produced,
            "history": history,
            "alerts": machine_alerts,
            "activities": machine_activities
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()
