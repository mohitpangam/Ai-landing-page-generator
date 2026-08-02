import type { FooterSection as FooterSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FooterSectionProps;
}

export function FooterSection({ section }: Props) {
  const { content } = section;

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--page-surface-base)",
        borderColor: "var(--page-border-subtle)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-10 @lg:px-8">
        <div className="flex flex-col items-center gap-6 @sm:flex-row @sm:justify-between">
          {/* Brand name */}
          <EditableText
            sectionId={section.id}
            updateFn={(v) => ({ ...content, brandName: v })}
            value={content.brandName}
            as="span"
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--page-primary)" }}
          />

          {/* Nav links */}
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {content.links.map((link, idx) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-sm transition-colors duration-150 hover:opacity-80"
                  style={{ color: "var(--page-text-tertiary)" }}
                >
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({
                      ...content,
                      links: content.links?.map((l, i) => (i === idx ? { ...l, label: v } : l)),
                    })}
                    value={link.label}
                    as="span"
                  />
                </a>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <EditableText
            sectionId={section.id}
            updateFn={(v) => ({ ...content, copyright: v })}
            value={content.copyright}
            as="p"
            className="text-sm"
            style={{ color: "var(--page-text-tertiary)" }}
          />
        </div>
      </div>
    </footer>
  );
}
