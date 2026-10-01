import { playSchoolNearMePhotos } from "./branch-photos";
import {
  PLAY_SCHOOL_NEAR_ME_CENTRES,
  PLAY_SCHOOL_NEAR_ME_CONTENT,
  admissionsSteps,
  allCentreFilters,
  areaOwners,
  checklist,
  faqs,
  nearMeCopy,
  nearMeUi,
  programmeContent,
  normalisePlaySchoolNearMeArea,
} from "./play-school-near-me-content";
import { ADMISSIONS_PHONE_NUMBER, branchWhatsAppGreeting } from "./centre-data";
import { homepageButtonClasses } from "./button-styles";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const link = (href: string, text: string, className = "") =>
  `<a href="${escapeHtml(href)}"${className ? ` class="${escapeHtml(className)}"` : ""}>${escapeHtml(text)}</a>`;
const infoIconPaths = {
  clock: '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
  banknote: '<rect width="20" height="12" x="2" y="6" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path>',
  bus: '<path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path><circle cx="7" cy="18" r="2"></circle><path d="M9 18h5"></path><circle cx="16" cy="18" r="2"></circle>',
} as const;
const infoIcon = (name: keyof typeof infoIconPaths) =>
  `<span class="nm-info-icon nm-info-icon-${name}" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">${infoIconPaths[name]}</svg></span>`;
const timelineIconPaths = {
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  blocks: '<rect width="7" height="7" x="14" y="3" rx="1"></rect><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>',
  music: '<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>',
  palette: '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>',
  sun: '<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>',
  "book-open": '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>',
} as const;
const timelineIcon = (name: keyof typeof timelineIconPaths) =>
  `<span class="nm-timeline-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">${timelineIconPaths[name]}</svg></span>`;
