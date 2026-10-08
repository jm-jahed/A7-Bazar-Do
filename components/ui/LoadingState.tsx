import React from "react";

// ============================================================================
// LoadingState Component
// Displays a friendly Bengali loading spinner while data is being fetched.
// ============================================================================

interface LoadingStateProps {
  // Optional custom loading message. Defaults to standard Bengali prompt.
  message?: string;
  // Optional extra CSS classes for layout spacing
  className?: string;
}

export default function LoadingState({
  message = "তথ্য লোড হচ্ছে...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Animated spinning ring */}
      <div className="relative w-12 h-12 mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-emerald-600 text-xs">
          🛒
        </div>
      </div>

      {/* Loading message */}
      <p className="text-slate-600 text-base font-medium">{message}</p>
      <span className="sr-only">লোড হচ্ছে...</span>
    </div>
  );
}
