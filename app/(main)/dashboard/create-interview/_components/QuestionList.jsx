import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { supabase } from "@/services/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/app/provider";
 
const QuestionList = ({ formData, onCreateLink }) => {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);

    try {
      const result = await axios.post("/api/ai-model", { ...formData });

      const content = result.data.content;
      const finalContent = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(finalContent);

      setQuestionList(parsed.interviewQuestions || []);
    } catch (e) {
      console.log(e);
      toast("Server Error, Try Again");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);

    const interview_id = uuidv4();

    const { data, error } = await supabase
      .from("Interviews")
      .insert([
        {
          ...formData,
          questionList,
          userEmail: user?.email,
          interview_id,
        },
      ])
      .select();
  
    setSaveLoading(false);
    onCreateLink(interview_id);
  };
    
  

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary gap-5 flex items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions
            </p>
          </div>
        </div>
      )}

      {!loading && questionList.length > 0 && (
        <div className="mt-5 space-y-3">
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