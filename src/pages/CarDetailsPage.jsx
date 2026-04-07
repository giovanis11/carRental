import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import { fetchCar } from "../lib/api";

function CarDetailsPage() {
  const { carId } = useParams();
  const [searchParams] = useSearchParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const searchLocation = searchParams.get("location") ?? "";
  const searchStartDate = searchParams.get("startDate") ?? "";
  const searchEndDate = searchParams.get("endDate") ?? "";
  const hasDateSearch = Boolean(searchStartDate && searchEndDate);
  const listingQuery = new URLSearchParams();

  if (searchLocation) {
    listingQuery.set("location", searchLocation);
  }

  if (searchStartDate && searchEndDate) {
    listingQuery.set("startDate", searchStartDate);
    listingQuery.set("endDate", searchEndDate);
  }

  const listingsLink = listingQuery.toString()
    ? `/cars?${listingQuery.toString()}`
    : "/cars";

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchCar(carId, {
      startDate: searchStartDate,
      endDate: searchEndDate,
    })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setCar(data);
        setError("");
      })
      .catch((requestError) => {
        if (!isMounted) {
          return;
        }

        setError(requestError.message);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [carId, searchEndDate, searchStartDate]);

  if (isLoading) {
    return (
      <section className="section-space">
        <div className="container">
          <div className="loading-panel">Loading car details...</div>
        </div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="section-space">
        <div className="container">
          <div className="empty-state text-center">
            <h1 className="mb-3">Car not found</h1>
            <p className="text-secondary mb-4">
              {error || "The vehicle you are looking for is unavailable right now."}
            </p>
            <Link to={listingsLink} className="btn btn-accent">
              Back to listings
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-space pt-5">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-7">
            <div className="details-image-card mb-4">
              <img
                src={car.imageLarge ?? car.image}
                srcSet={car.imageSrcSet}
                sizes="(max-width: 991px) 100vw, 58vw"
                alt={car.name}
                className="details-image"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <div className="details-info-card">
              <div className="d-flex flex-wrap justify-content-between gap-3 align-items-start mb-4">
                <div>
                  <span className="badge car-type-badge mb-2">{car.type}</span>
                  <h1 className="section-title mb-2">{car.name}</h1>
                  <p className="section-copy mb-0">{car.description}</p>
                </div>
                <div className="price-panel">
                  <div className="car-price">€{car.totalPrice ?? car.pricePerDay}</div>
                  <span className="text-secondary">
                    {car.rentalDays
                      ? `total for ${car.rentalDays} day${car.rentalDays > 1 ? "s" : ""}`
                      : "per day"}
                  </span>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-sm-6 col-xl-3">
                  <div className="spec-card">
                    <small>Status</small>
                    <strong>
                      {hasDateSearch
                        ? car.searchAvailable
                          ? "Available for dates"
                          : "Booked for dates"
                        : car.available
                          ? "Available"
                          : "Unavailable"}
                    </strong>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="spec-card">
                    <small>Category</small>
                    <strong>{car.type}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="spec-card">
                    <small>Rental</small>
                    <strong>
                      {car.rentalDays
                        ? `${car.rentalDays} day${car.rentalDays > 1 ? "s" : ""}`
                        : "Instant"}
                    </strong>
                  </div>
                </div>
                <div className="col-sm-6 col-xl-3">
                  <div className="spec-card">
                    <small>Pricing</small>
                    <strong>€{car.pricePerDay}/day</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <BookingForm
              carId={car.id}
              carName={car.name}
              available={car.available}
              dateAvailability={car.searchAvailable}
              initialStartDate={searchStartDate}
              initialEndDate={searchEndDate}
              pricePerDay={car.pricePerDay}
              initialRentalDays={car.rentalDays}
              initialTotalPrice={car.totalPrice}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarDetailsPage;
