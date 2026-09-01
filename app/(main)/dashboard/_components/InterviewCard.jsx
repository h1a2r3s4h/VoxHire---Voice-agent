"use client";

import moment from "moment";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send, MessageSquare, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";

function InterviewCard({ interview, viewDetail = false, onRefresh }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/${interview?.interview_id}`;

  const feedbackList =
    interview?.["interview-feedback"] ||
    interview?.interview_feedback ||
    interview?.feedback ||
    interview?.candidates ||
    [];

  const candidateCount = Array.isArray(feedbackList) ? feedbackList.length : 0;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Interview link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Interview Link");
    const body = encodeURIComponent(`Here is the interview link:\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(`Here is the interview link: ${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleDelete = async () => {
    if (!interview?.interview_id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${interview?.jobPosition || "this interview"}" from history?`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      await supabase
        .from("interview-feedback")
        .delete()
        .eq("interview_id", interview.interview_id);

      const { error } = await supabase
        .from("Interviews")
        .delete()
        .eq("interview_id", interview.interview_id);

      if (error) {
        toast.error("Failed to delete interview.");
      } else {
        toast.success("Interview deleted successfully.");
        onRefresh?.();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error removing interview.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-extrabold text-sm uppercase group-hover:border-indigo-500/60 transition-colors">
            {interview?.jobPosition?.[0] || "I"}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-mono">
              {interview?.created_at
                ? moment(interview.created_at).format("DD MMM YYYY")
                : "No date"}
            </span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete interview"
              className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <h3 className="mt-5 font-extrabold text-lg text-white capitalize line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {interview?.jobPosition || "Software Engineer"}
        </h3>

        <div className="mt-3.5 flex items-center justify-between text-xs">
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 rounded-lg">
            {interview?.duration || "15"} Min
          </span>
          <span className="text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg font-semibold">
            {candidateCount} Candidates
          </span>
        </div>
      </div>

      {!viewDetail ? (
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-zinc-900">
          <Button
            variant="outline"
            className="rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs px-2 py-2"
            onClick={copyLink}
          >
            <Copy className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Copy
          </Button>

          <Button
            variant="outline"
            className="rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs px-2 py-2"
            onClick={sendEmail}
          >
            <Send className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Email
          </Button>

          <Button
            variant="outline"
            className="rounded-xl border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs px-2 py-2"
            onClick={sendWhatsApp}
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1 text-indigo-400" />
            Share
          </Button>
        </div>
      ) : (
        <Link
          href={`/scheduled-interview/${interview?.interview_id}/details`}
          className="block mt-6"
        >
          <Button className="w-full bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-xs font-semibold py-2.5 transition-all" variant="outline">
            View Details <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;