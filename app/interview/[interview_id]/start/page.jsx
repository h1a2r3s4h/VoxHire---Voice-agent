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
        toast.error("Invalid feedback JSON received.");
        hardRedirectToCompleted();
        return;
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

    try {
      if (vapiRef.current) {
        await vapiRef.current.stop?.();
      }

      await supabase.from("Interviews").upsert({
        interview_id: id,
      });

      await saveCancelledInterview();
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
      await generateFeedback(conversationRef.current);
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
      <div className="p-20 text-center text-gray-500">
        Interview data not found.
      </div>
    );
  }

  return (
    <div className="p-20 lg:px-48 xl:px-56">
      <h2 className="flex justify-between text-xl font-bold">
        AI Interview Session
        <InterviewTimer isRunning={interviewStarted} />
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
        <div
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border bg-white p-20 transition-all duration-300 ${
            !activeUser
              ? "border-2 border-blue-400 shadow-lg shadow-blue-100"
              : "border-gray-200"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {!activeUser && (
              <>
                <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-blue-400 opacity-20" />
                <span className="delay-75 absolute inline-flex h-16 w-16 animate-ping rounded-full bg-blue-400 opacity-10" />
              </>
            )}
            <Bot className="relative z-10 h-16 w-16 text-blue-600" />
          </div>
          <p className="font-medium text-gray-600">AI Interviewer</p>
          {!activeUser && (
            <span className="animate-pulse text-xs font-medium text-blue-400">
              ● Speaking...
            </span>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center gap-3 rounded-lg border bg-white p-20 transition-all duration-300 ${
            activeUser
              ? "border-2 border-green-400 shadow-lg shadow-green-100"
              : "border-gray-200"
          }`}
        >
          <div className="relative flex items-center justify-center">
            {activeUser && (
              <>
                <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-green-400 opacity-20" />
                <span className="delay-75 absolute inline-flex h-16 w-16 animate-ping rounded-full bg-green-400 opacity-10" />
              </>
            )}
            <User className="relative z-10 h-16 w-16 text-green-600" />
          </div>
          <p className="font-medium text-gray-600">
            {interviewInfo?.userName || "Candidate"}
          </p>
          {activeUser && (
            <span className="animate-pulse text-xs font-medium text-green-400">
              ● Speaking...
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 flex justify-center gap-6">
        <button
          type="button"
          className="rounded-full bg-gray-100 p-4 shadow transition hover:bg-gray-200"
        >
          <Mic className="h-6 w-6 cursor-pointer text-gray-700" />
        </button>

        <AlertConfirmation stopInterview={stopInterview}>
          <button
            type="button"
            className="rounded-full bg-red-500 p-4 shadow transition hover:bg-red-600"
          >
            <Phone className="h-6 w-6 rotate-[135deg] cursor-pointer text-white" />
          </button>
        </AlertConfirmation>
      </div>

      <p className="mt-5 text-center text-sm text-gray-400">
        Interview in Progress...
      </p>
    </div>
  );
};

export default StartInterview;