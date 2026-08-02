"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Style hint chips ─────────────────────────────────────────────────────────
const STYLE_HINTS = [
  { label: "Minimal", emoji: "✦" },
  { label: "Bold", emoji: "⚡" },
  { label: "Playful", emoji: "🎨" },
  { label: "Corporate", emoji: "🏢" },
  { label: "Dark", emoji: "🌑" },
  { label: "Indigo", emoji: "💜" },
  { label: "Teal", emoji: "🩵" },
  { label: "Coral", emoji: "🪸" },
  { label: "Violet", emoji: "🔮" },
  { label: "Vibrant", emoji: "🌈" },
];

// ─── Loading stage messages ───────────────────────────────────────────────────
const LOADING_STAGES = [
  { message: "Analyzing your prompt…", icon: "🔍" },
  { message: "Designing page layout…", icon: "📐" },
  { message: "Writing compelling copy…", icon: "✍️" },
  { message: "Applying your theme…", icon: "🎨" },
  { message: "Building section content…", icon: "🧱" },
  { message: "Polishing the details…", icon: "✨" },
  { message: "Almost ready…", icon: "🚀" },
];

type State = "idle" | "generating" | "error";

const MAX_CHARS = 600;

export function NewProjectForm() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedHints, setSelectedHints] = useState<string[]>([]);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Cycle loading messages + progress bar while generating
  useEffect(() => {
    if (state === "generating") {
      setStageIndex(0);
      setProgress(5);

      let stage = 0;
      let prog = 5;

      intervalRef.current = setInterval(() => {
        stage = Math.min(stage + 1, LOADING_STAGES.length - 1);
        setStageIndex(stage);
        // Progress advances non-linearly — slows near the end (never hits 100% until done)
        prog = Math.min(prog + Math.random() * 12 + 4, 92);
        setProgress(prog);
      }, 2200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (state === "idle") {
        setStageIndex(0);
        setProgress(0);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state]);

  function toggleHint(label: string) {
    setSelectedHints((prev) =>
      prev.includes(label) ? prev.filter((h) => h !== label) : [...prev, label]
    );
  }

  async function handleGenerate() {
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt.length < 10) {
      textareaRef.current?.focus();
      return;
    }

    setState("generating");
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          styleHints: selectedHints.length > 0 ? selectedHints : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed. Please try again.");
      }

      // Jump progress to 100% briefly before navigating
      setProgress(100);
      await new Promise((r) => setTimeout(r, 400));
      router.push(`/editor/${data.projectId}`);
    } catch (err: unknown) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  const isGenerating = state === "generating";
  const charCount = prompt.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canGenerate = prompt.trim().length >= 10 && !isOverLimit && !isGenerating;

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {/* Animated icon */}
          <div className="mb-8 flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-brand">
              <span
                className="text-4xl transition-all duration-500"
                key={stageIndex}
                style={{ animation: "fadeSlideIn 0.4s ease" }}
              >
                {LOADING_STAGES[stageIndex].icon}
              </span>
              {/* Spinning ring */}
              <svg
                className="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 80 80"
                aria-hidden="true"
              >
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="3"
                />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="#3D5AFE"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
            </div>
          </div>

          {/* Stage message */}
          <p
            className="text-xl font-semibold text-text-primary mb-2 transition-all duration-300"
            key={`msg-${stageIndex}`}
          >
            {LOADING_STAGES[stageIndex].message}
          </p>
          <p className="text-sm text-text-tertiary mb-8">
            Generating your landing page with Gemini AI…
          </p>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-brand">
            <div
              className="h-full rounded-full bg-brand-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            This usually takes 15–30 seconds
          </p>
        </div>

        {/* Inline keyframe animation */}
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0);   }
          }
        `}</style>
      </main>
    );
  }

  // ─── Main form ────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col justify-center px-6 py-12 lg:px-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-primary transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to dashboard
      </Link>

      {/* Heading */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-brand-primary/40" />
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
            New Page
          </span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight sm:text-4xl">
          Describe your product
        </h1>
        <p className="mt-2 text-base text-text-tertiary leading-relaxed">
          The more specific you are about your target audience, product, and key benefit — the better the result.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Prompt textarea */}
        <div className="relative">
          <label
            htmlFor="prompt-input"
            className="mb-2 block text-sm font-semibold text-text-primary"
          >
            What does your product do?
          </label>
          <textarea
            ref={textareaRef}
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canGenerate) {
                handleGenerate();
              }
            }}
            placeholder="e.g. AI-powered invoice software for freelancers that tracks payments and sends automatic reminders to late clients."
            rows={5}
            maxLength={MAX_CHARS + 50}
            className={`w-full resize-none rounded-xl border px-4 py-3.5 text-base text-text-primary placeholder:text-text-tertiary/60 leading-relaxed transition-all duration-150 outline-none focus:ring-2 ${
              isOverLimit
                ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                : "border-border-subtle focus:border-brand-primary focus:ring-brand-primary/20"
            }`}
            disabled={isGenerating}
            aria-label="Describe your product"
            aria-describedby="prompt-char-count"
          />
          {/* Char count */}
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-xs text-text-tertiary">
              <kbd className="rounded border border-border-subtle bg-surface-brand px-1.5 py-0.5 text-xs font-mono">
                {typeof window !== "undefined" && navigator.platform.includes("Mac") ? "⌘" : "Ctrl"}
              </kbd>
              {" + "}
              <kbd className="rounded border border-border-subtle bg-surface-brand px-1.5 py-0.5 text-xs font-mono">
                Enter
              </kbd>
              {" to generate"}
            </p>
            <span
              id="prompt-char-count"
              className={`text-xs tabular-nums ${
                isOverLimit ? "text-red-500 font-semibold" : "text-text-tertiary"
              }`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </div>

        {/* Style hint chips */}
        <div>
          <p className="mb-3 text-sm font-semibold text-text-primary">
            Style hints{" "}
            <span className="font-normal text-text-tertiary">(optional — pick any)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {STYLE_HINTS.map((hint) => {
              const selected = selectedHints.includes(hint.label);
              return (
                <button
                  key={hint.label}
                  id={`hint-${hint.label.toLowerCase()}`}
                  type="button"
                  onClick={() => toggleHint(hint.label)}
                  disabled={isGenerating}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 select-none ${
                    selected
                      ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                      : "border-border-subtle bg-surface-base text-text-primary hover:border-brand-primary/50 hover:bg-surface-brand"
                  }`}
                  aria-pressed={selected}
                >
                  <span className="text-base leading-none">{hint.emoji}</span>
                  {hint.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error message */}
        {state === "error" && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5"
          >
            <span className="mt-0.5 text-lg leading-none">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">Generation failed</p>
              <p className="mt-0.5 text-sm text-red-600">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Generate button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            id="generate-btn"
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="inline-flex items-center gap-2.5 rounded-xl bg-brand-primary px-8 py-4 text-base font-semibold text-white shadow-md transition-all duration-150 hover:bg-brand-primary-hover hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 1L11.5 6.5L17 9L11.5 11.5L9 17L6.5 11.5L1 9L6.5 6.5L9 1Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
            </svg>
            {state === "error" ? "Try again" : "Generate my page"}
          </button>

          {prompt.trim().length < 10 && prompt.length > 0 && (
            <p className="text-sm text-text-tertiary">
              Keep going — a little more detail helps
            </p>
          )}
        </div>

        {/* Tips */}
        <div className="mt-2 rounded-xl border border-border-subtle bg-surface-brand/50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-3">
            Tips for a great result
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "Name who the product is for (e.g. 'for freelance designers', 'for busy parents')",
              "Mention the main benefit, not just the feature ('saves 3 hours a week' beats 'has analytics')",
              "Include the product name if you have one — it'll appear in the headline",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="mt-0.5 text-brand-primary font-semibold">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
