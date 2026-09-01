"use client";

import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";

const ScheduledInterview = () => {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from("Interviews")
      .select(`
        created_at,
        jobPosition,
        duration,
        interview_id,
        userEmail,
        interview-feedback (
          userEmail,
          feedback,
          recommended
        )
      `)
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    if (error) {
      console.warn("Supabase query warning:", error);
      return;
    }
    setInterviewList(data || []);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl text-white tracking-tight">
        Scheduled Interviews & Candidate Feedback
      </h2>

      {interviewList?.length === 0 && (
        <div className="p-8 flex flex-col gap-3 items-center text-center bg-zinc-950 border border-zinc-800 rounded-2xl mt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-white">No interviews found</h3>
          <p className="text-sm text-zinc-400 max-w-sm">
            Create an interview to start receiving candidate feedback.
          </p>
          <Link href="/dashboard/create-interview" className="mt-2">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg text-sm font-semibold">
              + Create New Interview
            </Button>
          </Link>
        </div>
      )}

      {interviewList?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-4">
          {interviewList.map((interview) => (
            <InterviewCard
              key={interview.interview_id}
              interview={interview}
              viewDetail={true}
              onRefresh={GetInterviewList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterview;