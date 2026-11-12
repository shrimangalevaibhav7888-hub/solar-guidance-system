from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

db_url = settings.DATABASE_URL

# Normalize PostgreSQL / Supabase URLs and use the appropriate driver
if db_url.startswith("postgres://") or db_url.startswith("postgresql://"):
    try:
        import psycopg  # noqa: F401
        driver_prefix = "postgresql+psycopg://"
    except ImportError:
        driver_prefix = "postgresql+psycopg2://"

    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", driver_prefix, 1)
    elif db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", driver_prefix, 1)

connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(db_url, connect_args=connect_args, echo=False)
else:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
