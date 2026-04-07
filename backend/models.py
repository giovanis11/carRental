from sqlalchemy import Boolean, Column, Date, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, index=True)
    price_per_day = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    available = Column(Boolean, nullable=False, default=True)

    bookings = relationship(
        "Booking", back_populates="car", cascade="all, delete-orphan"
    )


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    customer_name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, index=True)

    car = relationship("Car", back_populates="bookings")
