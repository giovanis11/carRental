import { useState } from "react";
import { useNavigate } from "react-router-dom";

function formatDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split("T")[0];
}

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: "Athens Airport",
    startDate: formatDate(0),
    pickupTime: "15:30",
    endDate: formatDate(7),
    dropoffTime: "15:30",
    driverAge: "25 - 74",
    differentDropoff: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSearch((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      location: search.location,
      startDate: search.startDate,
      endDate: search.endDate,
      pickupTime: search.pickupTime,
      dropoffTime: search.dropoffTime,
      driverAge: search.driverAge,
    });

    if (search.differentDropoff) {
      params.set("differentDropoff", "true");
    }

    navigate(`/cars?${params.toString()}`);
  };

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="home-hero-frame">
            <div className="home-hero-scene">
              <div className="home-hero-content">
                <div className="home-hero-left">
                  <h1 className="home-hero-title">Car Rental</h1>

                  <form className="home-booking-card" onSubmit={handleSubmit}>
                    <div className="home-booking-card-title">Pick-up and drop-off</div>

                    <div className="home-booking-location-row">
                      <input
                        type="text"
                        className="form-control home-booking-input"
                        name="location"
                        placeholder="Alicante - train station"
                        value={search.location}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label home-booking-label">
                          Pick-up date
                        </label>
                        <div className="home-inline-field">
                          <input
                            type="date"
                            className="form-control home-booking-input"
                            name="startDate"
                            value={search.startDate}
                            onChange={handleChange}
                            required
                          />
                          <input
                            type="time"
                            className="form-control home-booking-time"
                            name="pickupTime"
                            value={search.pickupTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label home-booking-label">
                          Drop-off date
                        </label>
                        <div className="home-inline-field">
                          <input
                            type="date"
                            className="form-control home-booking-input"
                            name="endDate"
                            value={search.endDate}
                            onChange={handleChange}
                            required
                          />
                          <input
                            type="time"
                            className="form-control home-booking-time"
                            name="dropoffTime"
                            value={search.dropoffTime}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="home-booking-footer">
                      <label className="home-booking-check">
                        <input
                          type="checkbox"
                          name="differentDropoff"
                          checked={search.differentDropoff}
                          onChange={handleChange}
                        />
                        <span>Return to a different office</span>
                      </label>

                      <div className="home-driver-age">
                        <span>Driver age</span>
                        <select
                          className="form-select home-driver-select"
                          name="driverAge"
                          value={search.driverAge}
                          onChange={handleChange}
                        >
                          <option>21 - 24</option>
                          <option>25 - 74</option>
                          <option>75+</option>
                        </select>
                      </div>
                    </div>

                    <button type="submit" className="btn home-search-button">
                      Search
                    </button>
                  </form>
                </div>

                <div className="home-hero-right">
                  <div className="home-hero-tagline">
                    <span>Drive now</span>
                    <strong>Travel easy</strong>
                  </div>
                </div>
              </div>

              <div className="home-hero-copy">
                Choose DriveNow Premium car rental with all essentials included
                at the best price. Flexible booking, no exchange fee, and free
                cancellation across Spain, Portugal, Italy, and Greece.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-space home-highlights-section">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="home-highlight-card">
                <strong>All-inclusive premium</strong>
                <span>Road assistance, transparent pricing, and modern fleet quality.</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="home-highlight-card">
                <strong>Free cancellation</strong>
                <span>Change your plans without stress and keep your booking flexible.</span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="home-highlight-card">
                <strong>Fast collection</strong>
                <span>Airport and city offices designed for quick pick-up and drop-off.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
