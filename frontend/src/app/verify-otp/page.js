"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import api from "@/lib/axios";

import useAuthStore from "@/store/auth.store";

export default function VerifyOTPPage() {
  const router = useRouter();

  const { setAuth } = useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [otp, setOtp] = useState("");

  // VERIFY OTP
  const handleVerifyOTP = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      // GET EMAIL
      const email =
        localStorage.getItem(
          "verifyEmail"
        );

      if (!email) {
        toast.error(
          "Email not found"
        );

        return;
      }

      // API REQUEST
      const response = await api.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      // SAVE TOKEN
      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      // SAVE AUTH STATE
      setAuth(response.data);

      toast.success(
        response.data.message
      );

      // REDIRECT
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOTP =
    async () => {
      try {
        const email =
          localStorage.getItem(
            "verifyEmail"
          );

        if (!email) {
          toast.error(
            "Email not found"
          );

          return;
        }

        const response =
          await api.post(
            "/auth/resend-otp",
            {
              email,
            }
          );

        toast.success(
          response.data.message
        );
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to resend OTP"
        );
      }
    };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-orange-500/30 bg-black p-8 shadow-2xl text-center">
        <p className="text-orange-500 uppercase tracking-[0.3em] text-sm mb-3">
          Verification Required
        </p>

        <h1 className="text-5xl font-black uppercase mb-4">
          OTP
        </h1>

        <p className="text-zinc-500 mb-8 leading-relaxed">
          We sent a verification
          code to your email.
        </p>

        <form
          onSubmit={
            handleVerifyOTP
          }
          className="space-y-6"
        >
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
            placeholder="Enter OTP"
            className="w-full text-center tracking-[1em] text-2xl bg-zinc-950 border border-zinc-800 px-4 py-5 outline-none focus:border-orange-500 transition"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition py-4 text-black font-black uppercase tracking-widest disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>
        </form>

        {/* RESEND OTP */}
        <button
          onClick={
            handleResendOTP
          }
          className="mt-6 text-sm text-lime-400 hover:text-lime-300 transition"
        >
          Resend OTP
        </button>
      </div>
    </main>
  );
}