'use client';

/////
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../../../lib/woocommerceApi';
import { useCart } from '../../../lib/cart';
import Link from 'next/link';
import { Tag, Gift, Zap, Check, ShoppingBag, Star, Package, ShoppingCart } from 'lucide-react';

interface ExtendedProduct extends Product {
  slug?: string;
  regular_price?: string;
  categories?: { id: number; name: string; slug?: string }[];
}

export default function Buy2GetFreeClient() {
  const { addToCart, openDrawer } = useCart();
  const [selectedMain, setSelectedMain] = useState<ExtendedProduct[]>([]);
  const [selectedFree, setSelectedFree] = useState<ExtendedProduct[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const { data, isLoading } = useQuery<ExtendedProduct[]>({
    queryKey: ['buy2-products'],
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
    if (selectedMain.find((p) => p.id === product.id)) {
      setSelectedMain(selectedMain.filter((p) => p.id !== product.id));
    } else if (selectedMain.length < 2) {
      setSelectedMain([...selectedMain, product]);
    }
    setAddedToCart(false);
  };

  const handleSelectFree = (product: ExtendedProduct) => {
    if (selectedFree.find((p) => p.id === product.id)) {
      setSelectedFree(selectedFree.filter((p) => p.id !== product.id));
    } else if (selectedFree.length < 2) {
      setSelectedFree([...selectedFree, product]);
    }
    setAddedToCart(false);
  };

  const isComplete = selectedMain.length === 2 && selectedFree.length === 2;

  const handleAddToCart = () => {
    if (!isComplete) return;

    // Create a special bundle product
    const bundleProduct = {
      id: Date.now(),
      name: `Buy 2 @ ₹999 Bundle: ${selectedMain.map(p => p.name.split(' ')[0]).join(' + ')} + 2 FREE 10ml`,
      price: '999',
      regular_price: '2999',
      images: selectedMain[0]?.images?.map(img => ({ src: img.src })) || [],
    };

    addToCart(bundleProduct);
    openDrawer();
    setAddedToCart(true);
  };

  const totalOriginalPrice = () => {
    let total = 0;
    selectedMain.forEach((p) => (total += Number(p.price) || 0));
    selectedFree.forEach((p) => (total += Number(p.price) || 0));
    return total;
  };

  const savings = totalOriginalPrice() - 999;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 py-8 md:py-12">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-red-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side - Offer details */}
            <div className="text-center md:text-left">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 mb-4">
                <span className="text-white font-bold text-sm md:text-base tracking-wider">MEGA COMBO DEAL</span>
              </div>

              <h1 className="text-white mb-2">
                <span className="block text-4xl md:text-6xl font-black tracking-tight">BUY 2</span>
                <span className="block text-2xl md:text-4xl font-bold tracking-tight">+ GET 2 FREE</span>
              </h1>

              <div className="flex items-center justify-center md:justify-start gap-2 my-4">
                <span className="text-white/80 text-xl md:text-2xl font-medium">@</span>
                <span className="text-5xl md:text-7xl font-black text-white drop-shadow-lg" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.3)'}}>₹999</span>
              </div>

              <p className="text-white/90 text-lg md:text-xl font-medium mb-4">
                2×100ml Perfumes + 2×10ml Travel Sizes FREE
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                  <Gift className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-700 font-bold text-sm">2 FREE GIFTS</span>
                </div>
                <div className="bg-red-500 rounded-full px-4 py-2 shadow-lg">
                  <span className="text-white font-bold text-sm">SAVE ₹2000+</span>
                </div>
              </div>
            </div>

            {/* Right side - Visual element */}
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <div className="text-center">
                  <div className="text-5xl md:text-7xl font-black text-white">2+2</div>
                  <p className="text-white font-bold text-sm md:text-base mt-2">PERFUMES</p>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center font-black text-xs md:text-sm shadow-lg animate-pulse">
                67%<br/>OFF
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-8 px-4 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">2× 100ml</p>
              <p className="text-xs text-gray-500">Signature Perfumes</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">2× 10ml FREE</p>
              <p className="text-xs text-gray-500">Travel Sizes</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Premium Quality</p>
              <p className="text-xs text-gray-500">Long Lasting</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">67% OFF</p>
              <p className="text-xs text-gray-500">Limited Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Step 1: Select 2 Main Perfumes */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedMain.length === 2 ? 'bg-green-500' : 'bg-amber-500'}`}>
                {selectedMain.length === 2 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 2 Signature Perfumes (100ml)
                <span className="text-amber-600 ml-2">({selectedMain.length}/2 selected)</span>
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
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600 border border-gray-200'
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
                  const isDisabled = selectedMain.length >= 2 && !isSelected;

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isDisabled && handleSelectMain(product)}
                      className={`cursor-pointer bg-white rounded-xl overflow-hidden transition-all duration-300 ${
                        isSelected
                          ? 'ring-2 ring-amber-500 shadow-lg scale-[1.02]'
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
                          <div className="absolute top-3 right-3 bg-amber-500 text-white p-1.5 rounded-full">
                            <Check className="w-4 h-4" />
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
                          <p className="text-amber-600 font-semibold text-sm">
                            ₹{Number(product.price).toLocaleString()}
                          </p>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, product)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                              addedProducts.has(product.id)
                                ? 'bg-green-500 text-white'
                                : 'bg-amber-500 text-white hover:bg-amber-600'
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

          {/* Step 2: Select 2 FREE 10ml */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${selectedFree.length === 2 ? 'bg-green-500' : 'bg-amber-500'}`}>
                {selectedFree.length === 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">
                Choose 2 FREE Travel Sizes (10ml)
                <span className="text-green-600 ml-2">({selectedFree.length}/2 selected)</span>
              </h2>
              <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                FREE
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
                {miniPerfumes.map((product) => {
                  const isSelected = selectedFree.find((p) => p.id === product.id);
                  const isDisabled = selectedFree.length >= 2 && !isSelected;

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isDisabled && handleSelectFree(product)}
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
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                          FREE
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
                                : 'bg-amber-500 text-white hover:bg-amber-600'
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
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-amber-100 max-w-2xl mx-auto">
            <h3 className="text-xl font-light text-gray-900 mb-6 text-center">
              Your Bundle Summary
            </h3>

            <div className="space-y-4 mb-6">
              {/* Selected Main Perfumes */}
              <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                <div className="w-16 h-16 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-2 gap-0.5 p-1">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-amber-200 rounded overflow-hidden">
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
                      : 'Select 2 signature perfumes'}
                  </p>
                  <p className="text-xs text-gray-500">2 × 100ml Bottles @ ₹999</p>
                </div>
                {selectedMain.length === 2 && <Check className="w-5 h-5 text-green-500" />}
              </div>

              {/* Selected Free Perfumes */}
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-lg overflow-hidden flex-shrink-0 grid grid-cols-2 gap-0.5 p-1">
                  {[0, 1].map((i) => (
                    <div key={i} className="bg-green-200 rounded overflow-hidden">
                      {selectedFree[i] && (
                        <img
                          src={selectedFree[i].images?.[0]?.src || '/placeholder.png'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFree.length > 0
                      ? `${selectedFree.length} Travel Sizes`
                      : 'Select 2 travel sizes'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">2 × 10ml Bottles - FREE!</p>
                </div>
                {selectedFree.length === 2 && <Check className="w-5 h-5 text-green-500" />}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Original Price:</span>
                <span className="line-through">₹{totalOriginalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 mb-2">
                <span>You Save:</span>
                <span>₹{savings > 0 ? savings.toLocaleString() : '2,000'}</span>
              </div>
              <div className="flex justify-between text-xl font-medium text-gray-900">
                <span>Bundle Price:</span>
                <span className="text-amber-600">₹999</span>
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
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isComplete ? 'Add Bundle to Cart - ₹999' : 'Complete Your Selection'}
              </button>
            )}

            {!isComplete && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {selectedMain.length < 2 && selectedFree.length < 2
                  ? 'Select 2 signature perfumes and 2 free travel sizes'
                  : selectedMain.length < 2
                  ? `Select ${2 - selectedMain.length} more signature perfume${2 - selectedMain.length > 1 ? 's' : ''}`
                  : `Select ${2 - selectedFree.length} more free travel size${2 - selectedFree.length > 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Why This Deal Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-light text-center text-gray-900 mb-12">
            Why This Deal is Unbeatable
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">67% Savings</h3>
              <p className="text-gray-600 text-sm">
                Get 4 perfumes at the price of less than 1
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Free Gifts</h3>
              <p className="text-gray-600 text-sm">
                2 travel sizes worth ₹600 absolutely free
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Limited Stock</h3>
              <p className="text-gray-600 text-sm">
                Grab this deal before it's gone
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
