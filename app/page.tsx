import { toBanglaNumber, formatPrice } from "@/lib/utils";

// ============================================================================
// Visual Foundation Test Page (Step 3)
// This temporary page verifies the global typography, responsive container,
// Bengali numerals, and price badge color system.
// ============================================================================

export default function Home() {
  return (
    <main className="flex-1 py-12">
      <div className="container-custom">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block text-4xl mb-3">🛒</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            বাজার দর (Bazar Dor)
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে দেখুন।
          </p>
        </div>

        {/* Foundation Verification Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {/* Rise Card */}
          <div className="bazar-card p-5">
            <div className="text-2xl mb-2">🍚</div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              স্বর্ণমাছি চাল
            </h3>
            <p className="text-sm text-slate-500 mb-3">প্রতি কেজি</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-900">
                {formatPrice(148)}
              </span>
              <span className="badge-rise">
                ▲ {toBanglaNumber("২.১")}%
              </span>
            </div>
          </div>

          {/* Fall Card */}
          <div className="bazar-card p-5">
            <div className="text-2xl mb-2">🥔</div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              দেশি গোল আলু
            </h3>
            <p className="text-sm text-slate-500 mb-3">প্রতি কেজি</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-900">
                {formatPrice(35)}
              </span>
              <span className="badge-fall">
                ▼ {toBanglaNumber("২.৯")}%
              </span>
            </div>
          </div>

          {/* Flat Card */}
          <div className="bazar-card p-5">
            <div className="text-2xl mb-2">🫙</div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">
              সয়াবিন তেল
            </h3>
            <p className="text-sm text-slate-500 mb-3">প্রতি লিটার</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-900">
                {formatPrice(185)}
              </span>
              <span className="badge-flat">
                — {toBanglaNumber("০.০")}%
              </span>
            </div>
          </div>
        </div>

        {/* Buttons / Accessibility check */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button type="button" className="btn-primary">
            সব পণ্য দেখুন
          </button>
          <button type="button" className="btn-outline">
            ক্যাটাগরি ব্রাউজ করুন
          </button>
        </div>
      </div>
    </main>
  );
}
