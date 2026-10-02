from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.core.database import Base


class Service(Base):

    __tablename__ = "services"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False
    )

    name = Column(
        String(100),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    service_type = Column(
        String(50),
        nullable=False
    )

    endpoint = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(30),
        default="HEALTHY",
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )