from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI RCA & Assistant"])

class AskQuestionInput(BaseModel):
    incidentId: str
    question: str

class AIQuestionResponse(BaseModel):
    answer: str
    confidence: int
    sources: List[str]

@router.post("/ask", response_model=AIQuestionResponse)
def ask_ai(input_data: AskQuestionInput):
    q = input_data.question.lower()

    if "database" in q or "db" in q or "why" in q:
        return AIQuestionResponse(
            answer="The platform detected a 14x surge in `sqlalchemy.exc.TimeoutError: QueuePool limit of size 20 reached` logs starting right at 14:25 after deployment v1.4.2. Database active connections reached 98% utilization while average query latency jumped from 12ms to 320ms.",
            confidence=89,
            sources=["PostgreSQL Metrics", "Payment API App Logs", "Deployment v1.4.2 Diff", "Runbook KB-1"]
        )
    elif "deployment" in q or "commit" in q or "change" in q:
        return AIQuestionResponse(
            answer="Deployment v1.4.2 (commit `afec4f7` by Yash Borole) modified the database session handler in the checkout flow. The new handler omitted `db.close()` in an exception branch, creating an unclosed session leak under concurrent traffic.",
            confidence=94,
            sources=["Git Commit afec4f7", "Telemetry Events", "Stack Trace at 14:32:10"]
        )
    elif "fix" in q or "resolve" in q or "action" in q:
        return AIQuestionResponse(
            answer="Recommended resolution: 1) Increase connection pool max_overflow to 40 in config. 2) Deploy a hotfix ensuring database sessions are wrapped in context managers (`with db:`). 3) Terminate idle unclosed sessions in PostgreSQL.",
            confidence=92,
            sources=["Historical Incident INC-782", "Runbook: Database connection pool tuning"]
        )
    else:
        return AIQuestionResponse(
            answer=f"Based on automated telemetry correlation for {input_data.incidentId}, the symptoms are directly traced to downstream connection exhaustion triggered after the latest release. Correlating 4 metrics and 2 historical incidents confirms high probability of connection leak.",
            confidence=85,
            sources=["Application Metrics", "System Logs", "Knowledge Base"]
        )
