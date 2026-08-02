import type { PricingSection as PricingSectionProps } from "@/lib/schema/page";

interface Props {
  section: PricingSectionProps;
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.12" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingSection({ section }: Props) {
  const { content } = section;

  return (
    <section
      className="py-20 @sm:py-28"
      style={{ backgroundColor: "var(--page-surface-brand)" }}
    >
      <div className="mx-auto max-w-6xl px-6 @lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          {content.eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span
                className="h-px w-8"
                style={{ backgroundColor: "var(--page-primary)" }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--page-primary)" }}
              >
                {content.eyebrow}
              </span>
              <span
                className="h-px w-8"
                style={{ backgroundColor: "var(--page-primary)" }}
              />
            </div>
          )}

          <h2
            className="text-3xl font-bold tracking-tight @sm:text-4xl"
            style={{ color: "var(--page-text-primary)" }}
          >
            {content.title}
          </h2>

          {content.description && (
            <p
              className="mt-4 text-lg leading-relaxed"
              style={{ color: "var(--page-text-tertiary)" }}
            >
              {content.description}
            </p>
          )}
        </div>

        {/* Plan cards */}
        <div
          className={`mt-16 flex flex-col gap-6 @sm:flex-row @sm:justify-center ${
            content.plans.length === 1 ? "@sm:max-w-md @sm:mx-auto" : ""
          }`}
        >
          {content.plans.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-1 flex-col gap-6 rounded-xl border p-8 transition-all duration-200 hover:shadow-lg"
              style={{
                maxWidth: content.plans.length > 2 ? undefined : "380px",
                backgroundColor: plan.isHighlighted
                  ? "var(--page-primary)"
                  : "var(--page-surface-base)",
                borderColor: plan.isHighlighted
                  ? "var(--page-primary)"
                  : "var(--page-border-subtle)",
                borderRadius: "var(--page-radius-card)",
              }}
            >
              {/* Popular badge */}
              {plan.isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="rounded-full px-4 py-1 text-xs font-semibold text-white shadow-md"
                    style={{ backgroundColor: "color-mix(in srgb, var(--page-primary) 80%, black)" }}
                  >
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + description */}
              <div>
                <h3
                  className="text-lg font-semibold"
                  style={{
                    color: plan.isHighlighted ? "#ffffff" : "var(--page-text-primary)",
                  }}
                >
                  {plan.name}
                </h3>
                {plan.description && (
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    style={{
                      color: plan.isHighlighted
                        ? "rgba(255,255,255,0.75)"
                        : "var(--page-text-tertiary)",
                    }}
                  >
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span
                  className="text-5xl font-bold tracking-tight"
                  style={{
                    color: plan.isHighlighted ? "#ffffff" : "var(--page-text-primary)",
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className="mb-1 text-sm"
                    style={{
                      color: plan.isHighlighted
                        ? "rgba(255,255,255,0.75)"
                        : "var(--page-text-tertiary)",
                    }}
                  >
                    /{plan.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      style={{
                        color: plan.isHighlighted ? "rgba(255,255,255,0.9)" : "var(--page-primary)",
                      }}
                    >
                      <CheckIcon />
                    </span>
                    <span
                      className="text-sm leading-snug"
                      style={{
                        color: plan.isHighlighted
                          ? "rgba(255,255,255,0.85)"
                          : "var(--page-text-primary)",
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#"
                className="mt-auto inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                  backgroundColor: plan.isHighlighted ? "#ffffff" : "var(--page-primary)",
                  color: plan.isHighlighted ? "var(--page-primary)" : "#ffffff",
                  borderRadius: "var(--page-radius-button)",
                }}
              >
                {plan.ctaText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
