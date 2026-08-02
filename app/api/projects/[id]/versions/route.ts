import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

// GET /api/projects/:id/versions
// Returns list of page versions for the version history panel
export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify project ownership
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

    const versions = await db.pageVersion.findMany({
      where: { projectId: id },
      orderBy: { createdAt: "desc" },
      take: 30, // return latest 30 versions
      select: {
        id: true,
        isAutosave: true,
        createdAt: true,
        schema: true,
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("GET /api/projects/:id/versions error:", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}
