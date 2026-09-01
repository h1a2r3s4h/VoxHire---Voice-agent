"use client";

import { InterviewDataContext } from "@/context/InterviewDataContext";
import InterviewTimer from "./_components/InterviewTimer";
import { Bot, User, Mic, MicOff, Phone } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "./_components/AlertConfirmation";
import { toast } from "sonner";
import axios from "axios";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import { ConversationTurn, VapiMessage } from "@/types";
import AudioWaveVisualizer from "@/components/AudioWaveVisualizer";

const StartInterview: React.FC = () => {
  const { interviewInfo } = useContext(InterviewDataContext);

  const [activeUser, setActiveUser] = useState<boolean>(false);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);

  const { interview_id } = useParams();
  const id = Array.isArray(interview_id) ? interview_id[0] : interview_id;

  const vapiRef = useRef<any>(null);
  const callStartedRef = useRef<boolean>(false);
  const conversationRef = useRef<ConversationTurn[] | null>(null);
  const manualConversationRef = useRef<ConversationTurn[]>([]);
  const feedbackSavedRef = useRef<boolean>(false);
  const manualStopRef = useRef<boolean>(false);
  const endingRef = useRef<boolean>(false);
  const redirectingRef = useRef<boolean>(false);

  const completedPath = `/interview/${id}/completed`;

  const hardRedirectToCompleted = () => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    window.location.replace(completedPath);
  };

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Your browser does not support microphone access.");
        setMicPermissionGranted(false);
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Clean up stream tracks after check
      stream.getTracks().forEach((track) => track.stop());
      setMicPermissionGranted(true);
      return true;
    } catch (err: any) {
      console.error("Microphone permission check failed:", err);
      setMicPermissionGranted(false);
      toast.error("Microphone access denied. Please grant mic permission in your browser to start the interview.");
      return false;
    }
  };

  const generateFeedback = async (currConversation: ConversationTurn[] | null) => {
    try {
      if (!currConversation || currConversation.length === 0) {
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
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsedFeedback;
      try {
        parsedFeedback = JSON.parse(finalContent);
      } catch (parseError) {
        console.error("JSON parse error:", parseError, finalContent);
        toast.error("Generating partial evaluation report...");

        parsedFeedback = {
          feedback: {
            rating: { technicalSkills: 0, communication: 0, problemSolving: 0, experience: 0 },
            summery: "The interview was manually ended early. There was limited conversation data for full AI evaluation.",
            Recommendation: false,
            RecommendationMsg: "Please ask the candidate to retake the interview.",
          },
        };
      }

      const isRecommended =
        parsedFeedback?.feedback?.Recommendation === "Yes" ||
        parsedFeedback?.feedback?.Recommendation === true;

      await supabase.from("Interviews").upsert({
        interview_id: id,
      });

      let finalName = interviewInfo?.userName;
      let finalEmail = interviewInfo?.userEmail;

      if (!finalName || !finalEmail) {
        try {
          const saved = sessionStorage.getItem("interviewInfo");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (!finalName) finalName = parsed?.userName;
            if (!finalEmail) finalEmail = parsed?.userEmail;
          }
        } catch (e) {}
      }

      const { error } = await supabase.from("interview-feedback").insert([
        {
          userName: finalName || "Candidate",
          userEmail: finalEmail || "No Email",
          interview_id: id,
          feedback: parsedFeedback,
          recommended: isRecommended,
          status: manualStopRef.current ? "cancelled" : "completed",
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

    const hasMicPermission = await checkMicrophonePermission();
    if (!hasMicPermission) return;

    const questions = interviewInfo?.interviewData?.questionList || [];
    const questionList = questions
      .map((item, index) => `${index + 1}. ${item?.question}`)
      .join("\n");

    const jobPosition = interviewInfo?.interviewData?.jobPosition || "this role";

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName || "there"}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "azure",
        voiceId: "andrew",
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting an interview for ${jobPosition}.

You must ask ONLY the interview questions provided below, one at a time, and wait for the candidate's response before moving to the next question.

Interview questions:
${questionList}

Rules:
- Ask one core question at a time.
- DEEP-DIVE PROBING RULE: If the candidate gives a short, superficial, or vague response, ask ONE brief technical follow-up probe (e.g. "Can you elaborate on how you handled architecture or performance in that implementation?") before moving to the next question.
- Wait for the candidate's answer before proceeding.
- After each answer, give a brief professional acknowledgment.
- If the candidate struggles, rephrase the question or offer a small hint without revealing the answer.
- Do not ask unrelated questions.
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
    } catch (error: any) {
      console.error("Error starting call:", error);
      setInterviewStarted(false);
      toast.error(`Failed to start interview: ${error?.message || "Connection error"}`);
    }
  };

  const toggleMute = () => {
    if (!vapiRef.current || !interviewStarted) return;
    try {
      const nextMuteState = !isMuted;
      vapiRef.current.setMuted?.(nextMuteState);
      setIsMuted(nextMuteState);
      toast.info(nextMuteState ? "Microphone muted" : "Microphone unmuted");
    } catch (err) {
      console.error("Failed to toggle mute state:", err);
    }
  };

  const stopInterview = async () => {
    if (endingRef.current) return;

    endingRef.current = true;
    manualStopRef.current = true;
    feedbackSavedRef.current = true;
    setInterviewStarted(false);

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
        toast.success("Generating feedback for interview...");
        await generateFeedback(finalConversation);
      } else {
        toast.error("Generating empty evaluation report...");
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

    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      toast.error("Vapi API key missing in environment settings.");
      return;
    }

    const vapi = new Vapi(apiKey);
    vapiRef.current = vapi;

    const handleMessage = async (message: VapiMessage) => {
      console.log("Vapi message:", message);

      if (message?.conversation) {
        conversationRef.current = message.conversation;
      }

      if (message?.type === "transcript" && message?.transcriptType === "final" && message?.transcript) {
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

    const handleError = (error: any) => {
      console.warn("Vapi connection warning:", error);
      if (error?.message && !error.message.includes("Meeting has ended")) {
        toast.error(`Voice connection issue: ${error.message}`);
      }
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
    vapi.on("error", handleError);

    return () => {
      try {
        setInterviewStarted(false);

        if (vapiRef.current) {
          vapiRef.current.off("message", handleMessage);
          vapiRef.current.off("speech-start", handleSpeechStart);
          vapiRef.current.off("speech-end", handleSpeechEnd);
          vapiRef.current.off("call-end", handleCallEnd);
          vapiRef.current.off("error", handleError);
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
    <div className="min-h-screen p-4 sm:p-8 lg:px-24 xl:px-36 bg-black text-zinc-100 font-sans relative">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Interview Session
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Role: <span className="text-indigo-400 font-medium">{interviewInfo?.interviewData?.jobPosition || "Screening Call"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 rounded-lg text-sm text-zinc-300">
            <InterviewTimer isRunning={interviewStarted} />
          </div>
        </div>

        {micPermissionGranted === false && (
          <div className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
            ⚠️ Microphone access is blocked. Please grant microphone permissions in your browser.
          </div>
        )}

        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* AI Interviewer Card */}
          <div
            className={`flex flex-col items-center justify-center gap-4 rounded-2xl border p-6 sm:p-12 transition-all duration-300 bg-zinc-950 ${
              !activeUser && interviewStarted
                ? "border-indigo-500/50 shadow-lg shadow-indigo-950/20"
                : "border-zinc-800"
            }`}
          >
            <div className="relative flex items-center justify-center">
              {!activeUser && interviewStarted && (
                <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-indigo-500/20" />
              )}
              <div className={`h-16 w-16 rounded-full border flex items-center justify-center ${
                !activeUser && interviewStarted
                  ? "border-indigo-500 bg-indigo-600/10 text-indigo-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-500"
              }`}>
                <Bot className="h-8 w-8" />
              </div>
            </div>
            <p className="font-semibold text-base text-white">AI Interviewer</p>
            <AudioWaveVisualizer isActive={!activeUser && interviewStarted} color="#6366f1" />
            {!activeUser && interviewStarted ? (
              <span className="text-xs font-medium text-indigo-400 animate-pulse">
                ● Speaking...
              </span>
            ) : (
              <span className="text-xs text-zinc-500">Listening...</span>
            )}
          </div>

          {/* Candidate Card */}
          <div
            className={`flex flex-col items-center justify-center gap-4 rounded-2xl border p-12 transition-all duration-300 bg-zinc-950 ${
              activeUser
                ? "border-indigo-500/50 shadow-lg shadow-indigo-950/20"
                : "border-zinc-800"
            }`}
          >
            <div className="relative flex items-center justify-center">
              {activeUser && (
                <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-indigo-500/20" />
              )}
              <div className={`h-16 w-16 rounded-full border flex items-center justify-center ${
                activeUser
                  ? "border-indigo-500 bg-indigo-600/10 text-indigo-400"
                  : "border-zinc-800 bg-zinc-900 text-zinc-500"
              }`}>
                <User className="h-8 w-8" />
              </div>
            </div>
            <p className="font-semibold text-base text-white">
              {interviewInfo?.userName || "Candidate"}
            </p>
            <AudioWaveVisualizer isActive={activeUser} color="#6366f1" />
            {activeUser ? (
              <span className="text-xs font-medium text-indigo-400 animate-pulse">
                ● Speaking...
              </span>
            ) : (
              <span className="text-xs text-zinc-500">Listening...</span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 flex justify-center items-center gap-6">
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            className={`rounded-xl border p-4 transition-all ${
              isMuted
                ? "bg-red-500/10 border-red-500/40 text-red-400"
                : "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5 cursor-pointer" /> : <Mic className="h-5 w-5 cursor-pointer" />}
          </button>

          <AlertConfirmation stopInterview={stopInterview}>
            <button
              type="button"
              className="rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-500 flex items-center gap-2"
            >
              <Phone className="h-4 w-4 rotate-[135deg]" />
              End Interview
            </button>
          </AlertConfirmation>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-zinc-500 tracking-wide">
          {interviewStarted ? "Voice session in progress" : "Connecting to voice server..."}
        </p>
      </div>
    </div>
  );
};

export default StartInterview;
