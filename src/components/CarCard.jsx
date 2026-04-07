import { Link } from "react-router-dom";

function CarCard({ car }) {
  return (
    <div className="card car-card h-100 border-0">
      <div className="car-image-wrap">
        <img
          src={car.image}
          srcSet={car.imageSrcSet}
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
          className="card-img-top car-image"
          alt={car.name}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-3 gap-3">
          <div>
            <span className="badge car-type-badge mb-2">{car.type}</span>
            <h5 className="card-title mb-1">{car.name}</h5>
            <small className={`availability-pill ${car.available ? "is-live" : "is-muted"}`}>
              {car.available ? "Available now" : "Currently unavailable"}
            </small>
          </div>
          <div className="text-end">
            <div className="car-price">€{car.pricePerDay}</div>
            <small className="text-secondary">per day</small>
          </div>
        </div>

        <p className="card-text text-secondary mb-3">{car.description}</p>

        <div className="d-flex flex-wrap gap-2 mb-4">
          <span className="spec-pill">{car.type}</span>
          <span className="spec-pill">Premium fleet</span>
          <span className="spec-pill">{car.available ? "Instant booking" : "Waitlist"}</span>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-auto pt-2 card-action-row">
          <span className="car-year">{car.available ? "Ready to reserve" : "Temporarily offline"}</span>
          <Link to={`/cars/${car.id}`} className="btn btn-dark">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
