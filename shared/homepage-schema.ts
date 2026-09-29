import { centres } from "./centre-data";
import {
  HOME_PUBLISH_DATE_ISO,
} from "./home-publish-date";

export const HOMEPAGE_URL = "https://www.rainbowpreschools.com/";
export const HOMEPAGE_TITLE =
  "Preschool in Thane | Playgroup, Nursery & KG | Rainbow";
export const HOMEPAGE_DESCRIPTION =
  "Playgroup, nursery and KG for ages 1.5 to 5.5 at 6 Rainbow Preschool International centres in Thane, since 2007. Book a free visit for 2026-27 or 2027-28.";
export const HOMEPAGE_H1 =
  "Preschool in Thane · Playgroup, Nursery & Kindergarten";

const ORGANIZATION_ID = "https://www.rainbowpreschools.com/#organization";

export const HOMEPAGE_ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Rainbow Preschool International",
  url: "https://www.rainbowpreschools.com/",
  logo: {
    "@type": "ImageObject",
    url: "https://www.rainbowpreschools.com/images/logo.webp",
    width: 512,
    height: 512,
  },
  foundingDate: "2007",
  telephone: "+918291568972",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8291568972",
    email: "admin@rainbowpreschools.com",
    contactType: "admissions",
    areaServed: "Thane",
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  },
  sameAs: [
    "https://www.google.com/maps/place/?q=place_id:ChIJs8uL-1-5vjcRPWjKJYOMaA0",
    "https://www.facebook.com/rainbowpreschoolthane",
    "https://www.instagram.com/rainbowpreschoolthane",
    "https://www.youtube.com/@RainbowPreschoolInternational",
    "https://www.justdial.com/Thane/Rainbow-Preschool-International",
  ],
};

export const HOMEPAGE_PRESCHOOL_SCHEMAS = centres.map((centre) => ({
  "@context": "https://schema.org",
  "@type": "Preschool",
  "@id": `https://www.rainbowpreschools.com${centre.preschoolLandingUrl}#preschool`,
  name: centre.name,
  url: `https://www.rainbowpreschools.com${centre.preschoolLandingUrl}`,
  telephone: centre.phoneNumbers,
  address: {
    "@type": "PostalAddress",
    streetAddress: centre.address,
    addressLocality: centre.localityName,
    addressRegion: "Maharashtra",
    postalCode: centre.postalCode,
    addressCountry: "IN",
  },
  parentOrganization: { "@id": ORGANIZATION_ID },
}));

export const HOMEPAGE_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${HOMEPAGE_URL}#webpage`,
  url: HOMEPAGE_URL,
  name: HOMEPAGE_TITLE,
  description: HOMEPAGE_DESCRIPTION,
  dateModified: HOME_PUBLISH_DATE_ISO,
  inLanguage: "en-IN",
  publisher: { "@id": ORGANIZATION_ID },
  about: HOMEPAGE_PRESCHOOL_SCHEMAS.map((preschool) => ({
    "@id": preschool["@id"],
  })),
};

export const HOMEPAGE_WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rainbow Preschool International",
  alternateName: "Rainbow Preschool",
  url: HOMEPAGE_URL,
};

export const HOMEPAGE_STRUCTURED_DATA = [
  HOMEPAGE_WEBPAGE_SCHEMA,
  HOMEPAGE_WEBSITE_SCHEMA,
  HOMEPAGE_ORGANIZATION_SCHEMA,
  ...HOMEPAGE_PRESCHOOL_SCHEMAS,
] as const;