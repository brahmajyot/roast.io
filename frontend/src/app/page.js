"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import {
  Flame,
  Skull,
  Zap,
} from "lucide-react";

import api from "@/lib/axios";

export default function HomePage() {
  // FEEDBACK LIST
  const [feedbacks, setFeedbacks] =
    useState([]);

  // FORM DATA
  const [
    feedbackData,
    setFeedbackData,
  ] = useState({
    name: "",
    message: "",
  });

  // LOADING
  const [
    feedbackLoading,
    setFeedbackLoading,
  ] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFeedbackData({
      ...feedbackData,

      [e.target.name]:
        e.target.value,
    });
  };

  // FETCH FEEDBACKS
  const fetchFeedbacks =
    async () => {
      try {
        const response =
          await api.get(
            "/feedback"
          );

        setFeedbacks(
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  // LIVE AUTO UPDATE
  useEffect(() => {
    fetchFeedbacks();

    const interval =
      setInterval(() => {
        fetchFeedbacks();
      }, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  // SUBMIT FEEDBACK
  const handleFeedbackSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setFeedbackLoading(
          true
        );

        const response =
          await api.post(
            "/feedback",
            feedbackData
          );

        toast.success(
          response.data
            .message
        );

        // RESET FORM
        setFeedbackData({
          name: "",
          message: "",
        });

        // REFRESH
        fetchFeedbacks();
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Submission failed"
        );
      } finally {
        setFeedbackLoading(
          false
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,90,31,0.12),transparent_40%)] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="border-b border-orange-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* LOGO */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-orange-500 italic">
              ROAST.IO
            </h1>
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest">
            {/* FEED */}
            <a
              href="#feed"
              className="hover:text-orange-400 transition"
            >
              Feed
            </a>

            {/* SHAME */}
            <a
              href="#shame"
              className="hover:text-lime-400 transition"
            >
              Shame
            </a>

            {/* SUBMIT */}
            <a
              href="#submit"
              className="hover:text-orange-400 transition"
            >
              Submit
            </a>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
            <Link
              href="/login"
              className="border border-zinc-700 px-3 sm:px-4 py-2 text-xs sm:text-sm hover:border-orange-500 hover:text-orange-400 transition uppercase tracking-widest whitespace-nowrap"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 transition px-4 sm:px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-black whitespace-nowrap"
            >
              Roast Me
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center relative z-10">
          {/* LEFT SIDE */}
          <div>
            <div className="inline-flex items-center gap-3 border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-400 mb-6">
              <Flame size={14} />
              AI Portfolio Destruction
              Engine
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-none uppercase">
              Feed The
              <span className="block text-lime-400">
                Flames.
              </span>
            </h1>

            <p className="mt-8 text-zinc-400 text-lg leading-relaxed max-w-xl">
              Paste your portfolio
              URL and let AI roast
              your design choices,
              recruiter decisions,
              animation addiction,
              and developer ego.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/register"
                className="bg-orange-500 hover:bg-orange-600 transition text-black font-black uppercase px-8 py-4 text-lg"
              >
                Roast My Portfolio
              </Link>

              <Link
                href="/dashboard"
                className="border border-zinc-700 hover:border-lime-400 hover:text-lime-400 transition uppercase px-8 py-4 font-bold"
              >
                Live Demo
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-14">
              <div className="border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-3xl font-black text-orange-500">
                  24K+
                </p>

                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Portfolios Roasted
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-3xl font-black text-lime-400">
                  11s
                </p>

                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Avg Roast Time
                </p>
              </div>

              <div className="border border-zinc-800 bg-zinc-950 p-5">
                <p className="text-3xl font-black text-orange-500">
                  71%
                </p>

                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Recruiter Damage
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-lime-400 blur-2xl opacity-20" />

            <div className="relative border border-orange-500/40 bg-[#0b0b0b] p-8 shadow-2xl">
              {/* TERMINAL HEADER */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>

              <div className="space-y-4 font-mono text-sm">
                <div className="text-zinc-500">
                  &gt; analyzing
                  portfolio...
                </div>

                <div className="text-orange-400">
                  ⚠ excessive Framer
                  Motion detected
                </div>

                <div className="text-lime-400">
                  ✓ responsive design
                  found
                </div>

                <div className="text-orange-400">
                  ⚠ recruiter
                  confidence unstable
                </div>

                <div className="border border-zinc-800 bg-black p-5 mt-6">
                  <p className="text-zinc-500 uppercase text-xs tracking-widest mb-3">
                    AI Verdict
                  </p>

                  <p className="text-2xl font-black leading-relaxed">
                    “This portfolio
                    has more animations
                    than actual
                    projects.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      <section
        id="feed"
        className="px-6 pb-20"
      >
        <div className="max-w-7xl mx-auto border border-zinc-800 bg-black p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black uppercase text-orange-500">
              Live Roast Feed
            </h2>

            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Emotional Damage
              Included
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 font-mono text-sm">
            <div className="border border-zinc-800 p-5 bg-zinc-950">
              <p className="text-lime-400 mb-2">
                🔥 alexdev.io got
                cooked
              </p>

              <p className="text-zinc-500">
                “Your navbar enters
                harder than your
                projects.”
              </p>
            </div>

            <div className="border border-zinc-800 p-5 bg-zinc-950">
              <p className="text-orange-400 mb-2">
                💀 recruiter rejected
                another portfolio
              </p>

              <p className="text-zinc-500">
                “Too much
                glassmorphism. Not
                enough substance.”
              </p>
            </div>

            <div className="border border-zinc-800 p-5 bg-zinc-950">
              <p className="text-red-400 mb-2">
                ⚠ animation
                addiction detected
              </p>

              <p className="text-zinc-500">
                “Framer Motion cannot
                fix weak projects.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="shame"
        className="px-6 pb-24"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="border border-zinc-800 bg-black p-8">
            <Flame className="text-orange-500 mb-6" />

            <h3 className="text-3xl font-black uppercase mb-4">
              AI Recruiter
            </h3>

            <p className="text-zinc-400 leading-relaxed">
              Get recruiter-style
              portfolio analysis and
              hiring feedback powered
              by AI.
            </p>
          </div>

          <div className="border border-zinc-800 bg-black p-8">
            <Zap className="text-lime-400 mb-6" />

            <h3 className="text-3xl font-black uppercase mb-4">
              SEO + Performance
            </h3>

            <p className="text-zinc-400 leading-relaxed">
              Lighthouse-powered
              performance, SEO, and
              accessibility analysis.
            </p>
          </div>

          <div className="border border-zinc-800 bg-black p-8">
            <Skull className="text-red-400 mb-6" />

            <h3 className="text-3xl font-black uppercase mb-4">
              Brutal Roasts
            </h3>

            <p className="text-zinc-400 leading-relaxed">
              Internet-level
              emotional damage mixed
              with useful portfolio
              improvements.
            </p>
          </div>
        </div>
      </section>

      {/* SUBMIT SECTION */}
      <section
        id="submit"
        className="px-6 pb-24"
      >
        <div className="max-w-5xl mx-auto border border-orange-500/30 bg-black p-8 md:p-10">
          <div className="mb-10">
            <p className="uppercase tracking-[0.3em] text-orange-400 text-sm mb-3">
              Community Feedback
            </p>

            <h2 className="text-5xl font-black uppercase">
              Submit The Damage.
            </h2>
          </div>

          {/* FORM */}
          <form
            onSubmit={
              handleFeedbackSubmit
            }
            className="space-y-5"
          >
            <input
              type="text"
              name="name"
              value={
                feedbackData.name
              }
              onChange={
                handleChange
              }
              placeholder="Your Name"
              className="w-full bg-zinc-950 border border-zinc-800 px-5 py-4 outline-none focus:border-orange-500 transition"
            />

            <textarea
              name="message"
              value={
                feedbackData.message
              }
              onChange={
                handleChange
              }
              placeholder="Tell me how badly the AI roasted you..."
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 px-5 py-4 outline-none focus:border-orange-500 transition resize-none"
              required
            />

            <button
              disabled={
                feedbackLoading
              }
              className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 text-black font-black uppercase tracking-widest disabled:opacity-50"
            >
              {feedbackLoading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>
          </form>

          {/* FEEDBACK LIST */}
          <div className="mt-14 space-y-5">
            {feedbacks.map(
              (feedback) => (
                <div
                  key={
                    feedback._id
                  }
                  className="border border-zinc-800 bg-zinc-950 p-6"
                >
                   <p className="text-xs text-zinc-500 uppercase mb-2">
          Just roasted
        </p>
                  <p className="text-orange-400 font-black uppercase tracking-wider mb-3">
                    {feedback.name ||
                      "Anonymous"}
                  </p>

                  <p className="text-zinc-300 leading-relaxed">
                    {
                      feedback.message
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto border border-orange-500/40 bg-gradient-to-r from-orange-500/10 to-lime-400/10 p-14 text-center">
          <p className="uppercase tracking-[0.4em] text-orange-400 text-sm mb-6">
            Ready To Get Cooked?
          </p>

          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">
            Start The Fire.
          </h2>

          <Link
            href="/register"
            className="inline-block mt-10 bg-orange-500 hover:bg-orange-600 transition px-10 py-5 text-black font-black uppercase text-xl"
          >
            Roast My Portfolio
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-black italic text-orange-500">
            ROAST.IO
          </h2>

          <p className="text-zinc-500 text-sm uppercase tracking-[0.2em]">
            Emotional Damage
            Included.
          </p>
        </div>
      </footer>
    </main>
  );
}