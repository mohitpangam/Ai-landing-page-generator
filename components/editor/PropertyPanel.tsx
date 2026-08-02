"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/editor/store";
import type { Section, ThemeTokens } from "@/lib/schema/page";

// ─── Shared field components ──────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors";

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`${inputCls} resize-none`}
    />
  );
}

// ─── Hero properties ──────────────────────────────────────────────────────────
function HeroProps({ section }: { section: Extract<Section, { type: "hero" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Eyebrow">
        <TextInput value={c.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v })} placeholder="Optional label" />
      </Field>
      <Field label="Headline">
        <TextArea value={c.headline} onChange={(v) => update({ headline: v })} rows={2} />
      </Field>
      <Field label="Subheadline">
        <TextArea value={c.subheadline} onChange={(v) => update({ subheadline: v })} rows={3} />
      </Field>
      <Field label="Primary CTA text">
        <TextInput value={c.primaryCtaText} onChange={(v) => update({ primaryCtaText: v })} />
      </Field>
      <Field label="Primary CTA link">
        <TextInput value={c.primaryCtaLink ?? ""} onChange={(v) => update({ primaryCtaLink: v })} placeholder="https://…" />
      </Field>
      <Field label="Secondary CTA text">
        <TextInput value={c.secondaryCtaText ?? ""} onChange={(v) => update({ secondaryCtaText: v })} placeholder="Optional" />
      </Field>
      <Field label="Hero image URL">
        <TextInput value={c.imageUrl ?? ""} onChange={(v) => update({ imageUrl: v })} placeholder="https://…" />
      </Field>
    </div>
  );
}

