import React from "react";

// ============================================================================
// ErrorState Component
// Displays a helpful Bengali error message when an API request fails,
// with an optional Retry button so the user can re-fetch easily.
// ============================================================================

interface ErrorStateProps {
  // Main error title
  title?: string;
  // Optional secondary description explaining the issue
  description?: string;
  // Callback function to re-attempt fetching the data
  onRetry?: () => void;
  // Text for the retry button
  retryText?: string;
  // Optional extra CSS classes
  className?: string;
}

export default function ErrorState({
  title = "দুঃখিত, তথ্য লোড করা যাচ্ছে না।",
  description = "ইন্টারনেট সংযোগ চেক করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।",
  onRetry,
  retryText = "আবার চেষ্টা করুন",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`bazar-card max-w-md mx-auto p-6 sm:p-8 text-center my-6 ${className}`}
      role="alert"
    >
      {/* Error icon circle */}
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl">
        ⚠️
      </div>

      {/* Error title */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Retry action button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg"
        >
          <span>🔄</span>
          <span>{retryText}</span>
        </button>
      )}
    </div>
  );
}
