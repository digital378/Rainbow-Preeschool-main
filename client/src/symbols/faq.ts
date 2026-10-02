function icon(kind: "plus" | "x") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  if (kind === "plus") {
    const vertical = document.createElementNS(svg.namespaceURI, "path");
    vertical.setAttribute("d", "M12 5v14");
    const horizontal = document.createElementNS(svg.namespaceURI, "path");
    horizontal.setAttribute("d", "M5 12h14");
    svg.append(vertical, horizontal);
  } else {
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", "M18 6 6 18M6 6l12 12");
    svg.append(path);
  }
  return svg;
}

export function initializeFaq(root: HTMLElement) {
  if (root.dataset.faqReady) return;
  root.dataset.faqReady = "true";
  root.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-faq-question]");
    if (!button || !root.contains(button)) return;
    const answer = button.parentElement?.querySelector<HTMLElement>(".faq-a");
    const wasOpen = button.getAttribute("aria-expanded") === "true";
    root.querySelectorAll<HTMLButtonElement>("[data-faq-question]").forEach((question) => {
      question.setAttribute("aria-expanded", "false");
      const panel = question.parentElement?.querySelector<HTMLElement>(".faq-a");
      if (panel) panel.hidden = true;
      question.replaceChildren(document.createTextNode(question.textContent?.trim() || ""), icon("plus"));
    });
    if (!wasOpen && answer) {
      button.setAttribute("aria-expanded", "true");
      answer.hidden = false;
      button.replaceChildren(document.createTextNode(button.textContent?.trim() || ""), icon("x"));
    }
  });
}