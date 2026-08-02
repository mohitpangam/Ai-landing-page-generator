"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/editor/store";
import type { Section } from "@/lib/schema/page";
import { SectionLibraryDrawer } from "./SectionLibraryDrawer";

const SECTION_LABELS: Record<Section["type"], string> = {
  hero: "Hero",
  features: "Features",
  testimonials: "Testimonials",
  pricing: "Pricing",
  cta: "Call to Action",
  faq: "FAQ",
  footer: "Footer",
};

const SECTION_ICONS: Record<Section["type"], string> = {
  hero: "✦",
  features: "⚡",
  testimonials: "💬",
  pricing: "💳",
  cta: "🎯",
  faq: "❓",
  footer: "📌",
};

// ─── Sortable section item ─────────────────────────────────────────────────────
function SortableSectionItem({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const { selectedSectionId, selectSection, deleteSection } = useEditorStore();
  const isSelected = selectedSectionId === section.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer transition-all duration-100 ${
        isSelected
          ? "bg-brand-primary/10 border border-brand-primary/30"
          : "hover:bg-surface-brand border border-transparent"
      }`}
      onClick={() => selectSection(isSelected ? null : section.id)}
      role="button"
      tabIndex={0}
      aria-label={`Select ${SECTION_LABELS[section.type]} section`}
      aria-pressed={isSelected}
      onKeyDown={(e) => e.key === "Enter" && selectSection(isSelected ? null : section.id)}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0 cursor-grab touch-none text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing"
      >
        <svg viewBox="0 0 10 16" className="h-4 w-2.5" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="3" r="1.5" />
          <circle cx="7" cy="3" r="1.5" />
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="7" cy="8" r="1.5" />
          <circle cx="3" cy="13" r="1.5" />
          <circle cx="7" cy="13" r="1.5" />
        </svg>
      </button>

      {/* Icon */}
      <span className="text-base leading-none flex-shrink-0">
        {SECTION_ICONS[section.type]}
      </span>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            isSelected ? "text-brand-primary" : "text-text-primary"
          }`}
        >
          {SECTION_LABELS[section.type]}
        </p>
        <p className="text-xs text-text-tertiary truncate">#{index + 1}</p>
      </div>

      {/* Delete */}
      <button
        type="button"
        aria-label={`Delete ${SECTION_LABELS[section.type]} section`}
        onClick={(e) => {
          e.stopPropagation();
          deleteSection(section.id);
        }}
        className="flex-shrink-0 rounded p-1 text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all"
      >
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
          <path d="M2 4h10M5 4V2.5A.5.5 0 015.5 2h3a.5.5 0 01.5.5V4M6 7v4M8 7v4M3 4l.75 7.5A.75.75 0 004.5 12h5a.75.75 0 00.75-.5L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

// ─── SectionList ──────────────────────────────────────────────────────────────
export function SectionList() {
  const { schema, moveSection } = useEditorStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const sections = schema.sections;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = sections.findIndex((s) => s.id === active.id);
    const toIndex = sections.findIndex((s) => s.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      moveSection(fromIndex, toIndex);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
            Sections
          </span>
          <span className="text-xs text-text-tertiary">({sections.length})</span>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center gap-1 rounded-md bg-brand-primary/10 px-2 py-1 text-xs font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
          title="Add a new section"
        >
          <svg viewBox="0 0 14 14" className="h-3 w-3" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add
        </button>
      </div>

      {/* Sortable list */}
      <div className="flex-1 overflow-y-auto p-2">
        {sections.length === 0 ? (
          <p className="px-2 py-4 text-xs text-text-tertiary text-center">
            No sections yet
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-1">
                {sections.map((section, index) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Bottom Add Section action bar */}
      <div className="p-2 border-t border-border-subtle flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border-subtle py-2 text-xs font-semibold text-text-tertiary hover:border-brand-primary hover:text-brand-primary hover:bg-surface-brand transition-colors"
        >
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Section
        </button>
      </div>

      {/* Section Library Modal */}
      <SectionLibraryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
