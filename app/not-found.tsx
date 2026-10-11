import React from "react";
import EmptyState from "@/components/ui/EmptyState";

// 404 page for unknown routes

export default function NotFound() {
  return (
    <main className="flex-1 py-16">
      <div className="container-custom">
        <EmptyState
          title="পৃষ্ঠাটি পাওয়া যায়নি"
          description="আপনি যে ক্যাটাগরি বা পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই অথবা সরানো হয়েছে।"
          icon="🔍"
          actionText="হোম পেজে ফিরে যান"
          actionHref="/"
        />
      </div>
    </main>
  );
}
