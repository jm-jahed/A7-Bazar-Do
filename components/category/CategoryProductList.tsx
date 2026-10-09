"use client";

import React, { useMemo, useState } from "react";
import { Category, Product, SortOption } from "@/lib/types";
import { toBanglaNumber } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

// ============================================================================
// CategoryProductList Component
// Interactive client component for category listing with numeric sorting.
// Supports sorting by: Default (ডিফল্ট), Price Low-to-High, and Price High-to-Low.
// ============================================================================

interface CategoryProductListProps {
  // Category information (name, icon, slug)
  category: Category;
  // Products belonging to this category from real API
  products: Product[];
}

export default function CategoryProductList({
  category,
  products,
}: CategoryProductListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // ==========================================================================
  // Numeric Sorting Logic
  // IMPORTANT: We sort using the actual raw numeric `product.today` value,
  // NOT formatted Bengali display strings (e.g. "১৪৮ টাকা").
  // ==========================================================================
  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sortOption === "price-low-to-high") {
      // Sort ascending by price: lowest price first
      return list.sort((a, b) => a.today - b.today);
    }

    if (sortOption === "price-high-to-low") {
      // Sort descending by price: highest price first
      return list.sort((a, b) => b.today - a.today);
    }

    // Default: preserve original API order
    return list;
  }, [products, sortOption]);

  return (
    <div>
      {/* ====================================================================
          1. Category Page Header: Icon, Name, Count & Sort Control
         ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-2xl sm:text-3xl" role="img" aria-label={category.nameBn}>
              {category.icon}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {category.nameBn}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {toBanglaNumber(products.length)}টি নিত্যপণ্যের আজকের বাজার দর
          </p>
        </div>

        {/* Sort Control Dropdown */}
        {products.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label
              htmlFor="category-sort-select"
              className="text-xs sm:text-sm font-semibold text-slate-600 shrink-0"
            >
              সাজান:
            </label>
            <div className="relative">
              <select
                id="category-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
                aria-label="পণ্য সাজানোর অপশন"
              >
                <option value="default">ডিফল্ট</option>
                <option value="price-low-to-high">দাম: কম থেকে বেশি</option>
                <option value="price-high-to-low">দাম: বেশি থেকে কম</option>
              </select>
              <span
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 text-xs"
                aria-hidden="true"
              >
                ▼
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
          2. Product Grid or Empty State
         ==================================================================== */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          title="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
          description={`"${category.nameBn}" ক্যাটাগরিতে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।`}
          icon={category.icon || "📦"}
          actionText="হোম পেজে ফিরে যান"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
