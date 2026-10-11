import React from "react";

// Product details loading skeleton

export default function ProductLoading() {
  return (
    <main className="flex-1 py-6 sm:py-10">
      <div className="container-custom animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-slate-200 rounded w-48 mb-6" />

        {/* Top card skeleton */}
        <div className="bazar-card p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-8 bg-slate-200 rounded w-64" />
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-14 bg-slate-200 rounded-lg" />
            <div className="h-14 bg-slate-200 rounded-lg" />
            <div className="h-14 bg-slate-200 rounded-lg" />
            <div className="h-14 bg-slate-200 rounded-lg" />
          </div>
        </div>

        {/* Price summary skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bazar-card p-5 h-28 bg-slate-100" />
          <div className="bazar-card p-5 h-28 bg-slate-100" />
          <div className="bazar-card p-5 h-28 bg-slate-100" />
        </div>

        {/* Market table skeleton */}
        <div className="bazar-card p-6 h-64 bg-slate-100" />
      </div>
    </main>
  );
}
