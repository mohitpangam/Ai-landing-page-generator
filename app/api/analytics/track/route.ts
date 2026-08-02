import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/analytics/track
// Public tracking endpoint — increments viewsCount or clicksCount for published pages
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { projectId, slug, eventType } = body;

    if (!projectId && !slug) {
      return NextResponse.json({ error: "projectId or slug is required" }, { status: 400 });
    }

    if (eventType !== "view" && eventType !== "click") {
      return NextResponse.json({ error: "eventType must be 'view' or 'click'" }, { status: 400 });
    }

    const whereClause = projectId ? { id: projectId } : { slug };

    if (eventType === "view") {
      await db.project.update({
        where: whereClause as any,
        data: { viewsCount: { increment: 1 } },
      });
    } else if (eventType === "click") {
      await db.project.update({
        where: whereClause as any,
        data: { clicksCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("POST /api/analytics/track error:", error);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
