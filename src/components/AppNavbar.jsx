import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/lekscar-logo.png";

function AppNavbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark site-navbar sticky-top">
        <div className="container">
          <Link className="navbar-brand brand-lockup d-flex align-items-center gap-3" to="/">
            <span className="brand-mark-wrap">
              <img
                src={logo}
                alt="LEKSCAR RENTAL logo"
                width="52"
                height="52"
                className="brand-logo-image"
              />
            </span>
            <span className="brand-copy-wrap">
              <span className="brand-wordmark">LEKSCAR</span>
              <span className="brand-submark">Rental</span>
            </span>
          </Link>

          <div className="d-none d-lg-flex navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link px-lg-3" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/cars">
              Rent Car
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/buy-car">
              Buy Car
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/buy-moto">
              Buy Moto
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/admin">
              Admin
            </NavLink>
            <span className="nav-meta d-none d-xl-inline-flex ms-lg-3">
              No hidden fees
            </span>
            <button
              type="button"
              className={`theme-toggle ms-lg-3 mt-3 mt-lg-0 ${isDark ? "is-dark" : ""}`}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              aria-pressed={isDark}
              onClick={onToggleTheme}
            >
              <span className="theme-toggle-icon" aria-hidden="true" />
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
            <Link to="/cars" className="btn btn-accent ms-lg-3 mt-3 mt-lg-0">
              Rent now
            </Link>
          </div>

          <button
            className={`navbar-toggler border-0 shadow-none ${mobileMenuOpen ? "is-open" : ""}`}
            type="button"
            aria-controls="mainNav"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            <span className="navbar-toggler-box" aria-hidden="true">
              <span className="navbar-toggler-line" />
              <span className="navbar-toggler-line" />
              <span className="navbar-toggler-line" />
            </span>
          </button>
        </div>
      </nav>

      <div className={`site-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`} id="mainNav">
        <div
          className="site-mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div className="site-mobile-menu-panel">
          <div className="site-mobile-menu-head">
            <div className="site-mobile-menu-brand">
              <span className="brand-mark-wrap mobile-brand-mark">
                <img
                  src={logo}
                  alt="LEKSCAR RENTAL logo"
                  width="52"
                  height="52"
                  className="brand-logo-image"
                />
              </span>
              <div className="brand-copy-wrap">
                <span className="brand-wordmark">LEKSCAR</span>
                <span className="brand-submark">Rental</span>
              </div>
            </div>

            <button
              type="button"
              className="site-mobile-menu-close"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span />
              <span />
            </button>
          </div>

          <div className="navbar-nav site-mobile-menu-nav">
            <NavLink className="nav-link px-lg-3" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/cars">
              Rent Car
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/buy-car">
              Buy Car
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/buy-moto">
              Buy Moto
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/admin">
              Admin
            </NavLink>
            <span className="nav-meta d-none d-xl-inline-flex ms-lg-3">
              No hidden fees
            </span>
            <button
              type="button"
              className={`theme-toggle ms-lg-3 mt-3 mt-lg-0 ${isDark ? "is-dark" : ""}`}
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
              aria-pressed={isDark}
              onClick={onToggleTheme}
            >
              <span className="theme-toggle-icon" aria-hidden="true" />
              <span>{isDark ? "Light" : "Dark"}</span>
            </button>
            <Link to="/cars" className="btn btn-accent ms-lg-3 mt-3 mt-lg-0">
              Rent now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppNavbar;
