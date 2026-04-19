import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="section-shell grid min-h-screen place-items-center py-28">
    <div className="cinema-panel rounded-lg p-10 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-black text-white">Page not found</h1>
      <Link
        to="/"
        className="primary-action mt-6 inline-flex rounded-md px-5 py-3 text-sm font-black transition"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
