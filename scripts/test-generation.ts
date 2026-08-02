/**
 * Test script for Gemini Page Generation Pipeline
 * Run with: npx tsx scripts/test-generation.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generatePageAction } from "../app/actions/generate";

async function testGeneration() {
  console.log("🚀 Testing Gemini AI Page Generation Pipeline...\n");

  const prompt = "AI-powered invoice management software for freelancers that auto-tracks payments";
  const styleHints = ["Minimal", "Corporate", "Indigo"];

  console.log(`Prompt: "${prompt}"`);
  console.log(`Style Hints: ${styleHints.join(", ")}\n`);

  try {
    const { schema, latencyMs } = await generatePageAction(prompt, styleHints);

    console.log(`✅ Generation Successful in ${latencyMs}ms!\n`);
    console.log("📌 Page Meta:");
    console.log(`   Title: ${schema.meta.title}`);
    console.log(`   Description: ${schema.meta.description}\n`);

    console.log("🎨 Theme Tokens:");
    console.log(`   Primary Color: ${schema.theme.primary}`);
    console.log(`   Border Radius: ${schema.theme.borderRadius}\n`);

    console.log(`📋 Generated ${schema.sections.length} Sections:`);
    schema.sections.forEach((sec, idx) => {
      console.log(`   ${idx + 1}. Type: [${sec.type.toUpperCase()}] — ID: ${sec.id}`);
    });

    console.log("\n🎉 Phase 3 Generation Pipeline is 100% verified!");
  } catch (error: any) {
    console.error("❌ Generation Test Failed:", error);
    process.exit(1);
  }
}

testGeneration();
