import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { conversation } = await req.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY" },
        { status: 500 }
      );
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation)
    );

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: FINAL_PROMPT }],
      extra_headers: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "VOX HIRE",
      },
    });

    return NextResponse.json({
      content: completion?.choices?.[0]?.message?.content || "",
    });
  } catch (e) {
    console.error("AI feedback route error:", e);

    return NextResponse.json(
      {
        error: e?.message || "Server error",
        status: e?.status || 500,
        details: e?.error || null,
      },
      { status: e?.status || 500 }
    );
  }
}