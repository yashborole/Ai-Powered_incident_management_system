from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/applications", tags=["Applications"])

class ServiceModel(BaseModel):
    id: str
    name: str
    requests: int = 0
    latencyMs: int = 80
    errorRate: float = 0.0
    status: str = "healthy"
    lastUpdated: Optional[str] = "Just now"

class DeploymentModel(BaseModel):
    id: str
    version: str
    commitHash: str
    author: str
    timestamp: str
    status: str
    summary: str
    associatedIncidentId: Optional[str] = None

class ApplicationModel(BaseModel):
    id: str
    name: str
    technology: str
    environment: str
    status: str = "healthy"
    uptime: float = 99.8
    errorRate: float = 0.4
    requestsCount: int = 125430
    avgLatencyMs: int = 182
    baseUrl: str
    description: str
    services: List[ServiceModel] = []
    deployments: List[DeploymentModel] = []
    createdAt: Optional[str] = None

class ApplicationCreateInput(BaseModel):
    name: str
    technology: str = "MERN"
    baseUrl: str
    environment: str = "TEST"
    description: str = ""

class AddServiceInput(BaseModel):
    name: str

# In-memory storage with initial default apps
apps_db: List[ApplicationModel] = [
    ApplicationModel(
        id="app-ecommerce",
        name="Friend E-commerce",
        technology="MERN",
        environment="TEST",
        status="healthy",
        uptime=99.8,
        errorRate=0.4,
        requestsCount=125430,
        avgLatencyMs=182,
        baseUrl="http://localhost:5000",
        description="Main customer-facing shopping storefront and checkout microservices.",
        createdAt="2026-07-15T10:00:00Z",
        services=[
            ServiceModel(id="srv-auth", name="Auth API", requests=15800, latencyMs=150, errorRate=0.3, status="healthy", lastUpdated="Just now"),
            ServiceModel(id="srv-orders", name="Orders API", requests=18200, latencyMs=185, errorRate=0.8, status="healthy", lastUpdated="Just now"),
            ServiceModel(id="srv-payment", name="Payment API", requests=8500, latencyMs=420, errorRate=3.2, status="critical", lastUpdated="1 min ago"),
            ServiceModel(id="srv-inventory", name="Inventory API", requests=22400, latencyMs=110, errorRate=0.1, status="healthy", lastUpdated="Just now"),
        ],
        deployments=[
            DeploymentModel(id="dep-101", version="v1.4.2", commitHash="afec4f7", author="Yash Borole", timestamp="14:20 Today", status="SUCCESS", summary="Build order apis and connection pool tuning", associatedIncidentId="INC-1045"),
            DeploymentModel(id="dep-100", version="v1.4.1", commitHash="e0cc6fb", author="Yash Borole", timestamp="Yesterday", status="SUCCESS", summary="Fix order API and add product API"),
            DeploymentModel(id="dep-099", version="v1.4.0", commitHash="66df311", author="Engineering Team", timestamp="3 days ago", status="SUCCESS", summary="Add product catalog caching"),
        ]
    ),
    ApplicationModel(
        id="app-payment-service",
        name="Payment Service",
        technology="Node.js",
        environment="TEST",
        status="degraded",
        uptime=98.2,
        errorRate=2.8,
        requestsCount=45200,
        avgLatencyMs=380,
        baseUrl="http://localhost:5001",
        description="Payment gateway integration and settlement processor.",
        createdAt="2026-07-20T14:30:00Z",
        services=[
            ServiceModel(id="srv-stripe", name="Stripe Gateway", requests=28000, latencyMs=340, errorRate=2.4, status="degraded"),
            ServiceModel(id="srv-settle", name="Settlement Engine", requests=17200, latencyMs=410, errorRate=3.5, status="degraded"),
        ],
        deployments=[
            DeploymentModel(id="dep-201", version="v2.1.0", commitHash="7b9c1d2", author="Payment Team", timestamp="Today 11:00", status="SUCCESS", summary="Update webhook signature verification")
        ]
    ),
    ApplicationModel(
        id="app-inventory-api",
        name="Inventory API",
        technology="FastAPI",
        environment="PRODUCTION",
        status="healthy",
        uptime=99.9,
        errorRate=0.1,
        requestsCount=92100,
        avgLatencyMs=95,
        baseUrl="http://localhost:8000",
        description="Real-time warehouse stock synchronization and tracking API.",
        createdAt="2026-08-01T09:00:00Z",
        services=[
            ServiceModel(id="srv-stock", name="Stock Sync Service", requests=62000, latencyMs=85, errorRate=0.05, status="healthy"),
            ServiceModel(id="srv-warehouse", name="Warehouse Connector", requests=30100, latencyMs=115, errorRate=0.15, status="healthy"),
        ],
        deployments=[
            DeploymentModel(id="dep-301", version="v1.0.8", commitHash="4f2e9a1", author="Backend Team", timestamp="2 days ago", status="SUCCESS", summary="Optimized stock query indexes")
        ]
    ),
    ApplicationModel(
        id="app-auth-service",
        name="Auth & Identity Service",
        technology="Python",
        environment="PRODUCTION",
        status="healthy",
        uptime=99.95,
        errorRate=0.05,
        requestsCount=180300,
        avgLatencyMs=65,
        baseUrl="http://localhost:8001",
        description="Central OAuth2 and JWT token authentication & role management.",
        createdAt="2026-06-10T12:00:00Z",
        services=[
            ServiceModel(id="srv-jwt", name="Token Verification", requests=120000, latencyMs=45, errorRate=0.02, status="healthy"),
            ServiceModel(id="srv-rbac", name="RBAC Policy Provider", requests=60300, latencyMs=85, errorRate=0.08, status="healthy"),
        ],
        deployments=[
            DeploymentModel(id="dep-401", version="v3.0.0", commitHash="1a2b3c4", author="Security Team", timestamp="5 days ago", status="SUCCESS", summary="Added OAuth2 scopes support")
        ]
    )
]

