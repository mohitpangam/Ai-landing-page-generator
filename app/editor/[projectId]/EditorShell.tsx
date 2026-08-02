"use client";

import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { EditorTopBar } from "@/components/editor/EditorTopBar";
import { SectionList } from "@/components/editor/SectionList";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import type { PageSchema } from "@/lib/schema/page";

interface Props {
  projectId: string;
  projectName: string;
  schema: PageSchema;
  user: { name?: string | null; email?: string | null; image?: string | null };
}

const AUTOSAVE_DELAY_MS = 1500;

export function EditorShell({ projectId, projectName, schema, user }: Props) {
  const { init, schema: liveSchema, saveStatus, setSaveStatus } = useEditorStore();
  const { undo, redo, canUndo, canRedo } = useEditorStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedSchemaRef = useRef<string>(JSON.stringify(schema));

  // Initialise store on mount
  useEffect(() => {
    init(projectId, schema);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave — debounced 1.5s after any schema change
  const save = useCallback(async () => {
    const serialised = JSON.stringify(liveSchema);
    if (serialised === lastSavedSchemaRef.current) return; // nothing changed
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/projects/${projectId}/schema`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schema: liveSchema, isAutosave: true }),
      });
      if (!res.ok) throw new Error();
      lastSavedSchemaRef.current = serialised;
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [liveSchema, projectId, setSaveStatus]);

  useEffect(() => {
    if (saveStatus === "unsaved") {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(save, AUTOSAVE_DELAY_MS);
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [saveStatus, save]);

  // Warn on unload if unsaved
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved" || saveStatus === "saving") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [saveStatus]);

  // Global keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes("Mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        if (canRedo()) redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface-base">
      {/* Top bar */}
      <EditorTopBar projectName={projectName} user={user} />

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — section list */}
        <aside
          className="flex w-60 flex-shrink-0 flex-col border-r border-border-subtle bg-surface-base overflow-hidden"
          aria-label="Section list"
        >
          <SectionList />
        </aside>

        {/* Center — canvas */}
        <main className="flex flex-1 flex-col overflow-auto bg-[#F3F4F6]">
          <EditorCanvas />
        </main>

        {/* Right panel — property editor */}
        <aside
          className="flex w-72 flex-shrink-0 flex-col border-l border-border-subtle bg-surface-base overflow-hidden"
          aria-label="Property panel"
        >
          <PropertyPanel />
        </aside>
      </div>
    </div>
  );
}
