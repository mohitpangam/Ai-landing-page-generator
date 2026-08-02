"use client";

import { useState, useEffect } from "react";
import { useEditorStore } from "@/lib/editor/store";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PublishModal({ isOpen, onClose }: PublishModalProps) {
  const { projectId } = useEditorStore();
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !projectId) return;
    setIsLoading(true);
    fetch(`/api/projects/${projectId}/publish`)
      .then((res) => res.json())
      .then((data) => {
        setIsPublished(data.isPublished ?? false);
        setSlug(data.slug ?? "");
        setPublishedUrl(data.publishedUrl ?? `/p/${data.slug}`);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${publishedUrl}`
      : publishedUrl;

  const togglePublish = async (state: boolean) => {
    if (!projectId) return;
    setIsPublishing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: state }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setIsPublished(data.isPublished);
    } catch (err) {
      console.error(err);
      alert("Failed to update publish status");
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border-subtle bg-surface-base shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 id="publish-modal-title" className="text-lg font-bold text-text-primary">
              Publish Landing Page
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isPublished
                  ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30"
                  : "bg-gray-100 text-text-tertiary"
              }`}
            >
              {isPublished ? "Live ●" : "Draft"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close publish modal"
            className="rounded-lg p-1.5 text-text-tertiary hover:bg-surface-brand hover:text-text-primary transition-colors"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-5 p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <svg viewBox="0 0 16 16" className="h-6 w-6 animate-spin text-brand-primary" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" />
              </svg>
            </div>
          ) : (
            <>
              {isPublished ? (
                <div className="flex flex-col gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700">
                      🎉 Your page is live on the web!
                    </span>
                    <a
                      href={publishedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      Visit Page ↗
                    </a>
                  </div>

                  {/* URL Input + Copy button */}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      readOnly
                      value={fullUrl}
                      className="w-full rounded-lg border border-border-subtle bg-surface-base px-3 py-2 text-xs text-text-primary font-mono select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="flex-shrink-0 rounded-lg bg-brand-primary px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-brand-primary-hover transition-colors"
                    >
                      {copied ? "Copied ✓" : "Copy Link"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border-subtle bg-surface-brand p-4 text-xs text-text-tertiary leading-relaxed">
                  <p className="font-semibold text-text-primary mb-1">
                    Ready to launch your landing page?
                  </p>
                  Publishing will create a public link at{" "}
                  <strong className="text-text-primary font-mono">/p/{slug}</strong> that anyone can visit!
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border-subtle bg-surface-brand px-6 py-4">
          {isPublished ? (
            <button
              type="button"
              disabled={isPublishing}
              onClick={() => togglePublish(false)}
              className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              Unpublish (Back to Draft)
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-text-tertiary hover:text-text-primary transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isPublishing || isLoading}
              onClick={() => togglePublish(!isPublished)}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                isPublished
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-brand-primary hover:bg-brand-primary-hover"
              }`}
            >
              {isPublishing ? (
                <>
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 animate-spin" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" />
                  </svg>
                  Updating…
                </>
              ) : isPublished ? (
                "Update Live Page"
              ) : (
                "Publish Live Page"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
