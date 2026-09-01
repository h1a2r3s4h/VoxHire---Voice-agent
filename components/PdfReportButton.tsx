"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";

interface PdfReportButtonProps {
  candidateName?: string;
  candidateEmail?: string;
  jobPosition?: string;
  scores?: {
    tech: number;
    comm: number;
    prob: number;
    exp: number;
  };
  summary?: string;
  fileName?: string;
  targetId?: string;
}

export default function PdfReportButton({
  candidateName = "Candidate",
  candidateEmail = "Not Provided",
  jobPosition = "AI Voice Screening",
  scores = { tech: 0, comm: 0, prob: 0, exp: 0 },
  summary = "Evaluation report generated based on candidate responses.",
  fileName = "VoxHire_Evaluation_Report.pdf",
}: PdfReportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      toast.info("Generating PDF report...");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Background Header Block
      doc.setFillColor(15, 15, 20);
      doc.rect(0, 0, 210, 45, "F");

      // Title & Brand Logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Vox", 14, 22);
      doc.setTextColor(99, 102, 241);
      doc.text("Hire", 30, 22);

      doc.setFontSize(10);
      doc.setTextColor(161, 161, 170);
      doc.text("AI RECRUITER ASSESSMENT REPORT", 14, 30);
      doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), 14, 37);

      // Divider
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(1);
      doc.line(14, 45, 196, 45);

      // Candidate Profile Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Candidate Profile", 14, 58);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 75);
      doc.text(`Full Name: ${candidateName}`, 14, 66);
      doc.text(`Email: ${candidateEmail}`, 14, 72);
      doc.text(`Position: ${jobPosition}`, 14, 78);

      // Scores Section Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("AI Skill Evaluation Breakdown", 14, 94);

      // Score Cards Grid
      const drawScoreBox = (x: number, y: number, label: string, scoreVal: number) => {
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(x, y, 42, 24, 3, 3, "F");
        doc.setDrawColor(220, 220, 230);
        doc.roundedRect(x, y, 42, 24, 3, 3, "S");

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(99, 102, 241);
        doc.text(`${scoreVal}/10`, x + 21, y + 11, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 110);
        doc.text(label, x + 21, y + 19, { align: "center" });
      };

      drawScoreBox(14, 102, "Technical Skills", scores.tech);
      drawScoreBox(60, 102, "Communication", scores.comm);
      drawScoreBox(106, 102, "Problem Solving", scores.prob);
      drawScoreBox(152, 102, "Experience", scores.exp);

      // AI Summary Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("AI Executive Assessment Summary", 14, 140);

      doc.setFillColor(248, 248, 252);
      doc.roundedRect(14, 146, 182, 45, 3, 3, "F");
      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.roundedRect(14, 146, 182, 45, 3, 3, "S");

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 60);

      const splitSummary = doc.splitTextToSize(summary, 172);
      doc.text(splitSummary, 19, 156);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 150);
      doc.text("Generated automatically by VoxHire Voice AI Screening Platform", 14, 280);

      doc.save(fileName);
      toast.success("PDF Report downloaded successfully!");
    } catch (err: any) {
      console.error("PDF Export Error:", err);
      toast.error(`PDF export failed: ${err?.message || "Export error"}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExportPdf}
      disabled={exporting}
      variant="outline"
      className="border-indigo-500/30 bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 text-xs font-semibold rounded-xl px-4 py-2 flex items-center gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
          Exporting PDF...
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          Export PDF Report
        </>
      )}
    </Button>
  );
}
