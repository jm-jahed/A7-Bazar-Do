"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/types";
import { getCategories } from "@/lib/api";
import CategorySkeleton from "@/components/ui/CategorySkeleton";

// Category navigation bar

export default function CategoryNav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Load categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <nav
      className="bg-white/95 border-b border-slate-200/80 sticky top-16 sm:top-20 z-30 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
      aria-label="ক্যাটাগরি নেভিগেশন"
    >
      <div className="container-custom">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 scrollbar-none no-scrollbar">
          {/* Loading state */}
          {isLoading && <CategorySkeleton count={8} />}

          {/* Error message */}
          {!isLoading && hasError && (
            <div className="text-xs text-rose-500 py-1 font-medium">
              ক্যাটাগরি লোড করা যায়নি।
            </div>
          )}

          {/* Category buttons */}
          {!isLoading &&
            !hasError &&
            categories.map((category) => {
              const categoryPath = `/category/${category.slug}`;
              const isActive = pathname === categoryPath;

              return (
                <Link
                  key={category.id}
                  href={categoryPath}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                      : "bg-slate-50 text-slate-700 hover:bg-emerald-50/80 hover:text-emerald-700 border border-slate-200/70"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-sm sm:text-base leading-none">
                    {category.icon}
                  </span>
                  <span className="leading-none">{category.nameBn}</span>
                </Link>
              );
            })}
        </div>
      </div>
    </nav>
  );
}
