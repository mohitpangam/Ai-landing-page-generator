import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key") {
    throw new Error(
      "GEMINI_API_KEY is missing in .env.local. " +
        "Please get a key at https://aistudio.google.com/app/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Using gemini-flash-latest model (verified active with non-zero quota)
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
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

  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });
}
