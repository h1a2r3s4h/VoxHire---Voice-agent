import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterviewType } from "@/services/Constants";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";

const FormContainer = ({ onHandleInputChange, GoToNext }) => {
  const [interviewType, setInterviewType] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const AddInterviewType = (type) => {
    let updatedTypes = [];

    if (interviewType.includes(type)) {
      updatedTypes = interviewType.filter((item) => item !== type);
    } else {
      updatedTypes = [...interviewType, type];
    }

    setInterviewType(updatedTypes);
    onHandleInputChange("type", updatedTypes);
  };

  const handleJobPositionChange = (event) => {
    onHandleInputChange("jobPosition", event.target.value);
  };

  const handleJobDescriptionChange = (event) => {
    const value = event.target.value;
    setJobDescription(value);
    onHandleInputChange("jobDescription", value);
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isValidFile =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".doc") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isValidFile) {
      alert("Please upload a PDF, DOC, or DOCX resume.");
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    onHandleInputChange("resumeFile", file);
  };

  const removeResume = () => {
    setResumeFile(null);
    onHandleInputChange("resumeFile", null);

    const fileInput = document.getElementById("resume-upload");
    if (fileInput) fileInput.value = "";
  };

  const sourceMode = useMemo(() => {
    if (resumeFile && jobDescription.trim()) return "Resume + Job Description";
    if (resumeFile) return "Resume Only";
    if (jobDescription.trim()) return "Job Description Only";
    return "No Input";
  }, [resumeFile, jobDescription]);

  const canGenerate = !!resumeFile || !!jobDescription.trim();

  return (
    <div className="p-8 bg-card rounded-2xl border border-white/5 shadow-lg shadow-black/50">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Full Stack Developer"
          className="mt-2 bg-background border-white/10 focus-visible:ring-blue-500/50 transition-all"
          onChange={handleJobPositionChange}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Upload Resume</h2>

        <label
          htmlFor="resume-upload"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-background/50 p-6 text-center transition-all hover:border-blue-500 hover:bg-blue-500/5"
        >
          <Upload className="h-6 w-6 text-blue-400 mb-2" />
          <p className="mt-2 text-sm font-medium text-foreground">
            Click to upload resume
          </p>
          <p className="mt-1 text-xs text-muted-foreground">PDF, DOCX up to 5MB</p>
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleResumeChange}
        />

        {resumeFile && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-blue-500/30 bg-blue-900/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-200 truncate max-w-[220px]">
                {resumeFile.name}
              </span>
            </div>

            <button
              type="button"
              onClick={removeResume}
              className="rounded-full p-1 text-muted-foreground transition hover:bg-card hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            OR
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description..."
          className="h-[200px] mt-2 bg-background border-white/10 focus-visible:ring-blue-500/50 transition-all resize-none"
          value={jobDescription}
          onChange={handleJobDescriptionChange}
        />
      </div>

      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-900/10 px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-emerald-200/70">
          Provide resume, job description, or both for better context.
        </p>
        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
          {sourceMode}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select
          onValueChange={(value) => onHandleInputChange("duration", value)}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="5">5 Min</SelectItem>
            <SelectItem value="15">15 Min</SelectItem>
            <SelectItem value="30">30 Min</SelectItem>
            <SelectItem value="45">45 Min</SelectItem>
            <SelectItem value="60">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>

        <div className="flex gap-3 flex-wrap mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer gap-2 py-2 px-5 border rounded-full transition-all duration-200 ${
                interviewType.includes(type.title)
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-transparent text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-background border-white/10 text-muted-foreground hover:bg-white/5 hover:border-white/20"
              }`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className={`h-4 w-4 ${interviewType.includes(type.title) ? "text-white" : "text-muted-foreground"}`} />
              <span className="text-sm font-semibold">{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button 
          disabled={!canGenerate} 
          onClick={() => GoToNext()}
          className="px-8 py-6 text-lg font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
        >
          Generate Questions
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;