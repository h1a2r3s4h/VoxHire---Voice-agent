'use client';

import React, { useState } from 'react';
import InterviewHeader from './_components/InterviewHeader';
import { Toaster } from "sonner";
import { InterviewDataContext } from '@/context/InterviewDataContext';

const InterviewLayout = ({ children }) => {
  const [interviewInfo, setInterviewInfo] = useState(null);

  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className='bg-secondary min-h-screen'>
        <InterviewHeader />
        {children}
        <Toaster richColors position="top-right" />
      </div>
    </InterviewDataContext.Provider>
  );
};

export default InterviewLayout;