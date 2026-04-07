import { useEffect, useMemo, useState } from "react";
import { createBooking } from "../lib/api";

function calculateRentalDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const diffInDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diffInDays, 1);
}

function BookingForm({
  carId,
  carName,
  available,
  dateAvailability = true,
  initialStartDate = "",
  initialEndDate = "",
  pricePerDay,
  initialRentalDays = null,
  initialTotalPrice = null,
}) {
  const [formData, setFormData] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
    name: "",
    email: "",
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      startDate: initialStartDate,
      endDate: initialEndDate,
    }));
  }, [initialEndDate, initialStartDate]);

  const rentalDays = useMemo(
    () => calculateRentalDays(formData.startDate, formData.endDate) ?? initialRentalDays,
    [formData.endDate, formData.startDate, initialRentalDays]
  );
  const totalPrice =
    rentalDays && pricePerDay ? Math.round(pricePerDay * rentalDays * 100) / 100 : initialTotalPrice;
  const selectedDatesBlocked =
    Boolean(initialStartDate && initialEndDate) &&
    dateAvailability === false &&
    formData.startDate === initialStartDate &&
    formData.endDate === initialEndDate;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setStatus("submitting");
    setMessage("");

    createBooking({
      carId,
      startDate: formData.startDate,
      endDate: formData.endDate,
      customerName: formData.name,
      email: formData.email,
    })
      .then(() => {
        setStatus("success");
        setMessage(`Booking confirmed for ${carName}.`);
        setFormData({
          startDate: "",
          endDate: "",
          name: "",
          email: "",
        });
      })
      .catch((error) => {
        setStatus("error");
        setMessage(error.message);
      });
  };

  return (
    <div className="booking-card">
      <div className="mb-4">
        <span className="eyebrow">Quick reservation</span>
        <h4 className="mb-2">Book {carName}</h4>
        <p className="text-secondary mb-0">
          Secure your dates now. This form is connected to the live FastAPI
          backend and checks for conflicting reservations.
        </p>
      </div>

      {rentalDays ? (
        <div className="bg-light border rounded-4 p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>
              <small className="text-secondary d-block">Trip length</small>
              <strong>
                {rentalDays} day{rentalDays > 1 ? "s" : ""}
              </strong>
            </div>
            <div className="text-end">
              <small className="text-secondary d-block">Estimated total</small>
              <strong>€{totalPrice}</strong>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Start date</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End date</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-accent w-100"
          disabled={!available || status === "submitting"}
        >
          {available
            ? status === "submitting"
              ? "Booking..."
              : "Book Now"
            : "Unavailable"}
        </button>
      </form>

      {!available ? (
        <div className="alert alert-warning mt-4 mb-0" role="alert">
          This car is currently unavailable for new reservations.
        </div>
      ) : null}

      {available && selectedDatesBlocked ? (
        <div className="alert alert-warning mt-4 mb-0" role="alert">
          This car is already booked for the selected dates. Try a different
          pickup or drop-off date.
        </div>
      ) : null}

      {status === "success" ? (
        <div className="alert alert-success mt-4 mb-0" role="alert">
          {message}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="alert alert-danger mt-4 mb-0" role="alert">
          {message}
        </div>
      ) : null}
    </div>
  );
}

export default BookingForm;
