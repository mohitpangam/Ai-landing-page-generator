import { PageSchemaZod } from "../page.zod";

const validFixture = {
  meta: {
    title: "SaaSify — Launch fast",
    description: "Build AI-powered landing pages in under 60 seconds.",
  },
  theme: {
    primary: "#3D5AFE",
    primaryHover: "#2E46DB",
    surfaceBase: "#FFFFFF",
    surfaceDark: "#0B0F19",
    surfaceBrand: "#EEF1FF",
    textPrimary: "#0F1222",
    textTertiary: "#6B7280",
    textAccent: "#3D5AFE",
    borderRadius: "md",
  },
  sections: [
    {
      id: "sec_hero_1",
      type: "hero",
      content: {
        eyebrow: "AI LANDING PAGE GENERATOR",
        headline: "Launch your next SaaS idea in seconds",
        subheadline: "Generate, visually customize, and export clean Next.js code.",
        primaryCtaText: "Get Started Free",
        primaryCtaLink: "/signup",
      },
    },
    {
      id: "sec_features_1",
      type: "features",
      content: {
        eyebrow: "FEATURES",
        title: "Everything you need to ship fast",
        features: [
          {
            id: "feat_1",
            title: "Structured JSON Output",
            description: "No fragile HTML parsing. Powered by Gemini API.",
          },
        ],
      },
    },
    {
      id: "sec_footer_1",
      type: "footer",
      content: {
        brandName: "SaaSify",
        copyright: "© 2026 SaaSify Inc.",
      },
    },
  ],
};

const invalidMissingFieldFixture = {
  meta: {
    title: "Incomplete Page",
  },
  theme: {
    primary: "#3D5AFE",
  },
  sections: [],
};

const invalidSectionTypeFixture = {
  meta: {
    title: "Bad Section Page",
    description: "Test description",
  },
  theme: {
    primary: "#3D5AFE",
    primaryHover: "#2E46DB",
    surfaceBase: "#FFFFFF",
    surfaceDark: "#0B0F19",
    surfaceBrand: "#EEF1FF",
    textPrimary: "#0F1222",
    textTertiary: "#6B7280",
    textAccent: "#3D5AFE",
    borderRadius: "md",
  },
  sections: [
    {
      id: "sec_unknown",
      type: "unknown_type",
      content: {},
    },
  ],
};

function runTests() {
  console.log("🧪 Testing Zod Page Schema validation...");

  // 1. Valid fixture test
  const validResult = PageSchemaZod.safeParse(validFixture);
  if (!validResult.success) {
    console.error("❌ Valid fixture failed validation:", validResult.error.format());
    process.exit(1);
  }
  console.log("✅ Valid fixture passed validation");

  // 2. Invalid missing field test
  const invalidFieldResult = PageSchemaZod.safeParse(invalidMissingFieldFixture);
  if (invalidFieldResult.success) {
    console.error("❌ Invalid missing field fixture mistakenly passed!");
    process.exit(1);
  }
  console.log("✅ Invalid missing field fixture caught correctly");

  // 3. Invalid section type test
  const invalidTypeResult = PageSchemaZod.safeParse(invalidSectionTypeFixture);
  if (invalidTypeResult.success) {
    console.error("❌ Invalid section type fixture mistakenly passed!");
    process.exit(1);
  }
  console.log("✅ Invalid section type fixture caught correctly");

  console.log("\n🎉 All Page Schema Zod tests passed successfully!");
}

runTests();
