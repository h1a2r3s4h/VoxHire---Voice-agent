import { describe, it, expect } from "vitest";

function parseFeedbackResponse(content: string) {
  const finalContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(finalContent);
  } catch {
    return {
      feedback: {
        rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
        summery: "Evaluation unavailable.",
        Recommendation: false,
        RecommendationMsg: "Insufficient candidate response.",
      },
    };
  }
}

describe("Feedback Parsing & Fallback Logic", () => {
  it("correctly strips markdown code fences and parses valid JSON", () => {
    const rawAiOutput = "```json\n{\"feedback\": {\"Recommendation\": \"Yes\", \"summery\": \"Great performance\"}}\n```";
    const parsed = parseFeedbackResponse(rawAiOutput);

    expect(parsed.feedback.Recommendation).toBe("Yes");
    expect(parsed.feedback.summery).toBe("Great performance");
  });

  it("returns structured fallback object on invalid JSON content", () => {
    const malformedOutput = "This is not valid json text";
    const parsed = parseFeedbackResponse(malformedOutput);

    expect(parsed.feedback.Recommendation).toBe(false);
    expect(parsed.feedback.rating.technicalSkills).toBe(0);
  });
});
