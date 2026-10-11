"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// Sign up form

// Clean callback URL
function getSafeCallbackUrl(raw: string | null): string {
  if (!raw) return "/";
  const trimmed = raw.trim();
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\")
  ) {
    if (trimmed.startsWith("/signin") || trimmed.startsWith("/signup")) {
      return "/";
    }
    return trimmed;
  }
  return "/";
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback =
    searchParams.get("callbackURL") || searchParams.get("redirect");
  const callbackURL = getSafeCallbackUrl(rawCallback);

  const { data: sessionData, isPending: sessionLoading } = authClient.useSession();

  // Redirect if already logged in
  React.useEffect(() => {
    if (!sessionLoading && sessionData?.user) {
      router.replace(callbackURL);
    }
  }, [sessionData, sessionLoading, callbackURL, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম লিখুন।");
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন।");
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

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage("পাসওয়ার্ড দুটি মেলেনি। অনুগ্রহ করে আবার নিশ্চিত করুন।");
      toast.error("পাসওয়ার্ড দুটি মেলেনি।");
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

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে লগইন করুন।");
      router.push("/signin");
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

  // Handle social sign up
  const handleSocialSignUp = async (provider: "google" | "github") => {
    setErrorMessage(null);
    setSocialLoading(provider);

    try {
      const res = await authClient.signIn.social({
        provider,
        callbackURL: callbackURL,
      });

      if (res?.error) {
        const providerName = provider === "google" ? "Google" : "GitHub";
        const errMsg =
          res.error.message ||
          `${providerName} সাইন আপ সম্পন্ন করা যায়নি। অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড দিয়ে সাইন আপ করুন।`;
        setErrorMessage(errMsg);
        toast.error(errMsg);
      }
    } catch (err: unknown) {
      const providerName = provider === "google" ? "Google" : "GitHub";
      const errMsg =
        err instanceof Error && !err.message.includes("Failed to fetch")
          ? err.message
          : `${providerName} সাইন আপের জন্য OAuth পরিবেশ ভেরিয়েবল প্রয়োজন। অনুগ্রহ করে সরাসরি ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট তৈরি করুন।`;
      setErrorMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Page title */}
      <div className="text-center mb-5">
        <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-tight">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs text-slate-500 mt-1.5 leading-normal">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Sign up card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-7 space-y-4">
        {/* Error message */}
        {errorMessage && (
          <div
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            role="alert"
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              নাম
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-[#fcfdfc]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-[#fcfdfc]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-[#fcfdfc]"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-semibold text-slate-800 mb-1"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার লিখুন"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-[#fcfdfc]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || Boolean(socialLoading)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-xs text-sm transition-colors disabled:opacity-60 cursor-pointer mt-1"
          >
            {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-1 pb-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] text-slate-400 font-medium absolute">
            অথবা
          </span>
        </div>

        {/* Social sign up buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialSignUp("google")}
            disabled={Boolean(socialLoading) || isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors disabled:opacity-60 shadow-2xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
            <span className="truncate">
              {socialLoading === "google" ? "সংযুক্ত..." : "Google দিয়ে চালিয়ে যান"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignUp("github")}
            disabled={Boolean(socialLoading) || isLoading}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[11px] font-semibold transition-colors disabled:opacity-60 shadow-2xs cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0 fill-current text-slate-900"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="truncate">
              {socialLoading === "github" ? "সংযুক্ত..." : "GitHub দিয়ে চালিয়ে যান"}
            </span>
          </button>
        </div>

        {/* Link to login */}
        <div className="pt-2 text-center text-xs text-slate-600">
          <span>অ্যাকাউন্ট আছে? </span>
          <Link
            href={
              callbackURL !== "/"
                ? `/signin?callbackURL=${encodeURIComponent(callbackURL)}`
                : "/signin"
            }
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </div>
      </div>

      {/* Back to home link */}
      <div className="mt-5 text-center">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium"
        >
          <span>←</span>
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="flex-1 py-8 sm:py-12 px-4 flex items-center justify-center bg-[#f0f4f1]/60">
      <Suspense
        fallback={
          <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-8 animate-pulse text-center text-slate-400 text-sm">
            লোড হচ্ছে...
          </div>
        }
      >
        <SignUpForm />
      </Suspense>
    </main>
  );
}
