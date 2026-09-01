"use client";

import React from "react";
import { Trophy, Award, ShieldCheck, Star } from "lucide-react";

interface CandidateLeaderboardProps {
  candidateList: any[];
}

export default function CandidateLeaderboard({ candidateList }: CandidateLeaderboardProps) {
  if (!candidateList || candidateList.length === 0) return null;

  // Process & rank candidates by overall score
  const rankedCandidates = candidateList
    .map((candidate) => {
      const rawObj = candidate?.feedback || {};
      const feedbackObj = rawObj?.feedback || rawObj || {};
      const ratingObj = feedbackObj?.rating || {};

      const tech = typeof ratingObj.technicalSkills === "number" ? ratingObj.technicalSkills : 0;
      const comm = typeof ratingObj.communication === "number" ? ratingObj.communication : 0;
      const prob = typeof ratingObj.problemSolving === "number" ? ratingObj.problemSolving : 0;
      const exp = typeof ratingObj.experience === "number" ? ratingObj.experience : 0;

      const avgScore = Number(((tech + comm + prob + exp) / 4).toFixed(1));
      const isRecommended = candidate?.recommended === true || feedbackObj?.Recommendation === true || feedbackObj?.Recommendation === "Yes";

      return {
        ...candidate,
        avgScore,
        tech,
        comm,
        prob,
        exp,
        isRecommended,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="font-extrabold text-lg text-white">
            Candidate Performance Leaderboard
          </h3>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          Total Candidates: {rankedCandidates.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase">
              <th className="pb-3 px-2">Rank</th>
              <th className="pb-3 px-2">Candidate</th>
              <th className="pb-3 px-2 text-center">Avg Score</th>
              <th className="pb-3 px-2 text-center">Tech</th>
              <th className="pb-3 px-2 text-center">Comm</th>
              <th className="pb-3 px-2 text-center">Problem</th>
              <th className="pb-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900/60">
            {rankedCandidates.map((cand, index) => {
              const isTop = index === 0 && cand.avgScore > 0;
              return (
                <tr key={index} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-2 font-bold font-mono">
                    {isTop ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-extrabold">
                        <Trophy className="h-4 w-4" /> #1
                      </span>
                    ) : (
                      <span className="text-zinc-400">#{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-white text-sm">
                      {cand.userName || "Candidate"}
                    </p>
                    <p className="text-[11px] text-zinc-500">{cand.userEmail || "No Email"}</p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="font-extrabold text-indigo-400 text-sm">
                      {cand.avgScore} <span className="text-[10px] text-zinc-500">/10</span>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-zinc-300">{cand.tech}</td>
                  <td className="py-3 px-2 text-center font-mono text-zinc-300">{cand.comm}</td>
                  <td className="py-3 px-2 text-center font-mono text-zinc-300">{cand.prob}</td>
                  <td className="py-3 px-2 text-right">
                    {cand.isRecommended ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-[11px]">
                        <Award className="h-3 w-3 text-indigo-400" />
                        Recommended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium text-[11px]">
                        <ShieldCheck className="h-3 w-3 text-zinc-500" />
                        Reviewed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
