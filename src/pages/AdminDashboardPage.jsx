import { useEffect, useMemo, useState } from "react";
import {
  createCar,
  deleteCar,
  fetchBookings,
  fetchCars,
  updateCar,
} from "../lib/api";

const initialForm = {
  name: "",
  pricePerDay: "",
  image: "",
  description: "",
  available: true,
};

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

function calculateRentalDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 1;
  }

  return Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)), 1);
}

function AdminDashboardPage() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeView, setActiveView] = useState("bookings");
  const [fleetSearch, setFleetSearch] = useState("");
  const [fleetStatus, setFleetStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const carsById = useMemo(
    () => new Map(cars.map((car) => [car.id, car])),
    [cars]
  );

  const bookingRows = useMemo(
    () =>
      bookings
        .map((booking) => {
          const car = carsById.get(booking.carId);
          const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);
          const estimatedTotal = car
            ? Math.round(car.pricePerDay * rentalDays * 100) / 100
            : null;

          return {
            ...booking,
            car,
            rentalDays,
            estimatedTotal,
          };
        })
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [bookings, carsById]
  );

  const filteredCars = useMemo(() => {
    const query = fleetSearch.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesQuery =
        query.length === 0 ||
        `${car.name} ${car.type} ${car.description}`.toLowerCase().includes(query);
      const matchesStatus =
        fleetStatus === "all" ||
        (fleetStatus === "available" && car.available) ||
        (fleetStatus === "unavailable" && !car.available);

      return matchesQuery && matchesStatus;
    });
  }, [cars, fleetSearch, fleetStatus]);

  const averagePrice = useMemo(() => {
    if (cars.length === 0) {
      return 0;
    }

    return Math.round(
      cars.reduce((total, car) => total + car.pricePerDay, 0) / cars.length
    );
  }, [cars]);

  const availableCars = cars.filter((car) => car.available).length;
  const reservedCars = new Set(bookings.map((booking) => booking.carId)).size;
  const estimatedBookingValue = bookingRows.reduce(
    (total, booking) => total + (booking.estimatedTotal ?? 0),
    0
  );

  const loadDashboard = () => {
    setIsLoading(true);

    Promise.all([fetchCars(), fetchBookings()])
      .then(([carData, bookingData]) => {
        setCars(carData);
        setBookings(bookingData);
        setError("");
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingCarId(null);
    setIsFormVisible(false);
  };

  const openCreateForm = () => {
    setFormData(initialForm);
    setEditingCarId(null);
    setIsFormVisible(true);
    setActiveView("fleet");
    setError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);

    const action = editingCarId
      ? updateCar(editingCarId, formData)
      : createCar(formData);

    action
      .then(() => {
        resetForm();
        loadDashboard();
      })
      .catch((requestError) => {
        setError(requestError.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleEdit = (car) => {
    setEditingCarId(car.id);
    setFormData({
      name: car.name,
      pricePerDay: String(car.pricePerDay),
      image: car.image,
      description: car.description,
      available: car.available,
    });
    setIsFormVisible(true);
    setActiveView("fleet");
    setError("");
  };

  const handleDelete = (carId) => {
    const hasBookings = bookings.some((booking) => booking.carId === carId);
    const message = hasBookings
      ? "This car has bookings attached. Delete it and remove those bookings too?"
      : "Delete this car from the live inventory?";

    if (!window.confirm(message)) {
      return;
    }

    deleteCar(carId)
      .then(() => {
        if (editingCarId === carId) {
          resetForm();
        }

        loadDashboard();
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  };

  return (
    <section className="section-space pt-5 admin-page">
      <div className="container">
        <div className="admin-hero mb-4">
          <div>
            <span className="eyebrow">Admin panel</span>
            <h1 className="section-title mb-2">Operations Dashboard</h1>
            <p className="section-copy mb-0">
              Review reservations, see who booked each vehicle, and keep the fleet ready.
            </p>
          </div>
          <div className="admin-hero-actions">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={loadDashboard}
              disabled={isLoading}
            >
              Refresh
            </button>
            <button type="button" className="btn btn-accent" onClick={openCreateForm}>
              Add Car
            </button>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat-card">
              <small>Total cars</small>
              <strong>{cars.length}</strong>
              <span>{availableCars} available right now</span>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat-card">
              <small>Bookings</small>
              <strong>{bookings.length}</strong>
              <span>{reservedCars} vehicles reserved</span>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat-card">
              <small>Booking value</small>
              <strong>€{Math.round(estimatedBookingValue)}</strong>
              <span>Estimated from current rates</span>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="admin-stat-card">
              <small>Average rate</small>
              <strong>€{averagePrice}</strong>
              <span>Across the fleet</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

        <div className="admin-tabs mb-4" role="tablist" aria-label="Admin sections">
          <button
            type="button"
            className={activeView === "bookings" ? "is-active" : ""}
            onClick={() => setActiveView("bookings")}
          >
            Bookings
          </button>
          <button
            type="button"
            className={activeView === "fleet" ? "is-active" : ""}
            onClick={() => setActiveView("fleet")}
          >
            Fleet
          </button>
        </div>

        {activeView === "bookings" ? (
          <div className="admin-panel">
            <div className="admin-section-head">
              <div>
                <h2>Reservations</h2>
                <p>See exactly who booked which car and for what dates.</p>
              </div>
              <span className="admin-count-pill">{bookingRows.length} bookings</span>
            </div>

            {isLoading ? (
              <div className="loading-panel">Loading bookings...</div>
            ) : bookingRows.length === 0 ? (
              <div className="empty-state text-center">
                <h3>No bookings yet</h3>
                <p className="text-secondary mb-0">
                  New customer reservations will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="admin-booking-grid">
                {bookingRows.map((booking) => (
                  <article className="booking-admin-card" key={booking.id}>
                    <div className="booking-admin-main">
                      <div className="booking-admin-thumb-wrap">
                        {booking.car ? (
                          <img
                            src={booking.car.image}
                            alt={booking.car.name}
                            className="booking-admin-thumb"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>Car</span>
                        )}
                      </div>
                      <div>
                        <span className="admin-mini-label">Customer</span>
                        <h3>{booking.customerName}</h3>
                        <a href={`mailto:${booking.email}`}>{booking.email}</a>
                      </div>
                    </div>

                    <div className="booking-admin-meta">
                      <div>
                        <span>Car</span>
                        <strong>{booking.car?.name ?? `Car #${booking.carId}`}</strong>
                      </div>
                      <div>
                        <span>Dates</span>
                        <strong>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </strong>
                      </div>
                      <div>
                        <span>Length</span>
                        <strong>
                          {booking.rentalDays} day{booking.rentalDays > 1 ? "s" : ""}
                        </strong>
                      </div>
                      <div>
                        <span>Est. total</span>
                        <strong>
                          {booking.estimatedTotal === null
                            ? "Unknown"
                            : `€${booking.estimatedTotal}`}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="admin-panel">
            <div className="admin-section-head">
              <div>
                <h2>Fleet management</h2>
                <p>Add, edit, filter, and remove vehicle listings.</p>
              </div>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => {
                  if (isFormVisible && editingCarId === null) {
                    resetForm();
                    return;
                  }

                  openCreateForm();
                }}
              >
                {isFormVisible && editingCarId === null ? "Close Form" : "Add New Car"}
              </button>
            </div>

            {isFormVisible ? (
              <div className="admin-form-card mb-4">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                  <div>
                    <span className="eyebrow">
                      {editingCarId ? "Edit listing" : "New listing"}
                    </span>
                    <h4 className="mb-1">
                      {editingCarId ? "Update car details" : "Add a car to inventory"}
                    </h4>
                    <p className="text-secondary mb-0">
                      Image paths can be local, like /car-images/yaris_lrg.jpg, or a full URL.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Car name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Price per day</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="form-control"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Image path or URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          id="available"
                          className="form-check-input"
                          type="checkbox"
                          name="available"
                          checked={formData.available}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="available">
                          Available for booking
                        </label>
                      </div>
                    </div>
                    <div className="col-12 d-flex flex-wrap gap-2">
                      <button type="submit" className="btn btn-accent" disabled={isSaving}>
                        {isSaving
                          ? editingCarId
                            ? "Saving..."
                            : "Creating..."
                          : editingCarId
                            ? "Save Changes"
                            : "Create Car"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-dark"
                        onClick={resetForm}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="admin-toolbar">
              <input
                type="search"
                className="form-control"
                placeholder="Search cars by name, type, or description"
                value={fleetSearch}
                onChange={(event) => setFleetSearch(event.target.value)}
              />
              <select
                className="form-select"
                value={fleetStatus}
                onChange={(event) => setFleetStatus(event.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            <div className="table-card">
              <div className="table-responsive">
                <table className="table admin-fleet-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Status</th>
                      <th>Price / day</th>
                      <th>Bookings</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5">
                          <div className="loading-panel my-3">Loading inventory...</div>
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading && filteredCars.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-secondary py-4">
                          No cars match those filters.
                        </td>
                      </tr>
                    ) : null}

                    {!isLoading
                      ? filteredCars.map((car) => {
                          const carBookingCount = bookings.filter(
                            (booking) => booking.carId === car.id
                          ).length;

                          return (
                            <tr key={car.id}>
                              <td>
                                <div className="d-flex align-items-center gap-3">
                                  <img
                                    src={car.image}
                                    alt={car.name}
                                    className="admin-car-thumb"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <div>
                                    <div className="fw-semibold">{car.name}</div>
                                    <small className="text-secondary">{car.type}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span
                                  className={`availability-pill ${
                                    car.available ? "is-live" : "is-muted"
                                  }`}
                                >
                                  {car.available ? "Available" : "Unavailable"}
                                </span>
                              </td>
                              <td>€{car.pricePerDay}</td>
                              <td>
                                {carBookingCount} booking
                                {carBookingCount === 1 ? "" : "s"}
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-dark"
                                    onClick={() => handleEdit(car)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(car.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
