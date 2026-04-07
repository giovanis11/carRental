import { useEffect, useMemo, useState } from "react";
import { createCar, deleteCar, fetchCars, updateCar } from "../lib/api";

const initialForm = {
  name: "",
  pricePerDay: "",
  image: "",
  description: "",
  available: true,
};

function AdminDashboardPage() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCarId, setEditingCarId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const averagePrice = useMemo(() => {
    if (cars.length === 0) {
      return 0;
    }

    return Math.round(
      cars.reduce((total, car) => total + car.pricePerDay, 0) / cars.length
    );
  }, [cars]);

  const availableCars = cars.filter((car) => car.available).length;

  const loadCars = () => {
    setIsLoading(true);

    fetchCars()
      .then((data) => {
        setCars(data);
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
    loadCars();
  }, []);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingCarId(null);
    setIsFormVisible(false);
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
        loadCars();
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
    setError("");
  };

  const handleDelete = (carId) => {
    if (!window.confirm("Delete this car from the live inventory?")) {
      return;
    }

    deleteCar(carId)
      .then(() => {
        if (editingCarId === carId) {
          resetForm();
        }

        loadCars();
      })
      .catch((requestError) => {
        setError(requestError.message);
      });
  };

  return (
    <section className="section-space pt-5">
      <div className="container">
        <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <span className="eyebrow">Admin panel</span>
            <h1 className="section-title mb-2">Fleet Dashboard</h1>
            <p className="section-copy mb-0">
              Simple management interface for reviewing, adding, and updating
              vehicle inventory.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => {
              if (isFormVisible && editingCarId === null) {
                resetForm();
                return;
              }

              setFormData(initialForm);
              setEditingCarId(null);
              setIsFormVisible(true);
            }}
          >
            {isFormVisible && editingCarId === null ? "Close Form" : "Add New Car"}
          </button>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="admin-stat-card">
              <small>Total cars</small>
              <strong>{cars.length}</strong>
              <span>Curated active inventory</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-stat-card">
              <small>Available now</small>
              <strong>{availableCars}</strong>
              <span>Ready for immediate booking</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="admin-stat-card">
              <small>Average daily rate</small>
              <strong>€{averagePrice}</strong>
              <span>Across the current fleet</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}

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
                  These changes save directly to the FastAPI backend.
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
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
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

        <div className="table-card">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Status</th>
                  <th>Price / day</th>
                  <th>Description</th>
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

                {!isLoading && cars.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-secondary py-4">
                      No cars yet. Add your first listing above.
                    </td>
                  </tr>
                ) : null}

                {!isLoading
                  ? cars.map((car) => (
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
                        <td className="admin-description-cell">{car.description}</td>
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
                    ))
                  : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
