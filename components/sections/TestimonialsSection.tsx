import type { TestimonialsSection as TestimonialsSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

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
              <EditableText
                sectionId={section.id}
                updateFn={(v) => ({ ...content, eyebrow: v })}
                value={content.eyebrow}
                as="span"
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--page-primary)" }}
              />
              <span
                className="h-px w-8"
                style={{ backgroundColor: "var(--page-primary)" }}
              />
            </div>
          )}

          <EditableText
            sectionId={section.id}
            updateFn={(v) => ({ ...content, title: v })}
            value={content.title}
            as="h2"
            multiline
            className="text-3xl font-bold tracking-tight @sm:text-4xl"
            style={{ color: "var(--page-text-primary)" }}
          />
        </div>

        {/* Cards — horizontal scroll on mobile, grid on desktop */}
        <div className="mt-16 flex gap-6 overflow-x-auto pb-4 @lg:grid @lg:grid-cols-3 @lg:overflow-visible @lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {content.testimonials.map((testimonial, idx) => (
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
              <EditableText
                sectionId={section.id}
                updateFn={(v) => ({
                  ...content,
                  testimonials: content.testimonials.map((t, i) => (i === idx ? { ...t, quote: v } : t)),
                })}
                value={testimonial.quote}
                as="p"
                multiline
                className="flex-1 text-base leading-relaxed"
                style={{ color: "var(--page-text-primary)" }}
              />

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
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({
                      ...content,
                      testimonials: content.testimonials.map((t, i) => (i === idx ? { ...t, authorName: v } : t)),
                    })}
                    value={testimonial.authorName}
                    as="p"
                    className="text-sm font-semibold"
                    style={{ color: "var(--page-text-primary)" }}
                  />
                  {(testimonial.authorRole || testimonial.authorCompany) && (
                    <EditableText
                      sectionId={section.id}
                      updateFn={(v) => ({
                        ...content,
                        testimonials: content.testimonials.map((t, i) => (i === idx ? { ...t, authorRole: v } : t)),
                      })}
                      value={[testimonial.authorRole, testimonial.authorCompany].filter(Boolean).join(", ")}
                      as="p"
                      className="text-xs"
                      style={{ color: "var(--page-text-tertiary)" }}
                    />
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
