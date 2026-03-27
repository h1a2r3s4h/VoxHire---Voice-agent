import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/app/provider";

const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [inputSource, setInputSource] = useState("");

  const { user } = useUser();
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (!formData || hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;
    GenerateQuestionList();
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);

    try {
      let extractedResumeText = "";

      // ✅ Step 1: Parse resume if uploaded
      if (formData?.resumeFile) {
        const uploadData = new FormData();
        uploadData.append("resume", formData.resumeFile);

        const parseResult = await axios.post("/api/parse-resume", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        extractedResumeText = parseResult?.data?.resumeText || "";
        setResumeText(extractedResumeText);
      }

      const source = extractedResumeText
        ? "resume_only"
        : "job_description_only";

      setInputSource(source);

      // ✅ Step 2: Send to AI
      const payload = {
        jobPosition: formData?.jobPosition || "",
        jobDescription: formData?.jobDescription || "",
        duration: formData?.duration || "",
        type: formData?.type || [],
        resumeText: extractedResumeText,
      };

      const result = await axios.post("/api/ai-model", payload);

      // ✅ Step 3: FIX - route.js now returns parsed object, not raw string
      // So we just read it directly — NO JSON.parse needed
      const content = result?.data?.content;

      let questions = [];

      if (typeof content === "string") {
        // Fallback: if AI returned raw string, clean and parse it
        const cleaned = content.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        questions = parsed?.interviewQuestions || [];
      } else if (content?.interviewQuestions) {
        // ✅ Normal path: content is already a parsed object
        questions = content.interviewQuestions;
      }

      setQuestionList(questions);

      if (questions.length === 0) {
        toast("No questions generated. Try improving your resume or job description.");
      }

    } catch (e) {
      console.log("GenerateQuestionList Error:", e);
      toast("Server Error, Try Again");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    try {
      setSaveLoading(true);

      const interview_id = uuidv4();

      const { error } = await supabase.from("Interviews").insert([
        {
          jobPosition: formData?.jobPosition || "",
          jobDescription: formData?.jobDescription || "",
          duration: formData?.duration || "",
          type: formData?.type || [],
          questionList,
          userEmail: user?.email,
          interview_id,
          resumeText,
          inputSource,
          resumeFileName: formData?.resumeFile?.name || null,
        },
      ]);

      if (error) {
        console.log("Supabase Save Error:", error);
        toast("Failed to save interview");
        return;
      }

      onCreateLink(interview_id);
    } catch (error) {
      console.log("onFinish Error:", error);
      toast("Something went wrong while saving");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary gap-5 flex items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">Our AI is crafting personalized questions</p>
          </div>
        </div>
      )}

      {!loading && questionList.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border bg-white p-3 text-sm">
            <span className="font-semibold">Source:</span>{" "}
            {inputSource === "resume_only"
              ? "Resume Only"
              : "Job Description Only"}
          </div>
          <QuestionListContainer questionList={questionList} />
        </div>
      )}

      {!loading && questionList.length > 0 && (
        <div className="flex justify-end mt-10">
          <Button onClick={onFinish} disabled={saveLoading}>
            {saveLoading && <Loader2Icon className="animate-spin mr-2" />}
            Create Interview Link & Finish
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;