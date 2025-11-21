import { Link } from "react-router-dom";
import { FileQuestion, ArrowLeft } from "lucide-react";
import usePageMetadata from "../hooks/usePageMetadata";
import { ROUTES } from "../constants/routes";

const NotFoundPage = () => {
  usePageMetadata({
    title: "Page Not Found",
    description: "The requested admin path does not exist.",
  });

  return (
    <div className="section-shell grid min-h-[60vh] place-items-center py-16">
      <div className="cinema-panel max-w-md rounded-3xl p-8 text-center shadow-2xl">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
          <FileQuestion className="h-8 w-8" />
        </div>
        <p className="eyebrow mt-6">404 Error</p>
        <h1 className="mt-2 text-2xl font-black text-theme">Page Not Found</h1>
        <p className="muted-copy mx-auto mt-2 text-xs leading-relaxed">
          The administrative path you requested does not exist or has been
          relocated.
        </p>
        <div className="mt-6">
          <Link
            to={ROUTES.DASHBOARD}
            className="primary-action inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition focus:ring-2 focus:ring-red-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
