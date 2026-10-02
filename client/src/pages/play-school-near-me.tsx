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
  areaOwners,
  getPlaySchoolNearMeSchemas,
  getPlaySchoolNearMeProgramme,
  normalisePlaySchoolNearMeArea,
  nearMeUi,
} from "@shared/play-school-near-me-content";
import { renderPlaySchoolNearMeHtml } from "@shared/play-school-near-me-render";
import { ADMISSIONS_PHONE_NUMBER, branchWhatsAppGreeting } from "@shared/centre-data";
import { homepageButtonClasses } from "@shared/button-styles";
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
    const areaPicker = documentMain.querySelector<HTMLInputElement>("#nm-area-picker-input");
    const areaOptions = documentMain.querySelector<HTMLElement>("#nm-area-options");
    const areaSelection = documentMain.querySelector<HTMLElement>("#nm-area-selection");
    const filterButtons = Array.from(documentMain.querySelectorAll<HTMLButtonElement>(".nm-filter-row button"));
    const centreCards = Array.from(documentMain.querySelectorAll<HTMLElement>(".nm-centre-card"));
    const form = documentMain.querySelector<HTMLFormElement>("#nm-callback-form");
    const formError = documentMain.querySelector<HTMLElement>("#nm-form-error");
    const submitButton = documentMain.querySelector<HTMLButtonElement>(".nm-submit");
    const programmeTrack = documentMain.querySelector<HTMLElement>("#nm-programme-track");
    let submitting = false;
    let cancelled = false;
    let theatreRoot: Root | undefined;
    let theatreObserver: IntersectionObserver | undefined;
    let faqObserver: IntersectionObserver | undefined;
    let finderActivated = false;
    let areaPickerActivated = false;
    let filtersActivated = false;
    let faqListenersAttached = false;
    let faqDetails: HTMLDetailsElement[] = [];

    if (!status || !areaPicker || !areaOptions || !areaSelection || !form || !formError || !submitButton) {
      throw new Error("Play School Near Me document is missing required interactive controls.");
    }

    const setStatus = (message: string) => { status.textContent = message; };
    const areaOptionNodes = Array.from(areaOptions.querySelectorAll<HTMLElement>('[role="option"]'));
    let activeAreaOption = -1;
    const setActiveAreaOption = (index: number) => {
      activeAreaOption = index;
      areaOptionNodes.forEach((option, optionIndex) => {
        option.setAttribute("aria-selected", String(optionIndex === activeAreaOption));
      });
      const activeOption = areaOptionNodes[activeAreaOption];
      if (activeOption && !activeOption.hidden) areaPicker.setAttribute("aria-activedescendant", activeOption.id);
      else areaPicker.removeAttribute("aria-activedescendant");
    };
    const openAreaOptions = () => {
      const query = normalisePlaySchoolNearMeArea(areaPicker.value);
      let visibleCount = 0;
      areaOptionNodes.forEach((option) => {
        const matches = !query || normalisePlaySchoolNearMeArea(option.dataset.areaValue ?? "").includes(query);
        option.hidden = !matches;
        if (matches) visibleCount++;
      });
      areaOptions.hidden = visibleCount === 0;
      areaPicker.setAttribute("aria-expanded", String(visibleCount > 0));
      setActiveAreaOption(-1);
    };
    const closeAreaOptions = () => {
      areaOptions.hidden = true;
      areaPicker.setAttribute("aria-expanded", "false");
      setActiveAreaOption(-1);
    };
    const selectArea = (index: number) => {
      const owner = areaOwners[index];
      if (!owner) return;
      areaPicker.value = owner.area;
      closeAreaOptions();
      areaSelection.replaceChildren();
      const card = document.createElement("article");
      card.className = "nm-area-result-card";
      const title = document.createElement("h3");
      title.textContent = owner.centre.displayName;
      const distance = document.createElement("p");
      distance.className = "nm-area-result-distance";
      distance.textContent = owner.distance;
      const actions = document.createElement("div");
      actions.className = "nm-card-actions";
      const call = document.createElement("a");
      call.className = homepageButtonClasses("nm-button nm-button-red");
      call.href = "tel:+918291568972";
      call.textContent = "Call Now";
      const whatsapp = document.createElement("a");
      whatsapp.className = homepageButtonClasses("nm-button nm-button-green");
      whatsapp.href = `https://wa.me/91${encodeURIComponent(owner.centre.whatsappNumber)}?text=${encodeURIComponent(branchWhatsAppGreeting(owner.centre))}`;
      whatsapp.target = "_blank";
      whatsapp.rel = "noreferrer";
      whatsapp.textContent = nearMeUi.whatsApp;
      whatsapp.dataset.trackWhatsapp = owner.centre.localityName;
      const view = document.createElement("a");
      view.className = homepageButtonClasses("nm-button nm-button-outline");
      view.href = `${owner.centre.preschoolLandingUrl}#centre`;
      view.textContent = nearMeUi.viewCentre;
      actions.append(call, whatsapp, view);
      card.append(title, distance, actions);
      areaSelection.append(card);
    };
    const onAreaPickerInput = () => {
      areaSelection.replaceChildren();
      openAreaOptions();
    };
    const onAreaPickerKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (areaOptions.hidden) openAreaOptions();
        const options = areaOptionNodes.filter((option) => !option.hidden);
        if (!options.length) return;
        const current = options.findIndex((option) => Number(option.dataset.areaIndex) === activeAreaOption);
        const next = event.key === "ArrowDown"
          ? (current + 1 + options.length) % options.length
          : (current <= 0 ? options.length - 1 : current - 1);
        setActiveAreaOption(Number(options[next].dataset.areaIndex));
        return;
      }
      if (event.key === "Enter") {
        const active = areaOptionNodes.find((option) => Number(option.dataset.areaIndex) === activeAreaOption && !option.hidden);
        const exact = areaOwners.findIndex((owner) => normalisePlaySchoolNearMeArea(owner.area) === normalisePlaySchoolNearMeArea(areaPicker.value));
        const selectedIndex = active ? Number(active.dataset.areaIndex) : exact;
        if (selectedIndex >= 0) {
          event.preventDefault();
          selectArea(selectedIndex);
        }
      } else if (event.key === "Escape") {
        closeAreaOptions();
      }
    };
    const onAreaPickerClick = (event: Event) => {
      const option = (event.target as Element).closest<HTMLElement>('[role="option"]');
      if (option?.dataset.areaIndex) selectArea(Number(option.dataset.areaIndex));
    };
    const onAreaPickerOutsideClick = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".nm-area-picker")) closeAreaOptions();
    };
    const activateAreaPicker = () => {
      if (areaPickerActivated) return;
      areaPickerActivated = true;
      areaPicker.addEventListener("input", onAreaPickerInput);
      areaPicker.addEventListener("keydown", onAreaPickerKeyDown);
      areaPicker.addEventListener("focus", openAreaOptions);
      areaOptions.addEventListener("click", onAreaPickerClick);
      document.addEventListener("click", onAreaPickerOutsideClick, true);
    };
    const updateFilter = (filter: string) => {
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
      });
      centreCards.forEach((card) => {
        card.hidden = filter !== "All" && !card.dataset.centreFilter?.split("|").includes(filter);
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
      if (target.closest(".nm-area-picker")) activateAreaPicker();
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
      if (!parentName || parentName.length < 2) revealFormFieldError("parentName", nearMeUi.invalidName);
      if (!/^[6-9][0-9]{9}$/.test(phone)) revealFormFieldError("phone", nearMeUi.invalidPhone);
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
      } catch (caughtError) {
        if (!cancelled) {
          // apiRequest includes the server's JSON body in its error message.
          // Preserve inline field feedback when the server rejects a stale or
          // non-JavaScript form submission, without changing the endpoint.
          const error = caughtError;
          let fieldErrors: Record<string, string> = {};
          if (error instanceof Error) {
            const jsonStart = error.message.indexOf("{");
            if (jsonStart >= 0) {
              try {
                fieldErrors = JSON.parse(error.message.slice(jsonStart)).fieldErrors ?? {};
              } catch {
                fieldErrors = {};
              }
            }
          }
          if (fieldErrors.parentName) revealFormFieldError("parentName", fieldErrors.parentName);
          if (fieldErrors.phone) revealFormFieldError("phone", fieldErrors.phone);
          if (!fieldErrors.parentName && !fieldErrors.phone) {
            formError.textContent = nearMeUi.requestFailed;
            formError.hidden = false;
          }
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
        form.removeEventListener("submit", onSubmit);
      }
      if (areaPickerActivated) {
        areaPicker.removeEventListener("input", onAreaPickerInput);
        areaPicker.removeEventListener("keydown", onAreaPickerKeyDown);
        areaPicker.removeEventListener("focus", openAreaOptions);
        areaOptions.removeEventListener("click", onAreaPickerClick);
        document.removeEventListener("click", onAreaPickerOutsideClick, true);
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