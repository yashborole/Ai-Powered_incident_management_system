from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from app.database import Base


class Machine(Base):
    __tablename__ = "machines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    machine_type = Column(String, nullable=True)
    status = Column(String, default="Idle")
    current_job_id = Column(Integer, nullable=True)
    plant_id = Column(Integer, nullable=False, index=True)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    part_name = Column(String, nullable=False)
    target_qty = Column(Integer, default=0)
    priority = Column(String, default="Normal")
    status = Column(String, default="Pending")
    units_produced = Column(Integer, default=0)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=True)
    plant_id = Column(Integer, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)


class Production(Base):
    __tablename__ = "productions"

    id = Column(Integer, primary_key=True, index=True)
    units_produced = Column(Integer, default=0)
    target_units = Column(Integer, default=0)
    rejected_qty = Column(Integer, default=0)
    defect_qty = Column(Integer, default=0)
    oee_score = Column(Float, default=0.0)
    defect_type = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    plant_id = Column(Integer, nullable=False, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=True)


class MachineLog(Base):
    __tablename__ = "machine_logs"

    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    status = Column(String, nullable=False)
    units_produced = Column(Integer, default=0)
    note = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    event = Column(Text, nullable=False)
    status = Column(String, nullable=True)
    plant_id = Column(Integer, nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, nullable=False, index=True)
    message = Column(Text, nullable=True)
    severity = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
