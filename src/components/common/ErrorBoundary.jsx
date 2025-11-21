import { Component, createRef } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { APP_TITLE } from "../../config/config";

class ErrorBoundaryContent extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
    this.headingRef = createRef();
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "Unhandled application error in Admin Panel:",
      error,
      errorInfo,
    );
  }

  componentDidUpdate(_, previousState) {
    if (!previousState.hasError && this.state.hasError) {
      document.title = `Unexpected Error • ${APP_TITLE}`;
      this.headingRef.current?.focus();
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main
        className="section-shell grid min-h-screen place-items-center px-4 py-24 sm:py-28"
        role="alert"
        aria-labelledby="admin-unexpected-error-heading"
      >
        <section className="cinema-panel w-full max-w-lg rounded-2xl p-6 text-center sm:p-10 shadow-2xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1
            ref={this.headingRef}
            id="admin-unexpected-error-heading"
            tabIndex="-1"
            className="mt-6 text-3xl font-black text-theme outline-none sm:text-4xl"
          >
            Something went wrong.
          </h1>
          <p className="muted-copy mt-3 text-sm">
            The Admin Panel encountered an unexpected application error.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="primary-action inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Retry loading this page"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry Page
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/")}
              className="secondary-action inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Go to Admin Dashboard Overview"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              Admin Dashboard
            </button>
          </div>

          {this.state.error && (
            <div className="mt-8 text-left">
              <button
                type="button"
                onClick={() =>
                  this.setState((prev) => ({ showDetails: !prev.showDetails }))
                }
                className="text-xs font-semibold text-muted underline hover:text-theme"
              >
                {this.state.showDetails
                  ? "Hide Technical Details"
                  : "Show Technical Details"}
              </button>
              {this.state.showDetails && (
                <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-black/50 p-4 text-xs font-mono text-red-400 border border-red-900/30">
                  {this.state.error.toString()}
                </pre>
              )}
            </div>
          )}
        </section>
      </main>
    );
  }
}

const ErrorBoundary = ({ children }) => (
  <ErrorBoundaryContent>{children}</ErrorBoundaryContent>
);

export default ErrorBoundary;
