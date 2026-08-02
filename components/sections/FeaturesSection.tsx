import type { FeaturesSection as FeaturesSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FeaturesSectionProps;
}

export function FeaturesSection({ section }: Props) {
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

          {content.description && (
            <EditableText
              sectionId={section.id}
              updateFn={(v) => ({ ...content, description: v })}
              value={content.description}
              as="p"
              multiline
              className="mt-4 text-lg leading-relaxed"
              style={{ color: "var(--page-text-tertiary)" }}
            />
          )}
        </div>

        {/* Feature cards grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 @sm:grid-cols-2 @lg:grid-cols-3">
          {content.features.map((feature, idx) => (
            <div
              key={feature.id}
              className="group flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: "var(--page-surface-base)",
                borderColor: "var(--page-border-subtle)",
                borderRadius: "var(--page-radius-card)",
              }}
            >
              {/* Icon */}
              {feature.icon && (
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--page-primary) 12%, transparent)",
                    borderRadius: "var(--page-radius-card)",
                  }}
                >
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({
                      ...content,
                      features: content.features.map((f, i) => (i === idx ? { ...f, icon: v } : f)),
                    })}
                    value={feature.icon}
                    as="span"
                  />
                </div>
              )}

              {/* Title */}
              <EditableText
                sectionId={section.id}
                updateFn={(v) => ({
                  ...content,
                  features: content.features.map((f, i) => (i === idx ? { ...f, title: v } : f)),
                })}
                value={feature.title}
                as="h3"
                className="text-lg font-semibold"
                style={{ color: "var(--page-text-primary)" }}
              />

              {/* Description */}
              <EditableText
                sectionId={section.id}
                updateFn={(v) => ({
                  ...content,
                  features: content.features.map((f, i) => (i === idx ? { ...f, description: v } : f)),
                })}
                value={feature.description}
                as="p"
                multiline
                className="text-sm leading-relaxed"
                style={{ color: "var(--page-text-tertiary)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
