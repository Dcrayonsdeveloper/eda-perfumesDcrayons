'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Heart, Gift, Sparkles, Check, ShoppingBag, ShoppingCart } from 'lucide-react';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

///

export default function ValentineGiftPackClient() {
  const { addToCart, openDrawer } = useCart();
  const [selectedMains, setSelectedMains] = useState<ExtendedProduct[]>([]);
  const [selectedMinis, setSelectedMinis] = useState<ExtendedProduct[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['valentine-products'],
    queryFn: async () => {
      const result = await fetchProducts(1, 100);
      return (result || []) as ExtendedProduct[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const allProducts = Array.isArray(data) ? data : [];

  // Filter 100ml products (main perfumes) - exclude combos, packs, and 200ml
  const mainPerfumes = allProducts.filter((p) =>
    /100\s*ml/i.test(p.name) && !/200\s*ml/i.test(p.name) && !/combo|duo|set|bundle|pack|\+|2\s*x/i.test(p.name)
  );

  // Get unique categories from main perfumes
  const categories = ['All', ...Array.from(new Set(
    mainPerfumes.flatMap(p => p.categories?.map(c => c.name) || [])
  )).filter(Boolean)];

  // Filter main perfumes by selected category
  const filteredMainPerfumes = selectedCategory === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory));

  // Filter 10ml products
  const miniPerfumes = allProducts.filter((p) => /10\s*ml/i.test(p.name));

  const handleQuickAddToCart = (e: React.MouseEvent, product: ExtendedProduct) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      regular_price: product.regular_price || product.price,
      images: product.images?.map(img => ({ src: img.src })) || [],
    });
    openDrawer();
    setAddedProducts(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  const handleSelectMain = (product: ExtendedProduct) => {
    if (selectedMains.find((p) => p.id === product.id)) {
      setSelectedMains(selectedMains.filter((p) => p.id !== product.id));
    } else if (selectedMains.length < 2) {
      setSelectedMains([...selectedMains, product]);
    }
    setAddedToCart(false);
  };

  const handleSelectMini = (product: ExtendedProduct) => {
    if (selectedMinis.find((p) => p.id === product.id)) {
      setSelectedMinis(selectedMinis.filter((p) => p.id !== product.id));
    } else if (selectedMinis.length < 4) {
      setSelectedMinis([...selectedMinis, product]);
    }
    setAddedToCart(false);
  };

  const isComplete = selectedMains.length === 2 && selectedMinis.length === 4;

  const handleAddToCart = () => {
    if (!isComplete) return;

    // Create a special gift pack product
    const mainNames = selectedMains.map(p => p.name).join(' + ');
    const giftPackProduct = {
      id: Date.now(), // Unique ID for the gift pack
      name: `Valentine's Gift Pack: ${mainNames} + 4 Travel Sizes`,
      price: '1099',
      regular_price: '2499',
      images: selectedMains[0]?.images?.map(img => ({ src: img.src })) || [],
    };

    addToCart(giftPackProduct);
    openDrawer();
    setAddedToCart(true);
  };

  const totalOriginalPrice = () => {
    let total = 0;
    selectedMains.forEach((p) => (total += Number(p.price) || 0));
    selectedMinis.forEach((p) => (total += Number(p.price) || 0));
    return total;
  };

  const savings = totalOriginalPrice() - 1099;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-400 via-pink-500 to-red-400 py-8 md:py-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-red-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          {/* Floating hearts */}
          <div className="absolute top-10 left-10 text-white/20 animate-pulse">
            <Heart className="w-16 h-16 fill-current" />
          </div>
          <div className="absolute bottom-10 right-20 text-white/20 animate-pulse delay-300">
            <Heart className="w-12 h-12 fill-current" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Offer details */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                <span className="text-white font-bold text-sm md:text-base tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-current" /> VALENTINE SPECIAL
                </span>
              </div>

              <h1 className="text-white mb-2">
                <span className="block text-3xl md:text-5xl font-black tracking-tight">VALENTINE'S</span>
                <span className="block text-4xl md:text-6xl font-black tracking-tight">GIFT PACK</span>
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 my-4">
                <span className="text-white/80 text-xl md:text-2xl font-medium">@</span>
                <span className="text-5xl md:text-7xl font-black text-yellow-300 drop-shadow-lg" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.3)'}}>₹1099</span>
              </div>

              <p className="text-white/90 text-lg md:text-xl font-medium mb-4">
                2 × 100ml Perfumes + 4 × 10ml Travel Sizes FREE
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Gift className="w-5 h-5 text-rose-600" />
                  <span className="text-rose-700 font-bold text-sm">4 FREE GIFTS</span>
                </div>
                <div className="bg-red-600 rounded-full px-4 py-2 shadow-lg flex items-center gap-1">
                  <Heart className="w-4 h-4 text-white fill-current" />
                  <span className="text-white font-bold text-sm">PERFECT GIFT</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl">💝</div>
                  <p className="text-white font-bold text-sm md:text-base mt-2">GIFT OF LOVE</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-black text-xs md:text-sm shadow-lg animate-pulse">
                56%<br/>OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Step 1: Select Main Perfume */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedMains.length === 2 ? 'bg-green-500' : 'bg-rose-500'}`}>
                {selectedMains.length === 2 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 2 Signature Perfumes (100ml each)
                <span className="text-rose-500 ml-2">({selectedMains.length}/2 selected)</span>
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMainPerfumes.map((product) => {
                  const isSelected = selectedMains.find((p) => p.id === product.id);
                  const isDisabled = selectedMains.length >= 2 && !isSelected;

                  return (
                  <div
                    key={product.id}
                    onClick={() => !isDisabled && handleSelectMain(product)}
                    className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-rose-500 shadow-lg scale-[1.02]'
                        : isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-md border border-gray-100'
                    }`}
                  >
                    <div className="relative aspect-square bg-gray-50">
                      <img
                        src={product.images?.[0]?.src || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-rose-500 text-white p-1.5 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-light text-gray-900 line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-rose-600 font-semibold text-sm">
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                        <button
                          onClick={(e) => handleQuickAddToCart(e, product)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            addedProducts.has(product.id)
                              ? 'bg-green-500 text-white'
                              : 'bg-rose-500 text-white hover:bg-rose-600'
                          }`}
                        >
                          {addedProducts.has(product.id) ? (
                            <>
                              <Check className="w-3 h-3" />
                              Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}

            {filteredMainPerfumes.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>No perfumes found in this category</p>
              </div>
            )}
          </div>

          {/* Step 2: Select 4 Travel Sizes */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedMinis.length === 4 ? 'bg-green-500' : 'bg-rose-500'}`}>
                {selectedMinis.length === 4 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 4 Travel Sizes (10ml each)
                <span className="text-rose-500 ml-2">({selectedMinis.length}/4 selected)</span>
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                    <div className="h-3 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {miniPerfumes.map((product) => {
                  const isSelected = selectedMinis.find((p) => p.id === product.id);
                  const isDisabled = selectedMinis.length >= 4 && !isSelected;

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isDisabled && handleSelectMini(product)}
                      className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-rose-500 shadow-lg'
                          : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-md border border-gray-100'
                      }`}
                    >
                      <div className="relative aspect-square bg-gray-50">
                        <img
                          src={product.images?.[0]?.src || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-light text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-rose-600 font-semibold text-xs">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                              addedProducts.has(product.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-rose-500 text-white hover:bg-rose-600'
                            }`}
                          >
                            {addedProducts.has(product.id) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <ShoppingCart className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {miniPerfumes.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>Travel size perfumes loading...</p>
              </div>
            )}
          </div>

          {/* Summary & Add to Cart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-rose-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-light text-gray-900 mb-6 text-center">
              Your Gift Pack Summary
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-2 gap-0.5 p-1">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-gray-300 rounded overflow-hidden">
                      {selectedMains[i] && (
                        <img
                          src={selectedMains[i].images?.[0]?.src || '/placeholder.png'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMains.length > 0
                      ? `${selectedMains.length} Signature Perfume${selectedMains.length > 1 ? 's' : ''} Selected`
                      : 'Select 2 signature perfumes'}
                  </p>
                  <p className="text-xs text-gray-500">2 × 100ml Bottles</p>
                </div>
                {selectedMains.length === 2 && <Check className="w-5 h-5 text-green-500" />}
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-2 gap-0.5 p-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-300 rounded overflow-hidden">
                      {selectedMinis[i] && (
                        <img
                          src={selectedMinis[i].images?.[0]?.src || '/placeholder.png'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMinis.length > 0
                      ? `${selectedMinis.length} Travel Sizes Selected`
                      : 'Select 4 travel size perfumes'}
                  </p>
                  <p className="text-xs text-gray-500">4 × 10ml Bottles</p>
                </div>
                {selectedMinis.length === 4 && <Check className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Original Price:</span>
                <span className="line-through">₹{totalOriginalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>You Save:</span>
                <span>₹{savings > 0 ? savings.toLocaleString() : '1,400'}</span>
              </div>
              <div className="flex justify-between text-xl font-medium text-gray-900">
                <span>Gift Pack Price:</span>
                <span className="text-rose-500">₹1,099</span>
              </div>
            </div>

            {addedToCart ? (
              <div className="space-y-3">
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
                  <Check className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-medium">Added to Cart!</p>
                </div>
                <Link
                  href="/cart"
                  className="block w-full py-4 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 inline mr-2" />
                  View Cart & Checkout
                </Link>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className={`w-full py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  isComplete
                    ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Heart className={`w-5 h-5 ${isComplete ? 'fill-current' : ''}`} />
                {isComplete ? 'Add Gift Pack to Cart' : 'Complete Your Selection'}
              </button>
            )}

            {!isComplete && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {selectedMains.length === 0 && selectedMinis.length === 0
                  ? 'Select 2 signature perfumes and 4 travel sizes to continue'
                  : selectedMains.length < 2 && selectedMinis.length < 4
                  ? `Select ${2 - selectedMains.length} more perfume${2 - selectedMains.length > 1 ? 's' : ''} and ${4 - selectedMinis.length} more travel size${4 - selectedMinis.length > 1 ? 's' : ''}`
                  : selectedMains.length < 2
                  ? `Select ${2 - selectedMains.length} more signature perfume${2 - selectedMains.length > 1 ? 's' : ''}`
                  : `Select ${4 - selectedMinis.length} more travel size${4 - selectedMinis.length > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center text-gray-900 mb-12">
            Why Choose Our Valentine's Gift Pack?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Perfect for Couples</h3>
              <p className="text-gray-600 text-sm">
                A romantic gift that shows you care about every detail
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Premium Packaging</h3>
              <p className="text-gray-600 text-sm">
                Beautifully wrapped and ready to gift
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Variety of Scents</h3>
              <p className="text-gray-600 text-sm">
                Explore different fragrances with travel sizes
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
