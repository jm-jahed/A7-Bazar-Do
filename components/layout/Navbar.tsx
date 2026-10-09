"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, authClient } from "@/lib/auth-client";
import { getBanglaDate } from "@/lib/utils";

// ============================================================================
// Navbar Component
// Global website navigation bar containing the Bazar Dor logo, dynamic
// Bengali date, and responsive authentication state (Guest vs Authenticated).
// ============================================================================

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Generate current date in Bengali (e.g., ৯ অক্টোবর ২০২৬)
  const banglaDate = getBanglaDate(new Date(), true);

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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.03)]">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* ================================================================
              LEFT: Logo & Bengali Date
             ================================================================ */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            aria-label="বাজার দর হোম পেজ"
          >
            {/* Logo Icon */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={28}
                height={28}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                priority
              />
            </div>

            {/* Logo Title & Subtitle/Date */}
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                বাজার দর
              </span>
              <span
                className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-none"
                suppressHydrationWarning
              >
                {banglaDate || "আজকের বাজার দর"}
              </span>
            </div>
          </Link>

          {/* ================================================================
              RIGHT: Authentication Controls (Guest vs Logged In)
             ================================================================ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user ? (
              // Authenticated User Controls
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Profile Link */}
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title="প্রোফাইল দেখুন"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0">
                    {session.user.name?.trim()?.charAt(0).toUpperCase() || "👤"}
                  </span>
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">
                    {session.user.name || "প্রোফাইল"}
                  </span>
                </Link>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 rounded-lg transition-colors disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  {isSigningOut ? "অপেক্ষা..." : "সাইন আউট"}
                </button>
              </div>
            ) : (
              // Guest Controls (Sign In & Sign Up)
              <>
                <Link
                  href="/signin"
                  className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
