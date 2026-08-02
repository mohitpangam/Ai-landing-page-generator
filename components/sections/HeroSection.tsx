import type { HeroSection as HeroSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: HeroSectionProps;
}

export function HeroSection({ section }: Props) {
  const { content } = section;
  const hasImage = Boolean(content.imageUrl);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--page-surface-base)" }}
    >
      {/* Subtle radial gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 40%, var(--page-primary), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-20 @sm:py-28 @lg:px-8">
        <div
          className={`flex flex-col gap-12 ${
            hasImage ? "@lg:flex-row @lg:items-center @lg:gap-16" : "items-center text-center"
          }`}
        >
          {/* Copy */}
          <div className={`flex flex-col gap-6 ${hasImage ? "@lg:flex-1" : "max-w-3xl"}`}>
            {/* Eyebrow */}
            {content.eyebrow && (
              <div className="flex items-center gap-3" style={hasImage ? {} : { justifyContent: "center" }}>
                <span
                  className="h-px w-8 flex-shrink-0"
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
                  className="h-px w-8 flex-shrink-0"
                  style={{ backgroundColor: "var(--page-primary)" }}
                />
              </div>
            )}

            {/* Headline */}
            <EditableText
              sectionId={section.id}
              updateFn={(v) => ({ ...content, headline: v })}
              value={content.headline}
              as="h1"
              multiline
              className="text-4xl font-bold leading-tight tracking-tight @sm:text-5xl @lg:text-6xl"
              style={{ color: "var(--page-text-primary)" }}
            />

            {/* Subheadline */}
            <EditableText
              sectionId={section.id}
              updateFn={(v) => ({ ...content, subheadline: v })}
              value={content.subheadline}
              as="p"
              multiline
              className="text-lg leading-relaxed @sm:text-xl"
              style={{ color: "var(--page-text-tertiary)" }}
            />

            {/* CTA buttons */}
            <div
              className={`flex flex-wrap gap-4 pt-2 ${hasImage ? "" : "justify-center"}`}
            >
              <a
                href={content.primaryCtaLink ?? "#"}
                className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
                style={{
                  backgroundColor: "var(--page-primary)",
                  borderRadius: "var(--page-radius-button)",
                }}
              >
                <EditableText
                  sectionId={section.id}
                  updateFn={(v) => ({ ...content, primaryCtaText: v })}
                  value={content.primaryCtaText}
                  as="span"
                />
              </a>

              {content.secondaryCtaText && (
                <a
                  href={content.secondaryCtaLink ?? "#"}
                  className="inline-flex items-center justify-center rounded-lg border px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:opacity-80 active:scale-95"
                  style={{
                    borderColor: "var(--page-primary)",
                    color: "var(--page-primary)",
                    borderRadius: "var(--page-radius-button)",
                  }}
                >
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({ ...content, secondaryCtaText: v })}
                    value={content.secondaryCtaText}
                    as="span"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Hero image */}
          {hasImage && (
            <div className="flex-shrink-0 @lg:flex-1">
              <div
                className="overflow-hidden rounded-2xl shadow-2xl"
                style={{ borderRadius: "var(--page-radius-card)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={content.imageUrl}
                  alt={content.headline}
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
