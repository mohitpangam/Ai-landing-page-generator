import { create } from "zustand";
import type { PageSchema, Section, ThemeTokens, PageMeta } from "@/lib/schema/page";

type Viewport = "desktop" | "tablet" | "mobile";
type SaveStatus = "saved" | "saving" | "unsaved" | "error";

const MAX_UNDO = 50;

interface EditorState {
  projectId: string;
  schema: PageSchema;
  selectedSectionId: string | null;
  undoStack: PageSchema[];
  redoStack: PageSchema[];
  viewport: Viewport;
  saveStatus: SaveStatus;
}

interface EditorActions {
  /** Initialise the store with server-fetched data */
  init: (projectId: string, schema: PageSchema) => void;

  // ── Section actions ──
  selectSection: (id: string | null) => void;
  updateSectionContent: (sectionId: string, content: unknown) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  deleteSection: (sectionId: string) => void;

  // ── Theme / Meta ──
  updateTheme: (patch: Partial<ThemeTokens>) => void;
  updateMeta: (patch: Partial<PageMeta>) => void;

  // ── Undo / Redo ──
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // ── UI ──
  setViewport: (v: Viewport) => void;
  setSaveStatus: (s: SaveStatus) => void;
}

export type EditorStore = EditorState & EditorActions;

// ─── Helper: push current schema onto undo stack before mutation ───────────────
function pushUndo(
  state: EditorState,
  nextSchema: PageSchema
): Partial<EditorState> {
  return {
    schema: nextSchema,
    undoStack: [...state.undoStack.slice(-(MAX_UNDO - 1)), state.schema],
    redoStack: [],
    saveStatus: "unsaved",
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useEditorStore = create<EditorStore>((set, get) => ({
  // ── Initial state ──
  projectId: "",
  schema: { meta: { title: "", description: "" }, theme: {} as ThemeTokens, sections: [] },
  selectedSectionId: null,
  undoStack: [],
  redoStack: [],
  viewport: "desktop",
  saveStatus: "saved",

  // ── Init ──
  init: (projectId, schema) =>
    set({ projectId, schema, undoStack: [], redoStack: [], saveStatus: "saved" }),

  // ── Section ──
  selectSection: (id) => set({ selectedSectionId: id }),

  updateSectionContent: (sectionId, content) => {
    const state = get();
    const sections = state.schema.sections.map((s) =>
      s.id === sectionId ? ({ ...s, content } as Section) : s
    );
    set(pushUndo(state, { ...state.schema, sections }));
  },

  moveSection: (fromIndex, toIndex) => {
    const state = get();
    const sections = [...state.schema.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    set(pushUndo(state, { ...state.schema, sections }));
  },

  deleteSection: (sectionId) => {
    const state = get();
    const sections = state.schema.sections.filter((s) => s.id !== sectionId);
    set({
      ...pushUndo(state, { ...state.schema, sections }),
      selectedSectionId:
        state.selectedSectionId === sectionId ? null : state.selectedSectionId,
    });
  },

  // ── Theme / Meta ──
  updateTheme: (patch) => {
    const state = get();
    const theme = { ...state.schema.theme, ...patch };
    set(pushUndo(state, { ...state.schema, theme }));
  },

  updateMeta: (patch) => {
    const state = get();
    const meta = { ...state.schema.meta, ...patch };
    set(pushUndo(state, { ...state.schema, meta }));
  },

  // ── Undo / Redo ──
  undo: () => {
    const { undoStack, schema, redoStack } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      schema: prev,
      undoStack: undoStack.slice(0, -1),
      redoStack: [schema, ...redoStack],
      saveStatus: "unsaved",
    });
  },

  redo: () => {
    const { redoStack, schema, undoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    set({
      schema: next,
      redoStack: redoStack.slice(1),
      undoStack: [...undoStack, schema],
      saveStatus: "unsaved",
    });
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  // ── UI ──
  setViewport: (viewport) => set({ viewport }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
}));
