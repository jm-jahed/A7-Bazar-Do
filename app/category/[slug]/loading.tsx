import React from "react";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

// Category page loading skeleton

export default function CategoryLoading() {
  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="container-custom">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80 animate-pulse">
          <div>
            <div className="h-8 bg-slate-200 rounded w-40 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-56" />
          </div>
          <div className="h-9 bg-slate-200 rounded w-36" />
        </div>

        {/* Product grid skeleton */}
        <ProductCardSkeleton count={8} />
      </div>
    </main>
  );
}
