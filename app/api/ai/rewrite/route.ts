import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGeminiTextModel } from "@/lib/gemini";

const TONE_PROMPTS: Record<string, string> = {
  punchy: "Make this text punchy, energetic, high-converting, and compelling for a SaaS landing page.",
  professional: "Make this text professional, polished, enterprise-ready, and authoritative.",
  short: "Shorten and simplify this text to be concise, clear, and direct.",
  expand: "Expand this text slightly to provide more detail, clarity, and value.",
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { text, tone, customInstruction } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text string is required" }, { status: 400 });
    }

    let instruction = TONE_PROMPTS[tone] || TONE_PROMPTS.punchy;
    if (tone === "custom" && customInstruction) {
      instruction = customInstruction;
    }

    const prompt = `
You are an expert SaaS landing page copywriter.
Original Text: "${text.trim()}"

Goal: ${instruction}

Provide 3 distinct high-quality variations/alternatives for this copy.
Respond ONLY with a valid JSON array of 3 strings. Example format:
["Variation 1", "Variation 2", "Variation 3"]
`;

    const model = getGeminiTextModel();
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text().trim();

    let suggestions: string[] = [];
    try {
      let cleaned = rawResponse;
      if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
      if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
      if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        suggestions = parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      // Fallback if raw text wasn't strict JSON
      suggestions = [rawResponse.replace(/^["'\[\]\s]+|["'\[\]\s]+$/g, "")];
    }

    if (suggestions.length === 0) {
      suggestions = [text];
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("POST /api/ai/rewrite error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate AI rewrite" },
      { status: 500 }
    );
  }
}
