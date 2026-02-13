'use client';

//
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Crown, Gift, Sparkles, Check, ShoppingBag, Star, Package, Award, ShoppingCart } from 'lucide-react';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

export default function BuyThreeGetGiftsClient() {
  const { addToCart, openDrawer } = useCart();
  const [selectedMain, setSelectedMain] = useState<ExtendedProduct[]>([]);
  const [selectedGifts, setSelectedGifts] = useState<ExtendedProduct[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['buy3-products'],
    queryFn: async () => {
      const result = await fetchProducts(1, 100);
      return (result || []) as ExtendedProduct[];
    },
    staleTime: 10 * 60 * 1000,
  });

  const allProducts = Array.isArray(data) ? data : [];

  // Filter main perfumes (100ml) - exclude combos and packs
  const mainPerfumes = allProducts.filter((p) =>
    /100\s*ml/i.test(p.name) && !/combo|duo|set|bundle|pack|\+|2\s*x/i.test(p.name)
  );

  // Get unique categories from main perfumes
  const categories = ['All', ...Array.from(new Set(
    mainPerfumes.flatMap(p => p.categories?.map(c => c.name) || [])
  )).filter(Boolean)];

  // Filter main perfumes by selected category
  const filteredMainPerfumes = selectedCategory === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory));

  // Filter 10ml products for gifts - exclude pocket combos
  const giftPerfumes = allProducts.filter((p) =>
    /10\s*ml/i.test(p.name) &&
    !/\+/.test(p.name) &&
    !/2\s*[x×]\s*10\s*ml/i.test(p.name) &&
    !/combo|pack|bundle|duo|set|pocket/i.test(p.name)
  );

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
    if (selectedMain.find((p) => p.id === product.id)) {
      setSelectedMain(selectedMain.filter((p) => p.id !== product.id));
    } else if (selectedMain.length < 3) {
      setSelectedMain([...selectedMain, product]);
    }
    setAddedToCart(false);
  };

  const handleSelectGift = (product: ExtendedProduct) => {
    if (selectedGifts.find((p) => p.id === product.id)) {
      setSelectedGifts(selectedGifts.filter((p) => p.id !== product.id));
    } else if (selectedGifts.length < 3) {
      setSelectedGifts([...selectedGifts, product]);
    }
    setAddedToCart(false);
  };

  const isComplete = selectedMain.length === 3 && selectedGifts.length === 3;

  const handleAddToCart = () => {
    if (!isComplete) return;

    // Create a special bundle product
    const bundleProduct = {
      id: Date.now(),
      name: `Buy 3 @ ₹1499 Bundle: ${selectedMain.map(p => p.name.split(' ')[0]).join(', ')} + 3 FREE Gifts`,
      price: '1499',
      regular_price: '4499',
      images: selectedMain[0]?.images?.map(img => ({ src: img.src })) || [],
    };

    addToCart(bundleProduct);
    openDrawer();
    setAddedToCart(true);
  };

  const totalOriginalPrice = () => {
    let total = 0;
    selectedMain.forEach((p) => (total += Number(p.price) || 0));
    selectedGifts.forEach((p) => (total += Number(p.price) || 0));
    return total;
  };

  const savings = totalOriginalPrice() - 1499;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 py-8 md:py-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Offer details */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                <span className="text-white font-bold text-sm md:text-base tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4" /> PREMIUM BUNDLE
                </span>
              </div>

              <h1 className="text-white mb-2">
                <span className="block text-4xl md:text-6xl font-black tracking-tight">BUY 3</span>
                <span className="block text-2xl md:text-4xl font-bold tracking-tight">+ GET 3 GIFTS</span>
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 my-4">
                <span className="text-white/80 text-xl md:text-2xl font-medium">@</span>
                <span className="text-5xl md:text-7xl font-black text-yellow-300 drop-shadow-lg" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.3)'}}>₹1499</span>
              </div>

              <p className="text-white/90 text-lg md:text-xl font-medium mb-4">
                3×100ml Perfumes + 3×10ml Travel Sizes FREE
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Gift className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-bold text-sm">3 FREE GIFTS</span>
                </div>
                <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
                  <span className="text-yellow-900 font-bold text-sm">SAVE ₹3000+</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-black text-white">3+3</div>
                  <p className="text-white font-bold text-sm md:text-base mt-2">PERFUMES</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-black text-xs md:text-sm shadow-lg animate-pulse">
                BEST<br/>VALUE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-8 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">3× 100ml</p>
              <p className="text-xs text-gray-500">Signature Perfumes</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">3× 10ml FREE</p>
              <p className="text-xs text-gray-500">Gift Perfumes</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">6 Perfumes</p>
              <p className="text-xs text-gray-500">Total Collection</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Premium Quality</p>
              <p className="text-xs text-gray-500">Long Lasting</p>
            </div>
            <div className="p-4 col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">67% OFF</p>
              <p className="text-xs text-gray-500">Maximum Savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Step 1: Select 3 Main Perfumes */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedMain.length === 3 ? 'bg-green-500' : 'bg-violet-500'}`}>
                {selectedMain.length === 3 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 3 Signature Perfumes (100ml)
                <span className="text-violet-600 ml-2">({selectedMain.length}/3 selected)</span>
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
                        ? 'bg-violet-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600 border border-gray-200'
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
                  const isSelected = selectedMain.find((p) => p.id === product.id);
                  const isDisabled = selectedMain.length >= 3 && !isSelected;
                  const selectionIndex = selectedMain.findIndex((p) => p.id === product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isDisabled && handleSelectMain(product)}
                      className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-violet-500 shadow-lg scale-[1.02]'
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
                          <div className="absolute top-3 right-3 bg-violet-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-medium text-sm">
                            {selectionIndex + 1}
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          100ml
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-light text-gray-900 line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-violet-600 font-semibold text-sm">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              addedProducts.has(product.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-violet-500 text-white hover:bg-violet-600'
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

            {mainPerfumes.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>Products loading...</p>
              </div>
            )}
          </div>

          {/* Step 2: Select 3 FREE Gifts */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedGifts.length === 3 ? 'bg-green-500' : 'bg-violet-500'}`}>
                {selectedGifts.length === 3 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 3 FREE Gifts (10ml each)
                <span className="text-green-600 ml-2">({selectedGifts.length}/3 selected)</span>
              </h2>
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <Gift className="w-3 h-3" />
                FREE GIFTS
              </span>
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
                {giftPerfumes.map((product) => {
                  const isSelected = selectedGifts.find((p) => p.id === product.id);
                  const isDisabled = selectedGifts.length >= 3 && !isSelected;
                  const selectionIndex = selectedGifts.findIndex((p) => p.id === product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isDisabled && handleSelectGift(product)}
                      className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-green-500 shadow-lg'
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
                          <div className="absolute top-2 right-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-medium text-xs">
                            {selectionIndex + 1}
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                          GIFT
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-light text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-green-600 font-semibold text-xs">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                              addedProducts.has(product.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-violet-500 text-white hover:bg-violet-600'
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

            {giftPerfumes.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p>Gift perfumes loading...</p>
              </div>
            )}
          </div>

          {/* Summary & Add to Cart */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-violet-100 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-violet-500" />
              <h3 className="text-xl font-light text-gray-900">
                Your Premium Bundle
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              {/* Selected Main Perfumes */}
              <div className="flex items-center gap-4 p-3 bg-violet-50 rounded-lg">
                <div className="w-20 h-16 bg-violet-100 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-3 gap-0.5 p-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-violet-200 rounded overflow-hidden">
                      {selectedMain[i] && (
                        <img
                          src={selectedMain[i].images?.[0]?.src || '/placeholder.png'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedMain.length > 0
                      ? `${selectedMain.length} Signature Perfumes`
                      : 'Select 3 signature perfumes'}
                  </p>
                  <p className="text-xs text-gray-500">3 × 100ml Bottles @ ₹1,499</p>
                </div>
                {selectedMain.length === 3 && <Check className="w-5 h-5 text-green-500" />}
              </div>

              {/* Selected Gift Perfumes */}
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-20 h-16 bg-green-100 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-3 gap-0.5 p-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="bg-green-200 rounded overflow-hidden">
                      {selectedGifts[i] && (
                        <img
                          src={selectedGifts[i].images?.[0]?.src || '/placeholder.png'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedGifts.length > 0
                      ? `${selectedGifts.length} Gift Perfumes`
                      : 'Select 3 gift perfumes'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">3 × 10ml Bottles - FREE GIFTS!</p>
                </div>
                {selectedGifts.length === 3 && <Check className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Original Price (6 perfumes):</span>
                <span className="line-through">₹{totalOriginalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>You Save:</span>
                <span className="font-medium">₹{savings > 0 ? savings.toLocaleString() : '3,000'}</span>
              </div>
              <div className="flex justify-between text-xl font-medium text-gray-900">
                <span>Bundle Price:</span>
                <span className="text-violet-600">₹1,499</span>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                That's just ₹250 per perfume!
              </p>
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
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Crown className="w-5 h-5" />
                {isComplete ? 'Add Premium Bundle - ₹1,499' : 'Complete Your Selection'}
              </button>
            )}

            {!isComplete && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {selectedMain.length < 3 && selectedGifts.length < 3
                  ? 'Select 3 signature perfumes and 3 free gifts'
                  : selectedMain.length < 3
                  ? `Select ${3 - selectedMain.length} more signature perfume${3 - selectedMain.length > 1 ? 's' : ''}`
                  : `Select ${3 - selectedGifts.length} more free gift${3 - selectedGifts.length > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why This Deal Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center text-gray-900 mb-12">
            Why This is Our Best Deal
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-7 h-7 text-violet-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Best Value</h3>
              <p className="text-gray-600 text-sm">
                6 perfumes for the price of 1
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">3 Free Gifts</h3>
              <p className="text-gray-600 text-sm">
                Travel sizes worth ₹900 free
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">₹250 Each</h3>
              <p className="text-gray-600 text-sm">
                Lowest price per perfume
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">
                Same quality, maximum savings
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
