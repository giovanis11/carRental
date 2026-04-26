function Footer() {
  return (
    <footer className="site-footer py-5">
      <div className="container">
        <div className="footer-panel">
          <div className="row g-4">
            <div className="col-lg-5">
              <span className="eyebrow">DriveOn</span>
              <h3 className="footer-title">
                Premium rentals with the polish of a private mobility brand.
              </h3>
              <p className="mb-0 footer-copy">
                Curated vehicles, frictionless pickup, and a booking flow built
                to feel calm, fast, and premium.
              </p>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h6 className="footer-heading">Explore</h6>
              <div className="footer-stack">
                <span>Luxury SUVs</span>
                <span>Executive sedans</span>
                <span>Airport pickup</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h6 className="footer-heading">Company</h6>
              <div className="footer-stack">
                <span>About</span>
                <span>Pricing</span>
                <span>Support</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="footer-contact-card">
                <small className="text-uppercase">Client services</small>
                <h6 className="mt-2 mb-1">Always on, always human</h6>
                <p className="mb-0">
                  hello@driveon.com
                  <br />
                  +30 210 555 0147
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mt-4 pt-4">
            <p className="mb-0 footer-copy">
              © 2026 DriveOn. Designed for modern business and leisure travel.
            </p>
            <div className="footer-links d-flex flex-wrap gap-3">
              <span>Flexible bookings</span>
              <span>Curated fleet</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
