"use client";

import { Input } from "@/components/ui/input";
import { Clock, Video, Info, Loader2, Volume2, Mic, CheckCircle2, X } from "lucide-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";

const Interview = () => {
  const { interview_id } = useParams();
  const [userEmail, setUserEmail] = useState("");
  const [interview, setInterview] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWarmUpModal, setShowWarmUpModal] = useState(false);
  const [testMicActive, setTestMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);

  const { setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  const animRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const id = Array.isArray(interview_id) ? interview_id[0] : interview_id;

  useEffect(() => {
    if (id) {
      getInterviewDetails();
    }
  }, [id]);

  const getInterviewDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Interviews")
        .select("jobPosition, jobDescription, duration, type")
        .eq("interview_id", id)
        .single();

      if (error || !data) {
        toast.error("Incorrect Interview Link. Please verify with your recruiter.");
        return;
      }

      setInterview(data);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      toast.error("Something went wrong while fetching interview details.");
    } finally {
      setLoading(false);
    }
  };

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setTestMicActive(true);

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.error("Mic test error:", err);
      toast.error("Microphone access failed. Please check permissions.");
    }
  };

  const stopMicTest = () => {
    setTestMicActive(false);
    setMicLevel(0);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  const playTestAudio = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      toast.info("Audio synthesis test played.");
      return;
    }
    const utter = new SpeechSynthesisUtterance("Hi there! Audio check complete. Your speakers are working perfectly.");
    utter.rate = 1;
    synth.speak(utter);
  };

  const onJoinInterview = async () => {
    if (!userName.trim()) {
      toast.error("Please enter your name before joining.");
      return;
    }

    if (!userEmail.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_id", id)
        .single();

      if (error || !data) {
        toast.error("Interview session not found.");
        return;
      }

      setInterviewInfo({
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        interviewData: data,
      });

      router.push(`/interview/${id}/start`);
    } catch (error) {
      console.error("Join interview error:", error);
      toast.error("Something went wrong while joining the interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-black relative overflow-hidden px-4 py-12">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800/80 rounded-3xl shadow-2xl shadow-indigo-950/20 p-8 flex flex-col items-center text-center space-y-6 relative z-10">
        <div className="space-y-1">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            Candidate Assessment Portal
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-3">
            {interview?.jobPosition || "Screening Call"}
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 mt-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Duration: {interview?.duration || 15} Minutes</span>
          </div>
        </div>

        <div className="w-full text-left space-y-4 pt-2">
          <div className="space-y-1.5">
            <label htmlFor="fullname" className="text-xs font-semibold text-zinc-400">
              Full Name
            </label>
            <Input
              id="fullname"
              type="text"
              placeholder="e.g. Harshit Gangwar"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-zinc-400">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. candidate@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* Audio Warm-Up Button */}
        <button
          type="button"
          onClick={() => {
            setShowWarmUpModal(true);
            startMicTest();
          }}
          className="w-full border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-xl p-3 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Volume2 className="w-4 h-4 text-indigo-400" />
          Test Mic & Audio Warm-Up
        </button>

        <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 text-left">
          <div className="flex gap-3">
            <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs mb-1.5">
                Before You Start
              </p>
              <ul className="text-zinc-400 text-xs space-y-1 leading-relaxed">
                <li>• Ensure microphone permissions are enabled</li>
                <li>• Use a stable internet connection</li>
                <li>• Speak clearly when responding to the AI</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          className="btn-gradient w-full text-white font-bold py-3 text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={loading || !userName.trim() || !userEmail.trim()}
          onClick={onJoinInterview}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              Join Voice Interview
            </>
          )}
        </Button>
      </div>

      {/* Mic Warm-Up Modal */}
      {showWarmUpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-5 relative shadow-2xl">
            <button
              onClick={() => {
                stopMicTest();
                setShowWarmUpModal(false);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              <Mic className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Audio & Mic Warm-Up</h3>
              <p className="text-xs text-zinc-400 mt-1">Speak into your mic to test input level</p>
            </div>

            {/* Level Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Mic Sensitivity</span>
                <span className="font-mono text-indigo-400">{micLevel}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-75"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={playTestAudio}
              className="w-full border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white text-xs py-2 rounded-xl flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-indigo-400" />
              Play Test Speaker Sound
            </Button>

            <Button
              onClick={() => {
                stopMicTest();
                setShowWarmUpModal(false);
              }}
              className="btn-gradient w-full text-white text-xs font-semibold py-2.5 rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Audio Looks Good!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;