import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_TRANSIENT_RETRIES = 3;
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";

function isTransientGeminiError(error: unknown): boolean {
  const candidate = error as { status?: number; message?: string };
  const message = candidate?.message || String(error);

  return (
    candidate?.status === 429 ||
    candidate?.status === 500 ||
    candidate?.status === 503 ||
    /\b(429|500|503)\b|high demand|temporarily unavailable|overloaded/i.test(message)
  );
}

export async function generateGeminiContent(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string
) {
  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt += 1) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      if (attempt === MAX_TRANSIENT_RETRIES || !isTransientGeminiError(error)) {
        throw error;
      }

      const delayMs = 800 * 2 ** attempt;
      console.warn(
        `Gemini request failed temporarily. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${MAX_TRANSIENT_RETRIES})...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Gemini request failed after retries.");
}

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key") {
    throw new Error(
      "GEMINI_API_KEY is missing in .env.local. " +
        "Please get a key at https://aistudio.google.com/app/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  return genAI.getGenerativeModel({
    model,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
}

export function getGeminiTextModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key") {
    throw new Error(
      "GEMINI_API_KEY is missing in .env.local. " +
        "Please get a key at https://aistudio.google.com/app/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

  return genAI.getGenerativeModel({
    model,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });
}
