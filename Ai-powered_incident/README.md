# AI-Powered Incident Platform

An intelligent incident detection, triaging, and automated resolution platform built with FastAPI.

## Project Structure

```text
AI-powered_incident/
│
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── core/                # Core configurations, database, security
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   ├── models/              # SQLAlchemy database models
│   ├── schemas/             # Pydantic data schemas
│   ├── routers/             # API route handlers / endpoints
│   ├── db_ops/              # Database operations / CRUD layer
│   ├── services/            # Business logic & AI workflow services
│   └── integrations/        # External services (Slack, PagerDuty, LLMs, etc.)
│
├── tests/                   # Test suites
├── knowledge/               # Runbooks, incident knowledge base & documents
├── alembic/                 # Database migrations
│
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── requirements.txt         # Project dependencies
└── README.md                # Project documentation
```

## Getting Started

### 1. Set Up Virtual Environment

```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env` and fill in your keys and database credentials:
```bash
cp .env .env.local
```

### 4. Run the Application

```bash
uvicorn app.main:app --reload
```

Interactive API documentation will be available at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)