@router.get("/", response_model=List[ApplicationModel])
def get_applications():
    return apps_db

@router.get("/{app_id}", response_model=ApplicationModel)
def get_application(app_id: str):
    for a in apps_db:
        if a.id == app_id:
            return a
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

@router.post("/", response_model=ApplicationModel, status_code=status.HTTP_201_CREATED)
def create_application(input_data: ApplicationCreateInput):
    app_id = f"app-{input_data.name.lower().replace(' ', '-')}"
    new_app = ApplicationModel(
        id=app_id,
        name=input_data.name,
        technology=input_data.technology,
        environment=input_data.environment,
        baseUrl=input_data.baseUrl,
        description=input_data.description,
        status="healthy",
        uptime=99.9,
        errorRate=0.0,
        requestsCount=0,
        avgLatencyMs=80,
        services=[
            ServiceModel(id=f"srv-{input_data.name.lower()}", name=f"{input_data.name} Core", requests=0, latencyMs=80, errorRate=0.0, status="healthy")
        ],
        deployments=[
            DeploymentModel(id="dep-init", version="v1.0.0", commitHash="init001", author="Yash Borole", timestamp="Just now", status="SUCCESS", summary="Initial setup")
        ]
    )
    apps_db.insert(0, new_app)
    return new_app

@router.post("/{app_id}/services", response_model=ServiceModel, status_code=status.HTTP_201_CREATED)
def add_service(app_id: str, service_input: AddServiceInput):
    for a in apps_db:
        if a.id == app_id:
            srv = ServiceModel(
                id=f"srv-{len(a.services) + 1}",
                name=service_input.name,
                requests=1200,
                latencyMs=95,
                errorRate=0.0,
                status="healthy",
                lastUpdated="Just now"
            )
            a.services.append(srv)
            return srv
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
