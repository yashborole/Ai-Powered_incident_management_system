from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/incidents", tags=["Incidents"])

class TimelineEventModel(BaseModel):
    time: str
    type: str
    title: str
    description: Optional[str] = None
    severity: Optional[str] = "info"

class SimilarIncidentModel(BaseModel):
    id: str
    title: str
    similarity: int
    previousResolution: str
    resolvedAt: str

class RecommendedActionModel(BaseModel):
    id: str
    text: str
    completed: bool = False

class AIHypothesisModel(BaseModel):
    title: str
    confidence: int
    summary: str
    evidence: List[str]
    whyHypothesis: List[str]
    recommendedActions: List[RecommendedActionModel]
    similarIncidents: List[SimilarIncidentModel]
    suggestedRootCause: str
    suggestedResolution: str
    suggestedPreventiveAction: str

class ResolutionNotesModel(BaseModel):
    rootCause: str
    resolution: str
    preventiveAction: str
    resolvedBy: str
    resolvedAt: str

class IncidentModel(BaseModel):
    id: str
    applicationId: str
    applicationName: str
    serviceName: str
    title: str
    severity: str
    status: str
    detectedAt: str
    startedAt: str
    resolvedAt: Optional[str] = None
    description: str
    timeline: List[TimelineEventModel] = []
    aiInvestigation: Optional[AIHypothesisModel] = None
    resolutionNotes: Optional[ResolutionNotesModel] = None

class StatusUpdateInput(BaseModel):
    status: str

class ResolveInput(BaseModel):
    rootCause: str
    resolution: str
    preventiveAction: str

