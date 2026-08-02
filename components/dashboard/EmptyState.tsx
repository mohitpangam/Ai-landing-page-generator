import Link from "next/link";

const EXAMPLE_PROMPTS = [
  "A SaaS tool for freelance designers to send proposals and get paid online.",
  "AI-powered customer support chatbot for e-commerce stores.",
  "A mobile app that helps solo founders track their MRR and churn.",
  "Online course platform for teaching Python to absolute beginners.",
];

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Illustration */}
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-surface-brand border border-border-subtle">
        <svg
          className="h-12 w-12 text-brand-primary opacity-60"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <path d="M4 16h40" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="10" cy="12" r="2" fill="currentColor" />
          <circle cx="16" cy="12" r="2" fill="currentColor" />
          <circle cx="22" cy="12" r="2" fill="currentColor" />
          <path d="M14 28h20M18 34h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-3">
        Your first page is one prompt away
      </h2>
      <p className="text-text-tertiary max-w-md text-base leading-relaxed mb-10">
        Describe your product in plain English and we&apos;ll generate a fully styled,
        production-ready landing page in under 60 seconds.
      </p>

      {/* Primary CTA */}
      <Link
        href="/dashboard/new"
        id="empty-state-new-project-btn"
        className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-150 hover:bg-brand-primary-hover hover:shadow-lg active:scale-95 mb-12"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Generate my first page
      </Link>

      {/* Prompt tips */}
      <div className="w-full max-w-lg text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-4 text-center">
          — What makes a great prompt —
        </p>
        <ul className="flex flex-col gap-3">
          {EXAMPLE_PROMPTS.map((prompt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-border-subtle bg-surface-base px-4 py-3"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                ✓
              </span>
              <p className="text-sm text-text-primary leading-snug">{prompt}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-text-tertiary text-center">
          Be specific: name the target audience, product type, and key benefit.
        </p>
      </div>
    </div>
  );
}
