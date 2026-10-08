"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBanglaDate } from "@/lib/utils";

// ============================================================================
// Navbar Component
// Global website navigation bar containing the Bazar Dor logo, dynamic
// Bengali date, and authentication navigation links (Sign In / Sign Up).
// ============================================================================

export default function Navbar() {
  // Dynamic Bengali date state. We initialize with an empty string or standard
  // format and set it after hydration to avoid SSR/client timestamp mismatch.
  const [banglaDate, setBanglaDate] = useState<string>("");

  useEffect(() => {
    // Generate the current browser date in Bengali (e.g., ৯ অক্টোবর ২০২৬)
    setBanglaDate(getBanglaDate(new Date(), true));
  }, []);

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
              RIGHT: Authentication Links (Sign In & Sign Up)
             ================================================================ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sign In Link */}
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              সাইন ইন
            </Link>

            {/* Sign Up Link */}
            <Link
              href="/signup"
              className="btn-primary px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-sm"
            >
              সাইন আপ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
