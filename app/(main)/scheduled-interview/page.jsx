"use client";

import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

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

    console.log("SELECT ERROR:", error);
    console.log("DATA:", data);

    if (error) return;
    setInterviewList(data || []);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-3xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Interview List with Candidate Feedback</h2>

      {interviewList?.length === 0 && (
        <div className="p-10 flex flex-col gap-4 items-center bg-card mt-8 rounded-2xl border border-white/5 shadow-lg shadow-black/50">
          <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Video className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-xl font-medium text-muted-foreground">You don't have any interviews created yet!</h2>
          <Button className="mt-2 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02]">
            + Create New Interview
          </Button>
        </div>
      )}

      {interviewList?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-5">
          {interviewList.map((interview) => (
            <InterviewCard
              key={interview.interview_id}
              interview={interview}
              viewDetail={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledInterview;