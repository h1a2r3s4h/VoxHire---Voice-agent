'use client';
import React, { useState, useEffect } from 'react';
import InterviewHeader from './_components/InterviewHeader';
import { InterviewDataContext } from '@/context/InterviewDataContext';

const InterviewLayout = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('interviewInfo');
    if (saved) {
      try {
        setInterviewInfo(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse saved interview info:", err);
      }
    }
  }, []);

  const handleSetInterviewInfo = (data) => {
    setInterviewInfo(data);
    if (data) {
      sessionStorage.setItem('interviewInfo', JSON.stringify(data));
    }
  };

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo: handleSetInterviewInfo }}>
      <div className="bg-black min-h-screen text-zinc-100 font-sans">
        <InterviewHeader />
        <main>{children}</main>
      </div>
    </InterviewDataContext.Provider>
  );
};

export default InterviewLayout;