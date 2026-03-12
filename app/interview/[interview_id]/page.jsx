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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center space-y-6">
        <div className="flex items-center gap-2 text-3xl font-extrabold tracking-tight">
          <Mic className="h-7 w-7 text-blue-600" />
          <span className="text-blue-600">Vox</span>
          <span className="text-gray-900">Hire</span>
        </div>

        <p className="text-gray-500 text-sm">AI-Powered Interview Platform</p>

        <Image
          src="/interview.png"
          alt="Interview Illustration"
          width={220}
          height={220}
          priority
          className="object-contain"
        />

        <h2 className="text-xl font-semibold text-gray-900">
          {interview?.jobPosition || "Loading..."} Interview
        </h2>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{interview?.duration || 0} Minutes</span>
        </div>

        <div className="w-full text-left space-y-2">
          <label htmlFor="fullname" className="text-sm font-medium text-gray-700">
            Enter your full name
          </label>
          <Input
            id="fullname"
            type="text"
            placeholder="e.g. John Smith"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full text-left space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Enter your email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. johnsmith@example.com"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="w-full bg-blue-100 rounded-xl p-4 text-left">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
            <div>
              <p className="font-semibold text-gray-800 text-sm mb-2">
                Before you begin
              </p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>- Test your camera and microphone</li>
                <li>- Ensure you have a stable internet connection</li>
                <li>- Find a quiet place for interview</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 flex items-center justify-center gap-2"
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