import React from "react";

// ============================================================================
// Global Footer Component (Figma Matched)
// Requirement 7:
// Left: বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
// Right: সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
// ============================================================================

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-xs text-slate-500">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-medium text-slate-700">
            বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p className="text-slate-400 italic">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
      </div>
    </footer>
  );
}
