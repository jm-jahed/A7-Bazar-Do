"use client";

import React, { useState } from "react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import CategorySkeleton from "@/components/ui/CategorySkeleton";

// ============================================================================
// Step 4 UI State & Skeleton Verification Page (Temporary Test)
// This page demonstrates and verifies the reusable loading, error, empty,
// and skeleton state components matching the Bazar Dor design language.
// ============================================================================

export default function Home() {
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const handleRetry = () => {
    setRetryMessage("পুনরায় ডেটা লোড করার চেষ্টা করা হচ্ছে...");
    setTimeout(() => {
      setRetryMessage("পুনরায় চেষ্টা সফল হয়েছে!");
    }, 1000);
  };

  return (
    <main className="min-h-screen py-10 bg-slate-50">
      <div className="container-custom space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-3xl mb-2">🛒</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            স্টেপ ৪ — UI State & Skeleton Components Test
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            রিসোর্স ও রেফারেন্স ডিজাইনের সাথে মিল রেখে তৈরি করা লোডিং, এরর, এম্পটি এবং স্কেলিটন কম্পোনেন্ট।
          </p>
        </div>

        {/* 1. Category Skeleton Preview */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🏷️</span> ১. ক্যাটাগরি স্কেলিটন (Category Skeleton)
          </h2>
          <CategorySkeleton count={8} />
        </section>

        {/* 2. Product Card Skeletons Preview */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📦</span> ২. প্রোডাক্ট কার্ড স্কেলিটন (Product Card Skeletons)
          </h2>
          <ProductCardSkeleton count={4} />
        </section>

        {/* 3. Loading State Preview */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>⏳</span> ৩. লোডিং স্টেট (Loading State)
          </h2>
          <LoadingState message="বাজারের সর্বশেষ দর লোড হচ্ছে..." />
        </section>

        {/* 4. Error State Preview */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>⚠️</span> ৪. এরর স্টেট (Error State with Retry Action)
          </h2>
          <ErrorState
            title="দুঃখিত, তথ্য লোড করা যাচ্ছে না।"
            description="সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।"
            onRetry={handleRetry}
            retryText="পুনরায় চেষ্টা করুন"
          />
          {retryMessage && (
            <p className="text-center text-sm font-semibold text-emerald-600 mt-2">
              {retryMessage}
            </p>
          )}
        </section>

        {/* 5. Empty State Preview */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📭</span> ৫. এম্পটি স্টেট (Empty State)
          </h2>
          <EmptyState
            title="কোনো পণ্য পাওয়া যায়নি"
            description="আপনার নির্বাচিত ক্যাটাগরিতে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।"
            actionText="হোম পেজে ফিরে যান"
            actionHref="/"
          />
        </section>
      </div>
    </main>
  );
}
