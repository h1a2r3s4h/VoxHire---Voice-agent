import { Calendar, Clock, Briefcase, HelpCircle } from "lucide-react";
import React from "react";
import CandidateList from "./CandidateList";

const InterviewDetailContainer = ({ interviewDetail, loading }) => {
  if (loading) {
    return (
      <div className="mt-5 rounded-xl border bg-white p-5">
        Loading...
      </div>
    );
  }

  if (!interviewDetail) {
    return (
      <div className="mt-5 rounded-xl border bg-white p-5">
        No interview detail found.
      </div>
    );
  }

  console.log("Interview Detail Full:", interviewDetail);
  console.log("Feedback Data:", interviewDetail?.["interview-feedback"]);
  console.log("Feedback Data 2:", interviewDetail?.interview_feedback);

  let questions = [];

  try {
    questions =
      typeof interviewDetail?.questionList === "string"
        ? JSON.parse(interviewDetail.questionList || "[]")
        : interviewDetail?.questionList || [];
  } catch (error) {
    console.error("Question parse error:", error);
    questions = [];
  }

  const formattedDate = interviewDetail?.created_at
    ? new Date(interviewDetail.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  const candidateList =
    interviewDetail?.["interview-feedback"] ||
    interviewDetail?.interview_feedback ||
    [];

  return (
    <div className="mt-5 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">
        {interviewDetail?.jobPosition}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Duration</h2>
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Clock className="h-5 w-5" />
            <span>{interviewDetail?.duration} Min</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Created On</h2>
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="h-5 w-5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Type</h2>
          <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Briefcase className="h-5 w-5" />
            <span>{interviewDetail?.type || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
        <p className="mt-3 leading-8 text-gray-700">
          {interviewDetail?.jobDescription || "No description available"}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Interview Questions
        </h2>

        {questions.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
            {questions.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <HelpCircle className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                <div className="text-base leading-7 text-gray-800">
                  <span className="font-semibold">{index + 1}.</span>{" "}
                  {typeof item === "string" ? item : item?.question}
                  {item?.type && (
                    <div className="mt-1 text-sm text-gray-500">
                      Type: {item.type}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-gray-600">No questions available</p>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <CandidateList candidateList={candidateList} />
      </div>
    </div>
  );
};

export default InterviewDetailContainer;