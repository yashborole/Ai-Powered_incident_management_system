from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])

class KnowledgeDocModel(BaseModel):
    id: str
    title: str
    type: str
    updatedAt: str
    author: str
    tags: List[str] = []
    summary: str
    content: str

class CreateDocInput(BaseModel):
    title: str
    type: str
    author: str = "Yash Borole"
    tags: List[str] = []
    summary: str
    content: str

knowledge_db = [
    KnowledgeDocModel(
        id="kb-1",
        title="Payment troubleshooting & timeout runbook",
        type="Runbook",
        updatedAt="Today",
        author="Yash Borole",
        tags=["Payment", "Stripe", "Database", "Runbook"],
        summary="Standard operating procedure for handling Payment API latency degradation and gateway timeouts.",
        content="# Payment Troubleshooting Runbook\n\n## 1. Quick Diagnostics\n- Check database connection pool: `SELECT count(*) FROM pg_stat_activity WHERE state = 'active';`\n- Inspect payment gateway health status on Stripe / provider dashboard.\n- Verify Redis cache cluster latency.\n\n## 2. Mitigation Steps\n1. Scale payment worker instances up by 2x.\n2. If DB pool is saturated (>90%), increase `POOL_SIZE` in config and run rolling restart.\n3. Check for long-running unindexed queries holding table locks."
    ),
    KnowledgeDocModel(
        id="kb-2",
        title="Database connection pool sizing and tuning guide",
        type="Runbook",
        updatedAt="Yesterday",
        author="Database Team",
        tags=["PostgreSQL", "Connection Pool", "Performance"],
        summary="Best practices for configuring connection pools with SQLAlchemy and PgBouncer.",
        content="# Database Connection Pool Tuning\n\nCalculated formula for optimal pool size:\n```\nconnections = ((core_count * 2) + effective_spindle_count)\n```\n\nAlways ensure that your web application closes sessions with a context manager (`with db:`) to avoid orphan leaks."
    ),
    KnowledgeDocModel(
        id="kb-3",
        title="Production deployment guide & rollback procedures",
        type="Documentation",
        updatedAt="3 days ago",
        author="DevOps Lead",
        tags=["CI/CD", "Deployments", "Rollback"],
        summary="Zero-downtime deployment guidelines, canary testing, and automated rollback triggers.",
        content="# Deployment & Rollback Guide\n\nBefore promoting a release to production:\n- Ensure database migrations have backwards compatibility.\n- Run integration test suites against staging environment.\n- In case of >2% error rate spike, execute instant automated rollback via CLI."
    ),
    KnowledgeDocModel(
        id="kb-4",
        title="INC-782 Post-Mortem & Resolution Report",
        type="Incident",
        updatedAt="1 week ago",
        author="Yash Borole",
        tags=["Post-Mortem", "Incident", "Flash Sale"],
        summary="Detailed RCA and preventive actions from the connection timeout incident during flash sale.",
        content="# Post-Mortem: INC-782\n\n**Root Cause**: Database pool exhaustion caused by sudden surge in checkout requests.\n**Resolution**: Scaled connection pool to 60 connections and introduced circuit breaker."
    )
]

@router.get("/", response_model=List[KnowledgeDocModel])
def get_knowledge_docs():
    return knowledge_db

@router.get("/{doc_id}", response_model=KnowledgeDocModel)
def get_knowledge_doc(doc_id: str):
    for d in knowledge_db:
        if d.id == doc_id:
            return d
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

@router.post("/", response_model=KnowledgeDocModel, status_code=status.HTTP_201_CREATED)
def create_knowledge_doc(doc_input: CreateDocInput):
    new_doc = KnowledgeDocModel(
        id=f"kb-{len(knowledge_db) + 1}",
        title=doc_input.title,
        type=doc_input.type,
        updatedAt="Just now",
        author=doc_input.author,
        tags=doc_input.tags,
        summary=doc_input.summary,
        content=doc_input.content
    )
    knowledge_db.insert(0, new_doc)
    return new_doc
