import type { ComponentType } from "react";
import type { Section } from "@/lib/schema/page";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { FooterSection } from "./FooterSection";

// Each component in the registry receives `section` typed as the matching Section subtype.
// We use `any` here so the registry map can be indexed by string — PageRenderer narrows types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
