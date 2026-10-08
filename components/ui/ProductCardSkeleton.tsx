import React from "react";

// ============================================================================
// ProductCardSkeleton Component
// Placeholder skeleton card matching the exact dimensions and proportions
// of the Bazar Dor product card. Used during initial API fetching.
// ============================================================================

interface ProductCardSkeletonProps {
  // Number of skeleton cards to render in a grid. Defaults to 1.
  count?: number;
  className?: string;
}

// Single skeleton card matching the product card layout
function SingleCardSkeleton() {
  return (
    <div
      className="bazar-card p-5 animate-pulse flex flex-col justify-between"
      aria-hidden="true"
    >
      <div>
        {/* Top emoji / image placeholder */}
        <div className="w-12 h-12 rounded-xl bg-slate-200 mb-3" />

        {/* Product title placeholder */}
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-2" />

        {/* Unit text placeholder (e.g. প্রতি কেজি) */}
        <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-4" />
      </div>

      {/* Price row & change badge placeholder */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {/* Price placeholder */}
        <div className="h-5 bg-slate-200 rounded-md w-24" />

        {/* Change badge placeholder */}
        <div className="h-6 bg-slate-200 rounded-full w-16" />
      </div>
    </div>
  );
}

export default function ProductCardSkeleton({
  count = 1,
  className = "",
}: ProductCardSkeletonProps) {
  if (count <= 1) {
    return <SingleCardSkeleton />;
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SingleCardSkeleton key={index} />
      ))}
    </div>
  );
}
