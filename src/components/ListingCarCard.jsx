import { Link } from "react-router-dom";

const SIMILAR_CAR_TOOLTIP = `What does "or similar" mean?
The exact model may vary, but you'll always get a car in the same category, of the same size, with the same number of doors, gearbox and features. This is standard for most car rental companies.`;

function IconSeat() {
  return (
    <svg viewBox="0 0 24 24" className="listing-icon" aria-hidden="true">
      <path
        d="M8 11a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a6 6 0 0 1 12 0M4 20a8 8 0 0 1 3.2-6.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg viewBox="0 0 24 24" className="listing-icon" aria-hidden="true">
      <path
        d="M8 8V6a4 4 0 1 1 8 0v2M4 9.5A1.5 1.5 0 0 1 5.5 8H18.5A1.5 1.5 0 0 1 20 9.5V19A2 2 0 0 1 18 21H6A2 2 0 0 1 4 19V9.5Zm8-1v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTransmission() {
  return (
    <svg viewBox="0 0 24 24" className="listing-icon" aria-hidden="true">
      <path
        d="M8 5v14M16 5v14M8 12h8M5 5h3M16 5h3M5 19h3M16 19h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMileage() {
  return (
    <svg viewBox="0 0 24 24" className="listing-icon" aria-hidden="true">
      <path
        d="M12 5a9 9 0 0 0-9 9m18 0a9 9 0 0 0-9-9m0 0V3m0 2a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Zm0 9 3-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" className="listing-footer-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 10v6M12 7h.01"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function buildCarDetailsLink(carId, searchStartDate, searchEndDate, searchLocation) {
  const params = new URLSearchParams();

  if (searchLocation) {
    params.set("location", searchLocation);
  }

  if (searchStartDate && searchEndDate) {
    params.set("startDate", searchStartDate);
    params.set("endDate", searchEndDate);
  }

  const query = params.toString();
  return query ? `/cars/${carId}?${query}` : `/cars/${carId}`;
}

function ListingCarCard({
  car,
  searchLocation = "",
  searchStartDate = "",
  searchEndDate = "",
}) {
  const hasDateSearch = Boolean(searchStartDate && searchEndDate);
  const displayedPrice = car.totalPrice ?? car.pricePerDay;
  const priceLabel = car.rentalDays
    ? `Price for ${car.rentalDays} day${car.rentalDays > 1 ? "s" : ""}:`
    : "Price per day:";
  const isSearchAvailable = hasDateSearch ? car.searchAvailable : car.available;
  const detailsLink = buildCarDetailsLink(
    car.id,
    searchStartDate,
    searchEndDate,
    searchLocation
  );

  return (
    <article className="listing-card">
      <div className="listing-card-main">
        <div className="listing-image-column">
          <img
            src={car.image}
            srcSet={car.imageSrcSet}
            sizes="(max-width: 991px) 100vw, 320px"
            alt={car.name}
            className="listing-car-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="listing-content-column">
          <div className="listing-header-row">
            <span className="listing-ad-badge">
              {isSearchAvailable ? "Featured" : "Booked"}
            </span>
          </div>

          <h3 className="listing-title">
            {car.name}
            <span className="listing-title-subtitle">{car.similarLabel}</span>
            <button
              type="button"
              className="listing-inline-info listing-tooltip-trigger"
              aria-label={SIMILAR_CAR_TOOLTIP}
            >
              <IconInfo />
              <span className="listing-tooltip-bubble" role="tooltip">
                <strong>What does "or similar" mean?</strong>
                <span>
                  The exact model may vary, but you'll always get a car in the
                  same category, of the same size, with the same number of
                  doors, gearbox and features. This is standard for most car
                  rental companies.
                </span>
              </span>
            </button>
          </h3>

          <div className="listing-feature-grid">
            <div className="listing-feature-item">
              <IconSeat />
              <span>{car.seats} seats</span>
            </div>
            <div className="listing-feature-item">
              <IconTransmission />
              <span>{car.transmission}</span>
            </div>
            <div className="listing-feature-item">
              <IconBag />
              <span>{car.largeBags} Large bag{car.largeBags > 1 ? "s" : ""}</span>
            </div>
            <div className="listing-feature-item">
              <IconMileage />
              <span>{car.mileage}</span>
            </div>
          </div>

          <div className="listing-location-block">
            <div className="listing-location">{car.pickupLocation}</div>
            <div className="listing-distance">{car.distanceFromCenter}</div>
          </div>
        </div>

        <div className="listing-price-column">
          <div className="listing-price-label">{priceLabel}</div>
          <div className="listing-total-price">
            € {displayedPrice}
            {!car.rentalDays ? <span className="listing-price-suffix">/day</span> : null}
          </div>
          <div className={`listing-cancel-copy ${isSearchAvailable ? "is-free" : "is-tight"}`}>
            {hasDateSearch
              ? isSearchAvailable
                ? "Available for your dates"
                : "Unavailable for your dates"
              : car.available
                ? "Free cancellation"
                : "Limited availability"}
          </div>
          <Link
            to={detailsLink}
            className={`btn listing-deal-button ${isSearchAvailable ? "btn-success" : "btn-outline-secondary"}`}
          >
            {isSearchAvailable ? "View deal" : "View details"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ListingCarCard;
