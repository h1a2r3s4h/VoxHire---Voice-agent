import React from "react";

const QuestionListContainer = ({ questionList }) => {
  return (
    <div>
      <h2 className="font-bold text-lg">Generated Interview Questions</h2>

      {questionList.map((q, index) => (
        <div
          key={index}
          className="p-4 border rounded-lg bg-card shadow-sm shadow-black/50"
        >
          <h3 className="font-semibold">
            {index + 1}. {q.question}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Type: {q.type}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionListContainer;
