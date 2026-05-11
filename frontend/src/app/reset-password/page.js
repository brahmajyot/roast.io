"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import api from "@/lib/axios";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      otp: "",
      password: "",
    });

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // RESET PASSWORD
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const email =
        localStorage.getItem(
          "resetEmail"
        );

      if (!email) {
        toast.error(
          "Email not found"
        );

        return;
      }

      const response =
        await api.post(
          "/auth/reset-password",
          {
            email,

            otp: formData.otp,

            password:
              formData.password,
          }
        );

      toast.success(
        response.data.message
      );

      // REDIRECT LOGIN
      router.push("/login");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-lime-400/30 bg-black p-8 shadow-2xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="text-lime-400 uppercase tracking-[0.3em] text-sm mb-3">
            Create New Password
          </p>

          <h1 className="text-5xl font-black uppercase">
            RECOVER
          </h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* OTP */}
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={
              handleChange
            }
            placeholder="OTP"
            className="w-full bg-zinc-950 border border-zinc-800 px-4 py-4 outline-none focus:border-lime-400 transition"
            required
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={
                formData.password
              }
              onChange={
                handleChange
              }
              placeholder="New Password"
              className="w-full bg-zinc-950 border border-zinc-800 px-4 py-4 pr-14 outline-none focus:border-lime-400 transition"
              required
            />

            {/* TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-lime-400 transition"
            >
              {showPassword ? (
                <EyeOff
                  size={20}
                />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-lime-400 hover:bg-lime-300 transition py-4 text-black font-black uppercase tracking-widest disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}