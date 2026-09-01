import Link from "next/link";
import Logo from "@/components/Logo";
import {
  ArrowRight,
  Clock3,
  Mic,
  Users,
  Sparkles,
  ShieldCheck,
  Brain,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Clock3 className="h-6 w-6 text-indigo-400" />,
      title: "Save Screening Hours",
      desc: "Automate initial candidate voice calls and focus your time purely on qualified top talent.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-400" />,
      title: "AI Feedback & Scoring",
      desc: "Receive instant structured evaluation scores, detailed transcripts, and hiring recommendations.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-400" />,
      title: "Standardized Screening",
      desc: "Ensure 100% objective, unbiased, and structured first-round candidate screens.",
    },
  ];

  const steps = [
    {
      no: "01",
      title: "Create Interview",
      desc: "Define job roles and let AI craft targeted interview screening questions.",
    },
    {
      no: "02",
      title: "Share Unique Link",
      desc: "Candidates join the interactive voice call on their browser whenever convenient.",
    },
    {
      no: "03",
      title: "Review Candidate Scores",
      desc: "Access structured ratings, full transcripts, and instant hiring recommendations.",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans relative overflow-x-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo size="md" href="/" />

          <nav className="hidden items-center gap-8 md:flex text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="btn-gradient inline-flex items-center justify-center rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-lg"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-sm shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>AI Recruiter Voice Agent 2.0</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]">
            Automate Screening Calls with <br />
            <span className="text-gradient">Real-Time Voice AI</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Screen candidates faster, smarter, and at scale. VoxHire conducts interactive initial voice interviews, generates structured evaluations, and ranks top applicants automatically.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth"
              className="btn-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 px-8 py-3.5 text-base font-semibold text-zinc-300 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-700"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="mt-16 mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl">
          <div className="rounded-2xl border border-zinc-800/80 bg-black p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-sm font-semibold text-white">Live Voice Interview Session</span>
              </div>
              <span className="text-xs font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 rounded-lg">
                Vapi WebRTC Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-indigo-500/30 bg-zinc-950 p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-indigo-950/20">
                <div className="relative mb-4">
                  <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-indigo-500/20" />
                  <div className="relative h-16 w-16 rounded-full bg-indigo-600/10 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Mic className="h-8 w-8" />
                  </div>
                </div>
                <h4 className="font-bold text-white text-base">AI Interviewer</h4>
                <p className="text-xs text-indigo-300 mt-2 animate-pulse">● Speaking question 2 of 5...</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-white text-base">Candidate</h4>
                <p className="text-xs text-zinc-500 mt-2">Listening to response...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Engineered for Modern Hiring Teams
            </h2>
            <p className="mt-3 text-zinc-400 text-base">
              Everything you need to automate initial phone screens without compromising candidate experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 p-8 transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="mb-6 inline-flex p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 lg:px-8 border-b border-zinc-900 bg-zinc-950/40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              How VoxHire Works
            </h2>
            <p className="mt-3 text-zinc-400 text-base">
              Three simple steps from creating job listings to receiving candidate scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.no} className="relative rounded-3xl border border-zinc-800 bg-black p-8 transition-all duration-300 hover:border-indigo-500/40">
                <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg">
                  {step.no}
                </span>
                <h3 className="mt-6 text-xl font-bold text-white mb-2.5">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-white">Vox<span className="text-indigo-400">Hire</span></span>
          </div>

          <p>© 2026 VoxHire. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}