"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  slug: string;
  status: string;
  thumbnailUrl?: string | null;
  prompt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  onDeleted: (id: string) => void;
  onArchived: (id: string, status: string) => void;
  onDuplicated: () => void;
  onRenamed: (id: string, newName: string) => void;
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

// Gradient thumbnail placeholder based on project id (deterministic color)
function ThumbnailPlaceholder({ projectId, name }: { projectId: string; name: string }) {
  const hues = [220, 262, 168, 24, 330, 199];
  const hue = hues[projectId.charCodeAt(0) % hues.length];
  return (
    <div
      className="h-40 flex items-end p-3"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 75%, 55%), hsl(${hue + 40}, 70%, 45%))`,
      }}
    >
      <span className="text-xs font-medium text-white/80 line-clamp-2 leading-snug">{name}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  onDeleted,
  onArchived,
  onDuplicated,
  onRenamed,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [loading, setLoading] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (renaming) renameRef.current?.focus();
  }, [renaming]);

  async function handleDelete() {
    setMenuOpen(false);
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setLoading("delete");
    await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    setLoading(null);
    onDeleted(project.id);
  }

  async function handleArchive() {
    setMenuOpen(false);
    const newStatus = project.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED";
    setLoading("archive");
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(null);
    onArchived(project.id, newStatus);
  }

  async function handleDuplicate() {
    setMenuOpen(false);
    setLoading("duplicate");
    const res = await fetch(`/api/projects/${project.id}/duplicate`, { method: "POST" });
    setLoading(null);
    if (res.ok) {
      onDuplicated();
      router.refresh();
    }
  }

  async function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed || trimmed === project.name) { setRenaming(false); return; }
    setLoading("rename");
    await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    });
    setLoading(null);
    setRenaming(false);
    onRenamed(project.id, trimmed);
  }

  return (
    <div
      className={`group overflow-hidden rounded-xl border border-border-subtle bg-surface-base transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Thumbnail — links to editor */}
      <Link
        href={`/editor/${project.id}`}
        className="block"
        tabIndex={-1}
        aria-label={`Open ${project.name} in editor`}
      >
        {project.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="h-40 w-full object-cover"
          />
        ) : (
          <ThumbnailPlaceholder projectId={project.id} name={project.name} />
        )}
      </Link>

      {/* Card body */}
      <div className="p-4">
        {/* Name + rename input */}
        {renaming ? (
          <form onSubmit={handleRenameSubmit} className="mb-1">
            <input
              ref={renameRef}
              id={`rename-input-${project.id}`}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => e.key === "Escape" && setRenaming(false)}
              className="w-full rounded-md border border-brand-primary bg-surface-base px-2 py-1 text-sm font-semibold text-text-primary outline-none focus:ring-2 focus:ring-brand-primary/30"
              maxLength={80}
              aria-label="Rename project"
            />
          </form>
        ) : (
          <Link
            href={`/editor/${project.id}`}
            className="block text-sm font-semibold text-text-primary leading-snug hover:text-brand-primary transition-colors mb-1 line-clamp-2"
          >
            {project.name}
          </Link>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                project.status === "ARCHIVED"
                  ? "bg-gray-100 text-gray-500"
                  : "bg-surface-brand text-brand-primary"
              }`}
            >
              {project.status === "ARCHIVED" ? "Archived" : "Active"}
            </span>
            <span className="text-xs text-text-tertiary">{timeAgo(project.updatedAt)}</span>
          </div>

          {/* Kebab menu */}
          <div className="relative" ref={menuRef}>
            <button
              id={`project-menu-${project.id}`}
              type="button"
              aria-label="Project actions"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={(e) => { e.preventDefault(); setMenuOpen((o) => !o); }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-surface-brand hover:text-text-primary transition-all duration-150 focus:opacity-100"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 bottom-8 z-50 w-44 rounded-xl border border-border-subtle bg-surface-base shadow-lg ring-1 ring-black/5 py-1"
                role="menu"
              >
                <Link
                  href={`/editor/${project.id}`}
                  role="menuitem"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-text-primary hover:bg-surface-brand transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Open editor
                </Link>
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => { setMenuOpen(false); setRenaming(true); }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-text-primary hover:bg-surface-brand transition-colors"
                >
                  Rename
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleDuplicate}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-text-primary hover:bg-surface-brand transition-colors"
                >
                  Duplicate
                </button>
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleArchive}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-text-primary hover:bg-surface-brand transition-colors"
                >
                  {project.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                </button>
                <div className="my-1 border-t border-border-subtle" />
                <button
                  role="menuitem"
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
