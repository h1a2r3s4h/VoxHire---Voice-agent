import React from 'react';
import Logo from '@/components/Logo';

const InterviewHeader = () => {
  return (
    <header className="px-6 py-4 border-b border-zinc-900 bg-black">
      <div className="mx-auto max-w-6xl flex items-center justify-between">
        <Logo size="md" href="/" />
      </div>
    </header>
  );
};

export default InterviewHeader;