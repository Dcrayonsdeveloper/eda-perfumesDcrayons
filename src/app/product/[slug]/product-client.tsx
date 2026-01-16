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
import { Heart, Star, Shield, Truck, Award, CreditCard, Plus, Minus, Tag } from 'lucide-react'

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

  const product: Product | undefined =
    initialProduct ??
    products?.find((p) => p.slug === slug || p.id.toString() === slug)

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
  
  // Bulk pricing logic - Buy 4 at ₹1000
  const BULK_QUANTITY = 4
  const BULK_PRICE = 1000
  const isBulkEligible = quantity >= BULK_QUANTITY
  
  const totalPrice = isBulkEligible ? BULK_PRICE : salePrice * quantity
  const totalRegularPrice = regularPrice * quantity
  const perBottlePrice = isBulkEligible ? BULK_PRICE / quantity : salePrice
  const totalSaving = totalRegularPrice - totalPrice
  const hasSale = salePrice < regularPrice || isBulkEligible

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
          price: perBottlePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: perBottlePrice }, quantity)
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} added to your cart.`,
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
          price: perBottlePrice.toString(),
          images: product.images || [],
        })
      }
      trackAddToCart({ id: product.id, name: product.name, price: perBottlePrice }, quantity)
      const cartItems = [{ id: product.id, name: product.name, price: perBottlePrice, quantity }]
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
            {product.attributes?.length && (
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
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-light"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Bulk Offer Badge */}
            {!isBulkEligible && (
              <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium tracking-wide">Special Bulk Offer</span>
                </div>
                <p className="text-xs font-light">
                  Buy {BULK_QUANTITY} bottles for only ₹{BULK_PRICE.toLocaleString()} 
                  <span className="ml-2 text-white/80">
                    (₹{(BULK_PRICE / BULK_QUANTITY).toFixed(0)} per bottle)
                  </span>
                </p>
              </div>
            )}

            {/* Price Section */}
            <div className="py-6 border-y border-gray-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && totalSaving > 0 && (
                  <>
                    <span className="line-through text-gray-400 font-light">
                      ₹{totalRegularPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                      Save ₹{totalSaving.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              
              {/* Per bottle price */}
              <div className="text-xs text-gray-500 font-light">
                ₹{perBottlePrice.toLocaleString()} per bottle
                {isBulkEligible && (
                  <span className="ml-2 text-green-600 font-medium">
                    • Bulk discount applied!
                  </span>
                )}
              </div>

              {/* Savings breakdown for bulk */}
              {isBulkEligible && (
                <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-sm">
                  <div className="flex items-center gap-2 text-green-800">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                      You are saving ₹{(totalRegularPrice - BULK_PRICE).toLocaleString()} with bulk pricing!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
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
                
                {/* Quick select for bulk offer */}
                {quantity < BULK_QUANTITY && (
                  <button
                    onClick={() => setQuantity(BULK_QUANTITY)}
                    className="text-xs px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors rounded-sm font-light tracking-wide"
                  >
                    Buy {BULK_QUANTITY} & Save
                  </button>
                )}
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
          {/* Bulk offer indicator for mobile */}
          {isBulkEligible && (
            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-sm">
              <div className="flex items-center justify-center gap-1 text-green-800">
                <Tag className="w-3 h-3" />
                <span className="text-xs font-medium">Bulk discount applied!</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-light">Total</div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-light text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
                {hasSale && totalSaving > 0 && (
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
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-light" 
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