incidents_db: List[IncidentModel] = [
    IncidentModel(
        id="INC-1045",
        applicationId="app-ecommerce",
        applicationName="Friend E-commerce",
        serviceName="Payment API",
        title="Payment API latency increased significantly",
        severity="HIGH",
        status="INVESTIGATING",
        detectedAt="14:32 Today",
        startedAt="14:31 Today",
        description="Payment API latency increased 240% following deployment v1.4.2. Database connection pool reached 98% utilization with 14x timeout errors.",
        timeline=[
            TimelineEventModel(time="14:20", type="DEPLOYMENT", title="Deployment v1.4.2", description="Commit afec4f7 deployed to TEST environment by Yash Borole", severity="info"),
            TimelineEventModel(time="14:25", type="METRIC_SPIKE", title="Database latency increased", description="PostgreSQL avg query latency rose from 12ms to 320ms", severity="warning"),
            TimelineEventModel(time="14:28", type="METRIC_SPIKE", title="API latency increased", description="Payment API response time degraded to 420ms (P95 980ms)", severity="warning"),
            TimelineEventModel(time="14:30", type="ERROR_SPIKE", title="Error rate increased", description="HTTP 500 error rate surged to 8.4% on /payment/checkout", severity="danger"),
            TimelineEventModel(time="14:31", type="DETECTION", title="Incident detected", description="Automated reliability monitor triggered high-severity alert", severity="danger"),
            TimelineEventModel(time="14:35", type="ACTION", title="AI Investigation completed", description="Hypothesis formed with 87% confidence matching past incident INC-782", severity="info")
        ],
        aiInvestigation=AIHypothesisModel(
            title="Database connection pool exhaustion",
            confidence=87,
            summary="Payment API latency increased 240% due to MongoDB/PostgreSQL connection pool exhaustion following deployment v1.4.2.",
            evidence=[
                "DB connections reached 98% utilization ceiling",
                "Timeout errors increased 14x in the last 15 minutes",
                "Payment API latency spiked immediately after deployment v1.4.2",
                "Similar incident INC-782 found with 91% historical pattern match"
            ],
            whyHypothesis=[
                "14x increase in database timeout errors and connection wait queue depth",
                "98% connection utilization sustained over 10 consecutive minutes",
                "Direct correlation between deployment v1.4.2 config changes and connection leak",
                "Similar resolution in INC-782 resolved 100% of errors by resizing connection pool"
            ],
            recommendedActions=[
                RecommendedActionModel(id="act-1", text="Check database connection pool configuration (max_connections / pool_size)", completed=True),
                RecommendedActionModel(id="act-2", text="Review recent deployment v1.4.2 database session teardown logic", completed=False),
                RecommendedActionModel(id="act-3", text="Inspect active DB connections and kill idle unclosed transactions", completed=False),
                RecommendedActionModel(id="act-4", text="Scale pool size to 50 connections or enable PgBouncer connection reuse", completed=False)
            ],
            similarIncidents=[
                SimilarIncidentModel(id="INC-782", title="Database connection timeout during flash sale", similarity=91, previousResolution="Increased DB connection pool size from 20 to 60 and fixed unclosed session in checkout handler.", resolvedAt="1 week ago")
            ],
            suggestedRootCause="Database connection pool exhaustion caused by unclosed connection handlers in deployment v1.4.2 under peak load.",
            suggestedResolution="Increased connection pool size from 20 to 60, rolled out hotfix patch for session cleanup, and restarted service.",
            suggestedPreventiveAction="Add connection pool utilization alert at 80% threshold and implement strict contextual DB session scopes."
        )
    ),
    IncidentModel(
        id="INC-1044",
        applicationId="app-ecommerce",
        applicationName="Orders API",
        serviceName="Orders API",
        title="Order creation queue backpressure",
        severity="MEDIUM",
        status="OPEN",
        detectedAt="13:20 Today",
        startedAt="13:15 Today",
        description="Order processing queue lag increased by 45s. Background worker concurrency saturated.",
        timeline=[
            TimelineEventModel(time="13:15", type="METRIC_SPIKE", title="Queue depth increased", description="Kafka topic orders.process lag reached 1,200 messages", severity="warning"),
            TimelineEventModel(time="13:20", type="DETECTION", title="Incident detected", description="Queue SLA alert breached", severity="warning")
        ],
        aiInvestigation=AIHypothesisModel(
            title="Worker concurrency saturation",
            confidence=82,
            summary="Kafka consumer lag increased due to synchronous external inventory check.",
            evidence=[
                "Consumer lag exceeded 1,200 messages",
                "Worker thread utilization 100%",
                "Downstream inventory API latency 180ms"
            ],
            whyHypothesis=[
                "Worker batch processing was throttled by downstream synchronous network calls"
            ],
            recommendedActions=[
                RecommendedActionModel(id="act-101", text="Scale up worker replicas from 2 to 6", completed=False),
                RecommendedActionModel(id="act-102", text="Enable asynchronous inventory verification batching", completed=False)
            ],
            similarIncidents=[],
            suggestedRootCause="Queue worker starvation caused by blocking synchronous inventory verification calls.",
            suggestedResolution="Scaled worker pods to 6 and switched to batch inventory check.",
            suggestedPreventiveAction="Implement circuit breaker pattern on inventory client."
        )
    ),
    IncidentModel(
        id="INC-1042",
        applicationId="app-auth-service",
        applicationName="Auth API",
        serviceName="Token Verification",
        title="Intermittent 401 Unauthorized errors on token refresh",
        severity="LOW",
        status="INVESTIGATING",
        detectedAt="11:45 Today",
        startedAt="11:40 Today",
        description="Occasional clock skew validation failure on JWT token verification during high client concurrency.",
        timeline=[
            TimelineEventModel(time="11:40", type="ERROR_SPIKE", title="401 spike on /refresh", description="Rate of 401 responses rose from 0.01% to 0.4%", severity="warning"),
            TimelineEventModel(time="11:45", type="DETECTION", title="Incident detected", description="Auth anomaly threshold flagged", severity="info")
        ],
        aiInvestigation=AIHypothesisModel(
            title="Token clock skew mismatch",
            confidence=94,
            summary="NTP drift across application servers causing premature token expiry verification.",
            evidence=[
                "JWT tokens expired by < 2 seconds",
                "Server clock delta detected at 1.8 seconds"
            ],
            whyHypothesis=[
                "Client timestamp was slightly behind auth node validation window without leeway tolerance"
            ],
            recommendedActions=[
                RecommendedActionModel(id="act-201", text="Configure 10-second leeway in JWT decode verification", completed=True),
                RecommendedActionModel(id="act-202", text="Resync host system chrony / NTP daemon", completed=False)
            ],
            similarIncidents=[],
            suggestedRootCause="Absence of JWT leeway allowance in conjunction with server clock drift.",
            suggestedResolution="Added leeway=10 to jwt.decode and resynced NTP server.",
            suggestedPreventiveAction="Enforce NTP synchronization monitoring on all worker instances."
        )
    ),
    IncidentModel(
        id="INC-782",
        applicationId="app-ecommerce",
        applicationName="Friend E-commerce",
        serviceName="Payment API",
        title="Database connection timeout during flash sale",
        severity="HIGH",
        status="RESOLVED",
        detectedAt="1 week ago",
        startedAt="1 week ago",
        resolvedAt="1 week ago",
        description="Connection pool exhausted under heavy flash sale checkout load.",
        timeline=[
            TimelineEventModel(time="10:00", type="DETECTION", title="Alert triggered", severity="danger"),
            TimelineEventModel(time="10:15", type="ACTION", title="Pool resized and redeployed", severity="info"),
            TimelineEventModel(time="10:22", type="ACTION", title="Incident resolved", severity="info")
        ],
        resolutionNotes=ResolutionNotesModel(
            rootCause="Database connection pool size was capped at 20 while checkout traffic demanded 55 concurrent sessions.",
            resolution="Increased DB connection pool size from 20 to 60 and fixed unclosed session in checkout handler.",
            preventiveAction="Added automated database pool utilization metrics to monitoring dashboard.",
            resolvedBy="Yash Borole",
            resolvedAt="1 week ago"
        )
    )
]

