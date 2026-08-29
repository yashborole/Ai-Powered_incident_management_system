from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/logs", tags=["Logs"])

class LogEntryModel(BaseModel):
    id: str
    timestamp: str
    timeDisplay: str
    severity: str
    service: str
    message: str

logs_db = [
    LogEntryModel(id="log-1", timestamp="2026-08-28T14:32:01Z", timeDisplay="14:32:01", severity="INFO", service="Friend E-commerce", message="GET /products 200 OK (24ms)"),
    LogEntryModel(id="log-2", timestamp="2026-08-28T14:32:02Z", timeDisplay="14:32:02", severity="INFO", service="Orders API", message="POST /orders 201 Created (142ms)"),
    LogEntryModel(id="log-3", timestamp="2026-08-28T14:32:03Z", timeDisplay="14:32:03", severity="ERROR", service="Payment API", message="MongoDB connection timeout after 5000ms"),
    LogEntryModel(id="log-4", timestamp="2026-08-28T14:32:04Z", timeDisplay="14:32:04", severity="ERROR", service="Payment API", message="POST /payment 500 Internal Server Error (5012ms)"),
    LogEntryModel(id="log-5", timestamp="2026-08-28T14:32:05Z", timeDisplay="14:32:05", severity="ERROR", service="Payment API", message="Database connection pool exhausted: active=49/50 waiting=23"),
    LogEntryModel(id="log-6", timestamp="2026-08-28T14:32:06Z", timeDisplay="14:32:06", severity="WARN", service="Payment API", message="Circuit breaker tripped for payment gateway downstream"),
    LogEntryModel(id="log-7", timestamp="2026-08-28T14:32:08Z", timeDisplay="14:32:08", severity="INFO", service="Inventory API", message="GET /inventory/sku-4921 200 OK (18ms)"),
    LogEntryModel(id="log-8", timestamp="2026-08-28T14:32:10Z", timeDisplay="14:32:10", severity="ERROR", service="Payment API", message="sqlalchemy.exc.TimeoutError: QueuePool limit of size 20 overflow 10 reached"),
    LogEntryModel(id="log-9", timestamp="2026-08-28T14:32:12Z", timeDisplay="14:32:12", severity="INFO", service="Auth API", message="POST /auth/verify-token 200 OK (12ms)"),
    LogEntryModel(id="log-10", timestamp="2026-08-28T14:32:15Z", timeDisplay="14:32:15", severity="WARN", service="Orders API", message="Order checkout deferred due to payment retry queue"),
]

@router.get("/", response_model=List[LogEntryModel])
def get_logs(query: Optional[str] = None, severity: Optional[str] = None, service: Optional[str] = None):
    results = logs_db
    if query:
        results = [l for l in results if query.lower() in l.message.lower() or query.lower() in l.service.lower()]
    if severity and severity != "ALL":
        results = [l for l in results if l.severity == severity]
    if service and service != "ALL":
        results = [l for l in results if l.service == service]
    return results
