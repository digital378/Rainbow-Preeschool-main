import { useEffect, useMemo } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { SEO } from "@/components/seo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { trackFormSubmit, trackWhatsAppClick } from "@/lib/analytics";
import {
  PLAY_SCHOOL_NEAR_ME_CENTRES,
  PLAY_SCHOOL_NEAR_ME_CONTENT,
  PLAY_SCHOOL_NEAR_ME_OG,
  NEAR_ME_BUILD_DATE,
  getPlaySchoolNearMeSchemas,
  getPlaySchoolNearMeProgramme,
  findPlaySchoolNearMeAreaMatches,
  nearMeUi,
} from "@shared/play-school-near-me-content";
import { renderPlaySchoolNearMeHtml } from "@shared/play-school-near-me-render";
import "@/styles/play-school-near-me.css";

const NEAR_ME_CANONICAL = "https://www.rainbowpreschools.com/play-school-near-me";

function isPlaySchoolNearMeSchema(script: HTMLScriptElement) {
  try {
    const parsed = JSON.parse(script.textContent || "null");
    const entries = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
    return entries.some((schema) => {
      if (!schema || typeof schema !== "object") return false;
      if (schema["@type"] === "WebPage") return schema.url === NEAR_ME_CANONICAL;
      if (schema["@type"] === "BreadcrumbList") {
        return schema.itemListElement?.some((item: { item?: string | { "@id"?: string; url?: string } }) => {
          const url = typeof item.item === "string" ? item.item : item.item?.["@id"] ?? item.item?.url;
          return url === NEAR_ME_CANONICAL;
        });
      }
      return schema["@type"] === "ItemList" && schema.name === "Rainbow Preschool International centres in Thane";
    });
  } catch {
    return false;
  }
}

function mountStaticDocument() {
  let documentMain = document.getElementById("near-me-document");
  let created = false;
  if (!documentMain) {
    document.getElementById("root")?.insertAdjacentHTML("afterend", renderPlaySchoolNearMeHtml());
    documentMain = document.getElementById("near-me-document");
    created = true;
  }
  if (!documentMain) throw new Error("Unable to mount Play School Near Me document.");
  documentMain.hidden = false;
  let footer = document.getElementById("near-me-footer");
  if (!footer) {
    footer = document.createElement("div");
    footer.id = "near-me-footer";
    documentMain.after(footer);
  }
  return { documentMain, created };
}

