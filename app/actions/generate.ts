"use server";

import { getGeminiModel } from "@/lib/gemini";
import { buildPageGenerationPrompt } from "@/lib/prompts/generate-page";
import { PageSchemaZod } from "@/lib/schema/page.zod";
import type { PageSchema } from "@/lib/schema/page";

function cleanJsonResponse(rawText: string): string {
  let text = rawText.trim();
  if (text.startsWith("```json")) {
    text = text.substring(7);
  } else if (text.startsWith("```")) {
    text = text.substring(3);
  }
  if (text.endsWith("```")) {
    text = text.substring(0, text.length - 3);
  }
  return text.trim();
}

export async function generatePageAction(
  prompt: string,
  styleHints?: string[]
): Promise<{ schema: PageSchema; latencyMs: number }> {
  if (!prompt || prompt.trim().length < 5) {
    throw new Error("Please provide a descriptive prompt (at least 5 characters).");
  }

  const startTime = Date.now();
  const promptText = buildPageGenerationPrompt(prompt, styleHints);
  const geminiModel = getGeminiModel();

  try {
    let result = await geminiModel.generateContent(promptText);
    let rawText = result.response.text();
    let cleanedJson = cleanJsonResponse(rawText);
    let parsed = JSON.parse(cleanedJson);

    let validation = PageSchemaZod.safeParse(parsed);

    // Single retry with corrective prompt if validation fails
    if (!validation.success) {
      console.warn(
        "⚠️ Initial Gemini JSON failed Zod validation. Retrying with corrective prompt...",
        validation.error.issues
      );

      const correctivePrompt = `${promptText}\n\nIMPORTANT: Your previous output had schema validation errors:\n${JSON.stringify(
        validation.error.issues,
        null,
        2
      )}\nPlease fix all formatting errors and output valid JSON matching the exact schema requirements.`;

      result = await geminiModel.generateContent(correctivePrompt);
      rawText = result.response.text();
      cleanedJson = cleanJsonResponse(rawText);
      parsed = JSON.parse(cleanedJson);
      validation = PageSchemaZod.parse(parsed) as any;
    }

    const latencyMs = Date.now() - startTime;
    return {
      schema: validation.data as PageSchema,
      latencyMs,
    };
  } catch (error: any) {
    console.error("❌ Gemini generation error:", error);
    throw new Error(
      error.message || "Failed to generate landing page. Please try again."
    );
  }
}
