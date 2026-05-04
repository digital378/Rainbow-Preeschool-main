import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../error-boundary";

function Thrower({ message = "boom" }: { message?: string }): JSX.Element {
  throw new Error(message);
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    delete (window as unknown as { gtag?: unknown }).gtag;
    delete (window as unknown as { dataLayer?: unknown }).dataLayer;
  });

  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <p data-testid="child-content">happy path</p>
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.queryByTestId("error-boundary-fallback")).not.toBeInTheDocument();
  });

  it("renders the friendly fallback when a child throws", () => {
    render(
      <ErrorBoundary name="test-default">
        <Thrower />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("error-boundary-fallback")).toBeInTheDocument();
    expect(screen.getByTestId("text-error-title")).toHaveTextContent("We hit a snag");
    expect(screen.getByTestId("button-error-refresh")).toBeInTheDocument();

    const callLink = screen.getByTestId("link-error-call");
    expect(callLink).toBeInTheDocument();
    expect(callLink).toHaveAttribute("href", "tel:+918291568972");

    expect(screen.getByTestId("link-error-home")).toHaveAttribute("href", "/");
  });

  it("renders nothing when silent is true and a child throws", () => {
    const { container } = render(
      <ErrorBoundary silent name="test-silent">
        <Thrower />
      </ErrorBoundary>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("error-boundary-fallback")).not.toBeInTheDocument();
  });

  it("renders the provided fallback prop instead of the default UI when a child throws", () => {
    render(
      <ErrorBoundary
        name="test-custom"
        fallback={<div data-testid="custom-fallback">custom</div>}
      >
        <Thrower />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("error-boundary-fallback")).not.toBeInTheDocument();
  });

  it("dispatches a GA4 app_error event via window.gtag when available", () => {
    const gtagSpy = vi.fn();
    (window as unknown as { gtag: typeof gtagSpy }).gtag = gtagSpy;

    render(
      <ErrorBoundary name="ga-test">
        <Thrower message="kaboom" />
      </ErrorBoundary>,
    );

    expect(gtagSpy).toHaveBeenCalledTimes(1);
    const [eventName, action, payload] = gtagSpy.mock.calls[0];
    expect(eventName).toBe("event");
    expect(action).toBe("app_error");
    expect(payload).toMatchObject({
      event_category: "error_boundary",
      event_label: "ga-test",
      fatal: true,
    });
    expect(payload.description).toContain("kaboom");
  });

  it("falls back to dataLayer.push when window.gtag is not defined", () => {
    const dataLayer: Array<Record<string, unknown>> = [];
    (window as unknown as { dataLayer: typeof dataLayer }).dataLayer = dataLayer;

    render(
      <ErrorBoundary name="dl-test" silent>
        <Thrower />
      </ErrorBoundary>,
    );

    expect(dataLayer).toHaveLength(1);
    expect(dataLayer[0]).toMatchObject({
      event: "app_error",
      event_label: "dl-test",
      fatal: false,
    });
  });
});
