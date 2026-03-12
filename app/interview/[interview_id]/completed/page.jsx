import Image from "next/image";
import React from "react";
import { Check, Send } from "lucide-react";

const InterviewComplete = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] px-6 py-6 md:px-10">
      

      {/* Main Content */}
      <div className="mt-10 flex flex-col items-center">
        {/* Success Icon */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-md">
          <Check className="h-12 w-12 text-black" strokeWidth={3} />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-center text-4xl font-extrabold text-black md:text-5xl">
          Interview Complete!
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-center text-lg text-gray-500 md:text-xl">
          Thank you for participating in the AI-driven interview with AIcruiter
        </p>

        {/* Interview Image */}
        <div className="mt-8 w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg">
          <Image
            src="/interview-complete.png" // put your image in public folder with this name
            alt="Interview Complete"
            width={1400}
            height={700}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        {/* What's Next Card */}
        <div className="mt-10 w-full max-w-2xl rounded-2xl bg-white px-8 py-10 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
            <Send className="h-8 w-8 text-white" />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-black">What&apos;s Next?</h2>

          <p className="mt-4 text-lg leading-8 text-gray-400">
            The recruiter will review your interview responses and will contact
            you soon regarding the next steps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;