import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { generatePageAction } from "@/app/actions/generate";

// Rate limit configuration: Max 10 generations per hour per user
const HOURLY_RATE_LIMIT = 10;

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .substring(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${base || "project"}-${randomSuffix}`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to generate landing pages." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const { prompt, styleHints } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A valid prompt string is required." },
        { status: 400 }
      );
    }

    // Rate Limiting Check (Task 3.5)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentGenerationCount = await db.generationLog.count({
      where: {
        userId,
        createdAt: { gte: oneHourAgo },
        status: { in: ["SUCCESS", "RETRIED"] },
      },
    });

    if (recentGenerationCount >= HOURLY_RATE_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Hourly generation limit reached (10 pages / hour). Please wait a while before generating another page.",
        },
        { status: 429 }
      );
    }

    // Run Generation Pipeline
    let generationResult;
    try {
      generationResult = await generatePageAction(prompt, styleHints);
    } catch (genError: any) {
      // Log failed attempt
      await db.generationLog.create({
        data: {
          userId,
          prompt,
          status: "FAILED",
          errorMessage: genError.message || "Generation failed",
        },
      });

      return NextResponse.json(
        { error: genError.message || "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    const { schema, latencyMs } = generationResult;

    // Database Persistence: Project + PageVersion + SeoMeta
    const projectName = schema.meta.title || prompt.substring(0, 40);
    const projectSlug = slugify(projectName);

    const project = await db.project.create({
      data: {
        userId,
        name: projectName,
        slug: projectSlug,
        prompt,
        status: "ACTIVE",
      },
    });

    const pageVersion = await db.pageVersion.create({
      data: {
        projectId: project.id,
        schema: schema as any,
        isAutosave: false,
      },
    });

    // Update currentVersionId on project
    await db.project.update({
      where: { id: project.id },
      data: { currentVersionId: pageVersion.id },
    });

    // Upsert default SeoMeta
    await db.seoMeta.create({
      data: {
        projectId: project.id,
        title: schema.meta.title,
        description: schema.meta.description,
      },
    });

    // Log success
    await db.generationLog.create({
      data: {
        userId,
        projectId: project.id,
        prompt,
        status: "SUCCESS",
        latencyMs,
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      slug: project.slug,
      schema,
    });
  } catch (error: any) {
    console.error("❌ /api/generate route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during page generation." },
      { status: 500 }
    );
  }
}
