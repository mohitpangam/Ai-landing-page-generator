"use client";

import { useState, useRef, useEffect } from "react";

interface AiRewriteButtonProps {
  currentText: string;
  onApply: (newText: string) => void;
  label?: string;
}

const TONES = [
  { id: "punchy", label: "🚀 Punchy & High-Converting" },
  { id: "professional", label: "💼 Professional & Formal" },
  { id: "short", label: "✂️ Shorten & Simplify" },
  { id: "expand", label: "✨ Expand & Detail" },
];

export function AiRewriteButton({ currentText, onApply, label = "AI Rewrite" }: AiRewriteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleRewrite = async (tone: string, custom?: string) => {
    if (!currentText.trim()) return;
    setLoading(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentText,
          tone,
          customInstruction: custom,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
      alert("AI Rewrite failed. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (text: string) => {
    onApply(text);
    setIsOpen(false);
    setSuggestions([]);
    setShowCustomInput(false);
  };

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Rewrite with AI"
        aria-label="Rewrite copy with AI"
        className="inline-flex items-center gap-1 rounded-md bg-brand-primary/10 px-2 py-0.5 text-[11px] font-semibold text-brand-primary hover:bg-brand-primary/20 transition-colors"
      >
        <span className="text-xs">✨</span>
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-7 z-50 w-72 rounded-xl border border-border-subtle bg-surface-base p-3 shadow-xl ring-1 ring-black/5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2">
            <span className="text-xs font-bold text-text-primary flex items-center gap-1">
              ✨ AI Copy Assistant
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-text-tertiary hover:text-text-primary text-xs"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <svg viewBox="0 0 16 16" className="h-5 w-5 animate-spin text-brand-primary" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="10 20" />
              </svg>
              <span className="text-xs text-text-tertiary animate-pulse">
                Crafting variations with Gemini…
              </span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-text-tertiary">
                Choose a variation:
              </span>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className="group flex flex-col text-left rounded-lg border border-border-subtle p-2.5 hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
                >
                  <span className="text-xs text-text-primary leading-snug group-hover:text-brand-primary">
                    {suggestion}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply copy ↵
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSuggestions([])}
                className="mt-1 text-center text-xs font-semibold text-text-tertiary hover:text-text-primary"
              >
                ← Back to options
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleRewrite(t.id)}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-text-primary hover:bg-surface-brand hover:text-brand-primary font-medium transition-colors"
                >
                  {t.label}
                </button>
              ))}

              {showCustomInput ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (customPrompt.trim()) handleRewrite("custom", customPrompt.trim());
                  }}
                  className="mt-1 flex flex-col gap-1.5 pt-1 border-t border-border-subtle"
                >
                  <input
                    type="text"
                    placeholder="e.g. Add emojis, translate to Spanish"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full rounded-md border border-border-subtle bg-surface-base px-2 py-1 text-xs text-text-primary focus:border-brand-primary outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-brand-primary py-1 text-xs font-semibold text-white hover:bg-brand-primary-hover transition-colors"
                  >
                    Generate ✨
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs text-text-tertiary hover:bg-surface-brand hover:text-text-primary font-medium transition-colors"
                >
                  🪄 Custom Instruction…
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
