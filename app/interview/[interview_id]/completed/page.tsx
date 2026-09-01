"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { supabase } from "@/services/supabaseClient";
import { Button } from "@/components/ui/button";
import PdfReportButton from "@/components/PdfReportButton";
import CompetencyRadar from "@/components/CompetencyRadar";
import { CheckCircle2, ArrowRight, Star, ShieldCheck, Award, Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function InterviewComplete() {
  const params = useParams();
  const interview_id = Array.isArray(params?.interview_id)
    ? params.interview_id[0]
    : params?.interview_id;

  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionUserName, setSessionUserName] = useState<string>("");
  const [sessionUserEmail, setSessionUserEmail] = useState<string>("");

  useEffect(() => {
    // Rehydrate candidate name & email from sessionStorage if available
    try {
      const saved = sessionStorage.getItem("interviewInfo");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.userName) setSessionUserName(parsed.userName);
        if (parsed?.userEmail) setSessionUserEmail(parsed.userEmail);
      }
    } catch (e) {
      console.error("Session restore error:", e);
    }

    if (interview_id) {
      fetchFeedback();
    }
  }, [interview_id]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("interview-feedback")
        .select("*")
        .eq("interview_id", interview_id)
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setFeedbackData(data);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const rawFeedback = feedbackData?.feedback || {};
  const feedbackObj = rawFeedback?.feedback || rawFeedback || {};
  const ratingObj = feedbackObj?.rating || feedbackObj?.ratings || {};

  const extractScore = (obj: any, keys: string[]): number => {
    if (!obj || typeof obj !== "object") return 0;
    for (const key of keys) {
      for (const prop of Object.keys(obj)) {
        if (prop.toLowerCase().replace(/[^a-z]/g, "") === key.toLowerCase().replace(/[^a-z]/g, "")) {
          const val = Number(obj[prop]);
          if (!isNaN(val) && val >= 0) return val;
        }
      }
    }
    return 0;
  };

  const techScore = extractScore(ratingObj, ["technicalSkills", "technical_skills", "technicalskills", "technical"]);
  const commScore = extractScore(ratingObj, ["communication", "communication_skills", "communicationskills", "comm"]);
  const probScore = extractScore(ratingObj, ["problemSolving", "problem_solving", "problemsolving", "problem"]);
  const expScore = extractScore(ratingObj, ["experience", "experience_skills", "experienceskills", "exp"]);

  const isRecommended = feedbackData?.recommended === true || feedbackObj?.Recommendation === true || feedbackObj?.Recommendation === "Yes";
  const candidateName = feedbackData?.userName && feedbackData.userName !== "Candidate" ? feedbackData.userName : (sessionUserName || "Candidate");
  const candidateEmail = feedbackData?.userEmail && feedbackData.userEmail !== "No Email" ? feedbackData.userEmail : (sessionUserEmail || "Not Provided");

  const isEarlyTermination =
    feedbackData?.status === "cancelled" ||
    (techScore === 0 && commScore === 0 && probScore === 0 && expScore === 0) ||
    (feedbackObj?.summery && feedbackObj.summery.toLowerCase().includes("ended early"));

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans relative px-6 py-10 md:px-16 overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="mx-auto max-w-4xl flex items-center justify-between pb-8 border-b border-zinc-900">
        <Logo size="lg" href="/" />
        <Link href="/">
          <Button variant="outline" className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white text-xs">
            Return Home
          </Button>
        </Link>
      </header>

      {/* Hero Completion Container */}
      <div className="mx-auto max-w-4xl mt-12 space-y-8">
        <div className="text-center space-y-4">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xl ${
            isEarlyTermination 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-amber-950/20" 
              : "bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 shadow-indigo-950/30"
          }`}>
            {isEarlyTermination ? <AlertCircle className="h-9 w-9 text-amber-400" /> : <CheckCircle2 className="h-9 w-9 text-indigo-400" />}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            {isEarlyTermination ? "Interview Ended Early" : "Interview Complete & Analyzed"}
          </h1>

          <p className="text-zinc-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            {isEarlyTermination
              ? "The voice session was stopped before all questions were completed. Evaluation saved for recorded responses."
              : "Thank you for completing your voice interview session with VoxHire AI."}
          </p>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mx-auto" />
            <p className="text-sm font-mono text-zinc-400">Processing Evaluation Report...</p>
          </div>
        )}

        {/* Evaluation Feedback Window */}
        {!loading && (
          <div id="evaluation-report-card" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-10 shadow-2xl shadow-indigo-950/20 space-y-8">
            {/* Top Status & Candidate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono border px-2.5 py-1 rounded-md ${
                    isEarlyTermination 
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20" 
                      : "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                  }`}>
                    {isEarlyTermination ? "Partial Session Saved" : "Session Completed"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-2">
                  Candidate: {candidateName}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Email: {candidateEmail}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <PdfReportButton
                  candidateName={candidateName}
                  candidateEmail={candidateEmail}
                  scores={{ tech: techScore, comm: commScore, prob: probScore, exp: expScore }}
                  summary={feedbackObj?.summery || feedbackObj?.summary || "Evaluation report generated successfully."}
                  fileName={`VoxHire_${candidateName.replace(/\s+/g, "_")}_Report.pdf`}
                />
                {isRecommended ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold text-xs">
                    <Award className="h-4 w-4 text-indigo-400" />
                    Recommended for Next Stage
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium text-xs">
                    <ShieldCheck className="h-4 w-4 text-zinc-400" />
                    {isEarlyTermination ? "Requires Full Retake" : "Evaluation Saved"}
                  </span>
                )}
              </div>
            </div>

            {/* Skill Ratings Grid & Competency Radar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                  AI Evaluation Breakdown
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RatingCard title="Technical Skills" score={techScore} />
                  <RatingCard title="Communication" score={commScore} />
                  <RatingCard title="Problem Solving" score={probScore} />
                  <RatingCard title="Experience" score={expScore} />
                </div>
              </div>

              <div className="flex justify-center">
                <CompetencyRadar
                  scores={{
                    technicalDepth: extractScore(ratingObj, ["technicalDepth", "technical_depth", "technicalskills", "technicalSkills"]),
                    problemSolving: probScore,
                    communicationClarity: extractScore(ratingObj, ["communicationClarity", "communication_clarity", "communication"]),
                    confidenceVelocity: extractScore(ratingObj, ["confidenceVelocity", "confidence_velocity", "experience"]),
                    roleFit: extractScore(ratingObj, ["roleFit", "role_fit", "experience"]),
                  }}
                  size={240}
                />
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="rounded-2xl border border-zinc-800/80 bg-black p-6 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Sparkles className="h-4 w-4" />
                <span>AI Assessment Summary</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {feedbackObj?.summery ||
                  feedbackObj?.summary ||
                  (isEarlyTermination
                    ? "The interview was manually stopped before full completion. Limited conversation data was available for AI evaluation."
                    : "Evaluation report generated successfully based on candidate voice responses.")}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-900">
              <p className="text-xs text-zinc-500">
                Evaluation report saved to recruiter dashboard.
              </p>
              <Link href="/auth">
                <Button className="btn-gradient text-white rounded-xl font-semibold text-sm px-6 py-2.5 shadow-lg shadow-indigo-600/30">
                  Access Recruiter Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function RatingCard({ title, score }: { title: string; score: number }) {
  const displayScore = typeof score === "number" && !isNaN(score) ? Math.min(Math.max(score, 0), 10) : 0;
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-black p-4 text-center">
      <div className="flex items-center justify-center gap-1 text-indigo-400 mb-1">
        <Star className={`h-4 w-4 ${displayScore > 0 ? "fill-indigo-400 text-indigo-400" : "text-zinc-600"}`} />
        <span className="font-extrabold text-lg text-white">{displayScore}</span>
        <span className="text-xs text-zinc-500">/10</span>
      </div>
      <p className="text-xs font-medium text-zinc-400">{title}</p>
    </div>
  );
}