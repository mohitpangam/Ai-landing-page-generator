/**
 * /preview/test — Development-only route that renders a hardcoded PageSchema
 * through PageRenderer to visually verify all section components.
 *
 * Remove or gate this route behind an env check before production.
 */

import { PageRenderer } from "@/components/PageRenderer";
import type { PageSchema } from "@/lib/schema/page";

const DEMO_SCHEMA: PageSchema = {
  meta: {
    title: "AutoInvoice AI – Smart Invoice & Payment Tracking",
    description:
      "Stop chasing unpaid invoices. AutoInvoice AI creates invoices, tracks bank deposits in real-time, and sends friendly reminders automatically.",
  },
  theme: {
    primary: "#4F46E5",
    primaryHover: "#4338CA",
    surfaceBase: "#FFFFFF",
    surfaceDark: "#0B0F19",
    surfaceBrand: "#EEF1FF",
    textPrimary: "#0F1222",
    textTertiary: "#6B7280",
    textAccent: "#4F46E5",
    borderRadius: "md",
  },
  sections: [
    {
      id: "hero_1",
      type: "hero",
      content: {
        eyebrow: "Built for Freelancers",
        headline: "Get paid faster. Stop chasing invoices.",
        subheadline:
          "AutoInvoice AI creates professional invoices, tracks payments in real-time, and automatically sends polite reminders so you can focus on your work.",
        primaryCtaText: "Start for free",
        primaryCtaLink: "#",
        secondaryCtaText: "See how it works",
        secondaryCtaLink: "#",
      },
    },
    {
      id: "features_1",
      type: "features",
      content: {
        eyebrow: "Features",
        title: "Everything you need to get paid on time",
        description:
          "Automate the tedious parts of invoicing so you spend more time doing work you love.",
        features: [
          {
            id: "f1",
            icon: "⚡",
            title: "AI Invoice Generation",
            description:
              "Describe the work, get a polished invoice in seconds. No templates to fiddle with.",
          },
          {
            id: "f2",
            icon: "🔔",
            title: "Smart Payment Reminders",
            description:
              "Friendly, professional nudges sent automatically on your schedule.",
          },
          {
            id: "f3",
            icon: "📊",
            title: "Real-time Payment Tracking",
            description:
              "Know exactly which invoices are paid, overdue, or pending — at a glance.",
          },
          {
            id: "f4",
            icon: "🔗",
            title: "Bank & Stripe Sync",
            description: "Connect your accounts and reconcile payments without lifting a finger.",
          },
          {
            id: "f5",
            icon: "🌍",
            title: "Multi-currency Support",
            description:
              "Invoice clients in their preferred currency. Exchange rates handled automatically.",
          },
          {
            id: "f6",
            icon: "📄",
            title: "Expense Tracking",
            description:
              "Log project expenses and attach receipts directly to your invoices.",
          },
        ],
      },
    },
    {
      id: "testimonials_1",
      type: "testimonials",
      content: {
        eyebrow: "Testimonials",
        title: "Freelancers love AutoInvoice",
        testimonials: [
          {
            id: "t1",
            quote:
              "I used to spend 3 hours a month chasing payments. Now it takes 10 minutes. AutoInvoice is the best thing I've added to my workflow.",
            authorName: "Sarah Chen",
            authorRole: "UX Designer",
            authorCompany: "Freelance",
          },
          {
            id: "t2",
            quote:
              "The AI just knows what to write. I describe the project, it generates a professional invoice. My clients are always impressed.",
            authorName: "Marcus Webb",
            authorRole: "Full-stack Developer",
          },
          {
            id: "t3",
            quote:
              "Finally, invoicing software that doesn't require an accountant to configure. Got my first invoice out in under 2 minutes.",
            authorName: "Priya Nair",
            authorRole: "Brand Consultant",
            authorCompany: "Studio Nair",
          },
        ],
      },
    },
    {
      id: "pricing_1",
      type: "pricing",
      content: {
        eyebrow: "Pricing",
        title: "Simple, transparent pricing",
        description: "One plan. Everything included. No surprise fees.",
        plans: [
          {
            id: "p1",
            name: "Starter",
            price: "Free",
            description: "Perfect for getting started.",
            features: ["Up to 5 active clients", "10 invoices/month", "Email reminders"],
            ctaText: "Get started free",
            isHighlighted: false,
          },
          {
            id: "p2",
            name: "Pro",
            price: "$12",
            period: "month",
            description: "For freelancers running a full business.",
            features: [
              "Unlimited clients",
              "Unlimited invoices",
              "Bank & Stripe sync",
              "Multi-currency",
              "Expense tracking",
              "Priority support",
            ],
            ctaText: "Start Pro trial",
            isHighlighted: true,
          },
        ],
      },
    },
    {
      id: "cta_1",
      type: "cta",
      content: {
        title: "Your next invoice is ready in 30 seconds.",
        description: "Join 4,000+ freelancers who've stopped chasing payments.",
        ctaText: "Generate my first invoice",
        ctaLink: "#",
      },
    },
    {
      id: "faq_1",
      type: "faq",
      content: {
        eyebrow: "FAQ",
        title: "Common questions",
        items: [
          {
            id: "faq1",
            question: "Do I need an accountant to set this up?",
            answer:
              "Not at all. AutoInvoice is designed for freelancers, not accountants. You can send your first invoice in under 2 minutes.",
          },
          {
            id: "faq2",
            question: "What payment methods do clients see?",
            answer:
              "Clients can pay via bank transfer, Stripe (credit/debit card), or PayPal — you choose which to enable per invoice.",
          },
          {
            id: "faq3",
            question: "Can I use my own branding?",
            answer:
              "Yes. Upload your logo, set your brand color, and add a custom footer message. Every invoice looks like it came from your studio.",
          },
          {
            id: "faq4",
            question: "Is there a free trial?",
            answer:
              "Yes — our Starter plan is free forever. No credit card required to get started.",
          },
        ],
      },
    },
    {
      id: "footer_1",
      type: "footer",
      content: {
        brandName: "AutoInvoice AI",
        copyright: "© 2025 AutoInvoice AI. All rights reserved.",
        links: [
          { id: "l1", label: "Privacy", href: "#" },
          { id: "l2", label: "Terms", href: "#" },
          { id: "l3", label: "Support", href: "#" },
        ],
      },
    },
  ],
};

export default function PreviewTestPage() {
  return <PageRenderer schema={DEMO_SCHEMA} />;
}
