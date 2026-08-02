import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/projects/:id/publish
// Returns current publishing status & live public URL
export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      select: { id: true, userId: true, slug: true, isPublished: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      isPublished: project.isPublished ?? false,
      slug: project.slug,
      publishedUrl: `/p/${project.slug}`,
    });
  } catch (error) {
    console.error("GET /api/projects/:id/publish error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// POST /api/projects/:id/publish
// Toggles or sets isPublished status for the project
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const publishState = body.publish ?? true; // boolean

    const project = await db.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await db.project.update({
      where: { id },
      data: { isPublished: Boolean(publishState) },
      select: { id: true, slug: true, isPublished: true },
    });

    return NextResponse.json({
      isPublished: updated.isPublished,
      slug: updated.slug,
      publishedUrl: `/p/${updated.slug}`,
    });
  } catch (error) {
    console.error("POST /api/projects/:id/publish error:", error);
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}