const checkIcon = () =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
const daySteps = [
  ["8:30 AM", "Welcome circle & attendance", "warm greetings and settling in", "users"],
  ["9:00 AM", "Free play & exploration", "open-ended play with toys and materials", "blocks"],
  ["9:30 AM", "Rhymes & songs", "music, movement and language", "music"],
  ["10:00 AM", "Snack time", "snacks and social time", "utensils"],
  ["10:30 AM", "Learning activity", "colours, shapes or sensory exploration", "palette"],
  ["11:00 AM", "Outdoor play", "movement and motor skills", "sun"],
  ["11:30 AM", "Story time & goodbye", "calming stories and pickup", "book-open"],
] as const;
function centreCard(centre: typeof PLAY_SCHOOL_NEAR_ME_CENTRES[number], index: number) {
  const image = playSchoolNearMePhotos.centres[centre.id as keyof typeof playSchoolNearMePhotos.centres];
  const greeting = encodeURIComponent(branchWhatsAppGreeting(centre));
  return `<article class="nm-centre-card" data-centre-slug="${escapeHtml(centre.id)}" data-centre-filter="${escapeHtml(centre.filter)}">
    <div class="nm-centre-image"><img class="nm-centre-art" data-centre-photo="${centre.id}" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" width="600" height="400" loading="${index < 2 ? "eager" : "lazy"}" fetchpriority="low" decoding="async" /></div>
    <div class="nm-card-body">
      <h3>${escapeHtml(centre.displayName)}</h3>
      <p class="nm-address">${escapeHtml(centre.address)}</p>
        <div class="nm-badges" aria-label="Programmes and classes">${programmeContent.map((programme) => `<span>${escapeHtml(programme.title)}</span>`).join("")}<b>${escapeHtml(centre.grade)}</b></div>
      <div class="nm-card-actions">
        <a class="nm-button nm-button-red" href="tel:${ADMISSIONS_PHONE_NUMBER}">Call Now</a>
        <a class="nm-button nm-button-green" href="https://wa.me/91${escapeHtml(centre.whatsappNumber)}?text=${greeting}" target="_blank" rel="noreferrer" data-track-whatsapp="${escapeHtml(centre.localityName)}">WhatsApp</a>
        <a class="nm-button nm-button-outline" href="${escapeHtml(centre.googleMapsDirectionsUrl)}" target="_blank" rel="noreferrer">Directions</a>
      </div>
      ${link(`${centre.preschoolLandingUrl}#centre`, "View centre", "nm-card-view-link")}
    </div>
  </article>`;
}

export function renderPlaySchoolNearMeHtml(): string {
  const areaOptions = areaOwners.map(({ area }, index) =>
    `<div id="nm-area-option-${normalisePlaySchoolNearMeArea(area)}" class="nm-area-option" role="option" aria-selected="false" data-area-index="${index}" data-area-value="${escapeHtml(area)}">${escapeHtml(area)}</div>`,
  ).join("");
  const areaAccordions = PLAY_SCHOOL_NEAR_ME_CENTRES.map((centre) => {
    const uniqueAreas = new Set<string>();
    const underOneKm = centre.near1.filter((area) => {
      const normalized = normalisePlaySchoolNearMeArea(area);
      if (uniqueAreas.has(normalized)) return false;
      uniqueAreas.add(normalized);
      return true;
    });
    const oneToTwoKm = centre.near2.filter((area) => {
      const normalized = normalisePlaySchoolNearMeArea(area);
      if (uniqueAreas.has(normalized)) return false;
      uniqueAreas.add(normalized);
      return true;
    });
    const servedAreaCount = uniqueAreas.size;
    const areaLinks = (areas: string[]) => areas.length
      ? `<ul class="nm-area-links">${areas.map((area) => `<li>${link(`${centre.preschoolLandingUrl}#centre`, area)}</li>`).join("")}</ul>`
      : `<p class="nm-area-empty">No areas listed in this distance range.</p>`;
    return `<details class="nm-area-accordion">
      <summary><h3 class="nm-area-accordion-heading">Rainbow Preschool ${escapeHtml(centre.localityName)} — areas served (${servedAreaCount} areas)<span aria-hidden="true">+</span></h3></summary>
      <div class="nm-area-accordion-content">
        <section aria-label="Under 1 km"><strong>Under 1 km</strong>${areaLinks(underOneKm)}</section>
        <section aria-label="1–2 km"><strong>1–2 km</strong>${areaLinks(oneToTwoKm)}</section>
      </div>
    </details>`;
  }).join("");
  const hero = playSchoolNearMePhotos.hero;
  const intro = PLAY_SCHOOL_NEAR_ME_CONTENT.intro;
  return `<main id="near-me-document" class="near-me-page">
    <div class="nm-page-content">
      <section class="nm-hero" id="nm-hero">
        <div class="nm-hero-inner">
          <div class="nm-hero-copy">
            <span class="nm-kicker">${escapeHtml(PLAY_SCHOOL_NEAR_ME_CONTENT.kicker)}</span>
            <h1>${escapeHtml(PLAY_SCHOOL_NEAR_ME_CONTENT.h1)}</h1>
            <p class="nm-intro">${escapeHtml(intro)}</p>
          </div>
          <section class="nm-finder" id="nm-finder" aria-labelledby="nm-finder-title">
            <h2 id="nm-finder-title">${nearMeUi.finderHeading}</h2>
            <p class="nm-finder-status" id="nm-finder-status" role="status" aria-live="polite"></p>
            <form class="nm-callback-form" id="nm-callback-form" method="post" action="/api/contact" accept-charset="UTF-8">
              <input type="hidden" name="programme" value="${escapeHtml(nearMeUi.formProgramme)}" />
              <input type="hidden" name="childName" value="${escapeHtml(nearMeUi.formChildName)}" />
              <input type="hidden" name="email" value="${escapeHtml(nearMeUi.formEmail)}" />
              <input type="hidden" name="message" value="${escapeHtml(nearMeUi.formMessage)}" />
              <input type="hidden" name="leadSource" value="${escapeHtml(nearMeUi.formLeadSource)}" />
              <label>${nearMeUi.parentName}<input name="parentName" autocomplete="name" required minlength="2" /></label><small class="nm-error" data-error="parentName" hidden></small>
              <label>${nearMeUi.mobile}<input name="phone" type="tel" inputmode="numeric" autocomplete="tel" pattern="[6-9][0-9]{9}" maxlength="10" minlength="10" required /></label><small class="nm-error" data-error="phone" hidden></small>
              <label>${nearMeUi.childAge}<select name="childAge" required><option value="">Choose age group</option>${nearMeUi.ageChoices.map((choice) => `<option value="${escapeHtml(choice)}">${escapeHtml(choice)}</option>`).join("")}</select></label><small class="nm-error" data-error="childAge" hidden></small>
              <label>${nearMeUi.preferredCentre}<select name="branch" required><option value="">Choose a centre</option>${PLAY_SCHOOL_NEAR_ME_CENTRES.map((centre) => `<option value="${escapeHtml(centre.localityName)}">${escapeHtml(centre.localityName)}</option>`).join("")}</select></label><small class="nm-error" data-error="branch" hidden></small>
              <p class="nm-error nm-form-error" id="nm-form-error" role="alert" hidden></p>
              <button class="nm-button nm-button-red nm-submit" type="submit">${nearMeUi.getCallback}</button>
            </form>
            <noscript><p class="nm-privacy">${escapeHtml(nearMeUi.noScriptFormHelp)}</p></noscript>
            <p class="nm-privacy">${nearMeUi.callbackIntro}</p>
            <p class="nm-privacy">${nearMeUi.privacy}</p>
          </section>
          <div class="nm-hero-media">
            <div class="nm-hero-actions">
              <a class="nm-button nm-button-red" href="#nm-trust">${nearMeUi.findCentre}</a>
              <a class="nm-button nm-button-outline" href="tel:${ADMISSIONS_PHONE_NUMBER}">${nearMeUi.callAdmissions}</a>
            </div>
            <picture class="nm-hero-image">
              <source type="image/avif" srcset="${escapeHtml(hero.avifSrcSet)}" sizes="(max-width: 767px) 100vw, 45vw" />
              <img src="${escapeHtml(hero.src)}" srcset="${escapeHtml(hero.srcSet)}" sizes="(max-width: 767px) 100vw, 45vw" width="${hero.width}" height="${hero.height}" alt="${escapeHtml(hero.alt)}" loading="lazy" fetchpriority="low" decoding="async" />
            </picture>
          </div>
        </div>
      </section>

      <section class="nm-trust" id="nm-trust" aria-label="Rainbow Preschool facts"><div class="nm-trust-grid">
        ${nearMeCopy.trust.map(([value, label]) => `<div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}
      </div></section>

      <section class="nm-section nm-centres-section" id="nm-centres">
        <div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.centres)}</span><h2>${escapeHtml(nearMeCopy.headings.centres)}</h2><p>${escapeHtml(nearMeCopy.centreInstructions)}</p></div>
        <div class="nm-filter-row" aria-label="Filter centres by area">${allCentreFilters.map((filter, index) => `<button type="button" data-filter="${escapeHtml(filter)}" aria-pressed="${index === 0}" class="nm-button nm-filter-button${index === 0 ? " is-active" : ""}">${escapeHtml(filter)}</button>`).join("")}</div>
        <div class="nm-centre-grid">${PLAY_SCHOOL_NEAR_ME_CENTRES.map(centreCard).join("")}</div>
      </section>

      <section class="nm-section nm-programmes-section" id="nm-programmes">
        <div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.programmes)}</span><h2>${escapeHtml(nearMeCopy.headings.programmes)}</h2></div>
        <div class="nm-programme-track" id="nm-programme-track">${programmeContent.map((item, index) => `<article class="nm-programme-card"><span class="nm-programme-number">0${index + 1}</span><h3>${escapeHtml(item.title)}</h3><strong>${escapeHtml(item.age)}</strong><p>${escapeHtml(item.text)}</p><p class="nm-batch">${escapeHtml(nearMeCopy.programmeBatch)}</p>${link(item.href, item.link, "nm-inline-link")}</article>`).join("")}</div>
        <div class="nm-dots" aria-label="Programme cards">${programmeContent.map((item, index) => `<button type="button" data-programme-index="${index}" aria-label="Show ${escapeHtml(item.title)}"${index === 0 ? ' aria-current="true"' : ""}></button>`).join("")}</div>
        <p class="nm-guide-links">${escapeHtml(nearMeCopy.programmeGuidance)} ${link("/pre-kg-age-guide", "Check the age guide")}. ${link("/preschool-readiness-quiz", "Take the readiness quiz")}. ${escapeHtml(nearMeCopy.programmeGuidanceEnd)} ${link("/programmes", "preschool programmes")}.</p>
      </section>

      <section class="nm-section nm-info-section"><div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.timings)}</span><h2>${escapeHtml(nearMeCopy.headings.timings)}</h2></div>
        <div class="nm-info-grid">
          <article>${infoIcon("clock")}<h3>Timings</h3><p>Morning 8:30–11:30 AM · Afternoon 12:30–3:30 PM · Monday to Friday</p></article>
          <article>${infoIcon("banknote")}<h3>Fees</h3><p>Fees vary by centre and class. Call Admissions for the 2027-28 fee details.</p><a class="nm-button nm-button-red" href="tel:${ADMISSIONS_PHONE_NUMBER}">Call Admissions</a></article>
          <article>${infoIcon("bus")}<h3>Transport</h3><p>GPS-enabled in-house transport at all 6 centres.</p></article>
        </div>
      </section>

      <section class="nm-section nm-timeline-section" id="nm-day">
        <div class="nm-section-heading"><h2>A day at our play school in Thane</h2><p>Morning batch 8:30-11:30 AM. The afternoon batch (12:30-3:30 PM) follows the same flow.</p></div>
        <ol class="nm-day-timeline">${daySteps.map(([time, title, text, icon]) => `<li><span class="nm-time-pill">${time}</span>${timelineIcon(icon)}<div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div></li>`).join("")}</ol>
      </section>

      <section class="nm-section nm-checklist-section"><div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.checklist)}</span><h2>${escapeHtml(nearMeCopy.headings.checklist)}</h2><p>Use this checklist when you visit any play school near you — including ours.</p></div>
        <ol class="nm-checklist">${checklist.map(([heading, advice, fact]) => `<li><span class="nm-check-icon">${checkIcon()}</span><div><h3>${escapeHtml(heading)}</h3><p>${escapeHtml(advice)}</p><small><b>At Rainbow:</b> ${escapeHtml(fact)}</small></div></li>`).join("")}</ol>
        <p class="nm-center-link-line">${escapeHtml(nearMeCopy.compareOptions)} ${link("/top-preschools-in-thane", "See our guide to preschools in Thane")}.</p>
      </section>

      <section class="nm-about-section">
        <img class="nm-about-art" src="${escapeHtml(playSchoolNearMePhotos.about.src)}" alt="${escapeHtml(playSchoolNearMePhotos.about.alt)}" width="${playSchoolNearMePhotos.about.width}" height="${playSchoolNearMePhotos.about.height}" loading="lazy" decoding="async" />
        <div class="nm-about-copy"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.about)}</span><h2>${escapeHtml(nearMeCopy.headings.about)}</h2>
          <ul>${nearMeCopy.aboutBullets.map((bullet) => `<li><span class="nm-feature-icon">${infoIcon("clock")}</span>${escapeHtml(bullet)}</li>`).join("")}</ul>${link("/about", "About Rainbow", "nm-inline-link")}
        </div>
      </section>

      <section class="nm-section nm-areas-section"><div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.areas)}</span><h2>${escapeHtml(nearMeCopy.headings.areas)}</h2></div>
        <div class="nm-area-picker">
          <label for="nm-area-picker-input">Select your area</label>
          <input id="nm-area-picker-input" type="text" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="nm-area-options" aria-describedby="nm-area-picker-hint" autocomplete="off" placeholder="Search all areas and societies" />
          <p class="nm-area-picker-hint" id="nm-area-picker-hint">Type to search, then choose an area from the alphabetical list.</p>
          <div class="nm-area-options" id="nm-area-options" role="listbox" aria-label="Areas served" hidden>${areaOptions}</div>
        </div>
        <div class="nm-area-selection" id="nm-area-selection" aria-live="polite"></div>
        <div class="nm-area-accordions">${areaAccordions}</div>
        <p class="nm-area-note">${escapeHtml(nearMeCopy.dontSeeArea)} <a href="tel:${ADMISSIONS_PHONE_NUMBER}">Call Admissions</a> and we’ll tell you the closest centre and transport route.</p>
      </section>

      <section class="nm-section nm-admissions-section"><div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.admissions)}</span><h2>${escapeHtml(nearMeCopy.headings.admissions)}</h2></div>
        <ol class="nm-stepper">${admissionsSteps.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step)}</strong></li>`).join("")}</ol>
        <div class="nm-calendar">${nearMeCopy.admissionsCalendar.map((event, index) => `<article><span>${escapeHtml(event)}</span><strong>${escapeHtml(nearMeCopy.admissionsMonths[index])}</strong></article>`).join("")}</div>
        <p class="nm-midyear">${escapeHtml(nearMeCopy.midyear)} ${link("/preschool-admissions", "Full admissions guide")}.</p>
        <p class="nm-contact-hours">${escapeHtml(nearMeCopy.contactHours)} ${link("/contact", "Contact the admissions team")}.</p>
      </section>

      <section class="nm-theatre-wrap" id="nm-theatre" aria-label="Rainbow Theatre">
        <div class="nm-theatre-intro"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.headings.theatre)}</span><h2>${escapeHtml(nearMeCopy.headings.theatre)}</h2><p>${escapeHtml(nearMeCopy.theatreSubline)}</p></div>
        <div class="nm-theatre-mount"></div>
      </section>

      <section class="nm-section nm-faq-section"><div class="nm-section-heading"><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.faq)}</span><h2>${escapeHtml(nearMeCopy.headings.faq)}</h2></div>
        <div class="nm-faq-list">${faqs.map(({ q, a }, index) => {
          const answer = index === 0
            ? escapeHtml(a).replace("Compare options in our guide to preschools in Thane.", `${link("/top-preschools-in-thane", "Compare options in our guide to preschools in Thane")}.`)
            : escapeHtml(a);
          return `<details class="nm-faq-item"><summary aria-expanded="false">${escapeHtml(q)}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`;
        }).join("")}</div>
      </section>

      <section class="nm-final-cta"><div><span class="nm-eyebrow">${escapeHtml(nearMeCopy.sectionEyebrows.finalCta)}</span><h2>${escapeHtml(nearMeCopy.headings.visit)}</h2><p>${escapeHtml(nearMeCopy.finalDescription)}</p></div>
        <div class="nm-final-actions"><a class="nm-button nm-button-light" href="#nm-callback-form" data-action="book-visit">Book a Visit</a><a class="nm-button nm-button-outline-light" href="tel:${ADMISSIONS_PHONE_NUMBER}">Call Admissions</a><a class="nm-button nm-button-outline-light" href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool" target="_blank" rel="noreferrer" data-track-whatsapp="general">WhatsApp</a></div>
      </section>
    </div>
    <div class="nm-sticky-bar"><a href="tel:${ADMISSIONS_PHONE_NUMBER}">Call Admissions</a><a href="https://wa.me/918291568972?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20Rainbow%20Preschool" target="_blank" rel="noreferrer" data-track-whatsapp="sticky">WhatsApp</a></div>
  </main>`
    .replace(/<span class="nm-eyebrow">[\s\S]*?<\/span>/g, "")
    .replace(/class="([^"]*\bnm-button\b[^"]*)"/g, (_, classes: string) => `class="${homepageButtonClasses(classes)}"`);
}