"use client";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidateList from "./_components/CandidateList";

const InterviewDetail = () => {
  const params = useParams();
  const interview_id = Array.isArray(params?.interview_id)
    ? params.interview_id[0]
    : params?.interview_id;

  const { user } = useUser();
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email && interview_id) {
      GetInterviewDetail();
    }
  }, [user?.email, interview_id]);

  const GetInterviewDetail = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("Interviews")
      .select(`
        jobPosition,
        jobDescription,
        type,
        questionList,
        duration,
        interview_id,
        created_at,
        userEmail,
        interview-feedback (
          userEmail,
          userName,
          feedback,
          created_at,
          recommended
        )
      `)
      .eq("userEmail", user?.email)
      .eq("interview_id", interview_id)
      .maybeSingle();

    if (error) {
      setInterviewDetail(null);
    } else {
      // ✅ Deduplicate feedback by userEmail
      const feedback = data?.["interview-feedback"] || [];
      const uniqueFeedback = feedback.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.userEmail === item.userEmail)
      );
      setInterviewDetail({ ...data, "interview-feedback": uniqueFeedback });
    }

    setLoading(false);
  };

  return (
    <div className="mt-5">
      <h2 className="font-bold text-2xl">Interview Detail</h2>
      <InterviewDetailContainer
        interviewDetail={interviewDetail}
        loading={loading}
      />
      {/* ✅ Fixed prop name: candidateList not CandidateList */}
      <CandidateList
        candidateList={interviewDetail?.["interview-feedback"] || []}
      />
    </div>
  );
};

export default InterviewDetail;