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
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g full stack developer"
          className="mt-2"
          onChange={handleJobPositionChange}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Upload Resume</h2>

        <label
          htmlFor="resume-upload"
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Upload className="h-5 w-5 text-blue-600" />
          <p className="mt-2 text-sm font-medium text-gray-700">
            Click to upload resume
          </p>
          <p className="mt-1 text-xs text-gray-500">PDF, DOCX</p>
        </label>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleResumeChange}
        />

        {resumeFile && (
          <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 truncate max-w-[220px]">
                {resumeFile.name}
              </span>
            </div>

            <button
              type="button"
              onClick={removeResume}
              className="rounded-full p-1 text-gray-500 transition hover:bg-white hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
            OR
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter detailed job description"
          className="h-[200px] mt-2"
          value={jobDescription}
          onChange={handleJobDescriptionChange}
        />
      </div>

      <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
        <p className="text-xs text-gray-500">
          Upload resume, paste job description, or use both for better question
          generation.
        </p>
        <p className="mt-1 text-xs font-semibold text-blue-600">
          Source: {sourceMode}
        </p>
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
              className={`flex items-center cursor-pointer gap-2 p-1 px-4 border rounded-2xl transition ${
                interviewType.includes(type.title)
                  ? "bg-blue-50 border-primary text-primary"
                  : "bg-white border-gray-300 hover:bg-secondary"
              }`}
              onClick={() => AddInterviewType(type.title)}
            >
              <type.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 flex justify-end">
        <Button disabled={!canGenerate} onClick={() => GoToNext()}>
          Generate Question
        </Button>
      </div>
    </div>
  );
};

export default FormContainer;