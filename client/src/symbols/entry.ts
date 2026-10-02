type IslandName = "riddles" | "matching" | "faq" | "passport";

const replaying = new WeakSet<EventTarget>();
const islandLoads = new WeakMap<HTMLElement, Promise<void>>();

async function loadIsland(name: IslandName, root: HTMLElement) {
  const existing = islandLoads.get(root);
  if (existing) return existing;
  if (root.dataset[`${name}Loaded`] === "true") return;
  root.dataset[`${name}Loaded`] = "loading";
  const load = (async () => {
    try {
      if (name === "riddles") (await import("./riddles")).initializeRiddles(root);
      else if (name === "matching") (await import("./matching")).initializeMatching(root);
      else if (name === "faq") (await import("./faq")).initializeFaq(root);
      else (await import("./passport")).initializePassport(root);
      root.dataset[`${name}Loaded`] = "true";
    } catch (error) {
      delete root.dataset[`${name}Loaded`];
      throw error;
    } finally {
      islandLoads.delete(root);
    }
  })();
  islandLoads.set(root, load);
  return load;
}

export function initializeSymbols(root: HTMLElement) {
  if (root.dataset.symbolsInitialized) return () => {};
  root.dataset.symbolsInitialized = "true";

  const onStamp = (event: Event) => {
    const id = (event as CustomEvent<{ id?: string }>).detail?.id;
    if (!id) return;
    const card = root.querySelector<HTMLElement>(`[data-symbol-id="${CSS.escape(id)}"][data-symbol-card]`);
    if (card) card.dataset.collected = "true";
    const stamp = root.querySelector<HTMLElement>(`[data-stamp="${CSS.escape(id)}"]`);
    if (stamp) stamp.classList.add("filled");
  };
  document.addEventListener("symbols:stamp", onStamp);

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) target.classList.remove("pending");
    });
  }, { threshold: 0.12 });
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((item) => revealObserver.observe(item));
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.querySelectorAll("[data-reveal]").forEach((item) => item.classList.remove("pending"));
  }

  const collectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        const id = (target as HTMLElement).dataset.symbolId;
        (target as HTMLElement).dataset.collected = "true";
        const stamp = id && root.querySelector<HTMLElement>(`[data-stamp="${CSS.escape(id)}"]`);
        if (stamp) stamp.classList.add("filled");
      }
    });
  }, { threshold: 0.35 });
  root.querySelectorAll<HTMLElement>("[data-symbol-card]").forEach((card) => collectionObserver.observe(card));

  const progress = root.querySelector<HTMLElement>(".tricolour-progress-fill");
  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = doc.scrollTop || body.scrollTop;
    const scrollHeight = (doc.scrollHeight || body.scrollHeight) - doc.clientHeight;
    const pct = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    progress.style.width = `${pct}%`;
  };
  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const islandSelectors: [IslandName, string][] = [
    ["riddles", "[data-riddle-island]"],
    ["matching", "[data-match-island]"],
    ["faq", "[data-faq-island]"],
    ["passport", 'a[href="/downloads/symbol-passport.pdf"]'],
  ];
  const islands: { name: IslandName; node: HTMLElement }[] = [];
  islandSelectors.forEach(([name, selector]) => {
    root.querySelectorAll<HTMLElement>(selector).forEach((node) => islands.push({ name, node }));
  });
  const nearViewport = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const island = islands.find(({ node }) => node === entry.target);
      if (island) {
        void loadIsland(island.name, island.node);
        nearViewport.unobserve(island.node);
      }
    });
  }, { rootMargin: "320px 0px" });
  islands.forEach(({ node }) => nearViewport.observe(node));

  const delegatedClick = (event: MouseEvent) => {
    if (replaying.has(event.target as EventTarget)) {
      replaying.delete(event.target as EventTarget);
      return;
    }
    const target = event.target as Element | null;
    if (!target) return;
    const island = islands.find(({ node }) => node === target.closest(`[data-riddle-island], [data-match-island], [data-faq-island], a[href="/downloads/symbol-passport.pdf"]`));
    if (!island || island.node.dataset[`${island.name}Loaded`] === "true") return;

    // Native PDF links proceed unchanged. For button islands, defer and replay
    // the first activation only after its dedicated module is ready.
    const isPassport = island.name === "passport";
    if (!isPassport) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    void loadIsland(island.name, island.node).then(() => {
      if (isPassport) return;
      const activation = target.closest<HTMLElement>("button");
      if (!activation) return;
      replaying.add(activation);
      activation.click();
    });
  };
  root.addEventListener("click", delegatedClick, true);

  const delegatedDepthClick = (event: MouseEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-depth]");
    if (!button || !root.contains(button)) return;
    const id = button.dataset.symbolId;
    const depth = button.dataset.depth;
    if (!id || !depth) return;
    const card = button.closest<HTMLElement>("[data-symbol-card]");
    const copy = card?.querySelector<HTMLElement>("[data-detail-copy]");
    if (copy) copy.textContent = depth === "toddler" ? copy.dataset.toddler || "" : copy.dataset.preschooler || "";
    card?.querySelectorAll<HTMLButtonElement>("[data-depth]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    if (card) card.dataset.collected = "true";
    const stamp = root.querySelector<HTMLElement>(`[data-stamp="${CSS.escape(id)}"]`);
    if (stamp) stamp.classList.add("filled");
  };
  root.addEventListener("click", delegatedDepthClick);

  const cleanup = () => {
    document.removeEventListener("symbols:stamp", onStamp);
    root.removeEventListener("click", delegatedClick, true);
    root.removeEventListener("click", delegatedDepthClick);
    window.removeEventListener("scroll", updateProgress);
    window.removeEventListener("resize", updateProgress);
    revealObserver.disconnect();
    collectionObserver.disconnect();
    nearViewport.disconnect();
    delete root.dataset.symbolsInitialized;
  };
  return cleanup;
}