from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import bookings, cars
from .seed_data import seed_demo_data

Base.metadata.create_all(bind=engine)
seed_demo_data()

app = FastAPI(
    title="Car Rental API",
    description="FastAPI backend for a car rental web application.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cars.router)
app.include_router(bookings.router)


@app.get("/")
def read_root():
    return {"message": "Car Rental API is running"}
