import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/api";
import CategoryProductList from "@/components/category/CategoryProductList";

// ============================================================================
// Dynamic Category Page: /category/[slug]
// Server Component that fetches the category metadata and products from the API.
// ============================================================================

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Pre-renders static paths for known categories at build time.
 */
export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({
      slug: cat.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for categories:", error);
    return [];
  }
}

/**
 * Generates dynamic SEO meta tags based on the active category.
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = await getCategory(decodedSlug);

  if (!category) {
    return {
      title: "ক্যাটাগরি পাওয়া যায়নি — বাজার দর",
    };
  }

  return {
    title: `${category.nameBn} বাজার দর — বাজার দর`,
    description: `${category.nameBn} ক্যাটাগরির নিত্যপ্রয়োজনীয় পণ্যের আজকের সর্বশেষ বাজার দর ও মূল্যের তালিকা।`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Fetch category info and products in parallel
  const [category, products] = await Promise.all([
    getCategory(decodedSlug),
    getProductsByCategory(decodedSlug),
  ]);

  // If the category does not exist in the API, return Next.js notFound()
  if (!category) {
    notFound();
  }

  return (
    <main className="flex-1 py-8 sm:py-12">
      <div className="container-custom">
        <CategoryProductList category={category} products={products} />
      </div>
    </main>
  );
}
