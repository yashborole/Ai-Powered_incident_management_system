# Smart Manufacturing System

A full-stack smart manufacturing management system featuring real-time dashboard KPIs, machine kiosk tracking, job assignment, and OEE metrics.

## Architecture

- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS + Lucide Icons

## Project Structure

```
smart_manufacturing/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application & API endpoints
│   ├── database.py          # SQLAlchemy engine & session setup
│   ├── models.py            # Database tables (Machine, Job, Production, etc.)
│   └── db_ops/              # Business logic & queries
│       ├── __init__.py
│       ├── dashboard.py     # Dashboard KPI operations
│       └── kiosk.py         # Kiosk & machine job operations
├── frontend/
│   ├── src/                 # React UI components & views
│   ├── package.json         # Node dependencies & scripts
│   ├── vite.config.js       # Vite configuration
│   └── index.html           # HTML entrypoint
├── main.py                  # Entrypoint script to run uvicorn server
├── requirements.txt         # Python dependencies
└── README.md                # Documentation
```

## Getting Started

### 1. Backend Setup

```bash
# Navigate to the smart_manufacturing folder
cd smart_manufacturing

# Activate virtual environment
venv\Scripts\activate   # On Windows
# source venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload
# or: python main.py
```

The API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.
