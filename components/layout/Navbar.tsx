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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      setIsDropdownOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "সাইন আউটে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setIsSigningOut(false);
    }
  };

  const userInitial = session?.user?.name?.trim()?.charAt(0).toUpperCase() || "👤";
  const firstName = session?.user?.name?.trim()?.split(" ")[0] || "ব্যবহারকারী";

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
              // Authenticated User Avatar & Dropdown Menu
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "ইউজার"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-800 hidden sm:inline-block max-w-[100px] truncate">
                    {firstName}
                  </span>
                  <span className="text-xs text-slate-500">▾</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Popover Card */}
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3 animate-in fade-in duration-150">
                      {/* User Info Header */}
                      <div className="border-b border-slate-100 pb-3">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {session.user.name || "ব্যবহারকারী"}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {session.user.email}
                        </p>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                        >
                          <span>👤</span>
                          <span>আমার প্রোফাইল</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-60 text-left"
                        >
                          <span>←</span>
                          <span>{isSigningOut ? "সাইন আউট হচ্ছে..." : "সাইন আউট"}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
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
