import { useMemo, useState } from "react";
import BuyCarCard from "../components/BuyCarCard";
import { buyCars } from "../data/buyCars";

const BODY_TYPE_OPTIONS = ["All", "SUV", "Sedan", "Hatchback", "Estate"];
const FUEL_OPTIONS = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function BuyCarsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("All");
  const [selectedFuel, setSelectedFuel] = useState("All");
  const [maxPrice, setMaxPrice] = useState(40000);
  const [sortMode, setSortMode] = useState("featured");

  const filteredCars = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return buyCars
      .filter((car) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          `${car.name} ${car.location} ${car.bodyType} ${car.fuel} ${car.condition}`
            .toLowerCase()
            .includes(normalizedSearch);
        const matchesBodyType =
          selectedBodyType === "All" || car.bodyType === selectedBodyType;
        const matchesFuel = selectedFuel === "All" || car.fuel === selectedFuel;
        const matchesPrice = car.price <= maxPrice;

        return matchesSearch && matchesBodyType && matchesFuel && matchesPrice;
      })
      .sort((leftCar, rightCar) => {
        if (sortMode === "price-asc") {
          return leftCar.price - rightCar.price;
        }

        if (sortMode === "price-desc") {
          return rightCar.price - leftCar.price;
        }

        if (leftCar.featured === rightCar.featured) {
          return rightCar.year - leftCar.year;
        }

        return leftCar.featured ? -1 : 1;
      });
  }, [maxPrice, searchTerm, selectedBodyType, selectedFuel, sortMode]);

  const featuredCount = buyCars.filter((car) => car.featured).length;
  const lowestPrice = Math.min(...buyCars.map((car) => car.price));
  const activeFilters = [
    searchTerm ? `Search: ${searchTerm}` : null,
    selectedBodyType !== "All" ? selectedBodyType : null,
    selectedFuel !== "All" ? selectedFuel : null,
    `Up to €${formatCurrency(maxPrice)}`,
  ].filter(Boolean);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBodyType("All");
    setSelectedFuel("All");
    setMaxPrice(40000);
    setSortMode("featured");
  };

  return (
    <section className="section-space pt-5 buy-showroom-page">
      <div className="container buy-page-shell">
        <div className="buy-page-hero">
          <div className="buy-page-hero-main">
            <span className="eyebrow">Buy Car</span>
            <h1 className="section-title mb-2">Cars for sale</h1>
            <p className="section-copy mb-0">
              Browse a curated selection of sale listings with clear pricing,
              simple filters, and a more premium presentation.
            </p>

            <div className="buy-hero-stat-row">
              <div className="buy-hero-stat-card">
                <small>Total stock</small>
                <strong>{buyCars.length}</strong>
                <span>live car listings</span>
              </div>
              <div className="buy-hero-stat-card">
                <small>Featured</small>
                <strong>{featuredCount}</strong>
                <span>highlighted sale offers</span>
              </div>
              <div className="buy-hero-stat-card">
                <small>Entry point</small>
                <strong>EUR {formatCurrency(lowestPrice)}</strong>
                <span>starting sale price</span>
              </div>
            </div>
          </div>

          <div className="buy-page-hero-note">
            <small>Sales Desk</small>
            <strong>Luxury feel, professional structure</strong>
            <span>
              A restrained layout that puts pricing, condition, and comparison
              first while keeping the browsing experience polished.
            </span>
          </div>
        </div>

        <div className="buy-showroom-layout">
          <div className="buy-filter-panel buy-filter-toolbar">
            <div className="buy-filter-panel-head">
              <small>Refine Selection</small>
              <h3>Find the right car</h3>
              <p>Filter by body type, fuel, budget, and stock keywords.</p>
            </div>

            <div className="row g-3 align-items-end">
              <div className="col-lg-4">
                <label className="form-label">Search stock</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by model, fuel, or location"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="col-sm-6 col-lg-2">
                <label className="form-label">Body type</label>
                <select
                  className="form-select"
                  value={selectedBodyType}
                  onChange={(event) => setSelectedBodyType(event.target.value)}
                >
                  {BODY_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 col-lg-2">
                <label className="form-label">Fuel</label>
                <select
                  className="form-select"
                  value={selectedFuel}
                  onChange={(event) => setSelectedFuel(event.target.value)}
                >
                  {FUEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-lg-2">
                <label className="form-label d-flex justify-content-between">
                  <span>Budget</span>
                  <strong>€{formatCurrency(maxPrice)}</strong>
                </label>
                <input
                  type="range"
                  className="form-range"
                  min="15000"
                  max="40000"
                  step="500"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                />
              </div>

              <div className="col-sm-6 col-lg-2">
                <label className="form-label">Sort</label>
                <select
                  className="form-select"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                >
                  <option value="featured">Featured first</option>
                  <option value="price-asc">Lowest price</option>
                  <option value="price-desc">Highest price</option>
                </select>
              </div>
            </div>

            <div className="buy-filter-toolbar-footer">
              <div className="buy-active-filter-row">
                {activeFilters.map((filter) => (
                  <span className="buy-filter-chip" key={filter}>
                    {filter}
                  </span>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-accent buy-filter-clear"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          </div>

          <div className="buy-results-column">
            <div className="buy-results-overview">
              <div>
                <span className="buy-results-label">Available stock</span>
                <h2 className="results-overview-title">
                  {filteredCars.length} car{filteredCars.length === 1 ? "" : "s"} for sale
                </h2>
                <p className="results-overview-copy mb-0">
                  Clean comparison cards with a straightforward, professional
                  presentation.
                </p>
              </div>

              <div className="buy-results-summary-card">
                <small>Price window</small>
                <strong>Up to €{formatCurrency(maxPrice)}</strong>
              </div>
            </div>

            {filteredCars.length === 0 ? (
              <div className="empty-state text-center mt-4">
                <h2 className="mb-3">No sale cars match this search</h2>
                <p className="text-secondary mb-4">
                  Try widening your budget or switching to a different body type.
                </p>
                <button type="button" className="btn btn-accent" onClick={clearFilters}>
                  Reset buy filters
                </button>
              </div>
            ) : (
              <div className="buy-results-grid">
                {filteredCars.map((car) => (
                  <BuyCarCard car={car} key={car.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyCarsPage;
