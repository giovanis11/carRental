from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class CarBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    price_per_day: float = Field(..., gt=0)
    image_url: str = Field(..., min_length=5, max_length=500)
    description: str = Field(..., min_length=10, max_length=2000)
    available: bool = True

    @field_validator("name", "image_url", "description")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class CarCreate(CarBase):
    pass


class CarUpdate(CarBase):
    pass


class CarRead(CarBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class CarSearchRead(CarRead):
    start_date: date | None = None
    end_date: date | None = None
    rental_days: int | None = None
    total_price: float | None = None
    is_available_for_dates: bool | None = None


class BookingBase(BaseModel):
    car_id: int = Field(..., gt=0)
    start_date: date
    end_date: date
    customer_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr

    @field_validator("customer_name")
    @classmethod
    def clean_customer_name(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        return self


class BookingCreate(BookingBase):
    pass


class BookingRead(BookingBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
