import React from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice, formatUnitBn, formatPriceChange } from "@/lib/utils";

// ============================================================================
// ProductCard Component
// Reusable commodity card matching the Figma design reference.
// Shows product illustration, Bengali name, unit, today's price, and price change badge.
// ============================================================================

interface ProductCardProps {
  // Product item data from the real API
  product: Product;
  // Optional extra CSS classes for layout spacing
  className?: string;
}

export default function ProductCard({
  product,
  className = "",
}: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-200 p-4 sm:p-5 flex flex-col justify-between transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      aria-label={`${product.nameBn} - ${formatPrice(product.today)}`}
    >
      {/* Top Part: Emoji Icon Box on Left, Name & Unit on Right */}
      <div className="flex items-center gap-3.5 mb-4">
        {/* Product Illustration Box */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
          <span role="img" aria-label={product.nameBn}>
            {product.image}
          </span>
        </div>

        {/* Product Bengali Name & Unit */}
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-emerald-700 transition-colors truncate">
            {product.nameBn}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-none truncate">
            {formatUnitBn(product.unit)}
          </p>
        </div>
      </div>

      {/* Price Row: Label, Value, and Price Change Badge */}
      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mb-1">
            আজকের দাম
          </span>
          <span className="font-bold text-slate-900 text-sm sm:text-base leading-none">
            {formatPrice(product.today)}
          </span>
        </div>

        {/* Direction Badge */}
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            isUp
              ? "bg-rose-50 text-rose-600 border border-rose-100/70"
              : isDown
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100/70"
              : "bg-slate-50 text-slate-500 border border-slate-200/70"
          }`}
        >
          {formatPriceChange(product.change?.pct ?? 0, product.change?.dir ?? "flat")}
        </span>
      </div>
    </Link>
  );
}
