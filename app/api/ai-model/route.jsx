import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
  try {
    const {
      jobPosition = "",
      jobDescription = "",
      duration = "",
      type = [],
      resumeText = "",
    } = await req.json();

    const interviewTypes = Array.isArray(type) ? type.join(", ") : type;

    let FINAL_PROMPT = "";

    if (resumeText && resumeText.trim().length > 50) {
      // ✅ RESUME MODE
      FINAL_PROMPT = `
You are a strict technical interviewer.
Generate interview questions ONLY from the candidate's resume.
Ignore the job description completely.

JOB POSITION:
${jobPosition}

CANDIDATE RESUME:
${resumeText}

INTERVIEW DURATION:
${duration} minutes

INTERVIEW TYPES:
${interviewTypes}

RULES:
- Every question MUST reference something explicitly from the resume.
- Mention project names, technologies, tools, frameworks from the resume.
- If resume contains projects, ask deep project-based questions.
- If resume contains technologies like Next.js, React, Prisma, Supabase, Node.js, MongoDB, etc., ask specific questions on those.
- DO NOT ask generic questions like "tell me about yourself" or "describe a situation".
- Each question must prove that you actually read the resume.
- Keep questions practical, project-focused, and technical.

BAD EXAMPLES (never generate these):
- "Describe a situation where you solved a bug"
- "Tell me about a time you worked on a team"

GOOD EXAMPLES (generate like these):
- "In your VOX HIRE project, how did you implement real-time voice interviews?"
- "You used Prisma in SkillForge — explain your database schema design."
- "Your resume mentions Next.js — how did you handle routing and server-side logic?"

Return ONLY valid JSON in this exact format, no extra text, no markdown:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Project | Experience",
      "source": "Resume"
    }
  ]
}
`;
    } else {
      // ✅ JOB DESCRIPTION MODE
      FINAL_PROMPT = `
You are a technical interviewer.
Generate interview questions ONLY from the job description.
Ignore the resume completely.

JOB POSITION:
${jobPosition}

JOB DESCRIPTION:
${jobDescription}

INTERVIEW DURATION:
${duration} minutes

INTERVIEW TYPES:
${interviewTypes}

RULES:
- Questions MUST be based only on the job description.
- Focus on role responsibilities, required skills, tools, and expectations.
- Ask role-specific, scenario-based, and technical questions.
- DO NOT ask generic questions.
- Each question must clearly reflect the job description.

GOOD EXAMPLES:
- "How would you design a scalable backend system for this role?"
- "This role requires REST APIs — how would you structure secure and maintainable API routes?"
- "If this role involves database optimization, how would you improve query performance?"

Return ONLY valid JSON in this exact format, no extra text, no markdown:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Problem Solving | Experience",
      "source": "Job Description"
    }
  ]
}
`;
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: FINAL_PROMPT }],
    });

    const rawContent = completion.choices[0]?.message?.content || "";

    // ✅ Safely clean and parse JSON
    let parsed;
    try {
      const cleaned = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr);
      console.error("Raw content was:", rawContent);
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: rawContent },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: parsed,
      mode: resumeText && resumeText.trim().length > 50 ? "resume" : "job_description",
    });

  } catch (e) {
    console.error("AI MODEL ERROR:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}