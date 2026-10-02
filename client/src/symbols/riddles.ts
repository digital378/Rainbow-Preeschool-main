export function initializeRiddles(root: HTMLElement) {
  if (root.dataset.riddlesReady) return;
  root.dataset.riddlesReady = "true";
  root.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-riddle-id]");
    if (!button || !root.contains(button)) return;
    const answer = button.querySelector<HTMLElement>(".answer");
    if (!answer) return;
    answer.hidden = false;
    button.setAttribute("aria-expanded", "true");
    document.dispatchEvent(new CustomEvent("symbols:stamp", { detail: { id: button.dataset.stampId } }));
  });
}