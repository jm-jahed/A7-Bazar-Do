import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import CategoryNav from "@/components/layout/CategoryNav";
import PriceTicker from "@/components/layout/PriceTicker";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Load Google Noto Sans Bengali font for clean, readable Bengali and English typography
const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

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
    <html lang="bn" className={notoSansBengali.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {/* Global Toast Notifications */}
        <Toaster position="top-center" toastOptions={{ duration: 3500 }} />

        {/* Global Header Navigation Structure */}
        <Navbar />
        <CategoryNav />
        <PriceTicker />

        {/* Page Content */}
        <div className="flex-1 flex flex-col">{children}</div>

        {/* Global Footer (Requirement 7) */}
        <Footer />
      </body>
    </html>
  );
}
