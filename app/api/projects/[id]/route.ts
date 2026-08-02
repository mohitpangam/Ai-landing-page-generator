import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

// ─── PATCH /api/projects/:id ──────────────────────────────────────────────────
// Handles rename, archive, and prompt metadata update
export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, status, prompt } = body;

    // Verify ownership
    const project = await db.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow valid status transitions
    const allowedStatuses = ["ACTIVE", "ARCHIVED"];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await db.project.update({
      where: { id },
      data: {
        ...(name && typeof name === "string" ? { name: name.trim() } : {}),
        ...(status ? { status } : {}),
        ...(prompt && typeof prompt === "string" ? { prompt: prompt.trim() } : {}),
      },
      select: { id: true, name: true, status: true, updatedAt: true },
    });

    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("PATCH /api/projects/:id error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
// Soft-delete: sets status = DELETED, preserves all DB rows
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const project = await db.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.project.update({
      where: { id },
      data: { status: "DELETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/:id error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
