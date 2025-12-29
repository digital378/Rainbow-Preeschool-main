/**
 * Rainbow Trail Scroll Reveal - Kid-friendly scroll animations
 * 
 * USAGE:
 * <h2 data-sparkle>Section Heading</h2>
 * 
 * <div data-stagger="children">
 *   <div data-reveal="pop">Card 1</div>
 *   <div data-reveal="pop">Card 2</div>
 * </div>
 * 
 * <section data-reveal="float">Content</section>
 * <div data-reveal="slide" data-direction="left">From left</div>
 * <span data-reveal="wiggle">Icon</span>
 * 
 * ATTRIBUTES:
 * - data-reveal="pop|float|slide|wiggle" - Animation type
 * - data-direction="left|right" - For slide animations
 * - data-sparkle - Rainbow underline animation for headings
 * - data-stagger="children" - Stagger child animations
 * - data-float-icon - Gentle bobbing for icons
 */

// Check if reduced motion is preferred
function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Create sparkle elements for heading
function createSparkles(element: HTMLElement): void {
  // Don't create sparkles if they already exist
  if (element.querySelector(".sparkle-container")) return;
  
  const container = document.createElement("span");
  container.className = "sparkle-container";
  container.setAttribute("aria-hidden", "true");
  
  // Create 5 sparkle dots
  for (let i = 0; i < 5; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = `sparkle sparkle-${i + 1}`;
    container.appendChild(sparkle);
  }
  
  element.appendChild(container);
}

// Initialize reveal animations
function initReveal(): void {
  if (prefersReducedMotion()) {
    // For reduced motion: show all content immediately
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-inview", "no-animation");
    });
    document.querySelectorAll("[data-sparkle]").forEach((el) => {
      el.classList.add("is-inview", "no-animation");
    });
    return;
  }

  // Reveal observer for sections/cards
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  // Sparkle observer for headings
  const sparkleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          createSparkles(entry.target as HTMLElement);
          entry.target.classList.add("is-inview");
          sparkleObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  // Observe all reveal elements
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    revealObserver.observe(el);
  });

  // Observe all sparkle headings
  document.querySelectorAll("[data-sparkle]").forEach((el) => {
    sparkleObserver.observe(el);
  });

  // Handle stagger containers
  document.querySelectorAll("[data-stagger='children']").forEach((container) => {
    const children = container.querySelectorAll("[data-reveal]");
    children.forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--stagger-delay", `${index * 100}ms`);
    });
  });
}

// Cleanup function for SPA navigation
function cleanupReveal(): void {
  document.querySelectorAll("[data-reveal].is-inview").forEach((el) => {
    el.classList.remove("is-inview");
  });
  document.querySelectorAll("[data-sparkle].is-inview").forEach((el) => {
    el.classList.remove("is-inview");
    const container = el.querySelector(".sparkle-container");
    if (container) container.remove();
  });
}

// Export for React hook usage - returns cleanup function
export function useScrollReveal(): (() => void) | undefined {
  // Run on mount
  if (typeof window !== "undefined") {
    // Small delay to ensure DOM is ready after route change
    const timeoutId = setTimeout(() => {
      initReveal();
    }, 50);
    
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      cleanupReveal();
      initReveal();
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }
  return undefined;
}

// Initialize on DOMContentLoaded for non-SPA pages
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveal);
  } else {
    // DOM already loaded
    initReveal();
  }
}

export { initReveal, cleanupReveal, prefersReducedMotion };
