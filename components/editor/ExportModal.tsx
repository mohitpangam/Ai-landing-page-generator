"use client";

import { useState } from "react";
import { useEditorStore } from "@/lib/editor/store";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { projectId, schema } = useEditorStore();
  const [format, setFormat] = useState<"nextjs" | "html">("nextjs");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!projectId) return;
    setIsExporting(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, schema }),
      });

      if (!res.ok) throw new Error("Export request failed");

      // Extract filename from header or fallback
      const filename =
        format === "html" ? "landing-page.html" : "landing-page-nextjs.zip";

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to generate export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border-subtle bg-surface-base shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div>
            <h2 id="export-modal-title" className="text-lg font-bold text-text-primary">
              Export Landing Page
            </h2>
            <p className="text-xs text-text-tertiary">
              Download production-ready code for your website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export modal"
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Export Options */}
        <div className="flex flex-col gap-3 p-6">
          {/* Option 1: Next.js Zip */}
          <button
            type="button"
            onClick={() => setFormat("nextjs")}
            aria-pressed={format === "nextjs"}
            className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
              format === "nextjs"
                ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20"
                : "border-border-subtle hover:border-gray-300 bg-surface-base"
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-black text-white font-bold text-sm">
              N
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">
                  Next.js + Tailwind App (.zip)
                </h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                Full standalone Next.js 15 project with modular section components, Tailwind CSS v4 design tokens, and package.json.
              </p>
            </div>
          </button>

          {/* Option 2: Standalone HTML */}
          <button
            type="button"
            onClick={() => setFormat("html")}
            aria-pressed={format === "html"}
            className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-150 ${
              format === "html"
                ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20"
                : "border-border-subtle hover:border-gray-300 bg-surface-base"
            }`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-sm">
              &lt;/&gt;
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">
                Single-File HTML & CSS (.html)
              </h3>
              <p className="text-xs text-text-tertiary mt-1 leading-relaxed">
                Self-contained HTML file with Tailwind CDN, Google Fonts, and OpenGraph tags. Opens directly in any browser with zero setup.
              </p>
            </div>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border-subtle bg-surface-brand px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-primary-hover active:scale-95 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 animate-spin" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" />
                </svg>
                Generating Export…
              </>
            ) : (
              <>
                <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M7 1v8M4 6l3 3 3-3M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
