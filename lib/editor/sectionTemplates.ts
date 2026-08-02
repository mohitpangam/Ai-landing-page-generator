import type { Section } from "@/lib/schema/page";

export interface SectionTemplateMeta {
  type: Section["type"];
  label: string;
  description: string;
  icon: string;
}

export const SECTION_TEMPLATES_META: SectionTemplateMeta[] = [
  {
    type: "hero",
    label: "Hero Section",
    description: "Headline, subheadline, eyebrow, and call-to-action buttons.",
    icon: "✦",
  },
  {
    type: "features",
    label: "Features Grid",
    description: "Grid of feature cards with icons and descriptions.",
    icon: "⚡",
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Social proof cards with quotes, author names, and roles.",
    icon: "💬",
  },
  {
    type: "pricing",
    label: "Pricing Table",
    description: "Tier cards with feature checklists and highlighted plan.",
    icon: "💳",
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "High-impact banner to convert visitors.",
    icon: "🎯",
  },
  {
    type: "faq",
    label: "FAQ Accordion",
    description: "Expandable questions and answers.",
    icon: "❓",
  },
  {
    type: "footer",
    label: "Footer",
    description: "Brand name, links, and copyright notice.",
    icon: "📌",
  },
];

export function createDefaultSection(type: Section["type"]): Section {
  const id = `${type}_${Math.random().toString(36).substring(2, 8)}`;

  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        content: {
          eyebrow: "New Release",
          headline: "Build faster with intelligent automation",
          subheadline:
            "Streamline your workflow, save hours of repetitive work, and focus on building great products.",
          primaryCtaText: "Get started for free",
          primaryCtaLink: "#",
          secondaryCtaText: "Learn more",
          secondaryCtaLink: "#",
        },
      };
    case "features":
      return {
        id,
        type: "features",
        content: {
          eyebrow: "Capabilities",
          title: "Everything you need to succeed",
          description:
            "Designed from the ground up to make your workflow simple and productive.",
          features: [
            {
              id: `f1_${id}`,
              icon: "⚡",
              title: "Lightning Fast",
              description: "Optimized for speed and instant response times.",
            },
            {
              id: `f2_${id}`,
              icon: "🔒",
              title: "Secure by Default",
              description: "Enterprise-grade encryption and access controls.",
            },
            {
              id: `f3_${id}`,
              icon: "📊",
              title: "Analytics Included",
              description: "Real-time metrics and actionable insights.",
            },
          ],
        },
      };
    case "testimonials":
      return {
        id,
        type: "testimonials",
        content: {
          eyebrow: "Testimonials",
          title: "Loved by teams worldwide",
          testimonials: [
            {
              id: `t1_${id}`,
              quote:
                "This tool transformed our team's productivity. Highly recommended!",
              authorName: "Alex Rivera",
              authorRole: "Product Lead",
              authorCompany: "Acme Corp",
            },
            {
              id: `t2_${id}`,
              quote: "Simple, elegant, and super easy to set up.",
              authorName: "Jordan Lee",
              authorRole: "Founder",
            },
          ],
        },
      };
    case "pricing":
      return {
        id,
        type: "pricing",
        content: {
          eyebrow: "Pricing",
          title: "Simple & transparent plans",
          description: "No hidden fees. Upgrade or cancel anytime.",
          plans: [
            {
              id: `p1_${id}`,
              name: "Starter",
              price: "$19",
              period: "month",
              description: "Great for individual creators.",
              features: ["Up to 5 projects", "Basic analytics", "Community support"],
              ctaText: "Start Starter trial",
              isHighlighted: false,
            },
            {
              id: `p2_${id}`,
              name: "Pro",
              price: "$49",
              period: "month",
              description: "For growing teams and businesses.",
              features: [
                "Unlimited projects",
                "Advanced analytics",
                "Priority support",
                "Custom domain",
              ],
              ctaText: "Start Pro trial",
              isHighlighted: true,
            },
          ],
        },
      };
    case "cta":
      return {
        id,
        type: "cta",
        content: {
          title: "Ready to get started?",
          description: "Join thousands of users building landing pages in seconds.",
          ctaText: "Create your page now",
          ctaLink: "#",
        },
      };
    case "faq":
      return {
        id,
        type: "faq",
        content: {
          eyebrow: "FAQ",
          title: "Frequently Asked Questions",
          items: [
            {
              id: `faq1_${id}`,
              question: "How long does it take to get started?",
              answer: "You can sign up and launch your first page in under 5 minutes.",
            },
            {
              id: `faq2_${id}`,
              question: "Can I cancel my subscription anytime?",
              answer: "Yes, you can cancel or change your plan at any time from your dashboard.",
            },
          ],
        },
      };
    case "footer":
      return {
        id,
        type: "footer",
        content: {
          brandName: "My Brand",
          copyright: `© ${new Date().getFullYear()} All rights reserved.`,
          links: [
            { id: `l1_${id}`, label: "Privacy", href: "#" },
            { id: `l2_${id}`, label: "Terms", href: "#" },
            { id: `l3_${id}`, label: "Contact", href: "#" },
          ],
        },
      };
  }
}
