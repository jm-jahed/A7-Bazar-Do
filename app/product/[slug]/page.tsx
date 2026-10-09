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
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // 1. Server-side session verification via Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Redirect unauthenticated users to /signin with target callback URL
  if (!session) {
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

  return (
    <main className="flex-1 py-6 sm:py-10">
      <div className="container-custom">
        {/* ================================================================
            1. Breadcrumb / Back Link
           ================================================================ */}
        <nav
          className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium"
          aria-label="ব্রেডক্রাম্ব"
        >
          <Link
            href="/"
            className="hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <span>হোম</span>
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/category/${product.category}`}
                className="hover:text-emerald-600 transition-colors"
              >
                {product.categoryNameBn || product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-900 font-semibold truncate">
            {product.nameBn}
          </span>
        </nav>

        {/* ================================================================
            2. Top Summary Card: Product Header
           ================================================================ */}
        <section
          className="bazar-card p-5 sm:p-8 mb-6 sm:mb-8"
          aria-labelledby="product-title"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              {/* Product Emoji / Illustration */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-xs">
                <span role="img" aria-label={product.nameBn}>
                  {product.image}
                </span>
              </div>

              <div>
                {/* Category Badge & Unit */}
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  {product.category && (
                    <Link
                      href={`/category/${product.category}`}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <span>{product.categoryIcon}</span>
                      <span>{product.categoryNameBn || product.category}</span>
                    </Link>
                  )}
                  <span className="text-xs text-slate-500 font-medium">
                    {formatUnitBn(product.unit)}
                  </span>
                </div>

                {/* Main Product Title */}
                <h1
                  id="product-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {product.nameBn}
                </h1>
              </div>
            </div>

            {/* Today's Price & Change Badge */}
            <div className="flex md:flex-col items-center md:items-end justify-between pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-2">
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-400 font-medium block">
                  আজকের বাজার দর
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {formatPrice(product.today)}
                </span>
              </div>

              <span
                className={
                  isUp ? "badge-rise" : isDown ? "badge-fall" : "badge-flat"
                }
              >
                {formatPriceChange(
                  product.change?.pct ?? 0,
                  product.change?.dir ?? "flat"
                )}
              </span>
            </div>
          </div>

          {/* Historical Trend Row (Yesterday, Last Week, Last Month) */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-0.5">আজকের দাম</span>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {formatPrice(product.today)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-0.5">গতকাল</span>
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                {formatPrice(product.yesterday)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-0.5">গত সপ্তাহ</span>
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                {formatPrice(product.lastWeek)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
              <span className="text-xs text-slate-400 block mb-0.5">গত মাস</span>
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                {formatPrice(product.lastMonth)}
              </span>
            </div>
          </div>
        </section>

        {/* ================================================================
            3. Price Summary Cards (Min, Max, Average)
           ================================================================ */}
        <section className="mb-8" aria-labelledby="price-summary-title">
          <div className="mb-4">
            <h2
              id="price-summary-title"
              className="text-lg sm:text-xl font-bold text-slate-900"
            >
              মূল্য সারাংশ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              বিভিন্ন বাজারে যাচাইকৃত সর্বনিম্ন, সর্বোচ্চ এবং গড় দর।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Minimum Price Card */}
            <div className="bazar-card p-5 border-l-4 border-l-emerald-500">
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                সর্বনিম্ন দাম
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mb-1">
                {formatPrice(minPrice)}
              </div>
              <p className="text-xs text-slate-400">
                বিভিন্ন বাজারের মধ্যে প্রাপ্ত সর্বনিম্ন মূল্য
              </p>
            </div>

            {/* Maximum Price Card */}
            <div className="bazar-card p-5 border-l-4 border-l-rose-500">
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                সর্বোচ্চ দাম
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-rose-700 mb-1">
                {formatPrice(maxPrice)}
              </div>
              <p className="text-xs text-slate-400">
                বিভিন্ন বাজারের মধ্যে প্রাপ্ত সর্বোচ্চ মূল্য
              </p>
            </div>

            {/* Average Price Card */}
            <div className="bazar-card p-5 border-l-4 border-l-sky-500">
              <span className="text-xs text-slate-500 font-semibold block mb-1">
                গড় দাম
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-sky-700 mb-1">
                {formatPrice(avgPrice)}
              </div>
              <p className="text-xs text-slate-400">
                সকল বাজারের সমন্বিত গড় মূল্য
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            4. Market-wise Price Breakdown Table (বাজারভিত্তিক আজকের দাম)
           ================================================================ */}
        <section aria-labelledby="markets-title">
          <div className="mb-4">
            <h2
              id="markets-title"
              className="text-lg sm:text-xl font-bold text-slate-900"
            >
              বাজারভিত্তিক আজকের দাম
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              মোট {toBanglaNumber(markets.length)}টি বাজার থেকে সংগৃহীত সর্বশেষ দর তালিকা।
            </p>
          </div>

          {markets.length === 0 ? (
            <div className="bazar-card p-6 text-center text-slate-500 text-sm">
              এই পণ্যের জন্য বর্তমানে কোনো আঞ্চলিক বাজারের তথ্য পাওয়া যায়নি।
            </div>
          ) : (
            <div className="bazar-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4 sm:px-6">বাজারের নাম</th>
                      <th className="py-3 px-4 sm:px-6">বিভাগ</th>
                      <th className="py-3 px-4 sm:px-6">মূল্য পরিসীমা</th>
                      <th className="py-3 px-4 sm:px-6 text-right">গড় মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {markets.map((marketItem, idx) => {
                      const marketAvg = Math.round(
                        (marketItem.min + marketItem.max) / 2
                      );
                      return (
                        <tr
                          key={`${marketItem.market}-${idx}`}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Market Name */}
                          <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                            {marketItem.market}
                          </td>

                          {/* Division */}
                          <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              {marketItem.division}
                            </span>
                          </td>

                          {/* Price Range */}
                          <td className="py-3.5 px-4 sm:px-6 text-slate-700 font-medium">
                            {toBanglaNumber(marketItem.min)} –{" "}
                            {formatPrice(marketItem.max)}
                          </td>

                          {/* Average Price */}
                          <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 text-right">
                            {formatPrice(marketAvg)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
