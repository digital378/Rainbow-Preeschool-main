/**
 * Canonical HowTo schema data for the /preschool-admissions page.
 *
 * Used by:
 *  - server/ssr-pages.ts  → HowTo JSON-LD injected into raw HTML (Google sees it without JS)
 *  - client/src/pages/preschool-admissions.tsx → client-side structured data via <SEO>
 *
 * Edit step data here; both SSR schema and client page update automatically.
 */

import { PREFERRED_DOMAIN } from "@shared/seo-config";

export const admissionHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Apply for Preschool Admission at Rainbow Preschool Thane",
  description: "Complete your child's preschool admission at Rainbow Preschool International in 6 simple steps — from first enquiry to your child's first day.",
  image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/og-image.jpg`, width: "1200", height: "630" },
  totalTime: "P5D",
  step: [
    {
      "@type": "HowToStep",
      position: "1",
      name: "Submit an Enquiry",
      text: "Fill the online enquiry form on this page, call 82915 68972, or walk into any of the 6 Rainbow Preschool centres in Thane, Monday to Saturday, 9 AM to 6 PM.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-admin-office.webp` },
    },
    {
      "@type": "HowToStep",
      position: "2",
      name: "Schedule a Free Campus Visit",
      text: "Our admissions team will arrange a guided tour of your preferred centre, covering classrooms, play areas, and safety installations so you can experience the Rainbow environment firsthand.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-entrance-area.webp` },
    },
    {
      "@type": "HowToStep",
      position: "3",
      name: "Speak with the Admissions Team",
      text: "Discuss your child's age, preferred programme (Playgroup, Nursery, or KG), batch timing preferences, transport requirements, and any questions about the curriculum or fees.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/gallery/rainbow-preschool-100-percent-female-staff.webp` },
    },
    {
      "@type": "HowToStep",
      position: "4",
      name: "Complete the Registration Form",
      text: "Fill the formal admission registration form at the centre and submit it to reserve your child's seat. Forms are available at all 6 Rainbow Preschool centres across Thane West.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-lobby.webp` },
    },
    {
      "@type": "HowToStep",
      position: "5",
      name: "Submit Required Documents",
      text: "Provide the necessary documents — child's birth certificate, parent ID proof, photographs, address proof, and vaccination card — to complete your child's admission file.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-building.webp` },
    },
    {
      "@type": "HowToStep",
      position: "6",
      name: "Confirm Admission and Attend Orientation",
      text: "Pay the admission fee to confirm the seat. Attend our parent orientation session before your child's first day to meet teachers and understand the daily routine.",
      url: `${PREFERRED_DOMAIN}/preschool-admissions`,
      image: { "@type": "ImageObject", url: `${PREFERRED_DOMAIN}/images/campus/campus-classroom-1.webp` },
    },
  ],
};
