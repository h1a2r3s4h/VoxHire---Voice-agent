export interface QuestionItem {
  question: string;
  answer?: string;
}

export interface InterviewData {
  jobPosition?: string;
  jobDesc?: string;
  jobExperience?: string;
  questionList?: QuestionItem[];
}

export interface InterviewInfo {
  userName?: string;
  userEmail?: string;
  interviewData?: InterviewData;
  interview_id?: string;
}

export interface RatingScore {
  technicalSkills?: number;
  communication?: number;
  problemSolving?: number;
  experience?: number;
}

export interface FeedbackData {
  rating?: RatingScore;
  summery?: string;
  Recommendation?: boolean | string;
  RecommendationMsg?: string;
  status?: string;
  message?: string;
}

export interface SupabaseFeedbackRecord {
  userName: string;
  userEmail: string;
  interview_id: string;
  feedback: FeedbackData | any;
  recommended: boolean;
  status: "completed" | "cancelled" | "in_progress";
}

export interface ConversationTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface VapiMessage {
  type?: string;
  transcriptType?: string;
  role?: "user" | "assistant" | "system";
  transcript?: string;
  text?: string;
  content?: string;
  message?: string;
  conversation?: ConversationTurn[];
  error?: any;
}
