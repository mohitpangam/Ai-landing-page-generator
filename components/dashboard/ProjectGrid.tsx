"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";
import { SkeletonGrid } from "./SkeletonCard";

interface Project {
  id: string;
  name: string;
  slug: string;
  status: string;
  thumbnailUrl?: string | null;
  prompt: string;
  updatedAt: string;
}

type StatusFilter = "ALL" | "ACTIVE" | "ARCHIVED";

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();
      setProjects(data.projects ?? []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Debounced fetch on search/filter change
  useEffect(() => {
    const timer = setTimeout(fetchProjects, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchProjects, search]);

  function handleDeleted(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function handleArchived(id: string, status: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }

  function handleRenamed(id: string, newName: string) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  }

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Active", value: "ACTIVE" },
    { label: "Archived", value: "ARCHIVED" },
  ];

  return (
    <div>
      {/* Controls bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10.5 10.5l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="project-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages…"
            className="w-full rounded-lg border border-border-subtle bg-surface-base pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter tabs */}
          <div className="flex items-center rounded-lg border border-border-subtle bg-surface-base p-1 gap-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                id={`filter-${tab.value.toLowerCase()}`}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  statusFilter === tab.value
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-tertiary hover:text-text-primary hover:bg-surface-brand"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* New page button */}
          <Link
            href="/dashboard/new"
            id="new-project-grid-btn"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-brand-primary-hover active:scale-95"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Page
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : projects.length === 0 && !search && statusFilter === "ALL" ? (
        <EmptyState />
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <p className="text-text-tertiary text-base">No pages match your search.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
            className="mt-4 text-sm text-brand-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleted={handleDeleted}
              onArchived={handleArchived}
              onDuplicated={fetchProjects}
              onRenamed={handleRenamed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
