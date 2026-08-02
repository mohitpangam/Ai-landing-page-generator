import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generateStaticHtml } from "@/lib/export/generateStaticHtml";
import { generateNextjsZip } from "@/lib/export/generateNextjsZip";
import type { PageSchema } from "@/lib/schema/page";

interface Params {
  params: Promise<{ id: string }>;
}

// POST /api/projects/:id/export
// Generates and downloads Next.js project zip or standalone HTML file
export async function POST(req: Request, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { format = "nextjs", schema: payloadSchema } = body;

    // Verify project ownership
    const project = await db.project.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Determine schema (payload or latest version from DB)
    const schema = (payloadSchema ||
      project.versions[0]?.schema) as unknown as PageSchema;

    if (!schema) {
      return NextResponse.json({ error: "No schema available to export" }, { status: 400 });
    }

    const slug = (project.name || "landing-page")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    if (format === "html") {
      const htmlContent = generateStaticHtml(schema);
      return new NextResponse(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${slug}.html"`,
        },
      });
    }

    // Default: Next.js ZIP bundle
    const zipBuffer = await generateNextjsZip(schema, project.name);
    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${slug}-nextjs.zip"`,
      },
    });
  } catch (error) {
    console.error("POST /api/projects/:id/export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
