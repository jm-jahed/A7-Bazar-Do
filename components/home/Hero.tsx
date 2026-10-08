import React from "react";
import Image from "next/image";

// ============================================================================
// Hero Component
// Main banner section for the Bazar Dor homepage matching the Figma reference.
// Contains market eyebrow tag, main heading, subtitle, CTA anchor button,
// and the official Bazar Dor hero illustration asset.
// ============================================================================

export default function Hero() {
  return (
    <section className="bg-white border-b border-slate-200/80 py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================
              LEFT: Text Content & Primary Action Button
             ================================================================ */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-emerald-200">
              <span>📊</span>
              <span>দৈনন্দিন বাজার দর আপডেট</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-4">
              নিত্যপ্রয়োজনীয় পণ্যের <br className="hidden sm:inline" />
              <span className="text-emerald-600">সঠিক বাজার দর</span> এক নজরে
            </h1>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl">
              প্রতিদিনের চাল, ডাল, তেল, সবজি, মাছ ও মাংসের নির্ভরযোগ্য পাইকারি ও খুচরা বাজারমূল্য এক নজরে জানুন এবং তুলনা করুন।
            </p>

            {/* CTA Button linking smoothly to the all products section */}
            <div>
              <a
                href="#সব-পণ্য"
                className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-6 py-3 rounded-xl font-semibold shadow-sm"
              >
                <span>সব পণ্য দেখুন</span>
                <span className="text-lg leading-none" aria-hidden="true">
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* ================================================================
              RIGHT: Hero Graphic Asset from assignment resources
             ================================================================ */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর হিরো চিত্র"
                width={480}
                height={360}
                className="w-full h-auto object-contain rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
