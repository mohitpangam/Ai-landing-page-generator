import type { TestimonialsSection as TestimonialsSectionProps } from "@/lib/schema/page";

interface Props {
  section: TestimonialsSectionProps;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({ section }: Props) {
  const { content } = section;

  return (
    <section
      className="py-20 @sm:py-28"
      style={{ backgroundColor: "var(--page-surface-base)" }}
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
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="mt-16 flex gap-6 overflow-x-auto pb-4 @lg:grid @lg:grid-cols-3 @lg:overflow-visible @lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {content.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex w-72 flex-shrink-0 flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md @lg:w-auto"
              style={{
                borderColor: "var(--page-border-subtle)",
                borderRadius: "var(--page-radius-card)",
                backgroundColor: "var(--page-surface-base)",
              }}
            >
              {/* Opening quote mark */}
              <div
                className="text-4xl font-serif leading-none"
                style={{ color: "var(--page-primary)", opacity: 0.4 }}
              >
                &ldquo;
              </div>

              {/* Quote */}
              <p
                className="flex-1 text-base leading-relaxed"
                style={{ color: "var(--page-text-primary)" }}
              >
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t pt-4" style={{ borderColor: "var(--page-border-subtle)" }}>
                {testimonial.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.authorName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: "var(--page-primary)" }}
                  >
                    {getInitials(testimonial.authorName)}
                  </div>
                )}

                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--page-text-primary)" }}
                  >
                    {testimonial.authorName}
                  </p>
                  {(testimonial.authorRole || testimonial.authorCompany) && (
                    <p
                      className="text-xs"
                      style={{ color: "var(--page-text-tertiary)" }}
                    >
                      {[testimonial.authorRole, testimonial.authorCompany]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
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
