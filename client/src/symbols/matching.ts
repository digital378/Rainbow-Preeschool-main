export function initializeMatching(root: HTMLElement) {
  if (root.dataset.matchReady) return;
  root.dataset.matchReady = "true";
  let selected: string | null = null;
  const matched = new Set<string>();
  root.addEventListener("click", (event) => {
    const tile = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-match-illustration], [data-match-name]");
    if (!tile || !root.contains(tile) || tile.disabled) return;

    if (tile.dataset.matchIllustration) {
      selected = selected === tile.dataset.matchIllustration ? null : tile.dataset.matchIllustration;
      root.querySelectorAll<HTMLButtonElement>("[data-match-illustration]").forEach((item) => {
        const active = item === tile && selected !== null;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      return;
    }

    const nameId = tile.dataset.matchName;
    if (!nameId || !selected) return;
    tile.classList.add("selected");
    if (selected !== nameId) {
      selected = null;
      root.querySelectorAll<HTMLButtonElement>(".match-tile").forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });
      return;
    }

    matched.add(nameId);
    const illustration = root.querySelector<HTMLButtonElement>(`[data-match-illustration="${CSS.escape(nameId)}"]`);
    [illustration, tile].forEach((item) => {
      if (!item) return;
      item.classList.remove("selected");
      item.classList.add("matched");
      item.disabled = true;
      item.setAttribute("aria-disabled", "true");
      item.setAttribute("aria-pressed", "false");
      const text = item.dataset.matchLabel;
      if (text) item.textContent = "Matched";
      else item.insertAdjacentHTML("beforeend", "<span>Matched</span>");
    });
    selected = null;
    document.dispatchEvent(new CustomEvent("symbols:stamp", { detail: { id: nameId } }));
    if (matched.size === 12) {
      const status = document.createElement("p");
      status.className = "match-complete";
      status.setAttribute("role", "status");
      status.textContent = "Passport complete — all 12 matching pairs are locked.";
      root.after(status);
    }
  });
}