"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

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

  const [isSigningOut, setIsSigningOut] = useState(false);

  // Handle user sign-out action
  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      const res = await authClient.signOut();

      if (res?.error) {
        toast.error(
          res.error.message || "সাইন আউট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("সফলভাবে সাইন আউট করা হয়েছে।");
      router.push("/signin");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "সাইন আউটে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ====================================================================
          1. Profile Overview Card (Figma Matched)
         ==================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar Image or Fallback */}
            {user.image ? (
              <Image
                src={user.image}
                alt={currentName || "ইউজার"}
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-2xs">
                {currentName?.trim()?.charAt(0).toUpperCase() || "👤"}
              </div>
            )}

            {/* User Details */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentName || "ব্যবহারকারী"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer shadow-2xs shrink-0"
          >
            <span>←</span>
            <span>{isSigningOut ? "অপেক্ষা..." : "সাইন আউট"}</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          2. Update Information Form (Challenge C3 / Figma Matched)
         ==================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-7 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">তথ্য</h3>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
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
              নাম
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              disabled={isUpdating}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-[#fcfdfc] disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-xs text-sm transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
