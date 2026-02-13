// app/products/[slug]/page.tsx (Server Component)
import type { Metadata, ResolvingMetadata } from 'next'
import ProductClient from './product-client'
import { fetchProducts } from '../../../../lib/woocommerceApi'

// ✅ Updated: Make params a Promise
type Props = { 
  params: Promise<{ slug: string }>  // ← Changed to Promise
}

type ProductWire = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images?: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

type ProductNormalized = {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: Array<{ src: string }>
  attributes?: Array<{ option: string }>
}

function normalizeProduct(p: ProductWire): ProductNormalized {
  return {
    ...p,
    images: Array.isArray(p.images) ? p.images : [],
  }
}

async function getAllProducts() {
  const products = await fetchProducts() as ProductWire[]
  return products.map(normalizeProduct)
}

async function getProductBySlug(slug: string) {
  // Fetch directly by slug from WooCommerce API (handles all products, not just first 100)
  try {
    const ck = process.env.CONSUMER_KEY || 'ck_b1a13e4236dd41ec9b8e6a1720a69397ddd12da6'
    const cs = process.env.CONSUMER_SECRET || 'cs_d8439cfabc73ad5b9d82d1d3facea6711f24dfd1'
    const res = await fetch(
      `https://cms.edaperfumes.com/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}&consumer_key=${ck}&consumer_secret=${cs}`,
      { next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return normalizeProduct(data[0] as ProductWire)
      }
    }
  } catch {
    // Fall through to local search
  }
  // Fallback: search in first page of products
  const products = await getAllProducts()
  return products.find(p => p.slug === slug || String(p.id) === slug)
}

// Fetch Yoast SEO data from WordPress REST API
async function fetchYoastSeo(slug: string) {
  try {
    const res = await fetch(
      `https://cms.edaperfumes.com/wp-json/wp/v2/product?slug=${slug}&_fields=yoast_head_json`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0]?.yoast_head_json ?? null
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const [product, yoast] = await Promise.all([
    getProductBySlug(slug),
    fetchYoastSeo(slug),
  ])

  if (!product) {
    return {
      title: 'Product not found | EDA Perfumes',
      description: 'The product you are looking for is unavailable.',
      robots: { index: false, follow: false },
    }
  }

  const brand = 'EDA Perfumes'
  const fallbackTitle = `${product.name} | ${brand}`
  const fallbackDescription = `Shop ${product.name} at EDA Perfumes. Premium long-lasting Eau de Parfum crafted with luxury ingredients.`
  const fallbackCanonical = `https://www.edaperfumes.com/product/${product.slug}`

  const title = yoast?.title || fallbackTitle
  const description = yoast?.description || fallbackDescription
  const canonical = yoast?.canonical || fallbackCanonical

  const imageUrl = product.images?.[0]?.src || '/eda-perfumes-logo.jpeg'

  const ogTitle = yoast?.og_title || title
  const ogDescription = yoast?.og_description || description
  const ogImage = yoast?.og_image?.[0]?.url || imageUrl

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: yoast?.og_site_name || brand,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    metadataBase: new URL('https://www.edaperfumes.com'),
  }
}

// ✅ Updated: Await params in Page component
export default async function Page({ params }: Props) {
  const { slug } = await params  // ← Await params here
  const product = await getProductBySlug(slug)
  const products = await getAllProducts()
  return (
    <ProductClient
      initialProduct={product}
      allProductsInitial={products}
      slug={slug}
    />
  )
}
