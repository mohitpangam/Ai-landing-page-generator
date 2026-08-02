"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditorStore } from "@/lib/editor/store";
import type { PageSchema } from "@/lib/schema/page";

interface VersionItem {
  id: string;
  isAutosave: boolean;
  createdAt: string;
  schema: PageSchema;
}

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function VersionHistoryDrawer({
  isOpen,
  onClose,
}: VersionHistoryDrawerProps) {
  const { projectId, restoreSchema } = useEditorStore();
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`);
      const data = await res.json();
      setVersions(data.versions ?? []);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, fetchVersions]);

  if (!isOpen) return null;

  const handleRestore = (ver: VersionItem) => {
    setRestoringId(ver.id);
    restoreSchema(ver.schema);
    setRestoringId(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="version-history-title"
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-border-subtle bg-surface-base shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4 flex-shrink-0">
          <div>
            <h2 id="version-history-title" className="text-lg font-bold text-text-primary">
              Version History
            </h2>
            <p className="text-xs text-text-tertiary">
              Restore past snapshots of your page.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close version history"
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-surface-brand border border-border-subtle"
                />
              ))}
            </div>
          ) : versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-2 text-2xl">⏳</span>
              <p className="text-sm font-medium text-text-primary">No saved versions yet</p>
              <p className="mt-1 text-xs text-text-tertiary">
                Edits automatically save snapshots here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {versions.map((ver, idx) => {
                const sectionCount = ver.schema?.sections?.length ?? 0;
                const isLatest = idx === 0;

                return (
                  <div
                    key={ver.id}
                    className={`flex flex-col gap-2 rounded-xl border p-4 transition-all duration-150 ${
                      isLatest
                        ? "border-brand-primary/40 bg-brand-primary/5"
                        : "border-border-subtle bg-surface-base hover:bg-surface-brand"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            ver.isAutosave
                              ? "bg-surface-brand text-text-tertiary"
                              : "bg-brand-primary text-white"
                          }`}
                        >
                          {ver.isAutosave ? "Autosave" : "Manual Save"}
                        </span>
                        {isLatest && (
                          <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-text-tertiary">
                        {timeAgo(ver.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-text-tertiary">
                        {sectionCount} {sectionCount === 1 ? "section" : "sections"}
                      </p>
                      {!isLatest && (
                        <button
                          type="button"
                          disabled={restoringId === ver.id}
                          onClick={() => handleRestore(ver)}
                          className="rounded-lg bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-xs hover:bg-brand-primary-hover active:scale-95 transition-all disabled:opacity-50"
                        >
                          {restoringId === ver.id ? "Restoring…" : "Restore"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
