"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/utils";

// ============================================================================
// Profile Form Component (Client Component)
// Implements Assignment Challenge C3: Update Information Feature.
// Allows authenticated users to view their account info and update their name.
// ============================================================================

interface ProfileFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    createdAt?: Date | string | number;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [currentName, setCurrentName] = useState(user.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Format account registration date in Bengali
  const joinedDate = user.createdAt
    ? getBanglaDate(new Date(user.createdAt))
    : null;

  // Handle name update submission using Better Auth's updateUser API
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();

    // 1. Validation: Name must not be empty
    if (!trimmedName) {
      const err = "অনুগ্রহ করে আপনার নাম লিখুন। নাম ফাঁকা রাখা যাবে না।";
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    if (trimmedName === currentName.trim()) {
      toast("নামে কোনো পরিবর্তন করা হয়নি।", { icon: "ℹ️" });
      return;
    }

    try {
      setIsUpdating(true);

      const res = await authClient.updateUser({
        name: trimmedName,
      });

      if (res?.error) {
        const err =
          res.error.message ||
          "তথ্য আপডেট করা সম্ভব হয়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।";
        setErrorMessage(err);
        toast.error(err);
        return;
      }

      // 2. Success feedback and local state update
      setCurrentName(trimmedName);
      toast.success("আপনার নাম সফলভাবে আপডেট করা হয়েছে!");

      // 3. Refresh Server Components and Navbar
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "সার্ভারে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ====================================================================
          1. Profile Overview Card
         ==================================================================== */}
      <div className="bazar-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar Circle */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl sm:text-3xl font-bold shrink-0 shadow-sm">
            {currentName?.trim()?.charAt(0).toUpperCase() || "👤"}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentName || "ব্যবহারকারী"}
              </h2>
              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ সক্রিয় অ্যাকাউন্ট
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-1">{user.email}</p>

            {joinedDate && (
              <p className="text-xs text-slate-400 mt-2">
                অ্যাকাউন্ট খোলার তারিখ: {joinedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. Update Information Form (Challenge C3)
         ==================================================================== */}
      <div className="bazar-card p-6 sm:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">তথ্য আপডেট করুন</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            আপনার প্রোফাইলের নাম পরিবর্তন করতে নিচের ফর্মটি ব্যবহার করুন
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
            role="alert"
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Editable Name Field */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              পুরো নাম
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              disabled={isUpdating}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Read-only Email Field */}
          <div>
            <label
              htmlFor="profile-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              ইমেইল ঠিকানা <span className="text-slate-400 font-normal">(পরিবর্তনযোগ্য নয়)</span>
            </label>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed select-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="btn-primary py-2.5 px-6 rounded-lg text-sm font-semibold justify-center transition-all disabled:opacity-60 shadow-xs cursor-pointer"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
