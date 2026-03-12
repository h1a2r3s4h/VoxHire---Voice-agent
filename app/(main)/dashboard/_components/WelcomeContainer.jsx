"use client";

import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState } from "react";

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
    <div className="bg-white p-3 rounded-2xl flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold">
          Welcome Back, {user?.name || "User"}
        </h2>
        <h2 className="text-gray-500">
          AI-Driven Interviews, Hassle-Free Hiring
        </h2>
      </div>

      {user?.picture ? (
        <img
          src={user.picture}
          alt="userAvatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      )}
    </div>
  );
};

export default WelcomeContainer;