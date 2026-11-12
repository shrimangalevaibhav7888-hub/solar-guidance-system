from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database.session import Base, engine, SessionLocal
from app.seed.seed_data import seed_database
from app.routes import (
    auth_router,
    solar_router,
    schemes_router,
    installers_router,
    reports_router,
    config_router
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("solarsahayak")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables and seed initial database
    logger.info("Initializing SolarSahayak database schema...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        logger.info("Seeding initial government schemes, empanelled installers & assumptions...")
        seed_database(db)
        logger.info("Database initialized and verified successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()
        
    yield
    logger.info("Shutting down SolarSahayak backend service.")

app = FastAPI(
    title="SolarSahayak API",
    description="Solar Installation & Government Scheme Guidance System for India",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|.*\.vercel\.app|.*\.onrender\.com)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "We couldn't calculate or process your request right now. Please check your inputs and try again.",
            "error_type": type(exc).__name__
        }
    )

# Health check
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SolarSahayak Backend API",
        "version": "1.0.0",
        "mode": "Production Ready"
    }

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(solar_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(installers_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(config_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
