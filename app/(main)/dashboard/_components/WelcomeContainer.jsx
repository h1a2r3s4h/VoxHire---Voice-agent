"use client";

import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";
import { User as UserIcon, Sparkles } from "lucide-react";

const WelcomeContainer = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser({
          name:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email ||
            "User",
          picture: user.user_metadata?.avatar_url || null,
        });
      }
    };

    getCurrUser();
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 p-6 md:p-8 rounded-3xl flex justify-between items-center relative overflow-hidden shadow-xl shadow-indigo-950/10">
      {/* Soft Gradient Corner Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 mb-2">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Recruiter Workspace</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Welcome back, {user?.name || "User"} 👋
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          AI-Driven Candidate Screening, Hassle-Free Hiring.
        </p>
      </div>

      {user?.picture ? (
        <img
          src={user.picture}
          alt="userAvatar"
          className="relative z-10 w-12 h-12 rounded-2xl border border-indigo-500/30 object-cover shadow-md"
        />
      ) : (
        <div className="relative z-10 w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-base shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || <UserIcon className="h-5 w-5" />}
        </div>
      )}
    </div>
  );
};

export default WelcomeContainer;