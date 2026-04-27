function formatPrice(price) {
  return new Intl.NumberFormat("en-US").format(price);
}

function formatMileage(mileageKm) {
  return new Intl.NumberFormat("en-US").format(mileageKm);
}

function BuyCarCard({ car }) {
  return (
    <article className="card car-card buy-car-card h-100 border-0">
      <div className="car-image-wrap">
        <div className="buy-car-image-overlay">
          {car.featured ? <span className="buy-car-flag">Featured</span> : null}
          <span className="buy-car-location">{car.location}</span>
        </div>
        <img
          src={car.image}
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          className="card-img-top car-image buy-car-image"
          alt={car.name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="buy-car-topline">
          <div className="buy-car-tag-row">
            <span className="badge car-type-badge">{car.bodyType}</span>
            <span className="buy-car-year-badge">{car.year}</span>
          </div>
          <div className="text-end">
            <div className="buy-car-price">€{formatPrice(car.price)}</div>
            <small className="buy-car-price-label">sale price</small>
          </div>
        </div>

        <div className="mb-3">
            <h3 className="buy-car-title">{car.name}</h3>
            <small className="buy-car-subline">
              {car.transmission} • {car.fuel} • {formatMileage(car.mileageKm)} km
            </small>
        </div>

        <div className="buy-car-meta-grid mb-4">
          <div className="spec-card">
            <small>Mileage</small>
            <strong>{formatMileage(car.mileageKm)} km</strong>
          </div>
          <div className="spec-card">
            <small>Transmission</small>
            <strong>{car.transmission}</strong>
          </div>
          <div className="spec-card">
            <small>Body</small>
            <strong>{car.bodyType}</strong>
          </div>
          <div className="spec-card">
            <small>Status</small>
            <strong>{car.condition}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BuyCarCard;
