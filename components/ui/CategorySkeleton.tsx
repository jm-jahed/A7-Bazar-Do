import React from "react";

// ============================================================================
// CategorySkeleton Component
// Placeholder skeleton pills matching the category navigation bar items.
// ============================================================================

interface CategorySkeletonProps {
  // Number of skeleton category items to render. Defaults to 8.
  count?: number;
  className?: string;
}

// Single category pill skeleton
function SingleCategoryItemSkeleton() {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-slate-200 animate-pulse shrink-0"
      aria-hidden="true"
    >
      {/* Category icon placeholder */}
      <div className="w-5 h-5 rounded-full bg-slate-200" />
      {/* Category name placeholder */}
      <div className="h-4 bg-slate-200 rounded-md w-12" />
    </div>
  );
}

export default function CategorySkeleton({
  count = 8,
  className = "",
}: CategorySkeletonProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SingleCategoryItemSkeleton key={index} />
      ))}
    </div>
  );
}
