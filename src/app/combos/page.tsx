import { Metadata } from 'next';
import CombosPageClient from './CombosPageClient';

export const metadata: Metadata = {
  title: 'Fragrance Combos - Eda Perfumes',
  description: 'Curated perfume combinations at special bundle prices',
};

// Product type definition
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  short_description?: string;
  description?: string;
  stock_status?: string;
}

async function getProducts(): Promise<Product[]> {
  try {
    // Replace with your actual WooCommerce API endpoint
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/products?per_page=100&consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CombosPage() {
  const products = await getProducts();

  return <CombosPageClient products={products} />;
}
