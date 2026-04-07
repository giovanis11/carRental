from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/cars", tags=["Cars"])


def validate_search_window(start_date: date | None, end_date: date | None) -> None:
    if (start_date is None) != (end_date is None):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="start_date and end_date must be provided together",
        )

    if start_date is not None and end_date is not None and end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_date must be on or after start_date",
        )


def calculate_rental_days(start_date: date, end_date: date) -> int:
    return max((end_date - start_date).days, 1)


def has_overlapping_booking(
    db: Session, car_id: int, start_date: date, end_date: date
) -> bool:
    overlapping_booking = (
        db.query(models.Booking.id)
        .filter(models.Booking.car_id == car_id)
        .filter(
            and_(
                models.Booking.start_date <= end_date,
                models.Booking.end_date >= start_date,
            )
        )
        .first()
    )
    return overlapping_booking is not None


def serialize_car_for_search(
    car: models.Car,
    db: Session,
    start_date: date | None = None,
    end_date: date | None = None,
) -> schemas.CarSearchRead:
    payload = schemas.CarRead.model_validate(car).model_dump()

    if start_date is None or end_date is None:
        return schemas.CarSearchRead(**payload)

    rental_days = calculate_rental_days(start_date, end_date)
    is_available_for_dates = car.available and not has_overlapping_booking(
        db, car.id, start_date, end_date
    )

    return schemas.CarSearchRead(
        **payload,
        start_date=start_date,
        end_date=end_date,
        rental_days=rental_days,
        total_price=round(car.price_per_day * rental_days, 2),
        is_available_for_dates=is_available_for_dates,
    )


@router.get("", response_model=list[schemas.CarSearchRead])
def list_cars(
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    available_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    validate_search_window(start_date, end_date)

    cars = db.query(models.Car).order_by(models.Car.id.asc()).all()
    results: list[schemas.CarSearchRead] = []

    for car in cars:
        car_result = serialize_car_for_search(car, db, start_date, end_date)

        if available_only:
            if start_date is not None and end_date is not None:
                if not car_result.is_available_for_dates:
                    continue
            elif not car.available:
                continue

        results.append(car_result)

    return results


@router.get("/{car_id}", response_model=schemas.CarSearchRead)
def get_car(
    car_id: int,
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
    db: Session = Depends(get_db),
):
    validate_search_window(start_date, end_date)

    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")
    return serialize_car_for_search(car, db, start_date, end_date)


@router.post("", response_model=schemas.CarRead, status_code=status.HTTP_201_CREATED)
def create_car(payload: schemas.CarCreate, db: Session = Depends(get_db)):
    car = models.Car(**payload.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


@router.put("/{car_id}", response_model=schemas.CarRead)
def update_car(car_id: int, payload: schemas.CarUpdate, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    for field, value in payload.model_dump().items():
        setattr(car, field, value)

    db.commit()
    db.refresh(car)
    return car


@router.delete("/{car_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    db.delete(car)
    db.commit()
    return None
