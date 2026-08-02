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
    devDependencies: {
      "@types/node": "^20.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      typescript: "^5.0.0",
    },
  };
  zip.file("package.json", JSON.stringify(packageJson, null, 2));

  // tsconfig.json (critical for @/* alias resolution)
  const tsconfig = {
    compilerOptions: {
      target: "ES2017",
      lib: ["dom", "dom.iterable", "esnext"],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: "esnext",
      moduleResolution: "bundler",
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: "preserve",
      incremental: true,
      plugins: [{ name: "next" }],
      paths: {
        "@/*": ["./*"],
      },
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  };
  zip.file("tsconfig.json", JSON.stringify(tsconfig, null, 2));

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
    `"use client";

import type { PageSchema, ThemeTokens } from "@/lib/schema/page";
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

  // components/sections/index.ts
  zip.file(
    "components/sections/index.ts",
    `import type { ComponentType } from "react";
import type { Section } from "@/lib/schema/page";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { FooterSection } from "./FooterSection";

type SectionComponent = ComponentType<{ section: any }>;

export const sectionRegistry: Record<Section["type"], SectionComponent> = {
  hero: HeroSection,
  features: FeaturesSection,
  testimonials: TestimonialsSection,
  pricing: PricingSection,
  cta: CtaSection,
  faq: FaqSection,
  footer: FooterSection,
};
`
  );

  // components/sections/HeroSection.tsx
  zip.file(
    "components/sections/HeroSection.tsx",
    `"use client";

import type { HeroSection as HeroSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: HeroSectionProps;
}

export function HeroSection({ section }: Props) {
  const { content } = section;
  const hasImage = Boolean(content.imageUrl);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--page-surface-base)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ background: "radial-gradient(ellipse 80% 60% at 60% 40%, var(--page-primary), transparent)" }} />
      <div className="relative mx-auto max-w-6xl px-6 py-20 @sm:py-28 @lg:px-8">
        <div className={\`flex flex-col gap-12 \${hasImage ? "@lg:flex-row @lg:items-center @lg:gap-16" : "items-center text-center"}\`}>
          <div className={\`flex flex-col gap-6 \${hasImage ? "@lg:flex-1" : "max-w-3xl"}\`}>
            {content.eyebrow && (
              <div className="flex items-center gap-3" style={hasImage ? {} : { justifyContent: "center" }}>
                <span className="h-px w-8 flex-shrink-0" style={{ backgroundColor: "var(--page-primary)" }} />
                <EditableText sectionId={section.id} value={content.eyebrow} as="span" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--page-primary)" }} />
                <span className="h-px w-8 flex-shrink-0" style={{ backgroundColor: "var(--page-primary)" }} />
              </div>
            )}
            <EditableText sectionId={section.id} value={content.headline} as="h1" multiline className="text-4xl font-bold leading-tight tracking-tight @sm:text-5xl @lg:text-6xl" style={{ color: "var(--page-text-primary)" }} />
            <EditableText sectionId={section.id} value={content.subheadline} as="p" multiline className="text-lg leading-relaxed @sm:text-xl" style={{ color: "var(--page-text-tertiary)" }} />
            <div className={\`flex flex-wrap gap-4 pt-2 \${hasImage ? "" : "justify-center"}\`}>
              <a href={content.primaryCtaLink ?? "#"} className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95" style={{ backgroundColor: "var(--page-primary)", borderRadius: "var(--page-radius-button)" }}>
                <EditableText sectionId={section.id} value={content.primaryCtaText} as="span" />
              </a>
              {content.secondaryCtaText && (
                <a href={content.secondaryCtaLink ?? "#"} className="inline-flex items-center justify-center rounded-lg border px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:opacity-80 active:scale-95" style={{ borderColor: "var(--page-primary)", color: "var(--page-primary)", borderRadius: "var(--page-radius-button)" }}>
                  <EditableText sectionId={section.id} value={content.secondaryCtaText} as="span" />
                </a>
              )}
            </div>
          </div>
          {hasImage && (
            <div className="flex-shrink-0 @lg:flex-1">
              <div className="overflow-hidden rounded-2xl shadow-2xl" style={{ borderRadius: "var(--page-radius-card)" }}>
                <img src={content.imageUrl} alt={content.headline} className="h-auto w-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/FeaturesSection.tsx
  zip.file(
    "components/sections/FeaturesSection.tsx",
    `"use client";

import type { FeaturesSection as FeaturesSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FeaturesSectionProps;
}

export function FeaturesSection({ section }: Props) {
  const { content } = section;
  return (
    <section className="py-20 @sm:py-28" style={{ backgroundColor: "var(--page-surface-brand)" }}>
      <div className="mx-auto max-w-6xl px-6 @lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
              <EditableText sectionId={section.id} value={content.eyebrow} as="span" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--page-primary)" }} />
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
            </div>
          )}
          <EditableText sectionId={section.id} value={content.title} as="h2" multiline className="text-3xl font-bold tracking-tight @sm:text-4xl" style={{ color: "var(--page-text-primary)" }} />
          {content.description && <EditableText sectionId={section.id} value={content.description} as="p" multiline className="mt-4 text-lg leading-relaxed" style={{ color: "var(--page-text-tertiary)" }} />}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-3">
          {content.features.map((feature) => (
            <div key={feature.id} className="group flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md" style={{ backgroundColor: "var(--page-surface-base)", borderColor: "var(--page-border-subtle)", borderRadius: "var(--page-radius-card)" }}>
              {feature.icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl" style={{ backgroundColor: "color-mix(in srgb, var(--page-primary) 12%, transparent)", borderRadius: "var(--page-radius-card)" }}>
                  <EditableText sectionId={section.id} value={feature.icon} as="span" />
                </div>
              )}
              <EditableText sectionId={section.id} value={feature.title} as="h3" className="text-lg font-semibold" style={{ color: "var(--page-text-primary)" }} />
              <EditableText sectionId={section.id} value={feature.description} as="p" multiline className="text-sm leading-relaxed" style={{ color: "var(--page-text-tertiary)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/TestimonialsSection.tsx
  zip.file(
    "components/sections/TestimonialsSection.tsx",
    `"use client";

import type { TestimonialsSection as TestimonialsSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: TestimonialsSectionProps;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export function TestimonialsSection({ section }: Props) {
  const { content } = section;
  return (
    <section className="py-20 @sm:py-28" style={{ backgroundColor: "var(--page-surface-base)" }}>
      <div className="mx-auto max-w-6xl px-6 @lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
              <EditableText sectionId={section.id} value={content.eyebrow} as="span" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--page-primary)" }} />
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
            </div>
          )}
          <EditableText sectionId={section.id} value={content.title} as="h2" multiline className="text-3xl font-bold tracking-tight @sm:text-4xl" style={{ color: "var(--page-text-primary)" }} />
        </div>
        <div className="mt-16 flex gap-6 overflow-x-auto pb-4 @lg:grid @lg:grid-cols-3 @lg:overflow-visible @lg:pb-0">
          {content.testimonials.map((testimonial) => (
            <div key={testimonial.id} className="flex w-72 flex-shrink-0 flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md @lg:w-auto" style={{ borderColor: "var(--page-border-subtle)", borderRadius: "var(--page-radius-card)", backgroundColor: "var(--page-surface-base)" }}>
              <div className="text-4xl font-serif leading-none" style={{ color: "var(--page-primary)", opacity: 0.4 }}>&ldquo;</div>
              <EditableText sectionId={section.id} value={testimonial.quote} as="p" multiline className="flex-1 text-base leading-relaxed" style={{ color: "var(--page-text-primary)" }} />
              <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--page-border-subtle)" }}>
                {testimonial.avatarUrl ? (
                  <img src={testimonial.avatarUrl} alt={testimonial.authorName} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ backgroundColor: "var(--page-primary)" }}>{getInitials(testimonial.authorName)}</div>
                )}
                <div>
                  <EditableText sectionId={section.id} value={testimonial.authorName} as="p" className="text-sm font-semibold" style={{ color: "var(--page-text-primary)" }} />
                  {(testimonial.authorRole || testimonial.authorCompany) && (
                    <EditableText sectionId={section.id} value={[testimonial.authorRole, testimonial.authorCompany].filter(Boolean).join(", ")} as="p" className="text-xs" style={{ color: "var(--page-text-tertiary)" }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/PricingSection.tsx
  zip.file(
    "components/sections/PricingSection.tsx",
    `"use client";

import type { PricingSection as PricingSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: PricingSectionProps;
}

export function PricingSection({ section }: Props) {
  const { content } = section;
  return (
    <section className="py-20 @sm:py-28" style={{ backgroundColor: "var(--page-surface-brand)" }}>
      <div className="mx-auto max-w-6xl px-6 @lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
              <EditableText sectionId={section.id} value={content.eyebrow} as="span" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--page-primary)" }} />
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
            </div>
          )}
          <EditableText sectionId={section.id} value={content.title} as="h2" multiline className="text-3xl font-bold tracking-tight @sm:text-4xl" style={{ color: "var(--page-text-primary)" }} />
          {content.description && <EditableText sectionId={section.id} value={content.description} as="p" multiline className="mt-4 text-lg leading-relaxed" style={{ color: "var(--page-text-tertiary)" }} />}
        </div>
        <div className={\`mt-16 flex flex-col gap-6 @sm:flex-row @sm:justify-center \${content.plans.length === 1 ? "@sm:max-w-md @sm:mx-auto" : ""}\`}>
          {content.plans.map((plan) => (
            <div key={plan.id} className="relative flex flex-1 flex-col gap-6 rounded-xl border p-8 transition-all duration-200 hover:shadow-lg" style={{ maxWidth: content.plans.length > 2 ? undefined : "380px", backgroundColor: plan.isHighlighted ? "var(--page-primary)" : "var(--page-surface-base)", borderColor: plan.isHighlighted ? "var(--page-primary)" : "var(--page-border-subtle)", borderRadius: "var(--page-radius-card)" }}>
              {plan.isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full px-4 py-1 text-xs font-semibold text-white shadow-md" style={{ backgroundColor: "color-mix(in srgb, var(--page-primary) 80%, black)" }}>Most Popular</span>
                </div>
              )}
              <div>
                <EditableText sectionId={section.id} value={plan.name} as="h3" className="text-lg font-semibold" style={{ color: plan.isHighlighted ? "#ffffff" : "var(--page-text-primary)" }} />
                {plan.description && <EditableText sectionId={section.id} value={plan.description} as="p" multiline className="mt-1 text-sm leading-relaxed" style={{ color: plan.isHighlighted ? "rgba(255,255,255,0.75)" : "var(--page-text-tertiary)" }} />}
              </div>
              <div className="flex items-end gap-1">
                <EditableText sectionId={section.id} value={plan.price} as="span" className="text-5xl font-bold tracking-tight" style={{ color: plan.isHighlighted ? "#ffffff" : "var(--page-text-primary)" }} />
                {plan.period && <span className="mb-1 text-sm" style={{ color: plan.isHighlighted ? "rgba(255,255,255,0.75)" : "var(--page-text-tertiary)" }}>/<EditableText sectionId={section.id} value={plan.period} as="span" /></span>}
              </div>
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature, featIdx) => (
                  <li key={featIdx} className="flex items-start gap-3">
                    <span style={{ color: plan.isHighlighted ? "rgba(255,255,255,0.9)" : "var(--page-primary)" }}>✓</span>
                    <EditableText sectionId={section.id} value={feature} as="span" className="text-sm leading-snug" style={{ color: plan.isHighlighted ? "rgba(255,255,255,0.85)" : "var(--page-text-primary)" }} />
                  </li>
                ))}
              </ul>
              <a href="#" className="mt-auto inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95" style={{ backgroundColor: plan.isHighlighted ? "#ffffff" : "var(--page-primary)", color: plan.isHighlighted ? "var(--page-primary)" : "#ffffff", borderRadius: "var(--page-radius-button)" }}>
                <EditableText sectionId={section.id} value={plan.ctaText} as="span" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/CtaSection.tsx
  zip.file(
    "components/sections/CtaSection.tsx",
    `"use client";

import type { CtaSection as CtaSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: CtaSectionProps;
}

export function CtaSection({ section }: Props) {
  const { content } = section;
  return (
    <section className="relative overflow-hidden py-20 @sm:py-28" style={{ backgroundColor: "var(--page-surface-dark, #0B0F19)" }}>
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, var(--page-primary), transparent)" }} />
      <div className="relative mx-auto max-w-3xl px-6 text-center @lg:px-8">
        <EditableText sectionId={section.id} value={content.title} as="h2" multiline className="text-3xl font-bold tracking-tight text-white @sm:text-4xl @lg:text-5xl" />
        {content.description && <EditableText sectionId={section.id} value={content.description} as="p" multiline className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70" />}
        <div className="mt-10">
          <a href={content.ctaLink ?? "#"} className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-black/30 transition-all duration-200 hover:opacity-90 hover:shadow-xl active:scale-95" style={{ backgroundColor: "var(--page-primary)", borderRadius: "var(--page-radius-button)" }}>
            <EditableText sectionId={section.id} value={content.ctaText} as="span" />
          </a>
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/FaqSection.tsx
  zip.file(
    "components/sections/FaqSection.tsx",
    `"use client";

import { useState } from "react";
import type { FaqSection as FaqSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FaqSectionProps;
}

export function FaqSection({ section }: Props) {
  const { content } = section;
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="py-20 @sm:py-28" style={{ backgroundColor: "var(--page-surface-base)" }}>
      <div className="mx-auto max-w-3xl px-6 @lg:px-8">
        <div className="text-center">
          {content.eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
              <EditableText sectionId={section.id} value={content.eyebrow} as="span" className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--page-primary)" }} />
              <span className="h-px w-8" style={{ backgroundColor: "var(--page-primary)" }} />
            </div>
          )}
          <EditableText sectionId={section.id} value={content.title} as="h2" multiline className="text-3xl font-bold tracking-tight @sm:text-4xl" style={{ color: "var(--page-text-primary)" }} />
        </div>
        <div className="mt-12 flex flex-col divide-y" style={{ borderColor: "var(--page-border-subtle)" }}>
          {content.items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="first:border-t" style={{ borderColor: "var(--page-border-subtle)" }}>
                <button type="button" onClick={() => toggle(item.id)} className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-150">
                  <EditableText sectionId={section.id} value={item.question} as="span" className="text-base font-semibold @sm:text-lg" style={{ color: "var(--page-text-primary)" }} />
                  <span style={{ color: "var(--page-primary)" }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && (
                  <EditableText sectionId={section.id} value={item.answer} as="p" multiline className="pb-5 text-base leading-relaxed" style={{ color: "var(--page-text-tertiary)" }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`
  );

  // components/sections/FooterSection.tsx
  zip.file(
    "components/sections/FooterSection.tsx",
    `"use client";

import type { FooterSection as FooterSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FooterSectionProps;
}

export function FooterSection({ section }: Props) {
  const { content } = section;
  return (
    <footer className="border-t" style={{ backgroundColor: "var(--page-surface-base)", borderColor: "var(--page-border-subtle)" }}>
      <div className="mx-auto max-w-6xl px-6 py-10 @lg:px-8">
        <div className="flex flex-col items-center gap-6 @sm:flex-row @sm:justify-between">
          <EditableText sectionId={section.id} value={content.brandName} as="span" className="text-lg font-bold tracking-tight" style={{ color: "var(--page-primary)" }} />
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {content.links.map((link) => (
                <a key={link.id} href={link.href} className="text-sm transition-colors duration-150 hover:opacity-80" style={{ color: "var(--page-text-tertiary)" }}>
                  <EditableText sectionId={section.id} value={link.label} as="span" />
                </a>
              ))}
            </nav>
          )}
          <EditableText sectionId={section.id} value={content.copyright} as="p" className="text-sm" style={{ color: "var(--page-text-tertiary)" }} />
        </div>
      </div>
    </footer>
  );
}
`
  );

  // Generate zip as Node.js buffer
  return await zip.generateAsync({ type: "nodebuffer" });
}
