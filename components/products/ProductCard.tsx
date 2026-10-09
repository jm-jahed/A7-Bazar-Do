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
      className={`bazar-card p-4 sm:p-5 flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${className}`}
      aria-label={`${product.nameBn} - ${formatPrice(product.today)}`}
    >
      <div>
        {/* Product Illustration Box */}
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
          <span role="img" aria-label={product.nameBn}>
            {product.image}
          </span>
        </div>

        {/* Product Bengali Name */}
        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-1 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {product.nameBn}
        </h3>

        {/* Unit Line (e.g., প্রতি কেজি, প্রতি লিটার) */}
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          {formatUnitBn(product.unit)}
        </p>
      </div>

      {/* Price Row: Label, Value, and Price Change Badge */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium leading-none mb-1">
            আজকের দাম
          </span>
          <span className="font-bold text-slate-900 text-sm sm:text-base leading-none">
            {formatPrice(product.today)}
          </span>
        </div>

        {/* Direction Badge */}
        <span
          className={
            isUp ? "badge-rise" : isDown ? "badge-fall" : "badge-flat"
          }
        >
          {formatPriceChange(product.change?.pct ?? 0, product.change?.dir ?? "flat")}
        </span>
      </div>
    </Link>
  );
}
