from pydantic import BaseModel


class ServiceCreate(BaseModel):

    application_id: int
    name: str
    description: str | None = None
    service_type: str
    endpoint: str | None = None


class ServiceUpdate(BaseModel):

    name: str | None = None
    description: str | None = None
    service_type: str | None = None
    endpoint: str | None = None


class ServiceResponse(BaseModel):

    id: int
    application_id: int
    name: str
    description: str | None
    service_type: str
    endpoint: str | None
    status: str

    class Config:
        from_attributes = True