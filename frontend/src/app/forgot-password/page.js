"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  // SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      // SAVE EMAIL
      localStorage.setItem(
        "resetEmail",
        email
      );

      toast.success(
        response.data.message
      );

      // REDIRECT
      router.push("/reset-password");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-orange-500/30 bg-black p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-orange-500 uppercase tracking-[0.3em] text-sm mb-3">
            Password Recovery
          </p>

          <h1 className="text-5xl font-black uppercase">
            RESET
          </h1>

          <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
            We’ll send an OTP to your
            email.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="you@example.com"
            className="w-full bg-zinc-950 border border-zinc-800 px-4 py-4 outline-none focus:border-orange-500 transition"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition py-4 text-black font-black uppercase tracking-widest disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send OTP"}
          </button>
        </form>
      </div>
    </main>
  );
}