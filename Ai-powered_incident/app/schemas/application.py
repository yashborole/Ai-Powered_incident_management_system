from pydantic import BaseModel, HttpUrl


class ApplicationCreate(BaseModel):

    name: str
    description: str | None = None
    technology: str
    base_url: HttpUrl
    environment: str


class ApplicationUpdate(BaseModel):

    name: str | None = None
    description: str | None = None
    technology: str | None = None
    base_url: HttpUrl | None = None
    environment: str | None = None


class ApplicationResponse(BaseModel):

    id: int
    name: str
    description: str | None
    technology: str
    base_url: str
    environment: str
    status: str

    class Config:
        from_attributes = True