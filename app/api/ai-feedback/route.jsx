import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server"; // ✅ FIXED: was missing

export async function POST(req) {
  const { conversation } = await req.json();
  const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

  try {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });

  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}