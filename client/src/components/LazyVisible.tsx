import { useState, useRef, useEffect, ReactNode } from "react";

interface LazyVisibleProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  /** If window.innerWidth < minWidth, children are never mounted (desktop-only gate) */
  minWidth?: number;
}

/**
 * Mounts children only when the element nears the viewport (IntersectionObserver).
 * On screens narrower than `minWidth`, children are never mounted — the placeholder
 * shows permanently. This lets Three.js sections skip entirely on mobile.
 */
export function LazyVisible({
  children,
  placeholder = null,
  rootMargin = "300px",
  minWidth = 0,
}: LazyVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Never load on screens narrower than minWidth
    if (minWidth && window.innerWidth < minWidth) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, minWidth]);

  return <div ref={ref}>{show ? children : placeholder}</div>;
}
