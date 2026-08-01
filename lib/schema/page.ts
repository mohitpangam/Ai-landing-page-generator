export type ThemeTokens = {
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