function PlaySchoolNearMe() {
  const existingPageSchemas = useMemo(
    () => typeof document === "undefined"
      ? []
      : Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')).filter(isPlaySchoolNearMeSchema),
    [],
  );
  const structuredData = useMemo(
    () => existingPageSchemas.length ? undefined : getPlaySchoolNearMeSchemas(NEAR_ME_BUILD_DATE),
    [existingPageSchemas],
  );

  useEffect(() => {
    const { documentMain, created } = mountStaticDocument();
    const status = documentMain.querySelector<HTMLElement>("#nm-finder-status");
    const results = documentMain.querySelector<HTMLElement>("#nm-mini-results");
    const areaInput = documentMain.querySelector<HTMLInputElement>("#nm-area-input");
    const filterButtons = Array.from(documentMain.querySelectorAll<HTMLButtonElement>(".nm-filter-row button"));
    const centreCards = Array.from(documentMain.querySelectorAll<HTMLElement>(".nm-centre-card"));
    const form = documentMain.querySelector<HTMLFormElement>("#nm-callback-form");
    const formError = documentMain.querySelector<HTMLElement>("#nm-form-error");
    const locateButton = documentMain.querySelector<HTMLButtonElement>('[data-action="locate"]');
    const submitButton = documentMain.querySelector<HTMLButtonElement>(".nm-submit");
    const programmeTrack = documentMain.querySelector<HTMLElement>("#nm-programme-track");
    let submitting = false;
    let cancelled = false;
    let theatreRoot: Root | undefined;
    let theatreObserver: IntersectionObserver | undefined;
    let faqObserver: IntersectionObserver | undefined;
    let finderActivated = false;
    let filtersActivated = false;
    let faqListenersAttached = false;
    let faqDetails: HTMLDetailsElement[] = [];

    if (!status || !results || !areaInput || !form || !formError || !locateButton || !submitButton) {
      throw new Error("Play School Near Me document is missing required interactive controls.");
    }

    const setStatus = (message: string) => { status.textContent = message; };
    const renderResults = (items: { centre: typeof PLAY_SCHOOL_NEAR_ME_CENTRES[number]; distance?: number }[]) => {
      results.replaceChildren();
      for (const { centre, distance } of items) {
        const card = document.createElement("article");
        card.className = "nm-mini-card";
        const title = document.createElement("h3");
        title.textContent = centre.localityName;
        card.append(title);
        if (typeof distance === "number") {
          const distanceText = document.createElement("p");
          distanceText.className = "nm-distance";
          distanceText.textContent = `${nearMeUi.nearbyDistance} ${distance.toFixed(1)} km`;
          card.append(distanceText);
        }
        const actions = document.createElement("div");
        actions.className = "nm-card-actions";
        const view = document.createElement("a");
        view.className = "nm-button nm-button-outline";
        view.href = `${centre.preschoolLandingUrl}#centre`;
        view.textContent = nearMeUi.viewCentre;
        const whatsapp = document.createElement("a");
        whatsapp.className = "nm-button nm-button-green";
        whatsapp.href = `https://wa.me/91${encodeURIComponent(centre.whatsappNumber)}?text=${encodeURIComponent(`Hi, I'd like to know about admissions at Rainbow Preschool International, ${centre.localityName}.`)}`;
        whatsapp.target = "_blank";
        whatsapp.rel = "noreferrer";
        whatsapp.textContent = nearMeUi.whatsApp;
        whatsapp.dataset.trackWhatsapp = centre.localityName;
        actions.append(view, whatsapp);
        card.append(actions);
        results.append(card);
      }
    };
    const lookupArea = () => {
      const query = areaInput.value;
      results.replaceChildren();
      if (!query.trim()) {
        setStatus("");
        return;
      }
      const matches = findPlaySchoolNearMeAreaMatches(query);
      renderResults(matches.map(({ centre }) => ({ centre })));
      setStatus(matches.length
        ? matches.length === 1 ? nearMeUi.areaMatchOne : nearMeUi.areaMatchMany.replace("{count}", String(matches.length))
        : nearMeUi.noAreaMatch);
    };
    const radians = (degrees: number) => degrees * Math.PI / 180;
    const locate = () => {
      results.replaceChildren();
      if (!navigator.geolocation) {
        setStatus(nearMeUi.locationUnavailable);
        return;
      }
      setStatus(nearMeUi.findingLocation);
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        if (cancelled) return;
        const nearest = PLAY_SCHOOL_NEAR_ME_CENTRES.map((centre) => {
          const dLat = radians(centre.lat - coords.latitude);
          const dLng = radians(centre.lng - coords.longitude);
          const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(coords.latitude)) * Math.cos(radians(centre.lat)) * Math.sin(dLng / 2) ** 2;
          return { centre, distance: 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) };
        }).sort((a, b) => a.distance - b.distance).slice(0, 2);
        renderResults(nearest);
        setStatus(nearMeUi.locationResults);
      }, (error) => {
        if (cancelled) return;
        setStatus(error.code === error.PERMISSION_DENIED
          ? nearMeUi.locationDenied
          : nearMeUi.locationFailed);
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 });
    };
    const updateFilter = (filter: string) => {
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
      });
      centreCards.forEach((card) => {
        card.hidden = filter !== "All" && card.dataset.centreFilter !== filter;
      });
    };
    const revealFormFieldError = (field: string, message: string) => {
      const messageNode = form.querySelector<HTMLElement>(`[data-error="${field}"]`);
      const input = form.elements.namedItem(field);
      if (messageNode) {
        messageNode.textContent = message;
        messageNode.hidden = !message;
      }
      if (input instanceof HTMLElement) {
        if (message) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
      }
    };
    const clearFormErrors = () => {
      ["parentName", "phone", "childAge", "branch"].forEach((name) => revealFormFieldError(name, ""));
      formError.hidden = true;
      formError.textContent = "";
    };
    const onAreaInput = () => lookupArea();
    const onLocate = () => locate();
    const onFilter = (event: Event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-filter]");
      if (button?.dataset.filter) updateFilter(button.dataset.filter);
    };
    const onFaqToggle = (event: Event) => {
      const details = event.currentTarget as HTMLDetailsElement;
      details.querySelector("summary")?.setAttribute("aria-expanded", String(details.open));
    };
    const activateFinder = () => {
      if (finderActivated) return;
      finderActivated = true;
      form.noValidate = true;
      areaInput.addEventListener("input", onAreaInput);
      locateButton.addEventListener("click", onLocate);
      form.addEventListener("submit", onSubmit);
    };
    const filterRow = documentMain.querySelector<HTMLElement>(".nm-filter-row");
    const activateFilters = () => {
      if (filtersActivated || !filterRow) return;
      filtersActivated = true;
      filterRow.addEventListener("click", onFilter);
    };
    const activateFaqListeners = () => {
      if (faqListenersAttached) return;
      faqListenersAttached = true;
      faqDetails = Array.from(documentMain.querySelectorAll<HTMLDetailsElement>(".nm-faq-item"));
      faqDetails.forEach((details) => details.addEventListener("toggle", onFaqToggle));
    };
    const activateOnFirstInteraction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("#nm-finder")) activateFinder();
      if (target.closest(".nm-filter-row")) activateFilters();
      if (target.closest(".nm-faq-list")) activateFaqListeners();
    };
    const onWhatsApp = (event: Event) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("[data-track-whatsapp]");
      if (!link) return;
      const centre = link.dataset.trackWhatsapp;
      trackWhatsAppClick(centre && centre !== "general" && centre !== "sticky"
        ? { centre, locality: centre, source_page: "play-school-near-me" }
        : { source_page: `play-school-near-me-${centre ?? "cta"}` });
    };
    const onProgrammeScroll = () => {
      if (!programmeTrack) return;
      const first = programmeTrack.querySelector<HTMLElement>(".nm-programme-card");
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(programmeTrack).columnGap || "0");
      const index = Math.min(3, Math.round(programmeTrack.scrollLeft / step));
      documentMain.querySelectorAll<HTMLButtonElement>(".nm-dots button").forEach((dot) => {
        if (Number(dot.dataset.programmeIndex) === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    };
    const onProgrammeDots = (event: Event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("[data-programme-index]");
      if (!button || !programmeTrack) return;
      const cards = programmeTrack.querySelectorAll<HTMLElement>(".nm-programme-card");
      const card = cards[Number(button.dataset.programmeIndex)];
      if (card) programmeTrack.scrollTo({ left: card.offsetLeft - programmeTrack.offsetLeft, behavior: "smooth" });
      onProgrammeScroll();
    };
    const onSubmit = async (event: SubmitEvent) => {
      event.preventDefault();
      if (submitting) return;
      clearFormErrors();
      const values = new FormData(form);
      const parentName = String(values.get("parentName") ?? "").trim();
      const phone = String(values.get("phone") ?? "").trim();
      const childAge = String(values.get("childAge") ?? "");
      const programme = getPlaySchoolNearMeProgramme(childAge);
      const branch = String(values.get("branch") ?? "");
      if (parentName.length < 2) revealFormFieldError("parentName", nearMeUi.invalidName);
      if (!/^[+\d()\s-]{10,}$/.test(phone)) revealFormFieldError("phone", nearMeUi.invalidPhone);
      if (!childAge) revealFormFieldError("childAge", nearMeUi.invalidAge);
      if (!branch) revealFormFieldError("branch", nearMeUi.invalidCentre);
      if (form.querySelector('[aria-invalid="true"]')) return;
      submitting = true;
      submitButton.disabled = true;
      submitButton.textContent = nearMeUi.sending;
      try {
        const response = await apiRequest("POST", "/api/contact", {
          parentName,
          phone,
          childAge,
          branch,
          programme,
          childName: nearMeUi.formChildName,
          email: nearMeUi.formEmail,
          message: nearMeUi.formMessage,
          leadSource: nearMeUi.formLeadSource,
        });
        const data = await response.json();
        if (!cancelled) setStatus(nearMeUi.callbackSent);
        if (data?.emailSent) trackFormSubmit({ formType: "instant", programme, centre: branch, parentName, phone, childAge });
        form.reset();
      } catch {
        if (!cancelled) {
          formError.textContent = nearMeUi.requestFailed;
          formError.hidden = false;
        }
      } finally {
        submitting = false;
        if (!cancelled) {
          submitButton.disabled = false;
          submitButton.textContent = nearMeUi.getCallback;
        }
      }
    };

    document.addEventListener("pointerdown", activateOnFirstInteraction, true);
    document.addEventListener("focusin", activateOnFirstInteraction, true);
    document.addEventListener("click", activateOnFirstInteraction, true);
    documentMain.addEventListener("click", onWhatsApp);
    documentMain.querySelector(".nm-dots")?.addEventListener("click", onProgrammeDots);
    programmeTrack?.addEventListener("scroll", onProgrammeScroll, { passive: true });

    const hero = documentMain.querySelector<HTMLElement>(".nm-hero");
    const setSticky = (show: boolean) => {
      documentMain.classList.toggle("nm-sticky-active", show);
      document.body.classList.toggle("nm-sticky-on", show);
    };
    let heroPast = false;
    let footerVisible = false;
    const updateSticky = () => setSticky(heroPast && !footerVisible);
    const heroObserver = hero && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { heroPast = !entry.isIntersecting; updateSticky(); }, { threshold: 0 })
      : undefined;
    if (hero && heroObserver) heroObserver.observe(hero);
    const footer = document.getElementById("near-me-footer") ?? document.querySelector("footer");
    const footerObserver = footer && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { footerVisible = entry.isIntersecting; updateSticky(); }, { threshold: 0 })
      : undefined;
    if (footer && footerObserver) footerObserver.observe(footer);

    const faqSection = documentMain.querySelector<HTMLElement>(".nm-faq-section");
    if (faqSection && "IntersectionObserver" in window) {
      faqObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          activateFaqListeners();
          faqObserver?.disconnect();
        }
      }, { rootMargin: "350px" });
      faqObserver.observe(faqSection);
    }

    const theatreSection = documentMain.querySelector<HTMLElement>("#nm-theatre");
    const mountTheatre = async () => {
      if (!theatreSection || theatreRoot || cancelled) return;
      const mount = theatreSection.querySelector<HTMLElement>(".nm-theatre-mount");
      if (!mount) return;
      const { HomeRainbowTheatre } = await import("@/components/home/home-rainbow-theatre");
      if (cancelled) return;
      theatreRoot = createRoot(mount);
      theatreRoot.render(
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary name="near-me-theatre" silent>
            <HomeRainbowTheatre heading="The Rainbow Theatre" subline="Classroom moments, celebrations and discoveries from our centres." branchCopy introAlreadyRendered />
          </ErrorBoundary>
        </QueryClientProvider>,
      );
    };
    if (theatreSection && "IntersectionObserver" in window) {
      theatreObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          theatreObserver?.disconnect();
          void mountTheatre();
        }
      }, { rootMargin: "350px" });
      theatreObserver.observe(theatreSection);
    } else if (theatreSection) {
      void mountTheatre();
    }

    return () => {
      cancelled = true;
      document.removeEventListener("pointerdown", activateOnFirstInteraction, true);
      document.removeEventListener("focusin", activateOnFirstInteraction, true);
      document.removeEventListener("click", activateOnFirstInteraction, true);
      if (finderActivated) {
        areaInput.removeEventListener("input", onAreaInput);
        locateButton.removeEventListener("click", onLocate);
        form.removeEventListener("submit", onSubmit);
      }
      if (filtersActivated) filterRow?.removeEventListener("click", onFilter);
      documentMain.removeEventListener("click", onWhatsApp);
      documentMain.querySelector(".nm-dots")?.removeEventListener("click", onProgrammeDots);
      programmeTrack?.removeEventListener("scroll", onProgrammeScroll);
      heroObserver?.disconnect();
      footerObserver?.disconnect();
      faqObserver?.disconnect();
      theatreObserver?.disconnect();
      theatreRoot?.unmount();
      faqDetails.forEach((details) => details.removeEventListener("toggle", onFaqToggle));
      document.body.classList.remove("nm-sticky-on");
      documentMain.classList.remove("nm-sticky-active");
      existingPageSchemas.forEach((script) => script.remove());
      // Keep the SSR-owned main node stationary for back/forward navigation.
      documentMain.hidden = true;
      if (created) {
        document.getElementById("near-me-footer")?.remove();
      }
    };
  }, [existingPageSchemas]);

  return (
    <SEO
      title={PLAY_SCHOOL_NEAR_ME_CONTENT.title}
      description={PLAY_SCHOOL_NEAR_ME_CONTENT.description}
      canonical={NEAR_ME_CANONICAL}
      ogImage={PLAY_SCHOOL_NEAR_ME_OG.url}
      ogImageAlt={PLAY_SCHOOL_NEAR_ME_OG.alt}
      ogImageType={PLAY_SCHOOL_NEAR_ME_OG.type}
      ogImageWidth={PLAY_SCHOOL_NEAR_ME_OG.width}
      ogImageHeight={PLAY_SCHOOL_NEAR_ME_OG.height}
      structuredData={structuredData}
    />
  );
}

export default PlaySchoolNearMe;