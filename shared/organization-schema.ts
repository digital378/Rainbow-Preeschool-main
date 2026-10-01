const ORGANIZATION_URL = "https://www.rainbowpreschools.com";
const ORGANIZATION_ID = `${ORGANIZATION_URL}/#organization`;

export const SHARED_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  name: "Rainbow Preschool International",
  url: ORGANIZATION_URL,
  logo: {
    "@type": "ImageObject",
    url: `${ORGANIZATION_URL}/images/logo.webp`,
    width: 512,
    height: 512,
  },
  description:
    "Rainbow Preschool International has 6 centres across Thane and follows a play-based curriculum aligned with NEP 2020. Founded in 2007.",
  foundingDate: "2007",
  telephone: "+91-8291568972",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Chestnut Plaza, Opp. Edenwoods, Khewra Cir Marg",
    addressLocality: "Thane",
    addressRegion: "Maharashtra",
    postalCode: "400610",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "City",
    name: "Thane",
  },
  knowsAbout: ["Play-based curriculum aligned with NEP 2020"],
  award: [
    "Best Preschool in Thane (2018, 2023)",
    "Cleanest Preschool (2020)",
    "Most Promising Preschool Chain of the Year (2021)",
    "Emerging Preschool Chain of the Year (2022)",
  ],
  sameAs: [
    "https://www.google.com/maps/place/?q=place_id:ChIJs8uL-1-5vjcRPWjKJYOMaA0",
    "https://www.facebook.com/rainbowpreschoolthane",
    "https://www.instagram.com/rainbowpreschoolthane",
    "https://www.youtube.com/@RainbowPreschoolInternational",
    "https://www.justdial.com/Thane/Rainbow-Preschool-International",
  ],
} as const;