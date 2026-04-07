from datetime import date, timedelta

from . import models
from .database import SessionLocal

STARTER_CARS = [
    {
        "name": "Fiat 500",
        "price_per_day": 39,
        "image_url": "/car-images/500_lrg.jpg",
        "description": "Small city hatchback with light steering, easy parking, and efficient fuel use for short urban trips.",
        "available": True,
    },
    {
        "name": "Peugeot 208",
        "price_per_day": 44,
        "image_url": "/car-images/208_5door_lrg.jpg",
        "description": "Modern compact hatchback with a comfortable cabin, simple controls, and low running costs for everyday rental use.",
        "available": True,
    },
    {
        "name": "Fiat Panda",
        "price_per_day": 41,
        "image_url": "/car-images/panda_lrg_fiat.jpg",
        "description": "Practical small car with upright visibility, simple loading space, and flexible comfort for city breaks.",
        "available": True,
    },
    {
        "name": "Kia Picanto",
        "price_per_day": 40,
        "image_url": "/car-images/picanto_lrg_kia.jpg",
        "description": "Compact city car with easy maneuverability, efficient daily running costs, and a simple, practical layout.",
        "available": True,
    },
    {
        "name": "Volkswagen Polo",
        "price_per_day": 47,
        "image_url": "/car-images/polo_lrg.jpg",
        "description": "Well-rounded supermini with solid ride comfort, clean controls, and a polished feel for city or island rentals.",
        "available": True,
    },
    {
        "name": "Toyota Yaris",
        "price_per_day": 46,
        "image_url": "/car-images/yaris_lrg.jpg",
        "description": "Reliable compact hatchback with balanced comfort, tidy dimensions, and low fuel use for everyday travel.",
        "available": True,
    },
]

SYNC_NAME_GROUPS = [
    ["BMW X5", "Fiat 500"],
    ["Mercedes-Benz C-Class", "Peugeot 208"],
    ["Tesla Model 3", "Fiat Panda"],
    ["Audi Q7", "Toyota Yaris", "Kia Picanto"],
    ["Toyota Camry", "Opel Corsa", "Volkswagen Polo"],
    ["Range Rover Velar", "Nissan Qashqai", "Toyota Yaris"],
]


STARTER_BOOKINGS = [
    {
        "car_name": "Fiat 500",
        "start_offset": 2,
        "end_offset": 5,
        "customer_name": "Demo Traveler",
        "email": "traveler@example.com",
    },
    {
        "car_name": "Fiat Panda",
        "start_offset": 4,
        "end_offset": 8,
        "customer_name": "Demo Business Guest",
        "email": "business@example.com",
    },
    {
        "car_name": "Volkswagen Polo",
        "start_offset": 6,
        "end_offset": 9,
        "customer_name": "Demo Weekend Driver",
        "email": "weekend@example.com",
    },
]


def sync_demo_cars(db) -> None:
    used_ids: set[int] = set()

    for index, car_data in enumerate(STARTER_CARS):
        current_name = car_data["name"]
        car = (
            db.query(models.Car)
            .filter(models.Car.name == current_name)
            .order_by(models.Car.id.asc())
            .first()
        )
        if car is not None and car.id in used_ids:
            car = None

        if car is None:
            for alias in SYNC_NAME_GROUPS[index]:
                car = (
                    db.query(models.Car)
                    .filter(models.Car.name == alias)
                    .order_by(models.Car.id.asc())
                    .first()
                )
                if car is not None and car.id in used_ids:
                    car = None
                if car is not None:
                    break

        if car is None:
            db.add(models.Car(**car_data))
            continue

        for field, value in car_data.items():
            setattr(car, field, value)
        used_ids.add(car.id)

    db.commit()


def seed_demo_data() -> None:
    db = SessionLocal()
    try:
        sync_demo_cars(db)

        existing_booking = db.query(models.Booking.id).first()
        if existing_booking:
            return

        today = date.today()
        bookings_to_create: list[models.Booking] = []

        for booking in STARTER_BOOKINGS:
            car = db.query(models.Car).filter(models.Car.name == booking["car_name"]).first()
            if car is None:
                continue

            bookings_to_create.append(
                models.Booking(
                    car_id=car.id,
                    start_date=today + timedelta(days=booking["start_offset"]),
                    end_date=today + timedelta(days=booking["end_offset"]),
                    customer_name=booking["customer_name"],
                    email=booking["email"],
                )
            )

        if bookings_to_create:
            db.add_all(bookings_to_create)
            db.commit()
    finally:
        db.close()
