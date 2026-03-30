const prefetched = new Set<string>();

const routeImports: Record<string, () => Promise<unknown>> = {
  '/': () => import('@/pages/home'),
  '/about': () => import('@/pages/about'),
  '/programmes': () => import('@/pages/programmes'),
  '/playgroup': () => import('@/pages/playgroup-landing'),
  '/nursery': () => import('@/pages/nursery-landing'),
  '/kindergarten': () => import('@/pages/kindergarten-landing'),
  '/contact': () => import('@/pages/contact'),
  '/blog': () => import('@/pages/blog'),
  '/best-preschool-near-me-in-thane': () => import('@/pages/best-preschool-in-thane'),
  '/preschool-near-me': () => import('@/pages/preschool-near-me'),
  '/preschool-admissions': () => import('@/pages/preschool-admissions'),
};

export function prefetchRoute(path: string) {
  if (prefetched.has(path)) return;
  const loader = routeImports[path];
  if (loader) {
    prefetched.add(path);
    loader();
  }
}

export function setupLinkPrefetching() {
  const handleEvent = (e: Event) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/')) {
      prefetchRoute(href);
    }
  };

  document.addEventListener('pointerenter', handleEvent, { capture: true, passive: true });
  document.addEventListener('focusin', handleEvent, { capture: true, passive: true });
  document.addEventListener('touchstart', handleEvent, { capture: true, passive: true });
}
