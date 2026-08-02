import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/projects/:id/duplicate
// Clones the project + its latest PageVersion into a new project row
export async function POST(_req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership and fetch latest version
    const original = await db.project.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!original) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (original.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build a unique slug for the clone
    const baseSlug = original.slug.replace(/-copy-?\d*$/, "");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const newSlug = `${baseSlug}-copy-${randomSuffix}`;

    // Create the cloned project
    const clonedProject = await db.project.create({
      data: {
        userId: session.user.id,
        name: `${original.name} (Copy)`,
        slug: newSlug,
        prompt: original.prompt,
        status: "ACTIVE",
      },
    });

    // Clone the latest PageVersion if one exists
    if (original.versions.length > 0) {
      const latestVersion = original.versions[0];
      const newVersion = await db.pageVersion.create({
        data: {
          projectId: clonedProject.id,
          schema: latestVersion.schema as Prisma.InputJsonValue,
          isAutosave: false,
        },
      });

      // Set currentVersionId on the clone
      await db.project.update({
        where: { id: clonedProject.id },
        data: { currentVersionId: newVersion.id },
      });
    }

    return NextResponse.json({
      success: true,
      projectId: clonedProject.id,
      slug: clonedProject.slug,
    });
  } catch (error) {
    console.error("POST /api/projects/:id/duplicate error:", error);
    return NextResponse.json({ error: "Failed to duplicate project" }, { status: 500 });
  }
}
