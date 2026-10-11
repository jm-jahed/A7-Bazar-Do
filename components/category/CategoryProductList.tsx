"use client";

import React, { useMemo, useState } from "react";
import { Category, Product, SortOption } from "@/lib/types";
import { toBanglaNumber } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

// Category product list with sorting

interface CategoryProductListProps {
  category: Category;
  products: Product[];
}

export default function CategoryProductList({
  category,
  products,
}: CategoryProductListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // Sort products by price
  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sortOption === "price-low-to-high") {
      // Lowest price first
      return list.sort((a, b) => a.today - b.today);
    }

    if (sortOption === "price-high-to-low") {
      // Highest price first
      return list.sort((a, b) => b.today - a.today);
    }

    // Default order
    return list;
  }, [products, sortOption]);

  return (
    <div className="space-y-6">
      {/* Category header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-2xs">
            <span role="img" aria-label={category.nameBn}>
              {category.icon}
            </span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {category.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-none">
              প্রতি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>
      </div>

      {/* Count and sort controls */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Sort dropdown */}
        {products.length > 0 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="category-sort-select"
              className="text-xs text-slate-500 font-medium shrink-0"
            >
              সাজান:
            </label>
            <div className="relative">
              <select
                id="category-sort-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
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
                ▾
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product grid or empty state */}
      {sortedProducts.length === 0 ? (
        <EmptyState
          title="এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি"
          description={`"${category.nameBn}" ক্যাটাগরিতে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।`}
          icon={category.icon || "📦"}
          actionText="হোম পেজে ফিরে যান"
          actionHref="/"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
