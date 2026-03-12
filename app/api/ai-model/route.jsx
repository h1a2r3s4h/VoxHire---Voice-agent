import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  const { jobPosition, jobDescription, duration, type } = await req.json();

  const FINAL_PROMPT = QUESTIONS_PROMPT
    .replace("{{jobTitle}}", jobPosition)
    .replace("{{jobDescription}}", jobDescription)
    .replace("{{duration}}", duration)
    .replace("{{type}}", type);

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    // ✅ FIX: return object with content
    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (e) {
    console.log(e);

    // ✅ FIX: don't return raw error object
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
