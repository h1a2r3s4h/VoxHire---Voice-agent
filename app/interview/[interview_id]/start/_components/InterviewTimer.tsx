"use client";

import { Timer } from "lucide-react";
import React, { useEffect, useState } from "react";

interface InterviewTimerProps {
  isRunning: boolean;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((curr) => curr + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const secs = String(totalSeconds % 60).padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <span className="flex items-center gap-2" data-testid="interview-timer">
      <Timer />
      {formatTime(seconds)}
    </span>
  );
};

export default InterviewTimer;
