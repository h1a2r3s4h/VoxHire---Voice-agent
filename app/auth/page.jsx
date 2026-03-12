"use client";

import React from "react";
import Image from "next/image";
import { supabase } from "@/services/supabaseClient";

const Login = () => {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="text-blue-500">Vox</span>
            <span className="text-black">Hire</span>
          </h1>

          <div className="mt-6">
            <Image
              src="/logo.png"
              alt="Logo"
              width={600}
              height={400}
              className="h-[220px] w-[360px] object-contain"
              priority
            />
          </div>

          <h2 className="mt-6 text-center text-2xl font-bold">
            Welcome to AIcruiter
          </h2>

          <p className="mt-2 text-center text-gray-500">
            Sign in with Google to continue
          </p>

          <button
            onClick={signInWithGoogle}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border bg-white py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-6 w-6"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.844 32.91 29.274 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 16.108 19.002 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.252 0-9.812-3.073-11.282-7.461l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.707 2.002-2.017 3.704-3.743 4.965l.003-.002 6.19 5.238C36.9 39.041 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;