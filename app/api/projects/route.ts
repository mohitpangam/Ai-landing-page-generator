import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const statusParam = searchParams.get("status")?.toUpperCase();

    // Allowed statuses to filter — never expose DELETED via this route
    const allowedStatuses = ["ACTIVE", "ARCHIVED"] as const;
    type AllowedStatus = (typeof allowedStatuses)[number];
    const statusFilter: AllowedStatus | undefined = allowedStatuses.includes(
      statusParam as AllowedStatus
    )
      ? (statusParam as AllowedStatus)
      : undefined;

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
        status: statusFilter
          ? { equals: statusFilter }
          : { in: ["ACTIVE", "ARCHIVED"] },
        ...(search
          ? { name: { contains: search, mode: "insensitive" } }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        isPublished: true,
        thumbnailUrl: true,
        prompt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
