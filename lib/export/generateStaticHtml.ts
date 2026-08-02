import type { PageSchema, ThemeTokens, Section } from "@/lib/schema/page";

const RADIUS_MAP: Record<ThemeTokens["borderRadius"], string> = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "16px",
  full: "9999px",
};

export function generateStaticHtml(schema: PageSchema): string {
  const { meta, theme, sections } = schema;
  const radius = RADIUS_MAP[theme.borderRadius] ?? "8px";

  const cssVars = `
    --page-primary: ${theme.primary};
    --page-primary-hover: ${theme.primaryHover};
    --page-surface-base: ${theme.surfaceBase};
    --page-surface-dark: ${theme.surfaceDark};
    --page-surface-brand: ${theme.surfaceBrand};
    --page-text-primary: ${theme.textPrimary};
    --page-text-tertiary: ${theme.textTertiary};
    --page-text-accent: ${theme.textAccent};
    --page-border-subtle: rgba(0,0,0,0.1);
    --page-radius-button: ${radius};
    --page-radius-card: ${radius};
  `;

  const sectionsHtml = sections
    .map((section) => renderSectionHtml(section))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title || "Landing Page")}</title>
  <meta name="description" content="${escapeHtml(meta.description || "")}">
  
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(meta.title || "")}">
  <meta property="og:description" content="${escapeHtml(meta.description || "")}">
  ${meta.ogImageUrl ? `<meta property="og:image" content="${escapeHtml(meta.ogImageUrl)}">` : ""}

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      ${cssVars}
    }
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      background-color: var(--page-surface-base);
    }
    details summary::-webkit-details-marker { display: none; }
  </style>
</head>
<body>
  <div className="w-full">
    ${sectionsHtml}
  </div>
