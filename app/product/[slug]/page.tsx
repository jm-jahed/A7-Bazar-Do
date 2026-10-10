import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";
import { getProductBySlug } from "@/lib/api";
import { auth } from "@/lib/auth";
import {
  formatPrice,
  formatUnitBn,
  formatPriceChange,
  toBanglaNumber,
} from "@/lib/utils";

// ============================================================================
// Product Details Page: /product/[slug]
// Protected route — requires active login session via Better Auth.
// Server Component displaying complete commodity data, price statistics,
// historical comparisons, and market-wise price breakdown from the real API.
// ============================================================================

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Protected dynamic route — evaluated per request to verify active session
export const dynamic = "force-dynamic";

/**
 * Generates dynamic SEO metadata for the product detail page.
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const product = await getProductBySlug(decodedSlug);

    if (!product) {
      return {
        title: "পণ্য পাওয়া যায়নি — বাজার দর",
      };
    }

    return {
      title: `${product.nameBn} আজকের বাজার দর — বাজার দর`,
      description: `${product.nameBn}-এর আজকের খুচরা ও পাইকারি বাজার দর, সর্বনিম্ন, সর্বোচ্চ ও গড় মূল্য তালিকা।`,
    };
  } catch {
    return {
      title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Server-side session verification via Better Auth
  let session = null;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err) {
    console.error("Error checking session on product detail page:", err);
    session = null;
  }

  // 2. Redirect unauthenticated users to /signin with target callback URL
  if (!session?.user) {
    redirect(
      `/signin?callbackURL=${encodeURIComponent(`/product/${decodedSlug}`)}`
    );
  }

  // 3. Fetch product by slug from real API
  const product = await getProductBySlug(decodedSlug);

  // If product does not exist, trigger Next.js notFound()
  if (!product) {
    notFound();
  }

  // ==========================================================================
  // Price Summary Calculations (Min, Max, Average)
  // Derived strictly from real numeric market values.
  // ==========================================================================
  const markets = Array.isArray(product.markets) ? product.markets : [];
  const hasMarkets = markets.length > 0;

  const minPrice = hasMarkets
    ? Math.min(...markets.map((m) => m.min))
    : product.today;

  const maxPrice = hasMarkets
    ? Math.max(...markets.map((m) => m.max))
    : product.today;

  const avgPrice = hasMarkets
    ? Math.round(
        markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) /
          markets.length
      )
    : product.today;

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  const yesterdayDiff = product.today - (product.yesterday || product.today);

  return (
    <main className="flex-1 py-6 sm:py-8">
      <div className="container-custom max-w-5xl">
        {/* ================================================================
            1. Breadcrumb Navigation (Figma Matched)
           ================================================================ */}
        <nav
          className="mb-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium"
          aria-label="ব্রেডক্রাম্ব"
        >
          <Link
            href="/"
            className="hover:text-emerald-600 transition-colors"
          >
            হোম
          </Link>
          <span className="text-slate-400">›</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-emerald-600 transition-colors"
              >
                {product.categoryNameBn || product.category}
              </Link>
              <span className="text-slate-400">›</span>
            </>
          )}
          <span className="text-slate-700 font-normal truncate">
            {product.nameBn}
          </span>
        </nav>

        {/* ================================================================
            2. Top Summary Card: Product Header (Figma Matched)
           ================================================================ */}
        <section
          className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] p-6 sm:p-7 mb-6"
          aria-labelledby="product-title"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              {/* Product Emoji / Image Box */}
              <div className="w-16 h-16 rounded-2xl bg-[#f4f7f5] border border-slate-100 flex items-center justify-center text-3xl sm:text-4xl shrink-0">
                <span role="img" aria-label={product.nameBn}>
                  {product.image}
                </span>
              </div>

              <div>
                {/* Main Product Title */}
                <h1
                  id="product-title"
                  className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight"
                >
                  {product.nameBn}
                </h1>

                {/* Unit & Category */}
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  {formatUnitBn(product.unit)} {product.categoryNameBn ? `· ${product.categoryNameBn}` : ""}
                </p>

                {/* Yesterday Comparison Note */}
                <p className="text-xs text-slate-500 mt-1 leading-normal">
                  {yesterdayDiff > 0
                    ? `গতকালের তুলনায় আজ দাম বেড়েছে - ${toBanglaNumber(yesterdayDiff)} টাকা`
                    : yesterdayDiff < 0
                    ? `গতকালের তুলনায় আজ দাম কমেছে - ${toBanglaNumber(Math.abs(yesterdayDiff))} টাকা`
                    : "গতকালের তুলনায় আজ দাম অপরিবর্তিত"}
                </p>
              </div>
            </div>

            {/* Today's Price Box */}
            <div className="bg-[#f8faf9] border border-slate-200/80 rounded-2xl px-6 py-4 text-center min-w-[140px] self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-medium block leading-none mb-1.5">
                আজকের দাম
              </span>
              <div className="text-3xl font-extrabold text-slate-900 leading-tight">
                {toBanglaNumber(product.today)}
              </div>
              <span className="text-xs text-slate-500 block mt-1 leading-none">
                টাকা / {formatUnitBn(product.unit).replace("প্রতি ", "")}
              </span>

              <div className="mt-2.5 flex items-center justify-center">
                <span
                  className={`text-xs font-semibold ${
                    isUp
                      ? "text-rose-600"
                      : isDown
                      ? "text-emerald-600"
                      : "text-slate-500"
                  }`}
                >
                  {formatPriceChange(
                    product.change?.pct ?? 0,
                    product.change?.dir ?? "flat"
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            3. Unified Lower Card: Price Summary & Market Breakdown (Figma Matched)
           ================================================================ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] p-6 sm:p-7">
          {/* Price Summary Section */}
          <section className="mb-8" aria-labelledby="price-summary-title">
            <h2
              id="price-summary-title"
              className="text-base sm:text-lg font-bold text-slate-900 mb-4"
            >
              দামের সারসংক্ষেপ
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Minimum Price Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5">
                <span className="text-xs text-slate-500 font-medium block mb-1">
                  সর্বনিম্ন দাম
                </span>
                <div className="text-xl font-bold text-emerald-600">
                  {formatPrice(minPrice)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  সবচেয়ে কম দামের বাজার
                </p>
              </div>

              {/* Maximum Price Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5">
                <span className="text-xs text-slate-500 font-medium block mb-1">
                  সর্বাধিক দাম
                </span>
                <div className="text-xl font-bold text-rose-600">
                  {formatPrice(maxPrice)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  সবচেয়ে বেশি দামের বাজার
                </p>
              </div>

              {/* Average Price Card */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5">
                <span className="text-xs text-slate-500 font-medium block mb-1">
                  গড় দাম
                </span>
                <div className="text-xl font-bold text-emerald-600">
                  {formatPrice(avgPrice)}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  প্রতি {formatUnitBn(product.unit).replace("প্রতি ", "")}-এর হিসাব
                </p>
              </div>
            </div>
          </section>

          {/* Market Breakdown Table Section */}
          <section aria-labelledby="markets-title">
            <h2
              id="markets-title"
              className="text-base sm:text-lg font-bold text-slate-900 mb-4"
            >
              বাজারভিত্তিক আজকের দাম
            </h2>

            {markets.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                এই পণ্যের জন্য বর্তমানে কোনো আঞ্চলিক বাজারের তথ্য পাওয়া যায়নি।
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-3 sm:px-4 font-semibold">বাজার</th>
                      <th className="py-3 px-3 sm:px-4 font-semibold">বিভাগ</th>
                      <th className="py-3 px-3 sm:px-4 font-semibold">সর্বনিম্ন</th>
                      <th className="py-3 px-3 sm:px-4 font-semibold">সর্বাধিক</th>
                      <th className="py-3 px-3 sm:px-4 font-semibold">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {markets.map((marketItem, idx) => {
                      const avgNum = (marketItem.min + marketItem.max) / 2;
                      const formattedAvg =
                        avgNum % 1 === 0
                          ? `${toBanglaNumber(avgNum)} টাকা`
                          : `${toBanglaNumber(avgNum.toFixed(2))} টাকা`;

                      return (
                        <tr
                          key={`${marketItem.market}-${idx}`}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Market Name */}
                          <td className="py-3.5 px-3 sm:px-4 font-medium text-slate-900">
                            {marketItem.market}
                          </td>

                          {/* Division */}
                          <td className="py-3.5 px-3 sm:px-4 text-slate-600">
                            {marketItem.division}
                          </td>

                          {/* Min Price */}
                          <td className="py-3.5 px-3 sm:px-4 text-slate-700">
                            {formatPrice(marketItem.min)}
                          </td>

                          {/* Max Price */}
                          <td className="py-3.5 px-3 sm:px-4 text-slate-700">
                            {formatPrice(marketItem.max)}
                          </td>

                          {/* Average Price */}
                          <td className="py-3.5 px-3 sm:px-4 font-semibold text-slate-900">
                            {formattedAvg}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
