import React from "react";
import Hero from "@/components/home/Hero";

// ============================================================================
// Homepage (Step 8: Hero Section Integration)
// Displays the Figma-matched Hero section with its anchor target ready
// for the upcoming product sections in Step 9+.
// ============================================================================

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero / Banner Section */}
      <Hero />

      {/* 2. Anchor Target Placeholder for Step 9+ */}
      <section id="সব-পণ্য" className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container-custom text-center">
          <p className="text-sm font-medium text-slate-400">
            [#সব-পণ্য সেকশন — পরবর্তী ধাপে প্রোডাক্ট কার্ড ও সেকশন যুক্ত করা হবে]
          </p>
        </div>
      </section>
    </main>
  );
}
