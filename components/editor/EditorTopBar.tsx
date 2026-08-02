"use client";

import { useState } from "react";
import Link from "next/link";
import { useEditorStore } from "@/lib/editor/store";
import { VersionHistoryDrawer } from "./VersionHistoryDrawer";
import { ExportModal } from "./ExportModal";

interface Props {
  projectName: string;
  user: { name?: string | null; image?: string | null };
}

const VIEWPORTS = [
  {
    id: "desktop" as const,
    label: "Desktop",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <rect x="2" y="3" width="16" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 17h6M10 14v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tablet" as const,
    label: "Tablet",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <rect x="3" y="1.5" width="14" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "mobile" as const,
    label: "Mobile",
    icon: (
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
        <rect x="5" y="1.5" width="10" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export function EditorTopBar({ projectName, user }: Props) {
  const { viewport, setViewport, undo, redo, canUndo, canRedo, saveStatus } =
    useEditorStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "error"
      ? "Save failed"
      : saveStatus === "unsaved"
      ? "Unsaved changes"
      : "Saved ✓";

  const saveLabelColor =
    saveStatus === "error"
      ? "text-red-500"
      : saveStatus === "unsaved" || saveStatus === "saving"
      ? "text-text-tertiary"
      : "text-emerald-600";

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border-subtle bg-surface-base px-4">
        {/* Left: back + project name */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex-shrink-0 rounded-md p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
            aria-label="Back to dashboard"
            title="Back to dashboard"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <span className="h-4 w-px bg-border-subtle flex-shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-brand-primary text-white text-xs font-bold">
              AI
            </span>
            <span className="truncate text-sm font-semibold text-text-primary max-w-[180px]">
              {projectName}
            </span>
          </div>
        </div>

        {/* Center: viewport switcher */}
        <div className="flex items-center rounded-lg border border-border-subtle bg-surface-base p-1 gap-0.5">
          {VIEWPORTS.map((vp) => (
            <button
              key={vp.id}
              id={`viewport-${vp.id}`}
              type="button"
              title={vp.label}
              aria-label={`Switch to ${vp.label} preview`}
              aria-pressed={viewport === vp.id}
              onClick={() => setViewport(vp.id)}
              className={`flex items-center justify-center rounded-md p-1.5 transition-all duration-150 ${
                viewport === vp.id
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-text-tertiary hover:text-text-primary hover:bg-surface-brand"
              }`}
            >
              {vp.icon}
            </button>
          ))}
        </div>

        {/* Right: undo/redo + save status + version history + actions */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              id="undo-btn"
              type="button"
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
              disabled={!canUndo()}
              onClick={undo}
              className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M3 7H10a4 4 0 010 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              id="redo-btn"
              type="button"
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
              disabled={!canRedo()}
              onClick={redo}
              className="rounded-md p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M13 7H6A4 4 0 106 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <span className="h-4 w-px bg-border-subtle" />

          {/* Save status */}
          <span className={`text-xs font-medium tabular-nums whitespace-nowrap ${saveLabelColor}`}>
            {saveLabel}
          </span>

          {/* Version History Button */}
          <button
            id="version-history-btn"
            type="button"
            onClick={() => setIsHistoryOpen(true)}
            title="Version History"
            aria-label="Open Version History"
            className="flex items-center gap-1 rounded-md p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.5V8l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <span className="h-4 w-px bg-border-subtle" />

          {/* Export Button */}
          <button
            id="export-btn"
            type="button"
            onClick={() => setIsExportOpen(true)}
            title="Export Code"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-brand transition-colors"
          >
            <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
              <path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Export
          </button>

          {/* User avatar */}
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "User"}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-border-subtle"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-white text-xs font-semibold">
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>
      </header>

      {/* Version History Drawer */}
      <VersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </>
  );
}

