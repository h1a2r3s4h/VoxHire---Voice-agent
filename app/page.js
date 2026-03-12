import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Menu,
  Mic,
  Phone,
  Users,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Clock3 className="h-10 w-10 text-blue-600" />,
      title: "Save Time",
      desc: "Automate initial screening interviews and focus on final candidates.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-blue-600" />,
      title: "Data-Driven Insights",
      desc: "Get detailed analytics and candidate comparisons based on interview responses.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Reduce Bias",
      desc: "Standardized interviews help eliminate unconscious bias in the hiring process.",
    },
  ];

  const steps = [
    {
      no: "1",
      title: "Create Interview",
      desc: "Set up your job requirements and customize interview questions.",
    },
    {
      no: "2",
      title: "Share with Candidates",
      desc: "Send interview links to candidates to complete at their convenience.",
    },
    {
      no: "3",
      title: "Review Results",
      desc: "Get AI-analyzed results, transcripts, and candidate comparisons.",
    },
  ];

  const pricing = [
    {
      title: "Starter",
      price: "Free",
      desc: "Perfect for testing and small hiring flows.",
      points: ["1 active interview", "Basic dashboard", "Email sharing"],
    },
    {
      title: "Pro",
      price: "₹999/mo",
      desc: "Best for growing teams and recruiters.",
      points: ["Unlimited interviews", "Analytics", "Candidate review tools"],
      highlight: true,
    },
    {
      title: "Enterprise",
      price: "Custom",
      desc: "For teams needing scale and custom workflows.",
      points: ["Custom integrations", "Priority support", "Advanced reporting"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Mic className="h-7 w-7 text-blue-600" />
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-blue-500">Vox</span>
              <span className="text-black">Hire</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            <a
              href="#features"
              className="text-lg font-medium text-slate-700 transition hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-lg font-medium text-slate-700 transition hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium text-slate-700 transition hover:text-blue-600"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 md:inline-flex"
            >
              Dashboard
            </Link>

            <button className="inline-flex rounded-lg border border-slate-200 p-2 md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 md:text-6xl xl:text-7xl">
              AI-Powered <span className="text-blue-600">Interview</span>
              <br />
              <span className="text-blue-600">Assistant</span> for Modern
              <br />
              Recruiters
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-10 text-slate-500 md:text-2xl">
              An AI-powered voice interviewer that conducts automated interviews, evaluates candidates, and helps companies hire faster.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Create Interview
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right mock dashboard */}
          <div className="relative">
            <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#fbfdff]">
                <div className="grid min-h-[520px] grid-cols-[220px_1fr]">
                  {/* Sidebar */}
                  <div className="border-r border-slate-200 bg-white p-4">
                    <div className="mb-6 text-xl font-bold">
                      <span className="text-blue-600">AI</span>cruiter
                    </div>

                    <button className="mb-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-left text-sm font-semibold text-white">
                      + Create New Interview
                    </button>

                    <div className="space-y-2">
                      <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                        Dashboard
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-slate-600">
                        Scheduled Interview
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-slate-600">
                        All Interview
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-slate-600">
                        Billing
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-slate-600">
                        Settings
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-slate-50/50 p-5">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Welcome back, Sarah!
                        </h3>
                        <p className="text-sm text-slate-500">
                          AI-Driven Interviews, Hassle-Free Hiring
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    <h4 className="mt-5 text-xl font-bold text-slate-900">
                      Dashboard
                    </h4>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <Mic className="h-5 w-5 text-blue-600" />
                        </div>
                        <h5 className="font-bold">Create New Interview</h5>
                        <p className="mt-2 text-sm text-slate-500">
                          Create AI interviews and schedule them with
                          candidates.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <h5 className="font-bold">Create Phone Screening Call</h5>
                        <p className="mt-2 text-sm text-slate-500">
                          Schedule phone screening calls with potential
                          candidates.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="mb-4 font-bold text-slate-900">
                        Previously Created Interviews
                      </h5>

                      <div className="grid gap-4 md:grid-cols-3">
                        {["Google", "Microsoft", "Amazon"].map((company, i) => (
                          <div
                            key={company}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                {company[0]}
                              </div>
                              <span className="text-xs text-slate-400">
                                20 Oct 2024
                              </span>
                            </div>

                            <h6 className="mt-4 font-bold text-slate-900">
                              Full Stack Developer
                            </h6>
                            <p className="mt-1 text-sm text-slate-500">30 Min</p>

                            <div className="mt-4 flex gap-2">
                              <button className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                                Copy Link
                              </button>
                              <button className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
                                Send
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* soft glow */}
            <div className="absolute -right-8 -top-8 -z-10 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 -z-10 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              Streamline Your Hiring Process
            </h2>
            <p className="mt-4 text-xl leading-9 text-slate-500">
              AiCruiter helps you save time and find better candidates with our
              advanced AI interview technology.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-3xl font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-5 text-lg leading-9 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              How AiCruiter Works
            </h2>
            <p className="mt-4 text-xl leading-9 text-slate-500">
              Three simple steps to transform your recruitment process
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.no} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-700">
                  {step.no}
                </div>
                <h3 className="mt-7 text-3xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-5 text-lg leading-9 text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              Simple Pricing
            </h2>
            <p className="mt-4 text-xl leading-9 text-slate-500">
              Choose the plan that fits your hiring needs.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.title}
                className={`rounded-3xl border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  plan.highlight
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-900"
                }`}
              >
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <div className="mt-4 text-4xl font-extrabold">{plan.price}</div>
                <p
                  className={`mt-4 text-base ${
                    plan.highlight ? "text-blue-50" : "text-slate-500"
                  }`}
                >
                  {plan.desc}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.points.map((point) => (
                    <div key={point} className="text-base">
                      • {point}
                    </div>
                  ))}
                </div>

                <Link
                  href="/auth"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-semibold transition ${
                    plan.highlight
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-slate-200 bg-gradient-to-br from-white to-blue-50 px-8 py-16 text-center shadow-sm md:px-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="mt-5 text-xl leading-9 text-slate-500">
            Join hundreds of companies already using AiCruiter to find the best
            talent.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Get Started for Free
            </Link>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:text-left lg:px-10">
          <div className="flex items-center gap-2">
            <Mic className="h-7 w-7 text-blue-600" />
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-500">AI</span>
              <span className="text-black">cruiter</span>
            </span>
          </div>

          <div className="flex items-center gap-8 text-lg text-slate-600">
            <a href="#" className="hover:text-blue-600">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>

          <p className="text-lg text-slate-500">
            © 2025 AiCruiter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}