</body>
</html>`;
}

function renderSectionHtml(section: Section): string {
  switch (section.type) {
    case "hero": {
      const c = section.content;
      const hasImage = Boolean(c.imageUrl);
      return `
        <section className="relative overflow-hidden py-20 sm:py-28" style="background-color: var(--page-surface-base);">
          <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
            <div className="flex flex-col gap-12 ${hasImage ? "lg:flex-row lg:items-center lg:gap-16" : "items-center text-center"}">
              <div className="flex flex-col gap-6 ${hasImage ? "lg:flex-1" : "max-w-3xl"}">
                ${
                  c.eyebrow
                    ? `<div className="flex items-center gap-3 ${hasImage ? "" : "justify-center"}">
                        <span className="h-px w-8 flex-shrink-0" style="background-color: var(--page-primary);"></span>
                        <span className="text-xs font-semibold uppercase tracking-widest" style="color: var(--page-primary);">${escapeHtml(c.eyebrow)}</span>
                        <span className="h-px w-8 flex-shrink-0" style="background-color: var(--page-primary);"></span>
                       </div>`
                    : ""
                }
                <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style="color: var(--page-text-primary);">${escapeHtml(c.headline)}</h1>
                <p className="text-lg leading-relaxed sm:text-xl" style="color: var(--page-text-tertiary);">${escapeHtml(c.subheadline)}</p>
                <div className="flex flex-wrap gap-4 pt-2 ${hasImage ? "" : "justify-center"}">
                  <a href="${escapeHtml(c.primaryCtaLink || "#")}" className="inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 active:scale-95" style="background-color: var(--page-primary); border-radius: var(--page-radius-button);">${escapeHtml(c.primaryCtaText)}</a>
                  ${
                    c.secondaryCtaText
                      ? `<a href="${escapeHtml(c.secondaryCtaLink || "#")}" className="inline-flex items-center justify-center rounded-lg border px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:opacity-80 active:scale-95" style="border-color: var(--page-primary); color: var(--page-primary); border-radius: var(--page-radius-button);">${escapeHtml(c.secondaryCtaText)}</a>`
                      : ""
                  }
                </div>
              </div>
              ${
                hasImage
                  ? `<div className="flex-shrink-0 lg:flex-1">
                      <div className="overflow-hidden rounded-2xl shadow-2xl" style="border-radius: var(--page-radius-card);">
                        <img src="${escapeHtml(c.imageUrl!)}" alt="${escapeHtml(c.headline)}" className="h-auto w-full object-cover" />
                      </div>
                     </div>`
                  : ""
              }
            </div>
          </div>
        </section>
      `;
    }

    case "features": {
      const c = section.content;
      return `
        <section className="py-20 sm:py-28" style="background-color: var(--page-surface-brand);">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              ${
                c.eyebrow
                  ? `<div className="mb-4 flex items-center justify-center gap-3">
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest" style="color: var(--page-primary);">${escapeHtml(c.eyebrow)}</span>
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                     </div>`
                  : ""
              }
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--page-text-primary);">${escapeHtml(c.title)}</h2>
              ${c.description ? `<p className="mt-4 text-lg leading-relaxed" style="color: var(--page-text-tertiary);">${escapeHtml(c.description)}</p>` : ""}
            </div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              ${c.features
                .map(
                  (f) => `
                <div className="group flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md" style="background-color: var(--page-surface-base); border-color: var(--page-border-subtle); border-radius: var(--page-radius-card);">
                  ${f.icon ? `<div className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl" style="background-color: color-mix(in srgb, var(--page-primary) 12%, transparent); border-radius: var(--page-radius-card);">${escapeHtml(f.icon)}</div>` : ""}
                  <h3 className="text-lg font-semibold" style="color: var(--page-text-primary);">${escapeHtml(f.title)}</h3>
                  <p className="text-sm leading-relaxed" style="color: var(--page-text-tertiary);">${escapeHtml(f.description)}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "testimonials": {
      const c = section.content;
      return `
        <section className="py-20 sm:py-28" style="background-color: var(--page-surface-base);">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              ${
                c.eyebrow
                  ? `<div className="mb-4 flex items-center justify-center gap-3">
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest" style="color: var(--page-primary);">${escapeHtml(c.eyebrow)}</span>
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                     </div>`
                  : ""
              }
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--page-text-primary);">${escapeHtml(c.title)}</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              ${c.testimonials
                .map(
                  (t) => `
                <div className="flex flex-col gap-4 rounded-xl border p-6 transition-all duration-200 hover:shadow-md" style="border-color: var(--page-border-subtle); border-radius: var(--page-radius-card); background-color: var(--page-surface-base);">
                  <div className="text-4xl font-serif leading-none" style="color: var(--page-primary); opacity: 0.4;">&ldquo;</div>
                  <p className="flex-1 text-base leading-relaxed" style="color: var(--page-text-primary);">${escapeHtml(t.quote)}</p>
                  <div className="flex items-center gap-3 border-t pt-4" style="border-color: var(--page-border-subtle);">
                    ${
                      t.avatarUrl
                        ? `<img src="${escapeHtml(t.avatarUrl)}" alt="${escapeHtml(t.authorName)}" className="h-10 w-10 rounded-full object-cover" />`
                        : `<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style="background-color: var(--page-primary);">${escapeHtml(t.authorName.slice(0, 2).toUpperCase())}</div>`
                    }
                    <div>
                      <p className="text-sm font-semibold" style="color: var(--page-text-primary);">${escapeHtml(t.authorName)}</p>
                      ${t.authorRole ? `<p className="text-xs" style="color: var(--page-text-tertiary);">${escapeHtml(t.authorRole)}</p>` : ""}
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "pricing": {
      const c = section.content;
      return `
        <section className="py-20 sm:py-28" style="background-color: var(--page-surface-brand);">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              ${
                c.eyebrow
                  ? `<div className="mb-4 flex items-center justify-center gap-3">
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest" style="color: var(--page-primary);">${escapeHtml(c.eyebrow)}</span>
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                     </div>`
                  : ""
              }
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--page-text-primary);">${escapeHtml(c.title)}</h2>
              ${c.description ? `<p className="mt-4 text-lg leading-relaxed" style="color: var(--page-text-tertiary);">${escapeHtml(c.description)}</p>` : ""}
            </div>
            <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:justify-center">
              ${c.plans
                .map(
                  (p) => `
                <div className="relative flex flex-1 flex-col gap-6 rounded-xl border p-8 transition-all duration-200 hover:shadow-lg" style="max-width: 380px; background-color: ${p.isHighlighted ? "var(--page-primary)" : "var(--page-surface-base)"}; border-color: ${p.isHighlighted ? "var(--page-primary)" : "var(--page-border-subtle)"}; border-radius: var(--page-radius-card);">
                  ${p.isHighlighted ? `<div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="rounded-full px-4 py-1 text-xs font-semibold text-white shadow-md" style="background-color: rgba(0,0,0,0.2);">Most Popular</span></div>` : ""}
                  <div>
                    <h3 className="text-lg font-semibold" style="color: ${p.isHighlighted ? "#ffffff" : "var(--page-text-primary)"};">${escapeHtml(p.name)}</h3>
                    ${p.description ? `<p className="mt-1 text-sm leading-relaxed" style="color: ${p.isHighlighted ? "rgba(255,255,255,0.75)" : "var(--page-text-tertiary)"};">${escapeHtml(p.description)}</p>` : ""}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold tracking-tight" style="color: ${p.isHighlighted ? "#ffffff" : "var(--page-text-primary)"};">${escapeHtml(p.price)}</span>
                    ${p.period ? `<span className="mb-1 text-sm" style="color: ${p.isHighlighted ? "rgba(255,255,255,0.75)" : "var(--page-text-tertiary)"};">/${escapeHtml(p.period)}</span>` : ""}
                  </div>
                  <ul className="flex flex-col gap-3">
                    ${p.features.map((f) => `<li className="flex items-start gap-3"><span style="color: ${p.isHighlighted ? "#ffffff" : "var(--page-primary)"};">✓</span><span className="text-sm leading-snug" style="color: ${p.isHighlighted ? "rgba(255,255,255,0.85)" : "var(--page-text-primary)"};">${escapeHtml(f)}</span></li>`).join("")}
                  </ul>
                  <a href="#" className="mt-auto inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 hover:opacity-90" style="background-color: ${p.isHighlighted ? "#ffffff" : "var(--page-primary)"}; color: ${p.isHighlighted ? "var(--page-primary)" : "#ffffff"}; border-radius: var(--page-radius-button);">${escapeHtml(p.ctaText)}</a>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "cta": {
      const c = section.content;
      return `
        <section className="relative overflow-hidden py-20 sm:py-28" style="background-color: var(--page-surface-dark, #0B0F19);">
          <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">${escapeHtml(c.title)}</h2>
            ${c.description ? `<p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70">${escapeHtml(c.description)}</p>` : ""}
            <div className="mt-10">
              <a href="${escapeHtml(c.ctaLink || "#")}" className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90" style="background-color: var(--page-primary); border-radius: var(--page-radius-button);">${escapeHtml(c.ctaText)}</a>
            </div>
          </div>
        </section>
      `;
    }

    case "faq": {
      const c = section.content;
      return `
        <section className="py-20 sm:py-28" style="background-color: var(--page-surface-base);">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <div className="text-center">
              ${
                c.eyebrow
                  ? `<div className="mb-4 flex items-center justify-center gap-3">
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                      <span className="text-xs font-semibold uppercase tracking-widest" style="color: var(--page-primary);">${escapeHtml(c.eyebrow)}</span>
                      <span className="h-px w-8" style="background-color: var(--page-primary);"></span>
                     </div>`
                  : ""
              }
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style="color: var(--page-text-primary);">${escapeHtml(c.title)}</h2>
            </div>
            <div className="mt-12 flex flex-col divide-y" style="border-color: var(--page-border-subtle);">
              ${c.items
                .map(
                  (item) => `
                <details className="group py-4 cursor-pointer" style="border-color: var(--page-border-subtle);">
                  <summary className="flex items-center justify-between gap-4 font-semibold text-base sm:text-lg list-none" style="color: var(--page-text-primary);">
                    <span>${escapeHtml(item.question)}</span>
                    <span style="color: var(--page-primary);">&#9660;</span>
                  </summary>
                  <p className="mt-3 text-base leading-relaxed" style="color: var(--page-text-tertiary);">${escapeHtml(item.answer)}</p>
                </details>
              `
                )
                .join("")}
            </div>
          </div>
        </section>
      `;
    }

    case "footer": {
      const c = section.content;
      return `
        <footer className="border-t py-10" style="background-color: var(--page-surface-base); border-color: var(--page-border-subtle);">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <span className="text-lg font-bold tracking-tight" style="color: var(--page-primary);">${escapeHtml(c.brandName)}</span>
              ${
                c.links && c.links.length > 0
                  ? `<nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                      ${c.links.map((link) => `<a href="${escapeHtml(link.href)}" className="text-sm transition-colors duration-150 hover:opacity-80" style="color: var(--page-text-tertiary);">${escapeHtml(link.label)}</a>`).join("")}
                     </nav>`
                  : ""
              }
              <p className="text-sm" style="color: var(--page-text-tertiary);">${escapeHtml(c.copyright)}</p>
            </div>
          </div>
        </footer>
      `;
    }

    default:
      return "";
  }
}

function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
