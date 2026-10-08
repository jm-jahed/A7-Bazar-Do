import React, { Suspense } from "react";
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { getProducts } from "@/lib/api";

// ============================================================================
// Product Card Preview List (Step 9)
// Fetches real products from the API and renders sample ProductCard items.
// ============================================================================

async function ProductCardPreviewList() {
  const products = await getProducts();
  const sampleProducts = products.slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* 1. Hero / Banner Section */}
      <Hero />

      {/* 2. Step 9 Product Card Preview Container */}
      <section
        id="সব-পণ্য"
        className="py-10 bg-slate-50 border-t border-slate-200/80"
      >
        <div className="container-custom">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              প্রোডাক্ট কার্ড প্রিভিউ (Step 9)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ফিগমা ডিজাইন ও আসল API ডেটা অনুযায়ী তৈরি করা রিইউজেবল প্রোডাক্ট কার্ড।
            </p>
          </div>

          {/* Suspense wrapper with skeleton fallback */}
          <Suspense fallback={<ProductCardSkeleton count={4} />}>
            <ProductCardPreviewList />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
