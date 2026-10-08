"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { getProducts } from "@/lib/api";
import { formatPrice, formatUnitBn, toBanglaNumber } from "@/lib/utils";

// ============================================================================
// PriceTicker Component
// Infinite scrolling price marquee banner positioned under the category bar.
// Displays live commodity prices, units, and price direction change indicators.
// ============================================================================

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fetch all products from the real API for the ticker stream
  useEffect(() => {
    async function loadTickerData() {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products for ticker:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadTickerData();
  }, []);

  // Duplicate items for seamless continuous looping in CSS marquee
  const tickerItems = products.length > 0 ? [...products, ...products] : [];

  return (
    <div
      className="bg-slate-100/90 border-b border-slate-200/80 text-slate-800 text-xs sm:text-sm h-10 sm:h-11 flex items-center overflow-hidden relative select-none"
      aria-label="বাজার দর লাইভ টিকার"
    >
      {/* Left fixed badge label */}
      <div className="shrink-0 z-10 bg-slate-900 text-white font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 h-full flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
        <span>লাইভ দর</span>
      </div>

      {/* Ticker Content Area */}
      <div className="flex-1 overflow-hidden relative flex items-center h-full">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center gap-6 px-4 animate-pulse text-slate-400 text-xs">
            <span>তথ্য লোড হচ্ছে...</span>
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="h-3.5 bg-slate-200 rounded w-28 hidden sm:block" />
            <div className="h-3.5 bg-slate-200 rounded w-28 hidden md:block" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && hasError && (
          <div className="px-4 text-xs text-rose-500 font-medium">
            টিকার তথ্য লোড করা যায়নি।
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && products.length === 0 && (
          <div className="px-4 text-xs text-slate-500 font-medium">
            বর্তমানে কোনো টিকার ডেটা পাওয়া যায়নি।
          </div>
        )}

        {/* Real Product Ticker Stream */}
        {!isLoading && !hasError && tickerItems.length > 0 && (
          <div className="animate-marquee flex items-center gap-6 sm:gap-8 px-4">
            {tickerItems.map((product, idx) => {
              const isUp = product.change?.dir === "up";
              const isDown = product.change?.dir === "down";

              return (
                <Link
                  key={`${product.id}-${idx}`}
                  href={`/product/${product.id}`}
                  className="flex items-center gap-1.5 sm:gap-2 shrink-0 hover:text-emerald-700 transition-colors focus:outline-none focus-visible:underline"
                  tabIndex={0}
                >
                  {/* Product Emoji */}
                  <span className="text-sm sm:text-base">{product.image}</span>

                  {/* Product Name */}
                  <span className="font-semibold text-slate-900">
                    {product.nameBn}
                  </span>

                  {/* Price & Unit */}
                  <span className="text-slate-600 font-medium">
                    {formatPrice(product.today)} / {formatUnitBn(product.unit).replace("প্রতি ", "")}
                  </span>

                  {/* Price Change Percentage */}
                  <span
                    className={`font-bold text-[11px] sm:text-xs px-1.5 py-0.5 rounded ${
                      isUp
                        ? "text-emerald-700 bg-emerald-100"
                        : isDown
                        ? "text-rose-700 bg-rose-100"
                        : "text-slate-600 bg-slate-200"
                    }`}
                  >
                    {isUp && "▲ "}
                    {isDown && "▼ "}
                    {!isUp && !isDown && "— "}
                    {toBanglaNumber(product.change?.pct?.toFixed(1) || "০.০")}%
                  </span>

                  {/* Dot separator */}
                  <span className="text-slate-300 ml-3">|</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
