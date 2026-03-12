import moment from "moment";
import React from "react";
import CandidateFeedbackDialog from "./CandidateFeedbackDialog";

const CandidateList = ({ candidateList = [] }) => {
  console.log("candidateList:", candidateList);

  if (candidateList.length === 0) {
    return <div className="mt-4 text-gray-500">0 candidates available.</div>;
  }

  return (
    <div className="mt-5 space-y-4">
      <h2 className="my-5 font-bold">
        Candidates ({candidateList.length})
      </h2>

      {candidateList.map((candidate, index) => (
        <div
          key={candidate?.userEmail || index}
          className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white">
              {candidate?.userName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-base font-semibold">
                {candidate?.userName || "No Name"}
              </h2>

              <p className="text-sm text-gray-500">
                Completed On:{" "}
                {candidate?.created_at
                  ? moment(candidate.created_at).format("MM/DD/YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>

          <CandidateFeedbackDialog candidate={candidate} />
        </div>
      ))}
    </div>
  );
};

export default CandidateList;