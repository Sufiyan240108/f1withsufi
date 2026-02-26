from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.standings import router as standings_router
from api.calendar import router as calendar_router
from api.events import router as events_router
from api.analytics import router as analytics_router
from api.telemetry import router as telemetry_router

app = FastAPI(
    title="OpenF1 Analytics 2026",
    description="Post-session Formula 1 analytics platform. Free-tier. No live timing redistribution.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(standings_router)
app.include_router(calendar_router)
app.include_router(events_router)
app.include_router(analytics_router)
app.include_router(telemetry_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "OpenF1 Analytics 2026"}
