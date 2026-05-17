import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CandidateFeedbackDialog = ({ candidate }) => {
  const feedbackData = candidate?.feedback?.feedback || candidate?.feedback || {};
  const rating = feedbackData?.rating || {};

  const technicalSkills = rating?.technicalSkills ?? rating?.techicalSkills ?? 0;
  const communication = rating?.communication ?? 0;
  const problemSolving = rating?.problemSolving ?? 0;
  const experience = rating?.experience ?? 0;

  const hasCompletedFeedback =
    technicalSkills > 0 ||
    communication > 0 ||
    problemSolving > 0 ||
    experience > 0 ||
    feedbackData?.summery ||
    feedbackData?.RecommendationMsg;

  const avgRating = hasCompletedFeedback
    ? Math.round(
        (technicalSkills + communication + problemSolving + experience) / 4
      )
    : 0;

  const handleSendMsg = () => {
    const subject = hasCompletedFeedback
      ? feedbackData?.Recommendation
        ? "Interview Result - Next Round"
        : "Interview Feedback"
      : "Interview Status Update";

    const body = hasCompletedFeedback
      ? feedbackData?.Recommendation
        ? `Hi ${candidate?.userName || "Candidate"},

Congratulations! Based on your interview performance, you have been shortlisted for the next round.

Summary:
${feedbackData?.summery || "Good performance."}

Best regards,
Recruitment Team`
        : `Hi ${candidate?.userName || "Candidate"},

Thank you for attending the interview.

After reviewing your performance, we will not be moving forward at this time.

Summary:
${feedbackData?.summery || "No summary available."}

Recommendation Message:
${feedbackData?.RecommendationMsg || "Keep improving and apply again in the future."}

Best regards,
Recruitment Team`
      : `Hi ${candidate?.userName || "Candidate"},

Thank you for your time.

Your interview was not completed, so detailed feedback is not available yet.

Best regards,
Recruitment Team`;

    window.location.href = `mailto:${candidate?.userEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const getWidth = (value) => `${(value / 10) * 100}%`;

  const ScoreBar = ({ label, value }) => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium text-muted-foreground">{label}</h2>
        <span className="text-base font-medium text-muted-foreground">{value}/10</span>
      </div>

      <div className="w-full h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: getWidth(value) }}
        />
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-white/10 text-blue-400 hover:bg-white/5 hover:text-blue-300 transition-colors">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl rounded-2xl p-0 overflow-hidden border-white/10 bg-card shadow-2xl shadow-black/50">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Feedback Report
          </DialogTitle>

          <DialogDescription asChild>
            <div className="mt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    {candidate?.userName?.charAt(0) || "U"}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {candidate?.userName || "No Name"}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {candidate?.userEmail || "No Email"}
                    </p>
                  </div>
                </div>

                <div className="text-5xl font-bold text-blue-500">
                  {avgRating}/10
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="px-8 pb-8">
          {!hasCompletedFeedback ? (
            <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 shadow-lg shadow-black/20">
              <h2 className="text-2xl font-bold text-yellow-400 mb-3">
                Interview Incomplete
              </h2>
              <p className="text-lg text-yellow-200/80 leading-8">
                This candidate did not complete the full interview, so detailed
                feedback, ratings, summary, and recommendation are not available.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-muted-foreground mb-6">
                  Skills Assessment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ScoreBar label="Technical Skills" value={technicalSkills} />
                  <ScoreBar label="Communication" value={communication} />
                  <ScoreBar label="Problem Solving" value={problemSolving} />
                  <ScoreBar label="Experience" value={experience} />
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Performance Summary
                </h2>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-muted-foreground text-lg leading-9 shadow-inner">
                  {feedbackData?.summery || "No summary available"}
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg shadow-black/20">
                  <div>
                    <h2 className="text-2xl font-bold text-red-400">
                      Recommendation Msg:
                    </h2>
                    <p className="text-red-300/80 text-lg mt-2 leading-8">
                      {feedbackData?.RecommendationMsg ||
                        "No recommendation message available"}
                    </p>
                  </div>

                  <Button
                    onClick={handleSendMsg}
                    className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] font-bold"
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateFeedbackDialog;