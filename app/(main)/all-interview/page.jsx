"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/InterviewCard";

const AllInterview = () => {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return;
    }

    // ✅ Remove duplicate interviews by interview_id
    const unique = data?.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.interview_id === item.interview_id)
    );

    setInterviewList(unique || []);
  };

  return (
    <div className="my-5">
      <h2 className="font-bold text-3xl bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">All Created Interviews</h2>

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
              interview={interview}
              key={interview.interview_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllInterview;