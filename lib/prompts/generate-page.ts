export function buildPageGenerationPrompt(
  userPrompt: string,
  styleHints?: string[]
): string {
  const hintsText =
    styleHints && styleHints.length > 0
      ? `Preferred Style & Tone Hints: ${styleHints.join(", ")}`
      : "";

  return `You are an expert SaaS designer and conversion copywriter.
Your task is to take a user's business description and construct a complete, high-converting landing page schema.

User Request:
"${userPrompt}"
${hintsText}

CRITICAL RULES:
1. Output MUST be valid JSON only, with no surrounding Markdown backticks or commentary.
2. The JSON MUST follow this exact structure:
{
  "meta": {
    "title": "Compelling Title (50-60 chars)",
    "description": "Engaging meta description (120-160 chars)"
  },
  "theme": {
    "primary": "#3D5AFE",          // Pick a primary accent hue (e.g. #3D5AFE, #14B8A6, #F97066, #7C3AED, #D946EF, #0F1222)
    "primaryHover": "#2E46DB",     // Darker shade for hover state
    "surfaceBase": "#FFFFFF",
    "surfaceDark": "#0B0F19",
    "surfaceBrand": "#EEF1FF",
    "textPrimary": "#0F1222",
    "textTertiary": "#6B7280",
    "textAccent": "#3D5AFE",       // Same as primary
    "borderRadius": "md"          // "none" | "sm" | "md" | "lg" | "full"
  },
  "sections": [
    // Array of section objects. MUST include: "hero", "features", "testimonials", "pricing", "cta", "faq", "footer".
  ]
}

SECTION TYPES SPECIFICATION:

1. "hero" section:
{
  "id": "hero_1",
  "type": "hero",
  "content": {
    "eyebrow": "SHORT UPPERCASE EYEBROW",
    "headline": "Bold outcome-first headline",
    "subheadline": "1-2 sentence clear explanation of the main value proposition",
    "primaryCtaText": "Get Started Free",
    "primaryCtaLink": "#pricing",
    "secondaryCtaText": "Book a Demo",
    "secondaryCtaLink": "#features"
  }
}

2. "features" section:
{
  "id": "features_1",
  "type": "features",
  "content": {
    "eyebrow": "FEATURES",
    "title": "Everything you need to succeed",
    "description": "Designed for maximum conversion and speed.",
    "features": [
      {
        "id": "feat_1",
        "title": "Feature Name",
        "description": "Short, punchy 1-2 sentence feature description."
      },
      ... (3 to 6 features)
    ]
  }
}

3. "testimonials" section:
{
  "id": "testimonials_1",
  "type": "testimonials",
  "content": {
    "eyebrow": "TESTIMONIALS",
    "title": "Loved by founders worldwide",
    "testimonials": [
      {
        "id": "test_1",
        "quote": "Specific quote highlighting tangible result.",
        "authorName": "Jane Doe",
        "authorRole": "Founder & CEO",
        "authorCompany": "TechCorp"
      },
      ... (2 to 3 testimonials)
    ]
  }
}

4. "pricing" section:
{
  "id": "pricing_1",
  "type": "pricing",
  "content": {
    "eyebrow": "PRICING",
    "title": "Simple, transparent pricing",
    "description": "Choose the plan that fits your business stage.",
    "plans": [
      {
        "id": "plan_starter",
        "name": "Starter",
        "price": "$29",
        "period": "/month",
        "description": "For individuals and early MVPs",
        "features": ["Feature 1", "Feature 2", "Feature 3"],
        "ctaText": "Start Free Trial",
        "isHighlighted": false
      },
      {
        "id": "plan_pro",
        "name": "Pro",
        "price": "$79",
        "period": "/month",
        "description": "For growing companies",
        "features": ["All Starter features", "Feature 4", "Feature 5"],
        "ctaText": "Get Pro Access",
        "isHighlighted": true
      }
    ]
  }
}

5. "cta" section:
{
  "id": "cta_1",
  "type": "cta",
  "content": {
    "title": "Ready to transform your business?",
    "description": "Join hundreds of teams moving faster today.",
    "ctaText": "Start Generating Now",
    "ctaLink": "#pricing"
  }
}

6. "faq" section:
{
  "id": "faq_1",
  "type": "faq",
  "content": {
    "eyebrow": "FAQ",
    "title": "Frequently Asked Questions",
    "items": [
      {
        "id": "faq_1",
        "question": "Clear common question?",
        "answer": "Direct, helpful 1-2 sentence answer."
      },
      ... (3 to 4 items)
    ]
  }
}

7. "footer" section:
{
  "id": "footer_1",
  "type": "footer",
  "content": {
    "brandName": "BrandName",
    "copyright": "© 2026 BrandName Inc. All rights reserved.",
    "links": [
      { "id": "link_1", "label": "Features", "href": "#features" },
      { "id": "link_2", "label": "Pricing", "href": "#pricing" },
      { "id": "link_3", "label": "FAQ", "href": "#faq" }
    ]
  }
}

Ensure all IDs are unique strings. Ensure text copy is high quality, professional, and directly tailored to the user's business description.`;
}
