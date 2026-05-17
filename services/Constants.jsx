import {
  LayoutDashboard,
  Calendar,
  List,
  WalletCards,
  Settings,
  User2Icon,
  BriefcaseBusinessIcon,
  Puzzle,
  Code2Icon,
  Crown,
} from "lucide-react";

export const SideBarOptions = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Scheduled Interview",
    icon: Calendar,
    path: "/scheduled-interview",
  },
  {
    name: "All Interview",
    icon: List,
    path: "/all-interview",
  },
  {
    name: "Billing",
    icon: WalletCards,
    path: "/billing",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export const InterviewType = [
  {
    title: "Technical",
    icon: Code2Icon,
  },
  {
    title: "Behavioral",
    icon: User2Icon,
  },
  {
    title: "Experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Problem Solving",
    icon: Puzzle,
  },
  {
    title: "Leadership",
    icon: Crown,
  },
];

export const QUESTIONS_PROMPT = `You are an expert technical interviewer.

Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Your task:
- Analyze the job description to identify key responsibilities, required skills, and expected experience.
- Generate a list of interview questions depending on interview duration.
- Adjust the number and depth of questions to match the interview duration.
- Ensure the questions match the tone and structure of a real-life {{type}} interview.

IMPORTANT OUTPUT RULES:
- Output ONLY valid JSON
- Do NOT include markdown
- Do NOT include \`\`\`
- Do NOT include extra text

Return JSON in this exact format:

{
  "interviewQuestions": [
    {
      "question": "string",
      "type": "Technical | Behavioral | Experience | Problem Solving | Leadership"
    }
  ]
}

The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.`;

export const FEEDBACK_PROMPT = `{{conversation}}
Based on this Interview Conversation between the assistant and the user, give me feedback for the user interview.
IMPORTANT: Even if the conversation is extremely short, incomplete, or stopped manually, you MUST evaluate whatever is available. If no questions were answered, assign a rating of 0.
Give me a rating out of 10 for technical Skills, Communication, Problem Solving, and Experience. 
Also give me a summary in 3 lines about the interview and one line to let me know whether they are recommended for hire or not with a message.
You must NEVER respond with plain text. Return ONLY the JSON in this exact format:
{
    "feedback": {
        "rating": {
            "technicalSkills": 5,
            "communication": 6,
            "problemSolving": 4,
            "experience": 7
        },
        "summery": "<in 3 Lines>",
        "Recommendation": true,
        "RecommendationMsg": ""
    }
}`