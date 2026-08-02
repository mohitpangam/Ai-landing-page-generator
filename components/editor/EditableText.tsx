"use client";

import React, { useContext, useRef } from "react";
import { PageRendererContext } from "@/components/PageRendererContext";
import { useEditorStore } from "@/lib/editor/store";

interface EditableTextProps {
  sectionId: string;
  /** Callback to produce updated content object given the new string value */
  updateFn: (newValue: string) => unknown;
  value: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableText({
  sectionId,
  updateFn,
  value,
  as: Component = "span",
  className = "",
  style,
  placeholder = "Type here...",
  multiline = false,
}: EditableTextProps) {
  const { isEditable } = useContext(PageRendererContext);
  const { updateSectionContent } = useEditorStore();
  const elementRef = useRef<HTMLElement>(null);

  if (!isEditable) {
    return <Component className={className} style={style}>{value}</Component>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const text = e.currentTarget.textContent ?? "";
    if (text !== value) {
      const newContent = updateFn(text);
      updateSectionContent(sectionId, newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      if (elementRef.current) {
        elementRef.current.textContent = value;
      }
      e.currentTarget.blur();
    }
  };

  return (
    <Component
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      className={`${className} outline-none cursor-text transition-all focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-xs hover:ring-1 hover:ring-brand-primary/40`}
      style={style}
      data-placeholder={placeholder}
    >
      {value}
    </Component>
  );
}
