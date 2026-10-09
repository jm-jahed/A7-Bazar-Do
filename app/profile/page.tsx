import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";

// ============================================================================
// Profile Page: /profile
// Protected route — verifies session server-side via Better Auth.
// Displays account overview and implements Challenge C3: Update Information.
// ============================================================================

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "আমার প্রোফাইল — বাজার দর",
  description: "বাজার দর ইউজার প্রোফাইল ও অ্যাকাউন্ট তথ্য ব্যবস্থাপনা।",
};

export default async function ProfilePage() {
  // 1. Server-side session verification via Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Redirect unauthenticated visitors to sign in with safe callback URL
  if (!session || !session.user) {
    redirect(`/signin?callbackURL=${encodeURIComponent("/profile")}`);
  }

  return (
    <main className="flex-1 py-8 sm:py-12 bg-slate-50">
      <div className="container-custom max-w-2xl">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
        >
          <Link
            href="/"
            className="hover:text-emerald-700 transition-colors flex items-center gap-1"
          >
            <span>হোম</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 font-medium">আমার প্রোফাইল</span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            আপনার অ্যাকাউন্টের বিবরণ ও ব্যক্তিগত তথ্য পরিচালনা করুন
          </p>
        </div>

        {/* Profile Details & Challenge C3 Update Form */}
        <ProfileForm user={session.user} />
      </div>
    </main>
  );
}
