import { z } from "zod";

export const ThemeTokensSchema = z.object({
  primary: z.string(),
  primaryHover: z.string(),
  surfaceBase: z.string(),
  surfaceDark: z.string(),
  surfaceBrand: z.string(),
  textPrimary: z.string(),
  textTertiary: z.string(),
  textAccent: z.string(),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]),
});

export const HeroContentSchema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string(),
  subheadline: z.string(),
  primaryCtaText: z.string(),
  primaryCtaLink: z.string().optional(),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const HeroSectionSchema = z.object({
  id: z.string(),
  type: z.literal("hero"),
  content: HeroContentSchema,
});

export const FeatureItemSchema = z.object({
  id: z.string(),
  icon: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

export const FeaturesContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  features: z.array(FeatureItemSchema),
});

export const FeaturesSectionSchema = z.object({
  id: z.string(),
  type: z.literal("features"),
  content: FeaturesContentSchema,
});

export const TestimonialItemSchema = z.object({
  id: z.string(),
  quote: z.string(),
  authorName: z.string(),
  authorRole: z.string().optional(),
  authorCompany: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const TestimonialsContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  testimonials: z.array(TestimonialItemSchema),
});

export const TestimonialsSectionSchema = z.object({
  id: z.string(),
  type: z.literal("testimonials"),
  content: TestimonialsContentSchema,
});

export const PricingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  period: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()),
  ctaText: z.string(),
  isHighlighted: z.boolean().optional(),
});

export const PricingContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  plans: z.array(PricingPlanSchema),
});

export const PricingSectionSchema = z.object({
  id: z.string(),
  type: z.literal("pricing"),
  content: PricingContentSchema,
});

export const CtaContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  ctaText: z.string(),
  ctaLink: z.string().optional(),
});

export const CtaSectionSchema = z.object({
  id: z.string(),
  type: z.literal("cta"),
  content: CtaContentSchema,
});

export const FaqItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const FaqContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string(),
  items: z.array(FaqItemSchema),
});

export const FaqSectionSchema = z.object({
  id: z.string(),
  type: z.literal("faq"),
  content: FaqContentSchema,
});

export const FooterLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

export const FooterContentSchema = z.object({
  brandName: z.string(),
  copyright: z.string(),
  links: z.array(FooterLinkSchema).optional(),
});

export const FooterSectionSchema = z.object({
  id: z.string(),
  type: z.literal("footer"),
  content: FooterContentSchema,
});

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  FeaturesSectionSchema,
  TestimonialsSectionSchema,
  PricingSectionSchema,
  CtaSectionSchema,
  FaqSectionSchema,
  FooterSectionSchema,
]);

export const PageMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImageUrl: z.string().optional(),
});

export const PageSchemaZod = z.object({
  meta: PageMetaSchema,
  theme: ThemeTokensSchema,
  sections: z.array(SectionSchema),
});
