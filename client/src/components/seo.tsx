import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

const BASE_URL = "https://www.rainbowpreschools.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  noIndex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const updateMeta = (selector: string, content: string, attribute = "content") => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute(attribute, content);
      }
    };

    const updateOrCreateMeta = (name: string, content: string, type: "name" | "property" = "name") => {
      const selector = type === "name" ? `meta[name="${name}"]` : `meta[property="${name}"]`;
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(type, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    updateMeta('meta[name="description"]', description);
    if (keywords) {
      updateMeta('meta[name="keywords"]', keywords);
    }

    const robotsContent = noIndex ? "noindex, nofollow" : "index, follow";
    updateOrCreateMeta("robots", robotsContent);

    const fullCanonical = canonical
      ? canonical.startsWith("http")
        ? canonical
        : `${BASE_URL}${canonical}`
      : window.location.href.split("?")[0];

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", fullCanonical);
    }

    const ogImageUrl = ogImage || DEFAULT_OG_IMAGE;
    updateOrCreateMeta("og:title", title, "property");
    updateOrCreateMeta("og:description", description, "property");
    updateOrCreateMeta("og:type", ogType, "property");
    updateOrCreateMeta("og:url", fullCanonical, "property");
    updateOrCreateMeta("og:image", ogImageUrl, "property");
    updateOrCreateMeta("og:site_name", "Rainbow Preschool International", "property");
    updateOrCreateMeta("og:locale", "en_IN", "property");

    updateOrCreateMeta("twitter:card", "summary_large_image");
    updateOrCreateMeta("twitter:title", title);
    updateOrCreateMeta("twitter:description", description);
    updateOrCreateMeta("twitter:image", ogImageUrl);

    if (structuredData) {
      const existingScripts = document.querySelectorAll('script[data-seo-schema="true"]');
      existingScripts.forEach((script) => script.remove());

      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      dataArray.forEach((data, index) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-schema", "true");
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.title = "Best Preschool - Rainbow Preschool Thane";
      const seoScripts = document.querySelectorAll('script[data-seo-schema="true"]');
      seoScripts.forEach((script) => script.remove());
    };
  }, [title, description, keywords, canonical, ogType, ogImage, noIndex, structuredData]);

  return null;
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rainbow Preschool International",
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.webp`,
  description:
    "Rainbow Preschool International is a trusted preschool and playgroup in Thane, offering quality early childhood education for children aged 1.5 to 10 years.",
  foundingDate: "2007",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Thane",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8291568972",
    contactType: "admissions",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
  sameAs: [
    "https://www.facebook.com/rainbowpreschoolthane",
    "https://www.instagram.com/rainbowpreschoolthane",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rainbow Preschool International",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function createLocalBusinessSchema(centre: {
  name: string;
  address: string;
  phone: string;
  locality: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Preschool",
    "@id": `${BASE_URL}${centre.url}`,
    name: `Rainbow Preschool International - ${centre.locality}`,
    description: `Quality preschool and playgroup in ${centre.locality}, Thane offering Playgroup, Nursery, and Kindergarten programmes for children aged 1.5-10 years.`,
    url: `${BASE_URL}${centre.url}`,
    telephone: centre.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: centre.address,
      addressLocality: centre.locality,
      addressRegion: "Maharashtra",
      postalCode: "400607",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "19.2183",
      longitude: "72.9781",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
    image: `${BASE_URL}/og-image.jpg`,
    parentOrganization: organizationSchema,
  };
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createBlogPostSchema(post: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  wordCount?: number;
  keywords?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url.startsWith("http") ? post.url : `${BASE_URL}${post.url}`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      "@type": "Organization",
      name: post.author || "Rainbow Preschool International",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Rainbow Preschool International",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.url.startsWith("http") ? post.url : `${BASE_URL}${post.url}`,
    },
    wordCount: post.wordCount,
    articleSection: "Early Childhood Education",
    keywords: post.keywords,
    image: `${BASE_URL}/og-image.jpg`,
  };
}

export function createServiceSchema(service: {
  name: string;
  description: string;
  ageRange: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: organizationSchema,
    areaServed: {
      "@type": "City",
      name: "Thane",
    },
    audience: {
      "@type": "PeopleAudience",
      audienceType: "Children",
      suggestedMinAge: service.ageRange.split("-")[0],
      suggestedMaxAge: service.ageRange.split("-")[1] || "6",
    },
    url: `${BASE_URL}${service.url}`,
  };
}
