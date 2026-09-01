import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const {
      jobPosition = "",
      jobDescription = "",
      duration = "15",
      type = [],
      resumeText = "",
    } = await req.json();

    const interviewTypes = Array.isArray(type) ? type.join(", ") : type;

    const hasResume = resumeText && resumeText.trim().length > 50;
    const hasJobDesc = jobDescription && jobDescription.trim().length > 10;

    let FINAL_PROMPT = "";
    let mode = "";

    if (hasResume && hasJobDesc) {
      mode = "both";
      FINAL_PROMPT = `
You are a strict technical interviewer.
Generate interview questions based on BOTH the candidate's resume AND the job description.

JOB POSITION:
${jobPosition}

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

INTERVIEW DURATION:
${duration} minutes

INTERVIEW TYPES:
${interviewTypes}

RULES:
- Generate a balanced mix of 5 questions.
- Ask questions targeting their specific past experience from the resume.
- Ask questions testing their knowledge on the required skills for the role from the job description.
- Keep questions practical, project-focused, and technical.

Return ONLY valid JSON in this exact format, no extra text, no markdown:
{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Project | Experience | Behavioral",
      "source": "Resume & Job Description"
    }
  ]
}
`;
    } else if (hasResume) {
      mode = "resume";
      FINAL_PROMPT = `
You are a strict technical interviewer.
Generate interview questions ONLY from the candidate's resume.

JOB POSITION:
${jobPosition}

CANDIDATE RESUME:
${resumeText}

INTERVIEW DURATION:
${duration} minutes

INTERVIEW TYPES:
${interviewTypes}

RULES:
- Generate 5 questions.
- Every question MUST reference something explicitly from the resume.
- Mention project names, technologies, tools, frameworks from the resume.

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
      mode = "job_description";
      FINAL_PROMPT = `
You are a technical interviewer.
Generate interview questions ONLY from the job description.

JOB POSITION:
${jobPosition}

JOB DESCRIPTION:
${jobDescription}

INTERVIEW DURATION:
${duration} minutes

INTERVIEW TYPES:
${interviewTypes}

RULES:
- Generate 5 questions based on the job position and skills.
- Focus on role responsibilities, required skills, tools, and expectations.

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

    const apiKey = process.env.OPENROUTER_API_KEY || "";

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY missing, using fallback interview questions");
      return NextResponse.json({
        content: getFallbackQuestions(jobPosition, mode),
        mode: mode,
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

      const rawContent = completion.choices[0]?.message?.content || "";
      const cleaned = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      return NextResponse.json({
        content: parsed,
        mode: mode,
      });
    } catch (apiErr: any) {
      console.error("OpenRouter API Call Error:", apiErr?.message || apiErr);

      // Try secondary free model fallback if primary 401s or fails
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

        const rawContent = fallbackCompletion.choices[0]?.message?.content || "";
        const cleaned = rawContent
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        return NextResponse.json({
          content: parsed,
          mode: mode,
        });
      } catch (fallbackErr) {
        console.warn("Secondary model fallback also failed, returning fallback structured questions.");
        return NextResponse.json({
          content: getFallbackQuestions(jobPosition, mode),
          mode: mode,
        });
      }
    }
  } catch (e: any) {
    console.error("AI MODEL ROUTE ERROR:", e);
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}

function getFallbackQuestions(jobPosition: string, mode: string) {
  const role = jobPosition || "Software Engineer";
  return {
    interviewQuestions: [
      {
        question: `Can you introduce yourself and describe your experience related to the ${role} role?`,
        type: "Experience",
        source: mode,
      },
      {
        question: `What technical tools and frameworks do you use most frequently for ${role} development?`,
        type: "Technical",
        source: mode,
      },
      {
        question: `Describe a challenging project you built recently. What architecture decisions did you make?`,
        type: "Project",
        source: mode,
      },
      {
        question: `How do you approach debugging complex production issues and performance bottlenecks?`,
        type: "Problem Solving",
        source: mode,
      },
      {
        question: `Where do you see your technical growth over the next 2-3 years in this field?`,
        type: "Behavioral",
        source: mode,
      },
    ],
  };
}
