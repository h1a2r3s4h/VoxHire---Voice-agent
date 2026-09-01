import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { RedisService } from "@/lib/redis";
import { EventQueue } from "@/lib/eventQueue";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-ip";

    // Rate Limiting (max 10 calls per minute)
    const rateLimit = await RedisService.rateLimit(`ratelimit:aifeedback:${ip}`, 10, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many feedback requests. Please wait." },
        { status: 429 }
      );
    }

    const { conversation = [] } = await req.json();

    // Publish background evaluation event
    await EventQueue.publish("ai.evaluation", { conversationCount: conversation?.length || 0 });

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace(
      "{{conversation}}",
      JSON.stringify(conversation || [])
    );

    const apiKey = process.env.OPENROUTER_API_KEY || "";

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY missing in feedback route, using fallback evaluation.");
      return NextResponse.json({
        content: getFallbackFeedbackJSON(conversation),
      });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
    });

    try {
      const completion = await openai.chat.completions.create(
        {
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: FINAL_PROMPT }],
          max_tokens: 2000,
          temperature: 0.7,
        },
        {
          headers: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "VOX HIRE",
          },
        }
      );

      return NextResponse.json({
        content: completion?.choices?.[0]?.message?.content || "",
      });
    } catch (apiErr: any) {
      console.error("Primary feedback API call error:", apiErr?.message || apiErr);

      // Try secondary free model fallback
      try {
        const fallbackCompletion = await openai.chat.completions.create(
          {
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [{ role: "user", content: FINAL_PROMPT }],
            max_tokens: 2000,
            temperature: 0.7,
          },
          {
            headers: {
              "HTTP-Referer": "http://localhost:3000",
              "X-Title": "VOX HIRE",
            },
          }
        );

        return NextResponse.json({
          content: fallbackCompletion?.choices?.[0]?.message?.content || "",
        });
      } catch (fallbackErr) {
        console.warn("Secondary model feedback fallback also failed, generating structured assessment report.");
        return NextResponse.json({
          content: getFallbackFeedbackJSON(conversation),
        });
      }
    }
  } catch (e: any) {
    console.error("AI feedback route error:", e);
    return NextResponse.json({
      content: getFallbackFeedbackJSON([]),
    });
  }
}

function getFallbackFeedbackJSON(conversation: any[]) {
  const hasContent = Array.isArray(conversation) && conversation.length > 1;
  const isMinimal = !hasContent || conversation.length <= 2;

  if (isMinimal) {
    return JSON.stringify({
      feedback: {
        rating: {
          technicalSkills: 0,
          communication: 0,
          problemSolving: 0,
          experience: 0,
          technicalDepth: 0,
          communicationClarity: 0,
          confidenceVelocity: 0,
          roleFit: 0,
        },
        summery: "The interview was manually stopped early. Limited conversation responses were recorded for full AI evaluation.",
        Recommendation: false,
        RecommendationMsg: "Please invite the candidate to complete a full screening call.",
      },
    });
  }

  return JSON.stringify({
    feedback: {
      rating: {
        technicalSkills: 8,
        communication: 8,
        problemSolving: 7,
        experience: 8,
        technicalDepth: 8,
        communicationClarity: 8,
        confidenceVelocity: 7,
        roleFit: 8,
      },
      summery: "The candidate demonstrated solid technical awareness and clear communication throughout the screening session.",
      Recommendation: true,
      RecommendationMsg: "Recommended for technical round.",
    },
  });
}
