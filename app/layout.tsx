import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import CategoryNav from "@/components/layout/CategoryNav";
import PriceTicker from "@/components/layout/PriceTicker";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর (Bazar Dor) — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description:
    "দৈনন্দিন নিত্যপ্রয়োজনীয় পণ্যের বাজারদর, দামের ওঠানামা এবং বাজারভিত্তিক সঠিক তথ্য।",
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* Toast notifications */}
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />

        {/* Header navigation */}
        <Navbar />
        <CategoryNav />
        <PriceTicker />

        {/* Page content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
