import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

interface Params {
  params: Promise<{ id: string }>;
}

// PATCH /api/projects/:id/schema
// Creates a new PageVersion row + updates Project.updatedAt (autosave flow)
export async function PATCH(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { schema, isAutosave = true } = body;

    if (!schema || typeof schema !== "object") {
      return NextResponse.json({ error: "Invalid schema payload" }, { status: 400 });
    }

    // Ownership check
    const project = await db.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create new PageVersion
    const version = await db.pageVersion.create({
      data: {
        projectId: id,
        schema: schema as Prisma.InputJsonValue,
        isAutosave,
      },
    });

    // Update currentVersionId and touch updatedAt
    await db.project.update({
      where: { id },
      data: { currentVersionId: version.id },
    });

    return NextResponse.json({ success: true, versionId: version.id });
  } catch (error) {
    console.error("PATCH /api/projects/:id/schema error:", error);
    return NextResponse.json({ error: "Failed to save schema" }, { status: 500 });
  }
}
