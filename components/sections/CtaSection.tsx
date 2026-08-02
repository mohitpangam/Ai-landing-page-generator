import type { CtaSection as CtaSectionProps } from "@/lib/schema/page";

interface Props {
  section: CtaSectionProps;
}

export function CtaSection({ section }: Props) {
  const { content } = section;

  return (
    <section
      className="relative overflow-hidden py-20 @sm:py-28"
      style={{ backgroundColor: "var(--page-surface-dark, #0B0F19)" }}
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, var(--page-primary), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center @lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white @sm:text-4xl @lg:text-5xl">
          {content.title}
        </h2>

        {content.description && (
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">
            {content.description}
          </p>
        )}

        <div className="mt-10">
          <a
            href={content.ctaLink ?? "#"}
            className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-black/30 transition-all duration-200 hover:opacity-90 hover:shadow-xl active:scale-95"
            style={{
              backgroundColor: "var(--page-primary)",
              borderRadius: "var(--page-radius-button)",
            }}
          >
            {content.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
