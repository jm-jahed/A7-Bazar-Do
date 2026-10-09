import React from "react";
import Image from "next/image";
import { getBanglaDate } from "@/lib/utils";

// ============================================================================
// Hero Component (Figma Matched)
// Main banner section for the Bazar Dor homepage.
// Enclosed white rounded card with date eyebrow, main heading, subtitle,
// CTA button, and hero basket illustration.
// ============================================================================

export default function Hero() {
  const banglaDate = getBanglaDate(new Date(), true);

  return (
    <section className="py-6 sm:py-8">
      <div className="container-custom">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* ================================================================
                LEFT: Text Content & Primary Action Button
               ================================================================ */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Eyebrow Date Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50/90 text-emerald-700 text-xs font-medium mb-3 sm:mb-4 border border-emerald-100"
                suppressHydrationWarning
              >
                <span>{banglaDate || "আজকের বাজার দর"}</span>
              </div>

              {/* Main Hero Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-snug mb-3">
                আজকের বাজারের দাম এক নজরে
              </h1>

              {/* Subtitle Description */}
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 max-w-xl">
                চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
              </p>

              {/* CTA Button */}
              <div>
                <a
                  href="#সব-পণ্য"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>সব পণ্য দেখুন</span>
                </a>
              </div>
            </div>

            {/* ================================================================
                RIGHT: Hero Graphic Illustration
               ================================================================ */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px]">
                <Image
                  src="/bazar-hero.png"
                  alt="বাজার দর হিরো চিত্র"
                  width={340}
                  height={260}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
