'use client';
import React, { useState, useEffect } from 'react';
import InterviewHeader from './_components/InterviewHeader';
import { Toaster } from "sonner";
import { InterviewDataContext } from '@/context/InterviewDataContext';

const InterviewLayout = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState(null);

  // ✅ Load from sessionStorage AFTER mount (fixes hydration error)
  useEffect(() => {
    const saved = sessionStorage.getItem('interviewInfo');
    if (saved) {
      setInterviewInfo(JSON.parse(saved));
    }
  }, []);

  const handleSetInterviewInfo = (data) => {
    setInterviewInfo(data);
    sessionStorage.setItem('interviewInfo', JSON.stringify(data));
  };

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo: handleSetInterviewInfo }}>
      <div className='bg-secondary min-h-screen'>
        <InterviewHeader />
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </InterviewDataContext.Provider>
  );
};

export default InterviewLayout;