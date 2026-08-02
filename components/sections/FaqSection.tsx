"use client";

import { useState } from "react";
import type { FaqSection as FaqSectionProps } from "@/lib/schema/page";
import { EditableText } from "@/components/editor/EditableText";

interface Props {
  section: FaqSectionProps;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 7.5l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqSection({ section }: Props) {
  const { content } = section;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="py-20 @sm:py-28"
      style={{ backgroundColor: "var(--page-surface-base)" }}
    >
      <div className="mx-auto max-w-3xl px-6 @lg:px-8">
        {/* Header */}
        <div className="text-center">
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
        </div>

        {/* Accordion */}
        <div className="mt-12 flex flex-col divide-y" style={{ borderColor: "var(--page-border-subtle)" }}>
          {content.items.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="first:border-t" style={{ borderColor: "var(--page-border-subtle)" }}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-150"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({
                      ...content,
                      items: content.items.map((x, i) => (i === idx ? { ...x, question: v } : x)),
                    })}
                    value={item.question}
                    as="span"
                    className="text-base font-semibold @sm:text-lg"
                    style={{ color: "var(--page-text-primary)" }}
                  />
                  <span style={{ color: "var(--page-primary)" }}>
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>

                <div
                  id={`faq-answer-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "600px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <EditableText
                    sectionId={section.id}
                    updateFn={(v) => ({
                      ...content,
                      items: content.items.map((x, i) => (i === idx ? { ...x, answer: v } : x)),
                    })}
                    value={item.answer}
                    as="p"
                    multiline
                    className="pb-5 text-base leading-relaxed"
                    style={{ color: "var(--page-text-tertiary)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
