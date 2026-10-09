import React, { Suspense } from "react";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { getProducts } from "@/lib/api";
import { Product } from "@/lib/types";

// ============================================================================
// Helper Calculations for Step 10 Sections
// ============================================================================

/**
 * Filters and sorts products whose prices have increased today.
 * Displays up to 6 products sorted from greatest percentage increase to smallest.
 */
function getTopRisers(products: Product[]): Product[] {
  return products
    .filter(
      (product) =>
        product.change &&
        (product.change.dir === "up" || product.change.pct > 0)
    )
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);
}

/**
 * Filters and sorts products whose prices have decreased today.
 * Displays up to 6 products sorted from greatest percentage drop to smallest.
 */
function getTopFallers(products: Product[]): Product[] {
  return products
    .filter(
      (product) =>
        product.change &&
        (product.change.dir === "down" || product.change.pct < 0)
    )
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);
}

// ============================================================================
// Home Product Sections (Server Component)
// Fetches the real product list from the API once and feeds:
// 1. Top Risers (আজ দাম বেড়েছে ▲)
// 2. Top Fallers (আজ দাম কমেছে ▼)
// 3. All Products (সব পণ্য)
// ============================================================================

async function HomeProductSections() {
  let products: Product[] | null = null;
  let hasError = false;

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Failed to load products on Home page:", error);
    hasError = true;
  }

  if (hasError || !products) {
    return (
      <div className="container-custom py-12">
        <ErrorState
          title="পণ্য তালিকা লোড করা যাচ্ছে না"
          description="বাজার দর সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container-custom py-12">
        <EmptyState
          title="কোনো পণ্য পাওয়া যায়নি"
          description="বর্তমানে বাজার দর সার্ভারে কোনো পণ্য তালিকাভুক্ত নেই।"
        />
      </div>
    );
  }

  const topRisers = getTopRisers(products);
  const topFallers = getTopFallers(products);

  return (
    <>
      {/* ================================================================
          Section A: Top Risers (▲ আজ দাম বেড়েছে)
          Displays up to 6 rising products sorted by highest increase.
         ================================================================ */}
      {topRisers.length > 0 && (
        <section className="py-6 sm:py-8">
          <div className="container-custom">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-rose-600 text-sm sm:text-base leading-none" aria-hidden="true">
                  ▲
                </span>
                <span>আজ দাম বেড়েছে</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {topRisers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          Section B: Top Fallers (▼ আজ দাম কমেছে)
          Displays up to 6 falling products sorted by greatest drop.
         ================================================================ */}
      {topFallers.length > 0 && (
        <section className="py-6 sm:py-8">
          <div className="container-custom">
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-emerald-600 text-sm sm:text-base leading-none" aria-hidden="true">
                  ▼
                </span>
                <span>আজ দাম কমেছে</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {topFallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================
          Section C: All Products (সব পণ্য)
          Displays all commodities returned by the API in a responsive grid.
          Anchor id="সব-পণ্য" enables smooth navigation from the Hero CTA.
         ================================================================ */}
      <section id="সব-পণ্য" className="py-6 sm:py-8 scroll-mt-24">
        <div className="container-custom">
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              সব পণ্য
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              বাজারের সব নিত্যপ্রয়োজনীয় পণ্যের তালিকা ও বিস্তারিত তথ্য।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ============================================================================
// Skeleton Loader for Initial Suspense Fallback
// ============================================================================

function HomeSectionsSkeleton() {
  return (
    <div className="container-custom py-8 sm:py-10 space-y-10">
      <div>
        <div className="h-7 bg-slate-200 rounded w-48 mb-6 animate-pulse" />
        <ProductCardSkeleton count={6} />
      </div>
      <div>
        <div className="h-7 bg-slate-200 rounded w-48 mb-6 animate-pulse" />
        <ProductCardSkeleton count={6} />
      </div>
      <div>
        <div className="h-7 bg-slate-200 rounded w-32 mb-2 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-64 mb-6 animate-pulse" />
        <ProductCardSkeleton count={8} />
      </div>
    </div>
  );
}

// ============================================================================
// Main Home Page Component
// ============================================================================

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero / Banner Section */}
      <Hero />

      {/* 2. Real API Product Sections (Top Risers, Top Fallers, All Products) */}
      <Suspense fallback={<HomeSectionsSkeleton />}>
        <HomeProductSections />
      </Suspense>
    </main>
  );
}
