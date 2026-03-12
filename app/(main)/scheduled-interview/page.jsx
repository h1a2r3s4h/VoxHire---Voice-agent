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
      <h2 className="font-bold text-xl">Interview List with Candidate Feedback</h2>

      {interviewList?.length === 0 && (
        <div className="p-5 flex flex-col gap-3 items-center bg-white mt-5 rounded-xl border">
          <Video className="h-10 w-10 text-primary" />
          <h2>You don't have any interview created!</h2>
          <Button>+ Create New Interview</Button>
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