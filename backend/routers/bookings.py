from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=list[schemas.BookingRead])
def list_bookings(db: Session = Depends(get_db)):
    return db.query(models.Booking).order_by(models.Booking.start_date.asc()).all()


@router.post("", response_model=schemas.BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(payload: schemas.BookingCreate, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == payload.car_id).first()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    if not car.available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This car is currently unavailable",
        )

    overlapping_booking = (
        db.query(models.Booking)
        .filter(models.Booking.car_id == payload.car_id)
        .filter(
            and_(
                models.Booking.start_date <= payload.end_date,
                models.Booking.end_date >= payload.start_date,
            )
        )
        .first()
    )

    if overlapping_booking is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This car is already booked for the selected dates",
        )

    booking = models.Booking(**payload.model_dump())
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking
