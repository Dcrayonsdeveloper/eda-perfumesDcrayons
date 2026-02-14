'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Sparkles, ShoppingBag, Check, Gift, ArrowRight, ShoppingCart } from 'lucide-react';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

export default function BuyOneGetOneFreeClient() {
  const { addToCart, openDrawer } = useCart();
  const [selectedMain, setSelectedMain] = useState<ExtendedProduct | null>(null);
  const [selectedSecond, setSelectedSecond] = useState<ExtendedProduct | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCategory2, setSelectedCategory2] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const OFFER_PRICE = 799;

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['buy1get1-products'],
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

  // Filter main perfumes by selected category (Step 1)
  const filteredMainPerfumes = selectedCategory === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory));

  // Filter second perfumes by selected category (Step 2)
  const filteredSecondPerfumes = selectedCategory2 === 'All'
    ? mainPerfumes
    : mainPerfumes.filter(p => p.categories?.some(c => c.name === selectedCategory2));

  const handleMainSelect = (product: ExtendedProduct) => {
    setSelectedMain(product);
    setStep(2);
    setAddedToCart(false);
  };

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

  const handleSecondSelect = (product: ExtendedProduct) => {
    setSelectedSecond(product);
    setAddedToCart(false);
  };

  const handleAddToCart = () => {
    if (!selectedMain || !selectedSecond) return;

    const bundleProduct = {
      id: Date.now(),
      name: `Buy 1 Get 1: ${selectedMain.name.split(' ').slice(0, 3).join(' ')} + ${selectedSecond.name.split(' ').slice(0, 3).join(' ')}`,
      price: OFFER_PRICE.toString(),
      regular_price: (Number(selectedMain.price) + Number(selectedSecond.price)).toString(),
      images: selectedMain.images?.map(img => ({ src: img.src })) || [],
    };

    addToCart(bundleProduct);
    openDrawer();
    setAddedToCart(true);
  };

  const resetSelection = () => {
    setSelectedMain(null);
    setSelectedSecond(null);
    setStep(1);
    setAddedToCart(false);
  };

  const isComplete = selectedMain && selectedSecond;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 py-8 md:py-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-yellow-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Offer details */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                <span className="text-white font-bold text-sm md:text-base tracking-wider">LIMITED TIME OFFER</span>
              </div>

              <h1 className="text-white mb-2">
                <span className="block text-4xl md:text-6xl font-black tracking-tight">BUY 1</span>
                <span className="block text-3xl md:text-5xl font-black tracking-tight">GET 1 FREE</span>
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 my-4">
                <span className="text-white/80 text-xl md:text-2xl font-medium">@</span>
                <span className="text-5xl md:text-7xl font-black text-yellow-300 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>₹799</span>
              </div>

              <p className="text-white/90 text-lg md:text-xl font-medium mb-4">
                Pick Any 2 × 100ml Perfumes
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Gift className="w-5 h-5 text-teal-600" />
                  <span className="text-teal-700 font-bold text-sm">2 × 100ml</span>
                </div>
                <div className="bg-yellow-400 rounded-full px-4 py-2 shadow-lg">
                  <span className="text-yellow-900 font-bold text-sm">SAVE ₹500+</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <div className="text-center">
                  <div className="text-6xl md:text-8xl">🎁</div>
                  <p className="text-white font-bold text-sm md:text-base mt-2">2 × 100ml</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-black text-xs md:text-sm shadow-lg animate-pulse">
                HOT<br/>DEAL
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                selectedMain ? 'bg-teal-500 text-white' : step === 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedMain ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">First Perfume</p>
                <p className="text-xs text-gray-500">100ml Signature</p>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-300" />

            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                selectedSecond ? 'bg-teal-500 text-white' : step === 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {selectedSecond ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-gray-800">Second Perfume</p>
                <p className="text-xs text-gray-500">100ml Signature</p>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className={selectedMain ? 'text-teal-600 font-medium' : 'text-gray-400'}>
              {selectedMain ? `✓ ${selectedMain.name.split(' ').slice(0, 3).join(' ')}` : '○ Select first perfume'}
            </span>
            <span className="text-gray-300">+</span>
            <span className={selectedSecond ? 'text-teal-600 font-medium' : 'text-gray-400'}>
              {selectedSecond ? `✓ ${selectedSecond.name.split(' ').slice(0, 3).join(' ')}` : '○ Select second perfume'}
            </span>
          </div>
        </div>

        {/* Step 1: First Perfume Selection */}
        {step === 1 && !selectedMain && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-teal-500" />
              Step 1: Choose Your First Perfume (100ml)
            </h2>

            {/* Category Filter Tabs */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredMainPerfumes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleMainSelect(product)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-teal-400"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      100ml
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-600 font-bold">₹{Number(product.price).toLocaleString()}</p>
                      <button
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          addedProducts.has(product.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-teal-500 text-white hover:bg-teal-600'
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
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Second Perfume Selection */}
        {step === 2 && selectedMain && !isComplete && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Gift className="w-6 h-6 text-teal-500" />
                Step 2: Choose Your Second Perfume (100ml)
              </h2>
              <button
                onClick={() => { setStep(1); setSelectedMain(null); }}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                ← Change First Perfume
              </button>
            </div>

            {/* Selected Main */}
            <div className="bg-teal-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                {selectedMain.images && selectedMain.images[0] && (
                  <img
                    src={selectedMain.images[0].src}
                    alt={selectedMain.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-xs text-teal-600 font-semibold">FIRST PERFUME</p>
                <p className="font-semibold text-gray-800">{selectedMain.name}</p>
                <p className="text-sm text-gray-500">100ml</p>
              </div>
              <Check className="w-6 h-6 text-teal-500 ml-auto" />
            </div>

            {/* Category Filter Tabs for Step 2 */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory2(category)}
                    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap ${
                      selectedCategory2 === category
                        ? 'bg-teal-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredSecondPerfumes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSecondSelect(product)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-teal-400"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      100ml
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-600 font-bold">₹{Number(product.price).toLocaleString()}</p>
                      <button
                        onClick={(e) => handleQuickAddToCart(e, product)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          addedProducts.has(product.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-teal-500 text-white hover:bg-teal-600'
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
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        {isComplete && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Your Bundle
                </h2>
              </div>

              <div className="p-6">
                {/* First Perfume */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {selectedMain.images && selectedMain.images[0] && (
                      <img
                        src={selectedMain.images[0].src}
                        alt={selectedMain.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-teal-600 font-semibold mb-1">FIRST PERFUME</p>
                    <h3 className="font-semibold text-gray-800">{selectedMain.name}</h3>
                    <p className="text-sm text-gray-500">100ml Eau de Parfum</p>
                  </div>
                  <Check className="w-6 h-6 text-teal-500" />
                </div>

                {/* Second Perfume */}
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl mb-6">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {selectedSecond.images && selectedSecond.images[0] && (
                      <img
                        src={selectedSecond.images[0].src}
                        alt={selectedSecond.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-teal-600 font-semibold mb-1">SECOND PERFUME</p>
                    <h3 className="font-semibold text-gray-800">{selectedSecond.name}</h3>
                    <p className="text-sm text-gray-500">100ml Eau de Parfum</p>
                  </div>
                  <Check className="w-6 h-6 text-teal-500" />
                </div>

                {/* Price Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">First Perfume (100ml)</span>
                    <span className="text-gray-400 line-through">₹{selectedMain.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Second Perfume (100ml)</span>
                    <span className="text-gray-400 line-through">₹{selectedSecond.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                    <span className="text-gray-800">Bundle Price</span>
                    <span className="text-teal-600">₹{OFFER_PRICE}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transform hover:scale-[1.02]'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="w-6 h-6" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-6 h-6" />
                        Add to Cart - ₹{OFFER_PRICE}
                      </>
                    )}
                  </button>

                  {addedToCart && (
                    <div className="flex gap-4">
                      <button
                        onClick={resetSelection}
                        className="flex-1 py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
                      >
                        Add Another
                      </button>
                      <Link
                        href="/cart"
                        className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors text-center"
                      >
                        View Cart
                      </Link>
                    </div>
                  )}

                  {!addedToCart && (
                    <button
                      onClick={resetSelection}
                      className="w-full py-3 text-teal-600 font-medium hover:bg-teal-50 rounded-xl transition-colors"
                    >
                      Start Over
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '💎', title: 'Premium Quality', desc: 'Long-lasting fragrance' },
            { icon: '🎁', title: '2 × 100ml', desc: 'Two full-size perfumes' },
            { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹499' },
            { icon: '✨', title: 'Best Deal', desc: 'Unbeatable value' },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-4 text-center shadow-md">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
