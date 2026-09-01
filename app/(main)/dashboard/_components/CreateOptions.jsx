import React from "react";
import Link from "next/link";
import { Phone, Video, ArrowRight } from "lucide-react";

const CreateOptions = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link
        href="/dashboard/create-interview"
        className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-7 cursor-pointer hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-300 hover:-translate-y-1 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 group-hover:border-indigo-500/60 transition-colors">
            <Video className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="font-extrabold text-xl mt-5 text-white group-hover:text-indigo-300 transition-colors">
          Create New Interview
        </h3>
        <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
          Set up AI voice interview questions and generate an instant screening link for candidates.
        </p>
      </Link>

      <div className="bg-zinc-950 border border-zinc-800/80 rounded-3xl p-7 cursor-pointer hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20 transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 group-hover:border-indigo-500/60 transition-colors">
            <Phone className="h-6 w-6" />
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>
        <h3 className="font-extrabold text-xl mt-5 text-white group-hover:text-indigo-300 transition-colors">
          Create Phone Screening Call
        </h3>
        <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
          Schedule direct real-time AI phone screening calls with prospective job candidates.
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
