"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import InterviewTimer from "./_components/InterviewTimer";
import { Bot, User, Mic, Phone } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";

const StartInterview = () => {
  const { interviewInfo } = useContext(InterviewDataContext);

  const [activeUser, setActiveUser] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const { interview_id } = useParams();
  const id = Array.isArray(interview_id) ? interview_id[0] : interview_id;

  const vapiRef = useRef(null);
  const callStartedRef = useRef(false);
  const conversationRef = useRef(null);
  const manualConversationRef = useRef([]);
  const feedbackSavedRef = useRef(false);
  const manualStopRef = useRef(false);
  const endingRef = useRef(false);
  const redirectingRef = useRef(false);

  const completedPath = `/interview/${id}/completed`;

  const hardRedirectToCompleted = () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    window.location.replace(completedPath);
  };

  const saveCancelledInterview = async () => {
    try {
      const { error } = await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo?.userName || "Candidate",
          userEmail: interviewInfo?.userEmail || "No Email",
          interview_id: id,
          feedback: {
            status: "cancelled",
            message: "Interview cancelled before completion",
          },
          recommended: false,
          status: "cancelled",
        },
      ]);

      if (error) {
        console.error("Supabase cancel insert error:", error);
        toast.error("Failed to save cancelled interview.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Cancel interview save error:", error);
      toast.error("Something went wrong while saving cancelled interview.");
      return false;
    }
  };

  const generateFeedback = async (currConversation) => {
    try {
      if (!currConversation) {
        console.warn("No conversation found, redirecting without feedback");
        toast.error("Conversation not found for feedback.");
        hardRedirectToCompleted();
        return;
      }

      const result = await axios.post("/api/ai-feedback", {
        conversation: currConversation,
      });

      const content = result?.data?.content || "";
      const finalContent = content
        .replace("```json", "")
        .replace("```", "")
        .trim();

      let parsedFeedback;
      try {
        parsedFeedback = JSON.parse(finalContent);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, finalContent);
        toast.error("Interview ended very early. Generating partial evaluation.");
        
        // Fallback save so we don't lose the record and still show a report
        parsedFeedback = {
          feedback: {
            rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
            summery: "The interview was manually ended early. There was not enough conversation data for the AI to provide a comprehensive evaluation.",
            Recommendation: false,
            RecommendationMsg: "Please ask the candidate to complete a full interview."
          }
        };
      }

      const isRecommended =
        parsedFeedback?.feedback?.Recommendation === "Yes" ||
        parsedFeedback?.feedback?.Recommendation === true;

      await supabase.from("Interviews").upsert({
        interview_id: id,
      });

      const { error } = await supabase.from("interview-feedback").insert([
        {
          userName: interviewInfo?.userName || "Candidate",
          userEmail: interviewInfo?.userEmail || "No Email",
          interview_id: id,
          feedback: parsedFeedback,
          recommended: isRecommended,
          status: "completed",
        },
      ]);

      if (error) {
        console.error("Supabase feedback insert error:", error);
        toast.error("Failed to save feedback.");
      }

      hardRedirectToCompleted();
    } catch (error) {
      console.error("Feedback generation error:", error);
      toast.error("Failed to generate feedback.");
      hardRedirectToCompleted();
    }
  };

  const startCall = async () => {
    if (!interviewInfo?.interviewData || !vapiRef.current) return;

    const questions = interviewInfo?.interviewData?.questionList || [];
    const questionList = questions
      .map((item, index) => `${index + 1}. ${item?.question}`)
      .join("\n");

    const jobPosition = interviewInfo?.interviewData?.jobPosition || "this role";

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "11labs",
        voiceId: "bIHbv24MWmeRgasZH58o",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting an interview for ${jobPosition}.

You must ask ONLY the interview questions provided below, one at a time, and wait for the candidate's response before moving to the next question.

Interview questions:
${questionList}

Rules:
- Ask one question at a time.
- Wait for the candidate's answer before asking the next question.
- After each answer, give a brief professional acknowledgment.
- If the candidate struggles, rephrase the question or offer a small hint without revealing the answer.
- Do not ask unrelated follow-up questions.
- Do not continue the conversation after the final question.
- After all questions are completed, say exactly:
"The interview is now complete. Thank you for your time."
- After saying that, end the call.

Keep the conversation professional, concise, and focused on ${jobPosition}.
            `.trim(),
          },
        ],
      },
    };

    try {
      setInterviewStarted(true);
      await vapiRef.current.start(assistantOptions);
      toast.success("Call connected...");
    } catch (error) {
      console.error("Error starting call:", error);
      setInterviewStarted(false);
      toast.error("Failed to start interview.");
    }
  };

  const stopInterview = async () => {
    if (endingRef.current) return;

    endingRef.current = true;
    manualStopRef.current = true;
    feedbackSavedRef.current = true;
    setInterviewStarted(false);

    // Capture the conversation BEFORE stopping the call
    // Prefer our manual transcript accumulator as it is updated in real-time
    const finalConversation = 
      manualConversationRef.current && manualConversationRef.current.length > 0 
        ? manualConversationRef.current 
        : conversationRef.current;

    try {
      if (vapiRef.current) {
        await vapiRef.current.stop?.();
      }

      await supabase.from("Interviews").upsert({
        interview_id: id,
      });

      if (finalConversation && finalConversation.length > 0) {
        toast.success("Generating feedback for partial interview...");
        await generateFeedback(finalConversation);
      } else {
        toast.error("Generating empty feedback report...");
        // Instead of saveCancelledInterview(), generate an empty fallback to show report
        await generateFeedback([{ role: "system", content: "Interview ended before conversation started." }]);
      }
    } catch (error) {
      console.error("Error stopping interview:", error);
    } finally {
      hardRedirectToCompleted();
    }
  };

  useEffect(() => {
    if (vapiRef.current) return;

    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
    vapiRef.current = vapi;

    const handleMessage = async (message) => {
      console.log("Vapi message:", message);

      if (message?.conversation) {
        conversationRef.current = message.conversation;
      }

      // Manually accumulate final transcripts to ensure we don't miss anything if the user stops early
      if (message?.type === "transcript" && message?.transcriptType === "final") {
        manualConversationRef.current.push({
          role: message.role || "user",
          content: message.transcript,
        });
      }

      const text =
        message?.transcript ||
        message?.text ||
        message?.content ||
        message?.message ||
        "";

      if (
        typeof text === "string" &&
        text.toLowerCase().includes("the interview is now complete")
      ) {
        console.log("Completion phrase detected. Stopping call...");
        if (endingRef.current) return;

        endingRef.current = true;
        setInterviewStarted(false);

        try {
          await vapiRef.current?.stop?.();
        } catch (error) {
          console.error("Auto-stop error:", error);

          if (!feedbackSavedRef.current) {
            feedbackSavedRef.current = true;
            await generateFeedback(conversationRef.current);
          }
        }
      }
    };

    const handleSpeechStart = () => {
      setActiveUser(false);
    };

    const handleSpeechEnd = () => {
      setActiveUser(true);
    };

    const handleCallEnd = async () => {
      console.log("Vapi call ended");
      setInterviewStarted(false);

      if (manualStopRef.current) return;

      if (feedbackSavedRef.current) return;

      feedbackSavedRef.current = true;
      const finalConv = 
        manualConversationRef.current && manualConversationRef.current.length > 0 
          ? manualConversationRef.current 
          : conversationRef.current;
      await generateFeedback(finalConv);
    };

    vapi.on("message", handleMessage);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("call-end", handleCallEnd);

    return () => {
      try {
        setInterviewStarted(false);

        if (vapiRef.current) {
          vapiRef.current.off("message", handleMessage);
          vapiRef.current.off("speech-start", handleSpeechStart);
          vapiRef.current.off("speech-end", handleSpeechEnd);
          vapiRef.current.off("call-end", handleCallEnd);
          vapiRef.current.stop?.();
        }
      } catch (error) {
        console.error("Cleanup error:", error);
      }

      vapiRef.current = null;
    };
  }, [id, interviewInfo]);

  useEffect(() => {
    if (interviewInfo && vapiRef.current && !callStartedRef.current) {
      callStartedRef.current = true;
      startCall();
    }
  }, [interviewInfo]);

  if (!interviewInfo) {
    return (
      <div className="p-20 text-center text-muted-foreground">
        Interview data not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-20 lg:px-48 xl:px-56 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background" />

      <h2 className="relative z-10 flex justify-between text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
        Live Interview Session
        <InterviewTimer isRunning={interviewStarted} />
      </h2>

      <div className="relative z-10 mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          className={`flex flex-col items-center justify-center gap-4 rounded-3xl border p-20 transition-all duration-500 backdrop-blur-2xl ${
            !activeUser
              ? "border-blue-500/50 shadow-[0_0_40px_rgba(37,99,235,0.15)] bg-blue-900/20 scale-[1.02]"
              : "border-white/5 bg-card/50 scale-100"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {!activeUser && (
              <>
                <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-blue-500 opacity-20" />
                <span className="delay-75 absolute inline-flex h-20 w-20 animate-ping rounded-full bg-blue-400 opacity-30" />
              </>
            )}
            <Bot className={`relative z-10 h-16 w-16 transition-colors duration-300 ${!activeUser ? "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" : "text-muted-foreground"}`} />
          </div>
          <p className={`font-bold text-lg mt-2 transition-colors ${!activeUser ? "text-blue-100" : "text-muted-foreground"}`}>AI Interviewer</p>
          {!activeUser && (
            <span className="animate-pulse text-xs font-medium text-blue-400">
              ● Speaking...
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-4 rounded-3xl border p-20 transition-all duration-500 backdrop-blur-2xl ${
            activeUser
              ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] bg-emerald-900/20 scale-[1.02]"
              : "border-white/5 bg-card/50 scale-100"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {activeUser && (
              <>
                <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-emerald-500 opacity-20" />
                <span className="delay-75 absolute inline-flex h-20 w-20 animate-ping rounded-full bg-emerald-400 opacity-30" />
              </>
            )}
            <User className={`relative z-10 h-16 w-16 transition-colors duration-300 ${activeUser ? "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" : "text-muted-foreground"}`} />
          </div>
          <p className={`font-bold text-lg mt-2 transition-colors ${activeUser ? "text-emerald-100" : "text-muted-foreground"}`}>
            {interviewInfo?.userName || "Candidate"}
          </p>
          {activeUser && (
            <span className="animate-pulse text-xs font-medium text-green-400">
              ● Speaking...
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-12 flex justify-center gap-8">
        <button
          type="button"
          className="rounded-full bg-white/5 border border-white/10 p-5 shadow-lg transition-all hover:bg-white/10 hover:scale-110"
        >
          <Mic className="h-6 w-6 cursor-pointer text-white" />
        </button>

        <AlertConfirmation stopInterview={stopInterview}>
          <button
            type="button"
            className="rounded-full bg-red-600 p-5 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:bg-red-500 hover:scale-110"
          >
            <Phone className="h-6 w-6 rotate-[135deg] cursor-pointer text-white drop-shadow-md" />
          </button>
        </AlertConfirmation>
      </div>

      <p className="relative z-10 mt-8 text-center text-sm font-medium text-blue-400 animate-pulse tracking-wide">
        Interview in Progress...
      </p>
    </div>
  );
};

export default StartInterview;