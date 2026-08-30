import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.sheets import sheets_service
from app.api.websocket import router as ws_router
from app.api.appointments import router as appointments_router
from app.api.vapi_webhook import router as vapi_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI lifespan event handler for startup & shutdown."""
    logger.info("Initializing AL-RAFAI CLINIC Backend...")
    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY
    
    # Store sheets service in app state
    app.state.sheets_service = sheets_service
    logger.info(f"Sheets service status: Initialized={sheets_service.initialized}")

    yield

    logger.info("Shutting down AL-RAFAI CLINIC Backend...")

app = FastAPI(
    title="AL-RAFAI CLINIC AI Booking Backend",
    version="1.0.0",
    description="FastAPI + OpenAI Agents SDK appointment booking backend with Google Sheets integration.",
    lifespan=lifespan
)

# CORS middleware configuration for Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]
if settings.FRONTEND_ORIGIN and settings.FRONTEND_ORIGIN not in origins:
    origins.append(settings.FRONTEND_ORIGIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ws_router)
app.include_router(appointments_router, prefix="/api")
app.include_router(vapi_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "online",
        "clinic": settings.CLINIC_NAME,
        "doctor": settings.CLINIC_DOCTOR_NAME,
        "sheet_id": settings.GOOGLE_SHEET_ID,
        "sheets_connected": sheets_service.initialized,
        "sheets_status": "connected" if sheets_service.initialized else "DISCONNECTED — bookings will fail"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
