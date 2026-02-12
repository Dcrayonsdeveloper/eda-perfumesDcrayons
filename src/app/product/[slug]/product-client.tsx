'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../../../../lib/woocommerceApi'
import { useCart } from '../../../../lib/cart'
import { toast } from '../../../../hooks/use-toast'
import { useFacebookPixel } from '../../../../hooks/useFacebookPixel'
import ImageGallery from '../../../../components/ImageGallery'
import { Tab } from '@headlessui/react'
import ProductFAQ from '../../../../components/ProductFaq'
import RelatedProducts from '../../../../components/RelatedProducts'
import ProductReviews from '../../../../components/ProductReviews'
import { Heart, Star, Shield, Truck, Award, CreditCard, Plus, Minus, Gift } from 'lucide-react'

export interface ImageData { src: string }
export interface Attribute { option: string }
export interface Product {
  id: number
  name: string
  slug: string
  price: string
  regular_price: string
  description?: string
  short_description?: string
  images: ImageData[]
  attributes?: Attribute[]
}

export default function ProductClient({
  initialProduct,
  allProductsInitial,
  slug,
}: {
  initialProduct?: Product | undefined
  allProductsInitial?: Product[] | undefined
  slug: string
}) {
  const router = useRouter()
  const { addToCart } = useCart()
  const { trackViewContent, trackAddToCart, trackInitiateCheckout } = useFacebookPixel()

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['all-products'],
    queryFn: async () => await fetchProducts() as Product[],
    initialData: allProductsInitial,
    staleTime: 60_000,
    enabled: Boolean(slug),
  })

  const rawProduct: Product | undefined =
    initialProduct ??
    products?.find((p) => p.slug === slug || p.id.toString() === slug)

  // Product short_description overrides
  const shortDescOverrides: Record<string, string> = {
    'oudh-shukran-eau-de-parfum-100ml': '<p><span style="font-weight: 400;">Discover the timeless richness of</span><strong> Oudh Shukran</strong><span style="font-weight: 400;">, a luxurious Arabic fragrance crafted to reflect tradition, depth, and quiet confidence. Designed for those </span><strong>who appreciate bold oriental scents</strong><span style="font-weight: 400;">, this perfume blends elegance with intensity to create a truly memorable presence.</span></p>\n<p><span style="font-weight: 400;">With its deep oudh character and warm woody undertones, </span><strong>Oudh Shukran</strong><span style="font-weight: 400;"> is more than a fragrance — it\'s a</span><strong> statement of sophistication</strong><span style="font-weight: 400;"> rooted in </span><strong>Middle Eastern perfumery</strong><span style="font-weight: 400;">. Powerful yet refined, it leaves a lasting impression wherever you go.</span></p>',
  };

  // Product full description overrides
  const descriptionOverrides: Record<string, string> = {
    'oudh-shukran-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Oudh Shukran by EDA Perfumes is a refined </span><strong>Arabic attar perfume</strong><span style="font-weight: 400;"> inspired by the depth and richness of traditional Middle Eastern perfumery. Designed for those who appreciate bold, long-lasting fragrances, this Eau de Parfum delivers a luxurious scent experience rooted in authenticity and craftsmanship.</span></p>
<p><span style="font-weight: 400;">The fragrance opens with warm, resinous accords that immediately set a powerful tone. As it evolves, rich oudh notes take center stage, offering depth, intensity, and a distinctly premium character. The base settles into smooth woody undertones that enhance longevity and leave a strong, confident impression.</span></p>
<p><span style="font-weight: 400;">Ideal as an </span><strong>Arabic attar perfume for men</strong><span style="font-weight: 400;">, Oudh Shukran reflects strength, elegance, and timeless appeal. Its composition places it among </span><strong>premium arabic perfumes</strong><span style="font-weight: 400;">, making it suitable for evening wear, formal occasions, and cooler weather. For those seeking the </span><strong>best arabic attar perfume</strong><span style="font-weight: 400;">, this fragrance delivers both tradition and modern refinement.</span></p>
<p><span style="font-weight: 400;">Crafted with precision and quality-focused ingredients, Oudh Shukran represents EDA Perfumes\u2019 commitment to creating authentic, high-performance fragrances that honor Middle Eastern scent traditions.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for optimal performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Do not rub after spraying to maintain the fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">A little goes a long way due to its rich and intense profile</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Authentic arabic attar inspired fragrance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Rich oudh-based scent with premium depth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Ideal for men who prefer bold fragrances</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes with traditional influence</span></li>
</ul>
<h3><strong>Inspired by Traditional Arabic Perfumery</strong></h3>
<p><span style="font-weight: 400;">Oudh Shukran captures the essence of classic Middle Eastern fragrances, blending rich oudh notes with modern refinement.</span></p>
<h3><strong>Deep and Long-Lasting Scent Profile</strong></h3>
<p><span style="font-weight: 400;">This premium arabic perfume is designed to evolve beautifully on the skin, offering depth, warmth, and lasting presence.</span></p>
<h3><strong>Perfect for Evening and Special Occasions</strong></h3>
<p><span style="font-weight: 400;">With its bold character, this </span><strong>arabic attar perfume</strong><span style="font-weight: 400;"> is best suited for formal wear, celebrations, and cooler climates.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates thoughtfully crafted fragrances that respect tradition while delivering modern performance and consistency.</span></p>`,
    'nude-poison-elegant-unisex-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Nude Poison by EDA Perfumes is an elegant unisex perfume created for individuals who appreciate fresh citrus fragrances with a soft floral character. Designed as a premium Eau de Parfum, it delivers a balanced scent profile that feels light, modern, and long-lasting.</span></p>
<p><span style="font-weight: 400;">The fragrance opens with the brightness of a</span><strong> fresh lemon perfume</strong><span style="font-weight: 400;"> accord, immediately creating a crisp and uplifting impression. This citrus introduction is complemented by vibrant </span><strong>grapefruit perfume</strong><span style="font-weight: 400;"> notes that add energy and a refreshing edge to the composition.</span></p>
<p><span style="font-weight: 400;">As the fragrance evolves, the heart reveals a smooth </span><strong>jasmine perfume note</strong><span style="font-weight: 400;"> that introduces softness and elegance. This floral layer balances the citrus freshness, creating a fragrance that feels clean yet sophisticated.</span></p>
<p><span style="font-weight: 400;">The scent settles into a gentle and refined base that supports long-lasting performance throughout the day. Its versatility makes Nude Poison suitable for both daytime wear and relaxed evening settings.</span></p>
<p><span style="font-weight: 400;">Designed to perform beautifully on different skin types, Nude Poison stands out as an elegant unisex perfume that adapts naturally to personal style. It reflects EDA Perfumes\u2019 commitment to creating fragrances that combine freshness, balance, and modern simplicity.</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after application to preserve fragrance notes</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly if needed for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Elegant unisex perfume with citrus-floral balance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Fresh lemon perfume opening with grapefruit freshness</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Soft</span><strong> jasmine perfume</strong><span style="font-weight: 400;"> heart note</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes</span></li>
</ul>
<h3><strong>Fresh Citrus Opening</strong></h3>
<p><span style="font-weight: 400;">Nude Poison begins with bright lemon and grapefruit notes that create an instantly refreshing fragrance experience.</span></p>
<h3><strong>Soft Floral Elegance</strong></h3>
<p><span style="font-weight: 400;">The j</span><strong>asmine perfume</strong><span style="font-weight: 400;"> heart adds a smooth and sophisticated floral character that enhances balance.</span></p>
<h3><strong>Perfect Everyday Unisex Fragrance</strong></h3>
<p><span style="font-weight: 400;">This elegant unisex perfume is designed for daily wear, offering freshness without overpowering intensity.</span></p>
<h3><strong>Why Choose EDA Perfumes</strong></h3>
<p><span style="font-weight: 400;">EDA Perfumes creates thoughtfully balanced fragrances that combine modern freshness with reliable performance, making them suitable for everyday lifestyles.</span></p>`,
    'bad-habits-eau-de-parfum-100ml': `<p><span style="font-weight: 400;">Bad Habits by EDA Perfumes is a modern </span><strong>unisex luxury fragrance</strong><span style="font-weight: 400;"> created for individuals who appreciate bold scents with a balanced and sophisticated character. Crafted as a premium Eau de Parfum, it offers a fragrance experience that feels energetic, expressive, and long-lasting.\u00a0</span></p>
<p><span style="font-weight: 400;">The fragrance opens with a vibrant </span><strong>fresh citrus perfume</strong><span style="font-weight: 400;"> profile that immediately feels clean and uplifting. This bright introduction creates a refreshing presence that works beautifully in daily wear while maintaining a premium identity.\u00a0</span></p>
<p><span style="font-weight: 400;">As the scent develops, it reveals a deeper and warmer composition that adds personality and dimension. The evolving notes create a smooth transition into a sensual base, giving the fragrance a </span><strong>seductive perfume for women</strong><span style="font-weight: 400;"> appeal while remaining confidently unisex.\u00a0</span></p>
<p><span style="font-weight: 400;">Designed for versatility, Bad Habits performs well across different occasions, from casual daytime settings to evening outings. Its long-lasting Eau de Parfum concentration ensures the fragrance remains noticeable without feeling overpowering.\u00a0</span></p>
<p><span style="font-weight: 400;">Developed with attention to balance, longevity, and modern fragrance preferences, </span><strong>Bad Habits</strong><span style="font-weight: 400;"> reflects EDA Perfumes\u2019 commitment to creating premium scents that combine freshness, elegance, and lasting impact.\u00a0</span></p>
<h2><strong>How to Use</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Apply on clean, dry skin for best performance</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Spray lightly on pulse points such as the neck, wrists, and behind the ears</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Hold the bottle 5 to 7 inches away while applying</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Avoid rubbing after application to maintain fragrance structure</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Reapply lightly if needed for extended wear</span></li>
</ul>
<h2><strong>Key Highlights</strong></h2>
<ul>
<li style="font-weight: 400;"><span style="font-weight: 400;">Unisex luxury fragrance with modern appeal</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Fresh citrus perfume opening with warm depth</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Long-lasting Eau de Parfum concentration</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Suitable for both men and women</span></li>
<li style="font-weight: 400;"><span style="font-weight: 400;">Crafted by EDA Perfumes</span></li>
</ul>
<h3><strong>A Fresh Yet Seductive Signature</strong></h3>
<p><span style="font-weight: 400;">Bad Habits combines citrus freshness with a sensual dry-down, creating a fragrance that feels energetic yet sophisticated.</span></p>
<h3><strong>Designed for Confident Personalities</strong></h3>
<p><span style="font-weight: 400;">This unisex luxury fragrance is created for individuals who enjoy expressive scents that leave a lasting impression.</span></p>
<h3><strong>Versatile for Any Occasion</strong></h3>
<p><span style="font-weight: 400;">From daytime freshness to evening elegance, Bad Habits adapts easily to different settings and styles.</span></p>
<h2><strong>Why Choose EDA Perfumes</strong></h2>
<p><span style="font-weight: 400;">EDA Perfumes focuses on crafting premium fragrances that balance freshness, performance, and modern luxury, allowing every scent to become a personal signature.</span></p>`,
  };

  const product = rawProduct ? {
    ...rawProduct,
    ...(rawProduct.slug && shortDescOverrides[rawProduct.slug] ? { short_description: shortDescOverrides[rawProduct.slug] } : {}),
    ...(rawProduct.slug && descriptionOverrides[rawProduct.slug] ? { description: descriptionOverrides[rawProduct.slug] } : {}),
  } : undefined;

  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (product) {
      trackViewContent({
        id: product.id,
        name: product.name,
        price: product.price,
      })
    }
  }, [product, trackViewContent])

  if (isLoading && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-900 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm font-light">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || (!products && !product) || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-8">
          <h2 className="text-xl font-light text-gray-900 mb-3">Product Not Found</h2>
          <p className="text-sm text-gray-600 font-light mb-6">The product you are looking for does not exist.</p>
          <button 
            onClick={() => router.push('/shop')}
            className="px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const salePrice = parseFloat(product.price || '0')
  const regularPrice = parseFloat(product.regular_price || product.price || '0')
  const hasSale = salePrice < regularPrice
  
  const totalPrice = salePrice * quantity
  const totalRegularPrice = regularPrice * quantity
  const totalSaving = hasSale ? totalRegularPrice - totalPrice : 0
  
  // Free gift calculation - 1 x 10ml perfume per bottle purchased
  const freeGiftsCount = quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta))
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          name: product.name,
          price: salePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} + ${freeGiftsCount} FREE 10ml perfume${freeGiftsCount > 1 ? 's' : ''}`,
      })
    } catch (error) {
      console.error('Add to cart failed:', error)
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' })
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1000)
    }
  }

  const handleBuyNow = async () => {
    setIsBuyingNow(true)
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          ...product,
          name: product.name,
          price: salePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: salePrice }, quantity)
      const cartItems = [{ id: product.id, name: product.name, price: salePrice, quantity }]
      const total = totalPrice
      trackInitiateCheckout(cartItems, total)
      setTimeout(() => {
        router.push('/checkout')
        setIsBuyingNow(false)
      }, 800)
    } catch (error) {
      console.error('Buy now failed:', error)
      toast({ title: 'Error', description: 'Failed to process buy now', variant: 'destructive' })
      setIsBuyingNow(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-8">
      {/* Breadcrumb - Minimal */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500 font-light">
            <button onClick={() => router.push('/shop')} className="hover:text-black transition-colors">
              Shop
            </button>
            <span>›</span>
            <span className="text-black truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4 flex flex-col lg:flex-row gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2">
          <div className="sticky top-8">
            <ImageGallery images={product.images || []} />
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2">
          <div className="space-y-6">
            {/* Category */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="text-xs text-gray-500 uppercase tracking-widest font-light">
                {product.attributes[0]?.option || 'Collection'}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-wide">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gray-900 fill-gray-900" />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-light">4.8 (247 reviews)</span>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="ml-auto"
              >
                <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-black text-black' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Free Gift Offer Badge */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-sm">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Special Gift Offer</span>
              </div>
              <p className="text-xs font-light">
                Get a <span className="font-semibold">FREE 10ml perfume</span> with every 100ml bottle purchase
              </p>
            </div>

            {/* Price Section - Minimal */}
            <div className="py-6 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <>
                    <span className="line-through text-gray-400 font-light">
                      ₹{totalRegularPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-600 font-light">
                      Save ₹{totalSaving.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {quantity > 1 && (
                <div className="text-xs text-gray-500 mt-2 font-light">
                  ₹{salePrice.toLocaleString()} per bottle
                </div>
              )}
              
              {/* Free gifts indicator */}
              <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-sm">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Gift className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    You will receive {freeGiftsCount} FREE 10ml perfume{freeGiftsCount > 1 ? 's' : ''} with this order!
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity Selector - Minimal */}
            <div>
              <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-light text-gray-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-gray-600" />
                  </button>
                </div>
                <div className="text-xs text-gray-600 font-light">
                  <Gift className="w-3.5 h-3.5 inline mr-1" />
                  +{freeGiftsCount} free 10ml
                </div>
              </div>
            </div>

            {/* Action Buttons - Minimal */}
            <div className="hidden lg:flex flex-col gap-3 pt-6">
              <button
                className={`w-full bg-black text-white font-light px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors ${isAddingToCart ? 'opacity-50' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Added' : 'Add to Cart'}
              </button>
              <button
                className={`w-full border border-gray-300 text-black font-light px-8 py-4 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors ${isBuyingNow ? 'opacity-50' : ''}`}
                onClick={handleBuyNow}
                disabled={isBuyingNow}
              >
                {isBuyingNow ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

            {/* Trust Badges - Minimal */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              {[
                { icon: <Truck className="w-4 h-4" />, label: 'Free Shipping', subtitle: 'Orders above ₹999' },
                { icon: <Shield className="w-4 h-4" />, label: 'Authentic', subtitle: 'Guaranteed original' },
                { icon: <Award className="w-4 h-4" />, label: 'Premium Quality', subtitle: 'Long-lasting EDP' },
                { icon: <CreditCard className="w-4 h-4" />, label: 'Secure Payment', subtitle: 'Protected checkout' },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 border border-gray-100">
                  <div className="text-gray-600 mb-2 flex justify-center">
                    {item.icon}
                  </div>
                  <div className="font-light text-xs text-gray-900 mb-1">{item.label}</div>
                  <div className="text-xs text-gray-500 font-light">{item.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom - Minimal */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 p-4">
        <div className="max-w-md mx-auto">
          {/* Free gift indicator for mobile */}
          <div className="mb-3 p-2 bg-emerald-50 border border-emerald-200 rounded-sm">
            <div className="flex items-center justify-center gap-1 text-emerald-800">
              <Gift className="w-3 h-3" />
              <span className="text-xs font-medium">+{freeGiftsCount} FREE 10ml perfume{freeGiftsCount > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-light">Total</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && (
                  <span className="line-through text-gray-400 text-sm font-light">
                    ₹{totalRegularPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 hover:bg-gray-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4 py-2 text-sm font-light">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-black text-white font-light px-4 py-3 text-xs tracking-widest uppercase hover:bg-gray-800"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Added' : 'Add to Cart'}
            </button>
            <button
              className="flex-1 border border-gray-300 text-black font-light px-4 py-3 text-xs tracking-widest uppercase hover:bg-gray-50"
              onClick={handleBuyNow}
              disabled={isBuyingNow}
            >
              {isBuyingNow ? 'Processing' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs - Minimal */}
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <div className="border-t border-gray-200">
          <Tab.Group>
            <Tab.List className="flex border-b border-gray-200">
              {['Description', 'Fragrance Notes', 'How to Use'].map((label, idx) => (
                <Tab key={idx} className={({ selected }) =>
                  `flex-1 py-4 px-6 text-xs font-light outline-none transition-all uppercase tracking-widest ${
                    selected 
                      ? 'text-black border-b-2 border-black' 
                      : 'text-gray-500 hover:text-black'
                  }`
                }>
                  {label}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="py-8">
              <Tab.Panel>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: product.description || '' }} />
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-6">
                  <h3 className="text-lg font-light text-gray-900 tracking-wide">Fragrance Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { title: 'Top Notes', notes: 'Bergamot, Pink Pepper, Fresh Mint' },
                      { title: 'Heart Notes', notes: 'Jasmine, Rose, Spicy Cardamom' },
                      { title: 'Base Notes', notes: 'Sandalwood, Musk, Vanilla' },
                    ].map((item, idx) => (
                      <div key={idx} className="border border-gray-200 p-6">
                        <h4 className="font-light text-sm text-gray-900 mb-3 uppercase tracking-wide">{item.title}</h4>
                        <p className="text-sm text-gray-600 font-light">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="space-y-6">
                  <h3 className="text-lg font-light text-gray-900 tracking-wide">Application Tips</h3>
                  <div className="border border-gray-200 p-6">
                    <ul className="space-y-3 text-gray-700 font-light text-sm">
                      <li>Apply to pulse points: wrists, neck, and behind ears</li>
                      <li>For best longevity, apply to well-moisturized skin</li>
                      <li>Allow the fragrance to dry naturally - do not rub</li>
                      <li>For evening occasions, lightly spray on clothing or hair</li>
                    </ul>
                  </div>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 px-4">
        <ProductFAQ productSlug={slug} productName={product.name} />
      </div>
      <div className="max-w-7xl mx-auto mt-16 px-4">
        <ProductReviews productId={product.id} productName={product.name} />
      </div>
      <RelatedProducts currentProduct={product} allProducts={products || []} />
    </div>
  )
}
