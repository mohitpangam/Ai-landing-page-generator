"use client";

import { useEditorStore } from "@/lib/editor/store";
import { PageRenderer } from "@/components/PageRenderer";

const VIEWPORT_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export function EditorCanvas() {
  const { schema, viewport, selectedSectionId, selectSection } = useEditorStore();

  const canvasWidth = VIEWPORT_WIDTHS[viewport];
  const isConstrained = viewport !== "desktop";

  return (
    <div className="flex flex-1 flex-col items-center overflow-auto p-6">
      {/* Viewport label */}
      {isConstrained && (
        <div className="mb-3 rounded-full border border-border-subtle bg-surface-base px-3 py-1 text-xs font-medium text-text-tertiary">
          {viewport === "tablet" ? "768px — Tablet" : "375px — Mobile"}
        </div>
      )}

      {/* Canvas shell */}
      <div
        className="relative w-full flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/10 transition-all duration-300"
        style={{ maxWidth: canvasWidth }}
      >
        {/* Section click interceptors */}
        <div className="relative">
          {schema.sections.map((section) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <div
                key={section.id}
                className="relative"
                onClick={() => selectSection(isSelected ? null : section.id)}
                role="button"
                tabIndex={-1}
                aria-label={`Select ${section.type} section`}
              >
                {/* Selection ring */}
                {isSelected && (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-sm ring-2 ring-brand-primary ring-inset"
                    aria-hidden="true"
                  />
                )}
                {/* Hover ring (CSS-only) */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 rounded-sm ring-2 ring-transparent ring-inset transition-all duration-150 group-hover:ring-brand-primary/30"
                  aria-hidden="true"
                />

                {/* Render single section through PageRenderer */}
                <PageRenderer
                  schema={{ ...schema, sections: [section] }}
                  isEditable={true}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-16 flex-shrink-0" />
    </div>
  );
}
