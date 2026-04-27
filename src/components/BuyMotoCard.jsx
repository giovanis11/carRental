function formatPrice(price) {
  return new Intl.NumberFormat("en-US").format(price);
}

function formatMileage(mileageKm) {
  return new Intl.NumberFormat("en-US").format(mileageKm);
}

function BuyMotoCard({ moto }) {
  return (
    <article className="card car-card buy-car-card buy-moto-card h-100 border-0">
      <div className="car-image-wrap">
        <div className="buy-car-image-overlay">
          {moto.featured ? <span className="buy-car-flag">Featured</span> : null}
          <span className="buy-car-location">{moto.location}</span>
        </div>
        <img
          src={moto.image}
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          className="card-img-top car-image buy-car-image buy-moto-image"
          alt={moto.name}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="card-body d-flex flex-column p-4">
        <div className="buy-car-topline">
          <div className="buy-car-tag-row">
            <span className="badge car-type-badge">{moto.category}</span>
            <span className="buy-car-year-badge">{moto.year}</span>
          </div>
          <div className="text-end">
            <div className="buy-car-price">€{formatPrice(moto.price)}</div>
            <small className="buy-car-price-label">sale price</small>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="buy-car-title">{moto.name}</h3>
          <small className="buy-car-subline">
            {moto.transmission} • {moto.engine} • {formatMileage(moto.mileageKm)} km
          </small>
        </div>

        <div className="buy-car-meta-grid mb-4">
          <div className="spec-card">
            <small>Mileage</small>
            <strong>{formatMileage(moto.mileageKm)} km</strong>
          </div>
          <div className="spec-card">
            <small>Engine</small>
            <strong>{moto.engine}</strong>
          </div>
          <div className="spec-card">
            <small>Transmission</small>
            <strong>{moto.transmission}</strong>
          </div>
          <div className="spec-card">
            <small>Status</small>
            <strong>{moto.condition}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

export default BuyMotoCard;
