from sqlalchemy.orm import Session

from app import models
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate
)


def create_application(
    db: Session,
    application: ApplicationCreate
):

    db_application = models.Application(
        name=application.name,
        description=application.description,
        technology=application.technology,
        base_url=str(application.base_url),
        environment=application.environment
    )

    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application


def get_applications(db: Session):

    return db.query(
        models.Application
    ).all()


def get_application(
    db: Session,
    application_id: int
):

    return db.query(
        models.Application
    ).filter(
        models.Application.id == application_id
    ).first()


def update_application(
    db: Session,
    application_id: int,
    application: ApplicationUpdate
):

    db_application = get_application(
        db,
        application_id
    )

    if not db_application:
        return None

    update_data = application.model_dump(
        exclude_unset=True
    )

    if "base_url" in update_data:
        update_data["base_url"] = str(
            update_data["base_url"]
        )

    for key, value in update_data.items():

        setattr(
            db_application,
            key,
            value
        )

    db.commit()
    db.refresh(db_application)

    return db_application


def delete_application(
    db: Session,
    application_id: int
):

    db_application = get_application(
        db,
        application_id
    )

    if not db_application:
        return None

    db.delete(db_application)
    db.commit()

    return db_application