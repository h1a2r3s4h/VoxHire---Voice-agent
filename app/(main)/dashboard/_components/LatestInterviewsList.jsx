"use client";

import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "./InterviewCard";
import Link from "next/link";

const LatestInterviewsList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetInterviewList();
    } else {
      setLoading(false);
    }
  }, [user]);

  const GetInterviewList = async () => {
    setLoading(true);
    let { data: Interviews, error } = await supabase
      .from("Interviews")
      .select("*")
      .eq("userEmail", user?.email)
      .order("id", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Supabase error:", error);
    } else {
      setInterviewList(Interviews || []);
    }
    setLoading(false);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-extrabold text-xl text-white tracking-tight flex items-center gap-2">
          Previously Created Interviews
        </h2>
        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading interviews...
          </div>
        )}
      </div>

      {!loading && interviewList?.length === 0 && (
        <div className="p-10 flex flex-col gap-3 items-center text-center bg-zinc-950 border border-zinc-800/80 rounded-3xl mt-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400">
            <Video className="h-7 w-7" />
          </div>
          <h3 className="font-bold text-lg text-white">No interviews created yet</h3>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            Create your first AI voice screening link to start evaluating candidate responses.
          </p>
          <Link href="/dashboard/create-interview" className="mt-3">
            <Button className="btn-gradient text-white rounded-xl text-sm font-semibold px-6 py-2.5 shadow-lg shadow-indigo-600/30">
              + Create New Interview
            </Button>
          </Link>
        </div>
      )}

      {!loading && interviewList?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {interviewList.map((interview) => (
            <InterviewCard
              interview={interview}
              key={interview.interview_id}
              onRefresh={GetInterviewList}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestInterviewsList;