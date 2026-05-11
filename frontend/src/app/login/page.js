"use client";

import { useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import api from "@/lib/axios";

import useAuthStore from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const { setAuth } =
    useAuthStore();

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // HANDLE LOGIN
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/login",
          formData
        );

      // SAVE ACCESS TOKEN
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
        error.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md border border-orange-500/30 bg-black p-8 shadow-2xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="text-orange-500 uppercase tracking-[0.3em] text-sm mb-3">
            Welcome Back
          </p>

          <h1 className="text-5xl font-black uppercase">
            LOGIN
          </h1>

          <p className="text-zinc-500 mt-4 text-sm leading-relaxed">
            Continue your portfolio
            destruction journey.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="text-sm uppercase tracking-widest text-zinc-400 block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              className="w-full bg-zinc-950 border border-zinc-800 px-4 py-4 outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm uppercase tracking-widest text-zinc-400 block mb-2">
              Password
            </label>

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
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 px-4 py-4 pr-14 outline-none focus:border-orange-500 transition"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-orange-400 transition"
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
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-orange-400 hover:text-orange-300 transition"
            >
              Forgot Password?
            </Link>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 transition py-4 text-black font-black uppercase tracking-widest disabled:opacity-50"
          >
            {loading
              ? "Entering..."
              : "Enter The Fire"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-zinc-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-lime-400 hover:text-lime-300"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}