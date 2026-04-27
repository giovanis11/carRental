function Footer() {
  return (
    <footer className="site-footer py-5">
      <div className="container">
        <div className="footer-panel">
          <div className="row g-4">
            <div className="col-lg-5">
              <span className="eyebrow">LEKSCAR RENTAL</span>
              <h3 className="footer-title">
                Premium rentals with transparent pricing and a polished handover.
              </h3>
              <p className="mb-0 footer-copy">
                Airport-ready vehicles, quick collection, and a booking flow
                built to feel clear, fast, and premium.
              </p>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h6 className="footer-heading">Explore</h6>
              <div className="footer-stack">
                <span>City cars</span>
                <span>Family options</span>
                <span>Airport pickup</span>
              </div>
            </div>

            <div className="col-sm-6 col-lg-2">
              <h6 className="footer-heading">Company</h6>
              <div className="footer-stack">
                <span>About</span>
                <span>No hidden fees</span>
                <span>Support</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="footer-contact-card">
                <small className="text-uppercase">Reservations support</small>
                <h6 className="mt-2 mb-1">Fast help when plans change</h6>
                <p className="mb-0">
                  Airport and city pickup
                  <br />
                  Flexible booking assistance
                </p>
              </div>
            </div>
          </div>

          <div className="footer-bottom d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mt-4 pt-4">
            <p className="mb-0 footer-copy">
              © 2026 LEKSCAR RENTAL. Designed for smooth business and leisure travel.
            </p>
            <div className="footer-links d-flex flex-wrap gap-3">
              <span>Flexible bookings</span>
              <span>No hidden fees</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
