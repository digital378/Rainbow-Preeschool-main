import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
  silent?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const boundaryName = this.props.name || "unnamed";
    const path = typeof window !== "undefined" ? window.location.pathname : "ssr";

    if (typeof window !== "undefined" && import.meta.env.DEV) {
      console.error(`[ErrorBoundary:${boundaryName}]`, error, errorInfo);
    }

    if (typeof window !== "undefined") {
      const payload = {
        event_category: "error_boundary",
        event_label: boundaryName,
        description: `${error.name}: ${error.message}`.slice(0, 150),
        page_path: path,
        fatal: !this.props.silent,
      };
      try {
        if (typeof window.gtag === "function") {
          window.gtag("event", "app_error", payload);
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "app_error", ...payload });
        }
      } catch {
        // never let analytics dispatch crash the boundary itself
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.silent) return null;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        data-testid="error-boundary-fallback"
        className="min-h-[60vh] flex items-center justify-center px-6 py-12 bg-white dark:bg-neutral-950"
      >
        <div className="max-w-md w-full text-center space-y-6">
          <img
            src="/images/optimized/rainbow-logo.webp"
            alt="Rainbow Preschool International"
            width={120}
            height={120}
            className="mx-auto h-20 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            data-testid="img-error-logo"
          />
          <div className="space-y-2">
            <h1
              className="text-2xl font-bold text-neutral-900 dark:text-neutral-50"
              data-testid="text-error-title"
            >
              We hit a snag
            </h1>
            <p className="text-base text-neutral-600 dark:text-neutral-300">
              Something on this page didn't load correctly. Please refresh the page,
              or reach Rainbow Preschool International directly — we're happy to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                this.handleReset();
                if (typeof window !== "undefined") window.location.reload();
              }}
              style={{ backgroundColor: "#dc2626" }}
              className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity w-full sm:w-auto"
              data-testid="button-error-refresh"
            >
              Refresh page
            </button>
            <a
              href="tel:+918291568972"
              style={{ borderColor: "#dc2626", color: "#dc2626" }}
              className="inline-flex items-center justify-center rounded-md border-2 px-5 py-2.5 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950 transition-colors w-full sm:w-auto"
              data-testid="link-error-call"
            >
              Call +91 82915 68972
            </a>
          </div>
          <a
            href="/"
            onClick={this.handleReset}
            className="inline-block text-sm font-medium text-neutral-700 dark:text-neutral-300 underline underline-offset-4 hover:text-neutral-900 dark:hover:text-neutral-50"
            data-testid="link-error-home"
          >
            Back to homepage
          </a>
        </div>
      </div>
    );
  }
}
