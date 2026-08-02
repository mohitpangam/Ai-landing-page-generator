import type { FooterSection as FooterSectionProps } from "@/lib/schema/page";

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
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--page-primary)" }}
          >
            {content.brandName}
          </span>

          {/* Nav links */}
          {content.links && content.links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {content.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-sm transition-colors duration-150 hover:opacity-80"
                  style={{ color: "var(--page-text-tertiary)" }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* Copyright */}
          <p
            className="text-sm"
            style={{ color: "var(--page-text-tertiary)" }}
          >
            {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
