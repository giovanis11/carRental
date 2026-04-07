import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="section-space">
      <div className="container">
        <div className="empty-state text-center">
          <span className="eyebrow">404</span>
          <h1 className="mb-3">Page not found</h1>
          <p className="text-secondary mb-4">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-accent">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
