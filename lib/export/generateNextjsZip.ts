import JSZip from "jszip";
import type { PageSchema } from "@/lib/schema/page";

export async function generateNextjsZip(
  schema: PageSchema,
  projectName: string
): Promise<Buffer> {
  const zip = new JSZip();

  const slugifiedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // package.json
  const packageJson = {
    name: slugifiedName || "landing-page",
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
    },
    dependencies: {
      next: "^15.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      tailwindcss: "^4.0.0",
      "@tailwindcss/postcss": "^4.0.0",
    },
  };

  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // README.md
  zip.file(
    "README.md",
    `# ${projectName} — Exported Landing Page

Exported from AI SaaS Landing Generator.

## Getting Started

First, install dependencies:

\`\`\`bash
npm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
`
  );

  // app/layout.tsx
  zip.file(
    "app/layout.tsx",
    `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: ${JSON.stringify(schema.meta.title || projectName)},
  description: ${JSON.stringify(schema.meta.description || "")},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  );

  // app/globals.css
  zip.file(
    "app/globals.css",
    `@import "tailwindcss";

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
`
  );

  // app/page.tsx
  zip.file(
    "app/page.tsx",
    `import { PageRenderer } from "@/components/PageRenderer";
import type { PageSchema } from "@/lib/schema/page";

const pageSchema: PageSchema = ${JSON.stringify(schema, null, 2)};

export default function Home() {
  return <PageRenderer schema={pageSchema} />;
}
`
  );

  // lib/schema/page.ts
  zip.file(
    "lib/schema/page.ts",
    `export type ThemeTokens = {
  primary: string;
  primaryHover: string;
  surfaceBase: string;
  surfaceDark: string;
  surfaceBrand: string;
  textPrimary: string;
  textTertiary: string;
  textAccent: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
};

export type HeroContent = {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;
};

export type HeroSection = {
  id: string;
  type: "hero";
  content: HeroContent;
};

export type FeatureItem = {
  id: string;
  icon?: string;
  title: string;
  description: string;
};

export type FeaturesContent = {
  eyebrow?: string;
  title: string;
  description?: string;
  features: FeatureItem[];
};

export type FeaturesSection = {
  id: string;
  type: "features";
  content: FeaturesContent;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  authorCompany?: string;
  avatarUrl?: string;
};

export type TestimonialsContent = {
  eyebrow?: string;
  title: string;
  testimonials: TestimonialItem[];
};

export type TestimonialsSection = {
  id: string;
  type: "testimonials";
  content: TestimonialsContent;
};

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaText: string;
  isHighlighted?: boolean;
};

export type PricingContent = {
  eyebrow?: string;
  title: string;
  description?: string;
  plans: PricingPlan[];
};

export type PricingSection = {
  id: string;
  type: "pricing";
  content: PricingContent;
};

export type CtaContent = {
  title: string;
  description?: string;
  ctaText: string;
  ctaLink?: string;
};

export type CtaSection = {
  id: string;
  type: "cta";
  content: CtaContent;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqContent = {
  eyebrow?: string;
  title: string;
  items: FaqItem[];
};

export type FaqSection = {
  id: string;
  type: "faq";
  content: FaqContent;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type FooterContent = {
  brandName: string;
  copyright: string;
  links?: FooterLink[];
};

export type FooterSection = {
  id: string;
  type: "footer";
  content: FooterContent;
};

export type Section =
  | HeroSection
  | FeaturesSection
  | TestimonialsSection
  | PricingSection
  | CtaSection
  | FaqSection
  | FooterSection;

export type PageMeta = {
  title: string;
  description: string;
  ogImageUrl?: string;
};

export type PageSchema = {
  meta: PageMeta;
  theme: ThemeTokens;
  sections: Section[];
};
`
  );

  // components/PageRendererContext.ts
  zip.file(
    "components/PageRendererContext.ts",
    `"use client";
import { createContext } from "react";

export const PageRendererContext = createContext<{ isEditable: boolean }>({
  isEditable: false,
});
`
  );

  // components/editor/EditableText.tsx
  zip.file(
    "components/editor/EditableText.tsx",
    `"use client";

import React, { useContext } from "react";
import { PageRendererContext } from "@/components/PageRendererContext";

interface EditableTextProps {
  sectionId?: string;
  updateFn?: (newValue: string) => unknown;
  value: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({
  value,
  as: Component = "span",
  className = "",
  style,
}: EditableTextProps) {
  const { isEditable } = useContext(PageRendererContext);
  return <Component className={className} style={style}>{value}</Component>;
}
`
  );

  // components/PageRenderer.tsx
  zip.file(
    "components/PageRenderer.tsx",
    `import type { PageSchema, ThemeTokens } from "@/lib/schema/page";
import { sectionRegistry } from "@/components/sections";
import { PageRendererContext } from "@/components/PageRendererContext";

const RADIUS_MAP: Record<ThemeTokens["borderRadius"], string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

function buildPageCssVars(theme: ThemeTokens): Record<string, string> {
  const radius = RADIUS_MAP[theme.borderRadius] ?? "8px";
  return {
    "--page-primary": theme.primary,
    "--page-primary-hover": theme.primaryHover,
    "--page-surface-base": theme.surfaceBase,
    "--page-surface-dark": theme.surfaceDark,
    "--page-surface-brand": theme.surfaceBrand,
    "--page-text-primary": theme.textPrimary,
    "--page-text-tertiary": theme.textTertiary,
    "--page-text-accent": theme.textAccent,
    "--page-border-subtle": "rgba(0,0,0,0.1)",
    "--page-radius-button": radius,
    "--page-radius-card": radius,
  };
}

export function PageRenderer({ schema, className, isEditable = false }: { schema: PageSchema; className?: string; isEditable?: boolean }) {
  const { theme, sections } = schema;
  const cssVars = buildPageCssVars(theme);

  return (
    <PageRendererContext.Provider value={{ isEditable }}>
      <div className={\`@container \${className ?? ""}\`} style={cssVars as React.CSSProperties}>
        {sections.map((section) => {
          const Component = sectionRegistry[section.type];
          if (!Component) return null;
          return <Component key={section.id} section={section} />;
        })}
      </div>
    </PageRendererContext.Provider>
  );
}
`
  );

  // Generate zip as Node.js buffer
  return await zip.generateAsync({ type: "nodebuffer" });
}
