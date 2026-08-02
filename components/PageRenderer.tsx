"use client";

import type { PageSchema, ThemeTokens } from "@/lib/schema/page";
import { sectionRegistry } from "@/components/sections";
import { PageRendererContext } from "@/components/PageRendererContext";

// ─── Border radius map ─────────────────────────────────────────────────────────
const RADIUS_MAP: Record<ThemeTokens["borderRadius"], string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

// ─── Build scoped CSS variables from ThemeTokens ──────────────────────────────
// Prefixed with --page-* so they NEVER collide with the app's own --brand-* tokens.
function buildPageCssVars(theme: ThemeTokens): Record<string, string> {
  const radius = RADIUS_MAP[theme.borderRadius] ?? "8px";
  const isDark = theme.mode === "dark";
  return {
    "--page-primary": theme.primary,
    "--page-primary-hover": theme.primaryHover,
    "--page-surface-base": theme.surfaceBase,
    "--page-surface-dark": theme.surfaceDark,
    "--page-surface-brand": theme.surfaceBrand,
    "--page-text-primary": theme.textPrimary,
    "--page-text-tertiary": theme.textTertiary,
    "--page-text-accent": theme.textAccent,
    "--page-border-subtle": isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
    "--page-radius-button": radius,
    "--page-radius-card": radius,
  };
}

// ─── PageRenderer ─────────────────────────────────────────────────────────────

interface PageRendererProps {
  schema: PageSchema;
  /**
   * Optional extra class applied to the outermost wrapper.
   * The editor uses this to set a fixed viewport width for responsive preview.
   */
  className?: string;
  isEditable?: boolean;
}

export function PageRenderer({ schema, className, isEditable = false }: PageRendererProps) {
  const { theme, sections } = schema;
  const cssVars = buildPageCssVars(theme);

  return (
    <PageRendererContext.Provider value={{ isEditable }}>
      <div
        className={`@container ${className ?? ""}`}
        style={cssVars as React.CSSProperties}
      >
        {sections.map((section) => {
          const Component = sectionRegistry[section.type];

          if (!Component) {
            // Unknown section type — render a placeholder so the page doesn't break
            return (
              <div
                key={section.id}
                className="flex items-center justify-center py-12 text-sm text-gray-400"
              >
                Unknown section type: <code className="ml-1">{section.type}</code>
              </div>
            );
          }

          return <Component key={section.id} section={section} />;
        })}
      </div>
    </PageRendererContext.Provider>
  );
}
