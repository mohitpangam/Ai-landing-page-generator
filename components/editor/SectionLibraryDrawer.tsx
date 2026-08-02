"use client";

import { useEditorStore } from "@/lib/editor/store";
import {
  SECTION_TEMPLATES_META,
  createDefaultSection,
} from "@/lib/editor/sectionTemplates";
import type { Section } from "@/lib/schema/page";

interface SectionLibraryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  insertIndex?: number;
}

export function SectionLibraryDrawer({
  isOpen,
  onClose,
  insertIndex,
}: SectionLibraryDrawerProps) {
  const { addSection } = useEditorStore();

  if (!isOpen) return null;

  const handleAdd = (type: Section["type"]) => {
    const newSection = createDefaultSection(type);
    addSection(newSection, insertIndex);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="section-library-title"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border-subtle bg-surface-base shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h2 id="section-library-title" className="text-lg font-bold text-text-primary">
              Add a Section
            </h2>
            <p className="text-xs text-text-tertiary">
              Choose a section block to add to your landing page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close section library"
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Templates grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 max-h-[70vh] overflow-y-auto">
          {SECTION_TEMPLATES_META.map((tmpl) => (
            <button
              key={tmpl.type}
              type="button"
              onClick={() => handleAdd(tmpl.type)}
              className="group flex flex-col gap-2 rounded-xl border border-border-subtle bg-surface-base p-4 text-left transition-all duration-150 hover:border-brand-primary hover:bg-surface-brand hover:shadow-md active:scale-98"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary font-bold text-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  {tmpl.icon}
                </span>
                <span className="text-xs font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  + Add
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                  {tmpl.label}
                </h3>
                <p className="text-xs text-text-tertiary mt-0.5 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