// ─── Features properties ─────────────────────────────────────────────────────
function FeaturesProps({ section }: { section: Extract<Section, { type: "features" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Eyebrow"><TextInput value={c.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v })} /></Field>
      <Field label="Title"><TextInput value={c.title} onChange={(v) => update({ title: v })} /></Field>
      <Field label="Description"><TextArea value={c.description ?? ""} onChange={(v) => update({ description: v })} /></Field>
      <div className="border-t border-border-subtle pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Feature cards</p>
        {c.features.map((feat, idx) => (
          <div key={feat.id} className="mb-4 rounded-lg border border-border-subtle p-3">
            <p className="mb-2 text-xs font-medium text-text-tertiary">Card {idx + 1}</p>
            <div className="flex flex-col gap-2">
              <TextInput value={feat.icon ?? ""} onChange={(v) => {
                const features = c.features.map((f, i) => i === idx ? { ...f, icon: v } : f);
                update({ features });
              }} placeholder="Emoji icon" />
              <TextInput value={feat.title} onChange={(v) => {
                const features = c.features.map((f, i) => i === idx ? { ...f, title: v } : f);
                update({ features });
              }} placeholder="Title" />
              <TextArea rows={2} value={feat.description} onChange={(v) => {
                const features = c.features.map((f, i) => i === idx ? { ...f, description: v } : f);
                update({ features });
              }} placeholder="Description" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials properties ──────────────────────────────────────────────────
function TestimonialsProps({ section }: { section: Extract<Section, { type: "testimonials" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Eyebrow"><TextInput value={c.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v })} /></Field>
      <Field label="Title"><TextInput value={c.title} onChange={(v) => update({ title: v })} /></Field>
      <div className="border-t border-border-subtle pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Testimonials</p>
        {c.testimonials.map((t, idx) => (
          <div key={t.id} className="mb-4 rounded-lg border border-border-subtle p-3">
            <p className="mb-2 text-xs font-medium text-text-tertiary">#{idx + 1}</p>
            <div className="flex flex-col gap-2">
              <TextArea rows={3} value={t.quote} onChange={(v) => {
                const testimonials = c.testimonials.map((x, i) => i === idx ? { ...x, quote: v } : x);
                update({ testimonials });
              }} placeholder="Quote" />
              <TextInput value={t.authorName} onChange={(v) => {
                const testimonials = c.testimonials.map((x, i) => i === idx ? { ...x, authorName: v } : x);
                update({ testimonials });
              }} placeholder="Author name" />
              <TextInput value={t.authorRole ?? ""} onChange={(v) => {
                const testimonials = c.testimonials.map((x, i) => i === idx ? { ...x, authorRole: v } : x);
                update({ testimonials });
              }} placeholder="Role (optional)" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pricing properties ───────────────────────────────────────────────────────
function PricingProps({ section }: { section: Extract<Section, { type: "pricing" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Eyebrow"><TextInput value={c.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v })} /></Field>
      <Field label="Title"><TextInput value={c.title} onChange={(v) => update({ title: v })} /></Field>
      <div className="border-t border-border-subtle pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Plans</p>
        {c.plans.map((plan, idx) => (
          <div key={plan.id} className="mb-4 rounded-lg border border-border-subtle p-3">
            <p className="mb-2 text-xs font-medium text-text-tertiary">{plan.name || `Plan ${idx + 1}`}</p>
            <div className="flex flex-col gap-2">
              <TextInput value={plan.name} onChange={(v) => {
                const plans = c.plans.map((p, i) => i === idx ? { ...p, name: v } : p);
                update({ plans });
              }} placeholder="Plan name" />
              <TextInput value={plan.price} onChange={(v) => {
                const plans = c.plans.map((p, i) => i === idx ? { ...p, price: v } : p);
                update({ plans });
              }} placeholder="Price (e.g. $29)" />
              <TextInput value={plan.ctaText} onChange={(v) => {
                const plans = c.plans.map((p, i) => i === idx ? { ...p, ctaText: v } : p);
                update({ plans });
              }} placeholder="CTA text" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CTA properties ───────────────────────────────────────────────────────────
function CtaProps({ section }: { section: Extract<Section, { type: "cta" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Title"><TextArea rows={2} value={c.title} onChange={(v) => update({ title: v })} /></Field>
      <Field label="Description"><TextArea value={c.description ?? ""} onChange={(v) => update({ description: v })} /></Field>
      <Field label="CTA button text"><TextInput value={c.ctaText} onChange={(v) => update({ ctaText: v })} /></Field>
      <Field label="CTA link"><TextInput value={c.ctaLink ?? ""} onChange={(v) => update({ ctaLink: v })} placeholder="https://…" /></Field>
    </div>
  );
}

// ─── FAQ properties ───────────────────────────────────────────────────────────
function FaqProps({ section }: { section: Extract<Section, { type: "faq" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Eyebrow"><TextInput value={c.eyebrow ?? ""} onChange={(v) => update({ eyebrow: v })} /></Field>
      <Field label="Title"><TextInput value={c.title} onChange={(v) => update({ title: v })} /></Field>
      <div className="border-t border-border-subtle pt-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">FAQ items</p>
        {c.items.map((item, idx) => (
          <div key={item.id} className="mb-4 rounded-lg border border-border-subtle p-3">
            <p className="mb-2 text-xs font-medium text-text-tertiary">Q{idx + 1}</p>
            <div className="flex flex-col gap-2">
              <TextInput value={item.question} onChange={(v) => {
                const items = c.items.map((x, i) => i === idx ? { ...x, question: v } : x);
                update({ items });
              }} placeholder="Question" />
              <TextArea rows={3} value={item.answer} onChange={(v) => {
                const items = c.items.map((x, i) => i === idx ? { ...x, answer: v } : x);
                update({ items });
              }} placeholder="Answer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Footer properties ────────────────────────────────────────────────────────
function FooterProps({ section }: { section: Extract<Section, { type: "footer" }> }) {
  const { updateSectionContent } = useEditorStore();
  const c = section.content;
  const update = (patch: Partial<typeof c>) =>
    updateSectionContent(section.id, { ...c, ...patch });

  return (
    <div className="flex flex-col gap-4">
      <Field label="Brand name"><TextInput value={c.brandName} onChange={(v) => update({ brandName: v })} /></Field>
      <Field label="Copyright"><TextInput value={c.copyright} onChange={(v) => update({ copyright: v })} /></Field>
    </div>
  );
}

// ─── Theme tab ────────────────────────────────────────────────────────────────
const SWATCHES = [
  { label: "Indigo", value: "#3D5AFE", hover: "#2E46DB" },
  { label: "Teal", value: "#14B8A6", hover: "#0D9488" },
  { label: "Coral", value: "#F97066", hover: "#EF4444" },
  { label: "Violet", value: "#7C3AED", hover: "#6D28D9" },
  { label: "Magenta", value: "#D946EF", hover: "#C026D3" },
  { label: "Near-black", value: "#1E293B", hover: "#0F172A" },
];

const RADII: { label: string; value: ThemeTokens["borderRadius"] }[] = [
  { label: "None", value: "none" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
  { label: "Full", value: "full" },
];

function ThemeTab() {
  const { schema, updateTheme } = useEditorStore();
  const theme = schema.theme;

  return (
    <div className="flex flex-col gap-6">
      {/* Color swatches */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Primary colour
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SWATCHES.map((swatch) => {
            const isActive = theme.primary === swatch.value;
            return (
              <button
                key={swatch.value}
                type="button"
                title={swatch.label}
                aria-label={`${swatch.label} theme`}
                aria-pressed={isActive}
                onClick={() =>
                  updateTheme({
                    primary: swatch.value,
                    primaryHover: swatch.hover,
                    textAccent: swatch.value,
                  })
                }
                className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all duration-150 ${
                  isActive
                    ? "border-brand-primary ring-2 ring-brand-primary/30"
                    : "border-border-subtle hover:border-gray-300"
                }`}
              >
                <span
                  className="h-7 w-7 rounded-full shadow-sm"
                  style={{ backgroundColor: swatch.value }}
                />
                <span className="text-xs text-text-tertiary">{swatch.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Border radius
        </p>
        <div className="flex flex-wrap gap-2">
          {RADII.map((r) => (
            <button
              key={r.value}
              type="button"
              aria-pressed={theme.borderRadius === r.value}
              onClick={() => updateTheme({ borderRadius: r.value })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                theme.borderRadius === r.value
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-border-subtle text-text-primary hover:bg-surface-brand"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Content dispatcher ───────────────────────────────────────────────────────
function ContentTab({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":         return <HeroProps section={section} />;
    case "features":     return <FeaturesProps section={section} />;
    case "testimonials": return <TestimonialsProps section={section} />;
    case "pricing":      return <PricingProps section={section} />;
    case "cta":          return <CtaProps section={section} />;
    case "faq":          return <FaqProps section={section} />;
    case "footer":       return <FooterProps section={section} />;
    default:             return <p className="text-sm text-text-tertiary">Unknown section type.</p>;
  }
}

// ─── PropertyPanel ────────────────────────────────────────────────────────────
type PanelTab = "content" | "theme";

export function PropertyPanel() {
  const { schema, selectedSectionId } = useEditorStore();
  const [activeTab, setActiveTab] = useState<PanelTab>("content");

  const selectedSection = schema.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b border-border-subtle">
        {(["content", "theme"] as PanelTab[]).map((tab) => (
          <button
            key={tab}
            id={`panel-tab-${tab}`}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-colors duration-150 border-b-2 ${
              activeTab === tab
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-text-tertiary hover:text-text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "theme" ? (
          <ThemeTab />
        ) : selectedSection ? (
          <ContentTab section={selectedSection} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="mb-3 text-3xl">👈</span>
            <p className="text-sm font-medium text-text-primary">
              Click a section to edit
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              Or use the Theme tab to change colours and style.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
