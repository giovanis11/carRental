import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListingCarCard from "../components/ListingCarCard";
import { fetchCars } from "../lib/api";

const CATEGORY_OPTIONS = ["All", "Small car", "Medium car", "Large car"];

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

function CarListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxPrice, setMaxPrice] = useState(200);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedBagCounts, setSelectedBagCounts] = useState([]);
  const [sortMode, setSortMode] = useState("recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(
    Boolean(searchParams.get("startDate") && searchParams.get("endDate"))
  );

  const searchLocation = searchParams.get("location")?.trim() ?? "";
  const searchStartDate = searchParams.get("startDate") ?? "";
  const searchEndDate = searchParams.get("endDate") ?? "";
  const searchMode = searchParams.get("mode") ?? "";
  const hasDateSearch = Boolean(searchStartDate && searchEndDate);
  const searchRentalDays = useMemo(
    () => calculateRentalDays(searchStartDate, searchEndDate),
    [searchEndDate, searchStartDate]
  );

  useEffect(() => {
    setOnlyAvailable(hasDateSearch);
  }, [hasDateSearch]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchCars({
      startDate: searchStartDate,
      endDate: searchEndDate,
    })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setCars(data);
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
  }, [searchEndDate, searchStartDate]);

  const typeCounts = useMemo(() => {
    return cars.reduce(
      (counts, car) => ({
        ...counts,
        [car.type]: (counts[car.type] ?? 0) + 1,
      }),
      {}
    );
  }, [cars]);

  const seatCounts = useMemo(() => {
    return cars.reduce(
      (counts, car) => ({
        ...counts,
        [car.seats]: (counts[car.seats] ?? 0) + 1,
      }),
      {}
    );
  }, [cars]);

  const transmissionCounts = useMemo(() => {
    return cars.reduce(
      (counts, car) => ({
        ...counts,
        [car.transmission]: (counts[car.transmission] ?? 0) + 1,
      }),
      {}
    );
  }, [cars]);

  const bagCounts = useMemo(() => {
    return cars.reduce(
      (counts, car) => ({
        ...counts,
        [car.largeBags]: (counts[car.largeBags] ?? 0) + 1,
      }),
      {}
    );
  }, [cars]);

  const toggleValue = (value, setter) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const filteredCars = useMemo(
    () =>
      cars.filter((car) => {
        const matchesPrice = car.pricePerDay <= maxPrice;
        const matchesType = selectedType === "All" || car.type === selectedType;
        const matchesSeats =
          selectedSeats.length === 0 || selectedSeats.includes(car.seats);
        const matchesTransmission =
          selectedTransmissions.length === 0 ||
          selectedTransmissions.includes(car.transmission);
        const matchesBags =
          selectedBagCounts.length === 0 ||
          selectedBagCounts.includes(car.largeBags);
        const matchesAvailability = !onlyAvailable || car.searchAvailable;
        const locationTokens = searchLocation
          .toLowerCase()
          .split(/[\s,-]+/)
          .filter((token) => token.length > 2);
        const matchesLocation =
          locationTokens.length === 0 ||
          locationTokens.some((token) =>
            car.pickupLocation.toLowerCase().includes(token)
          );

        return (
          matchesPrice &&
          matchesType &&
          matchesSeats &&
          matchesTransmission &&
          matchesBags &&
          matchesAvailability &&
          matchesLocation
        );
      }),
    [
      cars,
      maxPrice,
      onlyAvailable,
      searchLocation,
      selectedBagCounts,
      selectedSeats,
      selectedTransmissions,
      selectedType,
    ]
  );

  const displayedCars = useMemo(() => {
    const sortedCars = [...filteredCars];

    if (sortMode === "price-asc") {
      sortedCars.sort(
        (leftCar, rightCar) =>
          (leftCar.totalPrice ?? leftCar.pricePerDay) -
          (rightCar.totalPrice ?? rightCar.pricePerDay)
      );
    }

    return sortedCars;
  }, [filteredCars, sortMode]);

  const toggleSortMode = () => {
    setSortMode((current) =>
      current === "recommended" ? "price-asc" : "recommended"
    );
  };

  const clearAllFilters = () => {
    setSelectedType("All");
    setMaxPrice(200);
    setOnlyAvailable(false);
    setSelectedSeats([]);
    setSelectedTransmissions([]);
    setSelectedBagCounts([]);
    setSortMode("recommended");
    setMobileFiltersOpen(false);
    setSearchParams({});
  };

  const mobileMapUrl = searchLocation
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        searchLocation
      )}`
    : "https://www.google.com/maps";

  return (
    <section className="section-space pt-5">
      <div className="container listings-page-shell">
        <div className="listings-page-intro mb-4">
          <span className="eyebrow">Browse fleet</span>
          <h1 className="section-title mb-2">Choose from premium rentals</h1>
          <p className="section-copy mb-0">
            Explore flexible daily pricing across small, medium, and larger
            rental categories.
          </p>
        </div>

        <div className="listings-layout">
          <aside
            className={`filter-panel listing-filter-panel ${
              mobileFiltersOpen ? "is-open" : ""
            }`}
          >
            <div className="filter-panel-head">
              <h3 className="mb-0">Filter</h3>
              <button
                type="button"
                className="filter-clear-button"
                onClick={clearAllFilters}
              >
                Clear all filters
              </button>
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Availability</h6>
              <label className="filter-option">
                <span className="filter-option-main">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(event) => setOnlyAvailable(event.target.checked)}
                  />
                  <span>
                    {hasDateSearch
                      ? "Only show cars available for these dates"
                      : "Only show available cars"}
                  </span>
                </span>
                <span className="filter-option-count">
                  {
                    cars.filter((car) =>
                      hasDateSearch ? car.searchAvailable : car.available
                    ).length
                  }
                </span>
              </label>
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Price</h6>
              <label
                htmlFor="priceRange"
                className="form-label d-flex justify-content-between"
              >
                <span>Up to</span>
                <strong>€{maxPrice}/day</strong>
              </label>
              <input
                id="priceRange"
                type="range"
                className="form-range"
                min="70"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
              />
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Car category</h6>
              <div className="filter-options-list">
                {CATEGORY_OPTIONS.map((type) => (
                  <label className="filter-option" key={type}>
                    <span className="filter-option-main">
                      <input
                        type="radio"
                        name="carType"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                      />
                      <span>{type === "All" ? "All categories" : type}</span>
                    </span>
                    <span className="filter-option-count">
                      {type === "All" ? cars.length : typeCounts[type] ?? 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Seats</h6>
              <div className="filter-options-list">
                {[4, 5].map((seatCount) => (
                  <label className="filter-option" key={seatCount}>
                    <span className="filter-option-main">
                      <input
                        type="checkbox"
                        checked={selectedSeats.includes(seatCount)}
                        onChange={() => toggleValue(seatCount, setSelectedSeats)}
                      />
                      <span>
                        {seatCount} seat{seatCount > 1 ? "s" : ""}
                      </span>
                    </span>
                    <span className="filter-option-count">
                      {seatCounts[seatCount] ?? 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Transmission</h6>
              <div className="filter-options-list">
                {["Automatic", "Manual"].map((transmission) => (
                  <label className="filter-option" key={transmission}>
                    <span className="filter-option-main">
                      <input
                        type="checkbox"
                        checked={selectedTransmissions.includes(transmission)}
                        onChange={() =>
                          toggleValue(transmission, setSelectedTransmissions)
                        }
                      />
                      <span>{transmission}</span>
                    </span>
                    <span className="filter-option-count">
                      {transmissionCounts[transmission] ?? 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h6 className="filter-group-title">Large bags</h6>
              <div className="filter-options-list">
                {[1, 2].map((bagCount) => (
                  <label className="filter-option" key={bagCount}>
                    <span className="filter-option-main">
                      <input
                        type="checkbox"
                        checked={selectedBagCounts.includes(bagCount)}
                        onChange={() =>
                          toggleValue(bagCount, setSelectedBagCounts)
                        }
                      />
                      <span>
                        {bagCount} large bag{bagCount > 1 ? "s" : ""}
                      </span>
                    </span>
                    <span className="filter-option-count">
                      {bagCounts[bagCount] ?? 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="listings-results-column">
            <div className="mobile-results-toolbar">
              <button
                type="button"
                className="mobile-results-action"
                onClick={toggleSortMode}
              >
                <span>Sort</span>
                <small>
                  {sortMode === "recommended" ? "Recommended" : "Lowest price"}
                </small>
              </button>
              <button
                type="button"
                className="mobile-results-action"
                onClick={() => setMobileFiltersOpen((current) => !current)}
              >
                <span>Filter</span>
                <small>{mobileFiltersOpen ? "Hide options" : "Show options"}</small>
              </button>
              <a
                className="mobile-results-action"
                href={mobileMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span>Map</span>
                <small>{searchLocation || "Open maps"}</small>
              </a>
            </div>

            <div className="results-overview-card">
              <div className="results-overview-top">
                <div>
                  <h2 className="results-overview-title">
                    {filteredCars.length}{" "}
                    {hasDateSearch && onlyAvailable
                      ? "cars available for your dates"
                      : "cars available"}
                  </h2>
                  <p className="results-overview-copy mb-0">
                    {hasDateSearch
                      ? "Live availability and total trip pricing based on your selected rental dates."
                      : "Live inventory, instant pricing, and booking-ready offers."}
                  </p>
                  {searchLocation || searchStartDate || searchEndDate ? (
                    <div className="results-query-summary">
                      {searchLocation ? (
                        <span className="results-query-chip">{searchLocation}</span>
                      ) : null}
                      {searchStartDate ? (
                        <span className="results-query-chip">Pick-up {searchStartDate}</span>
                      ) : null}
                      {searchEndDate ? (
                        <span className="results-query-chip">Drop-off {searchEndDate}</span>
                      ) : null}
                      {searchRentalDays ? (
                        <span className="results-query-chip">
                          {searchRentalDays} day{searchRentalDays > 1 ? "s" : ""}
                        </span>
                      ) : null}
                      {searchMode ? (
                        <span className="results-query-chip">
                          {searchMode === "daily"
                            ? "By day"
                            : searchMode === "hourly"
                              ? "By hour"
                              : "Road trip"}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="sort-pill-button"
                  onClick={toggleSortMode}
                >
                  Sort by:{" "}
                  {sortMode === "recommended" ? "Recommended" : "Lowest price"}
                </button>
              </div>

              <div className="category-chip-row">
                {CATEGORY_OPTIONS.map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={`category-chip ${selectedType === type ? "is-active" : ""}`}
                    onClick={() => setSelectedType(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="results-note-card">
              {hasDateSearch
                ? "These totals are calculated for the exact dates you searched, and each result is checked against existing bookings."
                : "Choose your rental dates to see real availability and full-trip pricing like an actual car rental search."}
            </div>

            {isLoading ? <div className="loading-panel">Fetching live inventory...</div> : null}

            {error ? (
              <div className="alert alert-danger" role="alert">
                Unable to load listings right now: {error}
              </div>
            ) : null}

            {!isLoading && !error && filteredCars.length === 0 ? (
              <div className="empty-state text-center">
                <h2 className="mb-3">No cars match this search</h2>
                <p className="text-secondary mb-4">
                  {hasDateSearch
                    ? "Try different dates or relax one of the filters to see more options."
                    : "Try a higher price ceiling or switch to a different category."}
                </p>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={clearAllFilters}
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {!isLoading && !error && filteredCars.length > 0 ? (
              <div className="listing-results-stack">
                {displayedCars.map((car) => (
                  <ListingCarCard
                    car={car}
                    key={car.id}
                    searchLocation={searchLocation}
                    searchStartDate={searchStartDate}
                    searchEndDate={searchEndDate}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CarListingsPage;
