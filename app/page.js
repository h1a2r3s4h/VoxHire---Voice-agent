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
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/30 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Mic className="h-7 w-7 text-blue-600" />
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-blue-500">Vox</span>
              <span className="text-foreground">Hire</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            <a
              href="#features"
              className="text-lg font-medium text-muted-foreground transition hover:text-blue-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-lg font-medium text-muted-foreground transition hover:text-blue-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-lg font-medium text-muted-foreground transition hover:text-blue-600"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="hidden rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm shadow-black/50 transition hover:bg-blue-700 md:inline-flex"
            >
              Dashboard
            </Link>

            <button className="inline-flex cursor-pointer rounded-lg border border-border p-2 transition hover:bg-muted md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl xl:text-7xl">
              AI-Powered <span className="bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">Interview</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Assessment</span> Platform
              <br />
              For Recruiters
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-10 text-muted-foreground md:text-2xl">
              An AI-powered voice interviewer that conducts automated interviews, evaluates candidates, and helps companies hire faster.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth"
                className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] hover:bg-blue-500"
              >
                Create Interview
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href="#features"
                className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-card px-8 py-4 text-lg font-semibold text-foreground shadow-sm shadow-black/50 transition-all hover:scale-[1.02] hover:bg-muted"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Right mock dashboard */}
          <div className="relative">
            <div className="rounded-[32px] border border-border bg-card p-4 shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
              <div className="overflow-hidden rounded-[28px] border border-border bg-[#fbfdff]">
                <div className="grid min-h-[520px] grid-cols-[220px_1fr]">
                  {/* Sidebar */}
                  <div className="border-r border-border bg-card p-4">
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
                      <div className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                        Scheduled Interview
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                        All Interview
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                        Billing
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm text-muted-foreground">
                        Settings
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-muted/50 p-5">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          Welcome back, Sarah!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          AI-Driven Interviews, Hassle-Free Hiring
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                      </div>
                    </div>

                    <h4 className="mt-5 text-xl font-bold text-foreground">
                      Dashboard
                    </h4>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/50">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <Mic className="h-5 w-5 text-blue-600" />
                        </div>
                        <h5 className="font-bold">Create New Interview</h5>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Create AI interviews and schedule them with
                          candidates.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/50">
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                          <Phone className="h-5 w-5 text-blue-600" />
                        </div>
                        <h5 className="font-bold">Create Phone Screening Call</h5>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Schedule phone screening calls with potential
                          candidates.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h5 className="mb-4 font-bold text-foreground">
                        Previously Created Interviews
                      </h5>

                      <div className="grid gap-4 md:grid-cols-3">
                        {["Google", "Microsoft", "Amazon"].map((company, i) => (
                          <div
                            key={company}
                            className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-black/50"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                                {company[0]}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                20 Oct 2024
                              </span>
                            </div>

                            <h6 className="mt-4 font-bold text-foreground">
                              Full Stack Developer
                            </h6>
                            <p className="mt-1 text-sm text-muted-foreground">30 Min</p>

                            <div className="mt-4 flex gap-2">
                              <button className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground">
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
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Streamline Your Hiring Process
            </h2>
            <p className="mt-4 text-xl leading-9 text-muted-foreground">
              AiCruiter helps you save time and find better candidates with our
              advanced AI interview technology.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/5 bg-card/50 backdrop-blur-sm px-8 py-10 text-center shadow-lg shadow-black/50 transition-all hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)]"
              >
                <div className="mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-3xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-5 text-lg leading-9 text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-card px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              How AiCruiter Works
            </h2>
            <p className="mt-4 text-xl leading-9 text-muted-foreground">
              Three simple steps to transform your recruitment process
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.no} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-700">
                  {step.no}
                </div>
                <h3 className="mt-7 text-3xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-5 text-lg leading-9 text-muted-foreground">
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
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Simple Pricing
            </h2>
            <p className="mt-4 text-xl leading-9 text-muted-foreground">
              Choose the plan that fits your hiring needs.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.title}
                className={`rounded-3xl border p-8 shadow-sm shadow-black/50 transition hover:-translate-y-1 hover:shadow-lg shadow-black/50 ${
                  plan.highlight
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <h3 className="text-2xl font-bold">{plan.title}</h3>
                <div className="mt-4 text-4xl font-extrabold">{plan.price}</div>
                <p
                  className={`mt-4 text-base ${
                    plan.highlight ? "text-blue-50" : "text-muted-foreground"
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
                      ? "bg-card text-blue-600 hover:bg-blue-50"
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
      <section className="bg-background px-6 py-24 lg:px-10">
        <div className="mx-auto max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-br from-card to-blue-900/10 px-8 py-16 text-center shadow-xl shadow-black/50 md:px-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="mt-5 text-xl leading-9 text-muted-foreground">
            Join hundreds of companies already using AiCruiter to find the best
            talent.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth"
              className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] hover:bg-blue-500"
            >
              Get Started for Free
            </Link>

            <a
              href="#pricing"
              className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-card px-8 py-4 text-lg font-semibold text-foreground shadow-lg shadow-black/50 transition-all hover:scale-[1.02] hover:bg-muted"
            >
              Schedule a Demo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:text-left lg:px-10">
          <div className="flex items-center gap-2">
            <Mic className="h-7 w-7 text-blue-600" />
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-blue-500">AI</span>
              <span className="text-foreground">cruiter</span>
            </span>
          </div>

          <div className="flex items-center gap-8 text-lg text-muted-foreground">
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

          <p className="text-lg text-muted-foreground">
            © 2025 AiCruiter. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}