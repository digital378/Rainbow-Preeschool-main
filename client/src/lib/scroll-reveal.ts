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

// Singleton observers - persisted across reinitializations
let revealObserver: IntersectionObserver | null = null;
let sparkleObserver: IntersectionObserver | null = null;

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

// Cleanup existing observers and DOM modifications
function cleanupReveal(): void {
  // Disconnect existing observers
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
  if (sparkleObserver) {
    sparkleObserver.disconnect();
    sparkleObserver = null;
  }
  
  // Remove is-inview classes from all elements
  document.querySelectorAll("[data-reveal].is-inview").forEach((el) => {
    el.classList.remove("is-inview", "no-animation");
  });
  document.querySelectorAll("[data-sparkle].is-inview").forEach((el) => {
    el.classList.remove("is-inview", "no-animation");
  });
  
  // Remove dynamically appended sparkle containers to prevent DOM buildup
  document.querySelectorAll(".sparkle-container").forEach((container) => {
    container.remove();
  });
}

// Initialize reveal animations
function initReveal(): void {
  // First, clean up any existing observers to prevent duplicates
  cleanupReveal();
  
  if (prefersReducedMotion()) {
    // For reduced motion: show all content immediately without animation
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-inview", "no-animation");
    });
    document.querySelectorAll("[data-sparkle]").forEach((el) => {
      el.classList.add("is-inview", "no-animation");
    });
    return;
  }

  // Create new reveal observer
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-inview");
          revealObserver?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  // Create new sparkle observer
  sparkleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          createSparkles(entry.target as HTMLElement);
          entry.target.classList.add("is-inview");
          sparkleObserver?.unobserve(entry.target);
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
    revealObserver?.observe(el);
  });

  // Observe all sparkle headings
  document.querySelectorAll("[data-sparkle]").forEach((el) => {
    sparkleObserver?.observe(el);
  });

  // Handle stagger containers - set delay CSS custom properties
  document.querySelectorAll("[data-stagger='children']").forEach((container) => {
    const children = container.querySelectorAll("[data-reveal]");
    children.forEach((child, index) => {
      (child as HTMLElement).style.setProperty("--stagger-delay", `${index * 100}ms`);
    });
  });
}

export { initReveal, cleanupReveal, prefersReducedMotion };
