import React from "react";
import Link from "next/link";

// Empty state component when no items are found

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title = "কোনো পণ্য পাওয়া যায়নি",
  description = "এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।",
  icon = "📦",
  actionText,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`bazar-card max-w-md mx-auto p-6 sm:p-8 text-center my-6 ${className}`}
    >
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {/* Button */}
      {actionHref && actionText && (
        <Link
          href={actionHref}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg"
        >
          <span>🏠</span>
          <span>{actionText}</span>
        </Link>
      )}

      {!actionHref && onAction && actionText && (
        <button
          type="button"
          onClick={onAction}
          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