@router.get("/", response_model=List[IncidentModel])
def get_incidents():
    return incidents_db

@router.get("/{incident_id}", response_model=IncidentModel)
def get_incident(incident_id: str):
    for inc in incidents_db:
        if inc.id == incident_id:
            return inc
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

@router.patch("/{incident_id}/status", response_model=IncidentModel)
def update_incident_status(incident_id: str, input_data: StatusUpdateInput):
    for inc in incidents_db:
        if inc.id == incident_id:
            inc.status = input_data.status
            inc.timeline.append(TimelineEventModel(
                time=datetime.now().strftime("%H:%M"),
                type="ACTION",
                title=f"Status changed to {input_data.status}",
                description="Status updated via dashboard",
                severity="info"
            ))
            return inc
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

@router.post("/{incident_id}/resolve", response_model=IncidentModel)
def resolve_incident(incident_id: str, input_data: ResolveInput):
    for inc in incidents_db:
        if inc.id == incident_id:
            inc.status = "RESOLVED"
            inc.resolvedAt = "Just now"
            inc.resolutionNotes = ResolutionNotesModel(
                rootCause=input_data.rootCause,
                resolution=input_data.resolution,
                preventiveAction=input_data.preventiveAction,
                resolvedBy="Yash Borole",
                resolvedAt=datetime.now().isoformat()
            )
            inc.timeline.append(TimelineEventModel(
                time=datetime.now().strftime("%H:%M"),
                type="ACTION",
                title="Incident Marked as Resolved",
                description=f"Resolution: {input_data.resolution}",
                severity="info"
            ))
            return inc
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident not found")

@router.patch("/{incident_id}/actions/{action_id}", response_model=IncidentModel)
def toggle_action(incident_id: str, action_id: str):
    for inc in incidents_db:
        if inc.id == incident_id and inc.aiInvestigation:
            for act in inc.aiInvestigation.recommendedActions:
                if act.id == action_id:
                    act.completed = not act.completed
                    return inc
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incident or action not found")
