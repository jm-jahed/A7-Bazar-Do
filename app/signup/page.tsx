"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// ============================================================================
// Sign Up Page (/signup)
// Allows new users to create an account via Name, Email, and Password or Social Auth.
// Matches assignment & Figma layout requirements with form validation.
// ============================================================================

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email & Password registration submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার পুরো নাম লিখুন।");
      toast.error("অনুগ্রহ করে আপনার পুরো নাম লিখুন।");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।");
      toast.error("অনুগ্রহ করে আপনার ইমেইল ঠিকানা দিন।");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    try {
      setIsLoading(true);

      const response = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response?.error) {
        const errMsg =
          response.error.message ||
          "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। অন্য একটি ইমেইল দিয়ে চেষ্টা করুন।";
        setErrorMessage(errMsg);
        toast.error(errMsg);
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম।");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "সার্ভারে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
      setErrorMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Social sign-up handler (Google / GitHub)
  const handleSocialSignUp = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setSocialLoading(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err: unknown) {
      const providerName = provider === "google" ? "Google" : "GitHub";
      const errMsg =
        err instanceof Error
          ? err.message
          : `${providerName} সাইন আপ সম্পন্ন করা যায়নি।`;
      setErrorMessage(errMsg);
      toast.error(errMsg);
      setSocialLoading(null);
    }
  };

  return (
    <main className="flex-1 py-10 sm:py-16 flex items-center justify-center">
      <div className="container-custom max-w-md">
        <div className="bazar-card p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-2xl">
              📝
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              বাজার দর অ্যাপে নিবন্ধন করতে আপনার তথ্য দিন
            </p>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignUp("google")}
              disabled={Boolean(socialLoading) || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors disabled:opacity-60 shadow-2xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>
                {socialLoading === "google"
                  ? "সংযুক্ত হচ্ছে..."
                  : "Google দিয়ে সাইন আপ"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignUp("github")}
              disabled={Boolean(socialLoading) || isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors disabled:opacity-60 shadow-2xs"
            >
              <svg
                className="w-4 h-4 shrink-0 fill-current text-slate-900"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>
                {socialLoading === "github"
                  ? "সংযুক্ত হচ্ছে..."
                  : "GitHub দিয়ে সাইন আপ"}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 font-medium absolute">
              অথবা ইমেইল দিয়ে
            </span>
          </div>

          {/* In-form error message banner */}
          {errorMessage && (
            <div
              className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
              role="alert"
            >
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                পুরো নাম
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                ইমেইল ঠিকানা
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || Boolean(socialLoading)}
              className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold justify-center transition-all disabled:opacity-60 shadow-xs"
            >
              {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}
            </button>
          </form>

          {/* Footer Link to Login */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
            <Link
              href="/signin"
              className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
