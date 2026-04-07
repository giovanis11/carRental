import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

def resolve_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")

    if database_url:
        return database_url

    if os.getenv("VERCEL"):
        return "sqlite:////tmp/car_rental.db"

    return "sqlite:///./backend/car_rental.db"


DATABASE_URL = resolve_database_url()

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine_options = {"pool_pre_ping": True}

if DATABASE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
