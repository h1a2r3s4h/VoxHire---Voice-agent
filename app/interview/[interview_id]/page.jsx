"use client";

import { Input } from "@/components/ui/input";
import { Clock, Video, Info, Loader2Icon, Mic } from "lucide-react";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";

const Interview = () => {
  const { interview_id } = useParams();
  const [userEmail, setUserEmail] = useState("");
  const [interview, setInterview] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  const id = Array.isArray(interview_id) ? interview_id[0] : interview_id;

  useEffect(() => {
    if (id) {
      getInterviewDetails();
    }
  }, [id]);

  const getInterviewDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Interviews")
        .select("jobPosition, jobDescription, duration, type")
        .eq("interview_id", id)
        .single();

      if (error || !data) {
        toast.error("Incorrect Interview ID. Please check the link.");
        return;
      }

      setInterview(data);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error("Something went wrong while fetching interview details.");
    } finally {
      setLoading(false);
    }
  };

  const onJoinInterview = async () => {
    if (!userName.trim()) {
      toast.error("Please enter your name before joining.");
      return;
    }

    if (!userEmail.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", id)
        .single();

      if (error || !data) {
        toast.error("Interview not found. Please check the link.");
        return;
      }

      setInterviewInfo({
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        interviewData: data,
      });

      router.push(`/interview/${id}/start`);
    } catch (error) {
      console.error("Join interview error:", error);
      toast.error("Something went wrong while joining the interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="w-full max-w-md bg-card/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(37,99,235,0.1)] p-8 flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
          <Mic className="h-7 w-7 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Vox</span>
          <span className="text-foreground">Hire</span>
        </div>

        <p className="text-muted-foreground text-sm font-medium">AI-Powered Assessment Platform</p>

        <Image
          src="/interview.png"
          alt="Interview Illustration"
          width={220}
          height={220}
          priority
          className="object-contain"
        />

        <h2 className="text-xl font-semibold text-foreground">
          {interview?.jobPosition || "Loading..."} Interview
        </h2>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="w-4 h-4" />
          <span>{interview?.duration || 0} Minutes</span>
        </div>

        <div className="w-full text-left space-y-2">
          <label htmlFor="fullname" className="text-sm font-medium text-muted-foreground">
            Enter your full name
          </label>
          <Input
            id="fullname"
            type="text"
            placeholder="e.g. John Smith"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-background/50 border-white/10 focus-visible:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="w-full text-left space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            Enter your email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. johnsmith@example.com"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full bg-background/50 border-white/10 focus-visible:ring-blue-500/50 transition-all"
          />
        </div>

        <div className="w-full bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 text-left shadow-inner">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
            <div>
              <p className="font-bold text-blue-100 text-sm mb-2">
                Before you begin
              </p>
              <ul className="text-blue-300/80 text-sm space-y-1.5 font-medium">
                <li>• Test your camera and microphone</li>
                <li>• Ensure you have a stable internet connection</li>
                <li>• Find a quiet place for interview</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
          disabled={loading || !userName.trim() || !userEmail.trim()}
          onClick={onJoinInterview}
        >
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              Join Interview
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Interview;