import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { centres, createBranchLocalBusinessSchema } from "../shared/centre-data";
import { organizationSchema } from "../client/src/components/seo";
import { HOMEPAGE_ORGANIZATION_SCHEMA } from "../shared/homepage-schema";
import { SHARED_ORGANIZATION_SCHEMA } from "../shared/organization-schema";

describe("shared organization structured data", () => {
  it("uses one canonical organization node for homepage, hydrated pages, and SSR", () => {
    expect(HOMEPAGE_ORGANIZATION_SCHEMA).toBe(SHARED_ORGANIZATION_SCHEMA);
    expect(organizationSchema).toBe(SHARED_ORGANIZATION_SCHEMA);

    const ssrSource = readFileSync("server/ssr-pages.ts", "utf8");
    expect(ssrSource).toContain(
      'import { SHARED_ORGANIZATION_SCHEMA } from "@shared/organization-schema";',
    );
    expect(ssrSource).toContain(
      "const organizationSchema = SHARED_ORGANIZATION_SCHEMA;",
    );
    expect(ssrSource).not.toContain("programmeOrgSchema");
    expect(ssrSource).not.toContain('"@type": "EducationalOrganization"');
    expect(ssrSource).toContain('"/testimonials": {');
    expect(ssrSource).toContain("structuredData: [organizationSchema]");

    const standaloneSource = readFileSync(
      "client/src/components/landing/playgroup-landing-template.tsx",
      "utf8",
    );
    expect(standaloneSource).toContain("SHARED_ORGANIZATION_SCHEMA");
  });

  it("preserves the existing organization reference on all branch schemas", () => {
    for (const centre of centres) {
      expect(createBranchLocalBusinessSchema(centre).parentOrganization["@id"]).toBe(
        SHARED_ORGANIZATION_SCHEMA["@id"],
      );
    }
  });

  it("keeps approved identity and claims without unsupported organization fields", () => {
    const schema = SHARED_ORGANIZATION_SCHEMA;

    expect(schema["@id"]).toBe("https://www.rainbowpreschools.com/#organization");
    expect(schema.name).toBe("Rainbow Preschool International");
    expect(schema.url).toBe("https://www.rainbowpreschools.com");
    expect(schema.telephone).toBe("+91-8291568972");
    expect(schema.foundingDate).toBe("2007");
    expect(schema.award).toEqual([
      "Best Preschool in Thane (2018, 2023)",
      "Cleanest Preschool (2020)",
      "Most Promising Preschool Chain of the Year (2021)",
      "Emerging Preschool Chain of the Year (2022)",
    ]);

    const serialized = JSON.stringify(schema).toLowerCase();
    for (const unsupported of [
      "numberofemployees",
      "availablelanguage",
      "montessori",
      "aggregaterating",
      "review",
      "openinghours",
      "thanes most-trusted",
      "most trusted",
      "no. 1",
      "no1",
      "thane west",
      "2026-27",
      "india today",
      "scoonews",
      "economic times",
    ]) {
      expect(serialized).not.toContain(unsupported);
    }
  });
});