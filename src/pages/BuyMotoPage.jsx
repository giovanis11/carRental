import { useMemo, useState } from "react";
import BuyMotoCard from "../components/BuyMotoCard";
import { buyMotos } from "../data/buyMotos";

const CATEGORY_OPTIONS = ["All", "Scooter", "Naked", "Adventure"];
const TRANSMISSION_OPTIONS = ["All", "Automatic", "Manual"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function BuyMotoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTransmission, setSelectedTransmission] = useState("All");
  const [maxPrice, setMaxPrice] = useState(9000);
  const [sortMode, setSortMode] = useState("featured");

  const filteredMotos = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return buyMotos
      .filter((moto) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          `${moto.name} ${moto.location} ${moto.category} ${moto.engine} ${moto.condition}`
            .toLowerCase()
            .includes(normalizedSearch);
        const matchesCategory =
          selectedCategory === "All" || moto.category === selectedCategory;
        const matchesTransmission =
          selectedTransmission === "All" ||
          moto.transmission === selectedTransmission;
        const matchesPrice = moto.price <= maxPrice;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesTransmission &&
          matchesPrice
        );
      })
      .sort((leftMoto, rightMoto) => {
        if (sortMode === "price-asc") {
          return leftMoto.price - rightMoto.price;
        }

        if (sortMode === "price-desc") {
          return rightMoto.price - leftMoto.price;
        }

        if (leftMoto.featured === rightMoto.featured) {
          return rightMoto.year - leftMoto.year;
        }

        return leftMoto.featured ? -1 : 1;
      });
  }, [maxPrice, searchTerm, selectedCategory, selectedTransmission, sortMode]);

  const featuredCount = buyMotos.filter((moto) => moto.featured).length;
  const lowestPrice = Math.min(...buyMotos.map((moto) => moto.price));
  const activeFilters = [
    searchTerm ? `Search: ${searchTerm}` : null,
    selectedCategory !== "All" ? selectedCategory : null,
    selectedTransmission !== "All" ? selectedTransmission : null,
    `Up to €${formatCurrency(maxPrice)}`,
  ].filter(Boolean);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedTransmission("All");
    setMaxPrice(9000);
    setSortMode("featured");
  };

  return (
    <section className="section-space pt-5 buy-showroom-page">
      <div className="container buy-page-shell">
        <div className="buy-page-hero">
          <div className="buy-page-hero-main">
            <span className="eyebrow">Buy Moto</span>
            <h1 className="section-title mb-2">Motorcycles for sale</h1>
            <p className="section-copy mb-0">
              Browse scooters and motorcycles for sale with clear pricing,
              simple filtering, and a more premium visual tone.
            </p>

            <div className="buy-hero-stat-row">
              <div className="buy-hero-stat-card">
                <small>Total stock</small>
                <strong>{buyMotos.length}</strong>
                <span>live moto listings</span>
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
            <strong>Premium but understated</strong>
            <span>
              A focused inventory view with key details visible at a glance,
              without mixing motorcycles into the car section.
            </span>
          </div>
        </div>

        <div className="buy-showroom-layout">
          <div className="buy-filter-panel buy-filter-toolbar">
            <div className="buy-filter-panel-head">
              <small>Refine Selection</small>
              <h3>Find the right moto</h3>
              <p>Filter by category, gearbox, budget, and stock keywords.</p>
            </div>

            <div className="row g-3 align-items-end">
              <div className="col-lg-4">
                <label className="form-label">Search stock</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by model, category, or location"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <div className="col-sm-6 col-lg-2">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6 col-lg-2">
                <label className="form-label">Transmission</label>
                <select
                  className="form-select"
                  value={selectedTransmission}
                  onChange={(event) => setSelectedTransmission(event.target.value)}
                >
                  {TRANSMISSION_OPTIONS.map((option) => (
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
                  min="4000"
                  max="9000"
                  step="250"
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
                  {filteredMotos.length} moto{filteredMotos.length === 1 ? "" : "s"} for sale
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

            {filteredMotos.length === 0 ? (
              <div className="empty-state text-center mt-4">
                <h2 className="mb-3">No motorcycles match this search</h2>
                <p className="text-secondary mb-4">
                  Try another category or widen your budget to see more options.
                </p>
                <button type="button" className="btn btn-accent" onClick={clearFilters}>
                  Reset moto filters
                </button>
              </div>
            ) : (
              <div className="buy-results-grid">
                {filteredMotos.map((moto) => (
                  <BuyMotoCard moto={moto} key={moto.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyMotoPage;
