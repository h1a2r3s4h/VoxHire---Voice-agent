"use client";

import moment from "moment";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Send } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false }) {
   console.log("InterviewCard Data:", interview);
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
      toast("Link copied to clipboard!");
    } catch {
      toast("Failed to copy link");
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

  return (
    <div className="p-5 bg-white rounded-xl border">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 bg-primary rounded-full"></div>

        <h2 className="text-sm text-gray-500">
          {interview?.created_at
            ? moment(interview.created_at).format("DD MMM YYYY")
            : "No date"}
        </h2>
      </div>

      <h2 className="mt-4 font-bold text-lg">{interview?.jobPosition}</h2>

      <h2 className="mt-2 text-gray-500 flex justify-between">
        <span>{interview?.duration} Min</span>
        <span className="text-green-700">{candidateCount} Candidates</span>
      </h2>

      {!viewDetail ? (
        <div className="grid grid-cols-3 gap-3 mt-5">
          <Button variant="outline" className="rounded-xl" onClick={copyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>

          <Button variant="outline" className="rounded-xl" onClick={sendEmail}>
            <Send className="w-4 h-4 mr-2" />
            Email
          </Button>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
            onClick={sendWhatsApp}
          >
            <FaWhatsapp className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      ) : (
        <Link
          href={`/scheduled-interview/${interview?.interview_id}/details`}
          className="block mt-5"
        >
          <Button className="w-full" variant="outline">
            View Detail <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default InterviewCard;