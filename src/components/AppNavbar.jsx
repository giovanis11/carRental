import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

function AppNavbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <nav
      className={`navbar navbar-expand-lg ${isDark ? "navbar-dark" : "navbar-light"} site-navbar sticky-top`}
    >
      <div className="container">
        <Link className="navbar-brand brand-lockup d-flex align-items-center gap-3" to="/">
          <span className="brand-mark-wrap">
            <img src={logo} alt="DriveOn logo" width="40" height="40" />
          </span>
          <span className="brand-copy-wrap">
            <span className="brand-wordmark">DriveOn</span>
            <span className="brand-submark">premium car rentals</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link px-lg-3" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/cars">
              Cars
            </NavLink>
            <NavLink className="nav-link px-lg-3" to="/admin">
              Admin
            </NavLink>
            <span className="nav-meta d-none d-xl-inline-flex ms-lg-3">
              Concierge pickup in 40+ cities
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
              Book Today
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
