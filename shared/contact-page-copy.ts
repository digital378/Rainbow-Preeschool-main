import { branches } from "./schema";

/**
 * Visitor-facing /contact copy, kept as plain shared data for browser and SSR
 * renderers. Branch names, addresses and contact numbers come from the
 * canonical centre records in shared/schema.
 */
export const CONTACT_PAGE_COPY = {
  title: "Contact Rainbow Preschool Thane | Phone & Centres",
  description: "Call 82915 68972 or visit one of our 6 Rainbow Preschool International centres in Thane: addresses, phone and WhatsApp numbers, and enquiry form.",
  ogImage: "https://www.rainbowpreschools.com/images/og/contact-share-1200x630.jpg",
  ogImageAlt: "Rainbow Preschool centre in Thane",
  publishDate: "2026-09-29",
  publishDateDisplay: "September 29, 2026",
  h1: "Contact Rainbow Preschool in Thane",
  intro: "Questions about admissions or want to visit a centre? Call us on 82915 68972, WhatsApp your nearest centre, or send the form below. Our admissions team replies within 24 hours.",
  introSegments: [
    { text: "Questions about admissions or want to visit a centre? Call us on " },
    { text: "82915 68972", href: "tel:+918291568972" },
    { text: ", WhatsApp your nearest centre, or send the form below. Our admissions team replies within 24 hours." },
  ],
  callbackHeading: "Request A Callback",
  callbackDescription: "Share a few details and our admissions team will call you within 24 hours.",
  phoneLabel: "Phone",
  generalPhone: "82915 68972",
  phoneSecondary: "Admissions enquiries",
  emailLabel: "Email",
  email: "admin@rainbowpreschools.com",
  workingHoursLabel: "Working Hours",
  workingDays: "Monday – Saturday",
  workingHours: "9 AM – 6 PM",
  locationsLabel: "Locations",
  locationCount: "6 centres across Thane",
  nearestCentrePrompt: "Head office: 2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Circle Marg, Manpada, Thane (W) 400610",
  quote: "Prefer to visit? Every centre welcomes parents for a free visit. Call ahead to book a time.",
  centresHeading: "Our 6 Preschool Centres in Thane",
  centresDescription: "Find your nearest Rainbow Preschool centre. Call, WhatsApp or get directions.",
  exploreHeading: "Explore Rainbow Preschool",
  links: [
    { href: "/programmes", label: "Our Programmes" },
    { href: "/play-school-near-me", label: "Find Nearest Centre" },
    { href: "/preschool-admissions", label: "Admission Process" },
    { href: "/gallery", label: "Photo Gallery" },
  ],
  branchCard: {
    view: "View",
    localCentre: "Centre",
    whatsapp: "WhatsApp",
    directions: "Directions",
    accessibleActions: true,
  },
  centreDetails: {
    aggarwal: {
      classes: "Playgroup to Grade 4",
      daycare: "Happy Times daycare available",
      image: { src: "/images/gallery/rainbow-preschool-manpada-centre-thane.webp", alt: "Rainbow Preschool Manpada centre in Thane — Aggarwal Centre" },
    },
    hariniwas: {
      classes: "Playgroup to Grade 3",
      image: { src: "/images/gallery/rainbow-preschool-hariniwas-centre-thane.webp", alt: "Rainbow Preschool Hariniwas centre in Thane" },
    },
    "anand-nagar": {
      classes: "Playgroup to Grade 2",
      daycare: "Happy Times daycare available",
      image: { src: "/images/gallery/rainbow-preschool-anand-nagar-centre-thane.webp", alt: "Rainbow Preschool Anand Nagar centre in Thane" },
    },
    dhokali: {
      classes: "Playgroup to Sr. KG",
      daycare: "Happy Times daycare available",
      image: { src: "/images/gallery/rainbow-preschool-dhokali-centre-thane.webp", alt: "Rainbow Preschool Dhokali centre in Thane" },
    },
    kalwa: {
      classes: "Playgroup to Grade 4",
      image: { src: "/images/gallery/rainbow-preschool-kalwa-centre-thane.webp", alt: "Rainbow Preschool Kalwa centre in Thane" },
    },
    kasarvadavali: {
      classes: "Playgroup to Grade 3",
      image: { src: "/images/gallery/rainbow-preschool-kasarvadavali-centre-thane.webp", alt: "Rainbow Preschool Kasarvadavali centre in Thane" },
    },
  },
  branches,
  localPages: {
    aggarwal: { url: "/preschool-in-manpada-thane", locality: "Manpada" },
    hariniwas: { url: "/preschool-in-hariniwas-thane", locality: "Hariniwas" },
    "anand-nagar": { url: "/preschool-in-anand-nagar-thane", locality: "Anand Nagar" },
    dhokali: { url: "/preschool-in-dhokali-thane", locality: "Dhokali" },
    kalwa: { url: "/preschool-in-kalwa-thane", locality: "Kalwa" },
    kasarvadavali: { url: "/preschool-in-kasarvadavali-thane", locality: "Kasarvadavali" },
  },
  form: {
    parentName: "Parent Name *",
    parentNamePlaceholder: "Enter your name",
    phone: "Phone Number *",
    phonePlaceholder: "Enter phone number",
    emailLabel: "Email",
    emailPlaceholder: "Enter email address",
    childName: "Child's Name *",
    childNamePlaceholder: "Enter child's name",
    childAge: "Child's Age *",
    agePlaceholder: "Select age",
    ages: ["Below 1.5 years", "1.5 - 2 years", "2 - 2.5 years", "2.5 - 3 years", "3 - 3.5 years", "3.5 - 4 years", "4 - 5 years", "5 - 6 years", "Above 6 years"],
    programme: "Programme *",
    programmePlaceholder: "Select programme",
    preferredCentre: "Preferred Centre *",
    centrePlaceholder: "Select centre",
    message: "Message (Optional)",
    messagePlaceholder: "Any questions or specific requirements?",
    submit: "Request Callback",
    submitting: "Submitting...",
    thankYou: "Thank You!",
    received: "We've received your request and will contact you within 24 hours.",
    submitAnother: "Submit Another Request",
    submittedToast: "Request Submitted!",
    submittedDescription: "We'll get back to you within 24 hours.",
    errorToast: "Something went wrong",
    errorDescription: "Please try again or call us directly.",
  },
} as const;

const BASE_URL = "https://www.rainbowpreschools.com";

export const CONTACT_PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${BASE_URL}/contact#webpage`,
  url: `${BASE_URL}/contact`,
  name: CONTACT_PAGE_COPY.h1,
  description: CONTACT_PAGE_COPY.description,
  dateModified: CONTACT_PAGE_COPY.publishDate,
  about: { "@id": `${BASE_URL}/#organization` },
  mainEntity: { "@id": `${BASE_URL}/#organization` },
} as const;

export const CONTACT_BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${BASE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE_URL}/contact` },
  ],
} as const;