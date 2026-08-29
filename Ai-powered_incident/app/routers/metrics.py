from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/metrics", tags=["Metrics"])

class ReliabilityMetricsModel(BaseModel):
    mttdMinutes: int
    mttrMinutes: int
    availabilityPercent: float
    totalIncidents: int
    resolvedIncidents: int
    openIncidents: int

class MetricPointModel(BaseModel):
    timestamp: str
    requests: int
    errorRate: float
    latencyMs: int
    p95Ms: int

@router.get("/reliability", response_model=ReliabilityMetricsModel)
def get_reliability_metrics():
    return ReliabilityMetricsModel(
        mttdMinutes=4,
        mttrMinutes=38,
        availabilityPercent=99.82,
        totalIncidents=24,
        resolvedIncidents=21,
        openIncidents=3
    )

@router.get("/performance", response_model=List[MetricPointModel])
def get_performance_metrics(time_range: Optional[str] = "1h"):
    return [
        MetricPointModel(timestamp="14:00", requests=8200, errorRate=0.2, latencyMs=120, p95Ms=210),
        MetricPointModel(timestamp="14:05", requests=9100, errorRate=0.3, latencyMs=125, p95Ms=220),
        MetricPointModel(timestamp="14:10", requests=10400, errorRate=0.2, latencyMs=130, p95Ms=230),
        MetricPointModel(timestamp="14:15", requests=11200, errorRate=0.4, latencyMs=135, p95Ms=240),
        MetricPointModel(timestamp="14:20", requests=12500, errorRate=0.5, latencyMs=140, p95Ms=250),
        MetricPointModel(timestamp="14:25", requests=14200, errorRate=1.8, latencyMs=290, p95Ms=580),
        MetricPointModel(timestamp="14:28", requests=15800, errorRate=4.2, latencyMs=380, p95Ms=790),
        MetricPointModel(timestamp="14:30", requests=16400, errorRate=8.4, latencyMs=420, p95Ms=980),
        MetricPointModel(timestamp="14:35", requests=15100, errorRate=6.2, latencyMs=390, p95Ms=820),
        MetricPointModel(timestamp="14:40", requests=13900, errorRate=3.1, latencyMs=260, p95Ms=510),
        MetricPointModel(timestamp="14:45", requests=12800, errorRate=1.2, latencyMs=190, p95Ms=320),
        MetricPointModel(timestamp="14:50", requests=12100, errorRate=0.4, latencyMs=145, p95Ms=230),
    ]
