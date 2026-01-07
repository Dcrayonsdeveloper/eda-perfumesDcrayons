'use client';

import { useState, useMemo } from 'react';
import ProductCard from "../../../components/ProductCard";
import { Product } from "./page";
import { SlidersHorizontal, X, Search, Package } from 'lucide-react';

interface CombosPageClientProps {
  products: Product[];
}

type ProductWithSlug = Product & {
  slug: string;
  regular_price: string;
};

export default function CombosPageClient({ products }: CombosPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [itemCount, setItemCount] = useState('');

  // Filter only combo products
  const comboProducts = useMemo(() => {
    return products.filter(product => 
      product.categories?.some(cat => 
        cat.name.toLowerCase().includes('combo') || 
        cat.name.toLowerCase().includes('bundle') ||
        cat.slug.toLowerCase().includes('combo') ||
        cat.slug.toLowerCase().includes('bundle')
      )
    );
  }, [products]);

  // Extract unique item counts from combos
  const itemCounts = useMemo(() => {
    const counts = new Set<string>();
    comboProducts.forEach(product => {
      const match = product.name.match(/(\d+)[\s-]*(piece|pc|item|pack)/i);
      if (match) counts.add(match[1]);
    });
    return Array.from(counts).sort((a, b) => parseInt(a) - parseInt(b));
  }, [comboProducts]);

  // Filter and sort combo products
  const filteredProducts = useMemo(() => {
    const filtered = comboProducts.filter(product => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      if (itemCount) {
        const match = product.name.match(/(\d+)[\s-]*(piece|pc|item|pack)/i);
        if (!match || match[1] !== itemCount) return false;
      }

      if (priceRange.min || priceRange.max) {
        const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
        if (priceRange.min && price < parseFloat(priceRange.min)) return false;
        if (priceRange.max && price > parseFloat(priceRange.max)) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.price.replace(/[^\d.]/g, '')) - parseFloat(b.price.replace(/[^\d.]/g, ''));
        case 'price-high':
          return parseFloat(b.price.replace(/[^\d.]/g, '')) - parseFloat(a.price.replace(/[^\d.]/g, ''));
        case 'discount':
          const discountA = a.regular_price ? 
            ((parseFloat(a.regular_price) - parseFloat(a.price.replace(/[^\d.]/g, ''))) / parseFloat(a.regular_price)) * 100 : 0;
          const discountB = b.regular_price ? 
            ((parseFloat(b.regular_price) - parseFloat(b.price.replace(/[^\d.]/g, ''))) / parseFloat(b.regular_price)) * 100 : 0;
          return discountB - discountA;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [comboProducts, searchTerm, itemCount, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setItemCount('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="h-8 w-8 text-gray-900" />
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-wide">
                Fragrance Combos
              </h1>
            </div>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto font-light">
              Curated perfume combinations at special bundle prices
            </p>
            {comboProducts.length > 0 && (
              <p className="text-sm text-gray-500 mt-3 font-light">
                Save up to 30% with our exclusive combo offers
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search combo packs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-b-2 border-gray-200 focus:border-black focus:outline-none transition-colors bg-white text-gray-900 placeholder:text-gray-400 font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle - Mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-black text-white py-3 px-6 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-50 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-base font-light text-gray-900 tracking-wide uppercase">
                  Refine Combos
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-600 hover:text-black font-light tracking-wide uppercase"
                >
                  Clear
                </button>
              </div>

              {/* Item Count Filter */}
              {itemCounts.length > 0 && (
                <div className="mb-8">
                  <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                    Items in Pack
                  </label>
                  <select
                    value={itemCount}
                    onChange={(e) => setItemCount(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 focus:border-black focus:outline-none text-gray-900 font-light text-sm bg-white"
                  >
                    <option value="">All Sizes</option>
                    {itemCounts.map(count => (
                      <option key={count} value={count}>
                        {count}-Piece Combo
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                  Price Range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-1/2 px-3 py-2.5 border border-gray-200 focus:border-black focus:outline-none text-gray-900 font-light text-sm bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-1/2 px-3 py-2.5 border border-gray-200 focus:border-black focus:outline-none text-gray-900 font-light text-sm bg-white"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-8">
                <label className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 focus:border-black focus:outline-none text-gray-900 font-light text-sm bg-white"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Best Savings</option>
                </select>
              </div>

              {/* Active Filters */}
              {(searchTerm || itemCount || priceRange.min || priceRange.max) && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xs font-light text-gray-600 mb-3 uppercase tracking-widest">
                    Active
                  </h3>
                  <div className="space-y-2">
                    {searchTerm && (
                      <div className="text-xs text-gray-600 font-light">
                        Search: {searchTerm}
                      </div>
                    )}
                    {itemCount && (
                      <div className="text-xs text-gray-600 font-light">
                        Pack Size: {itemCount} items
                      </div>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <div className="text-xs text-gray-600 font-light">
                        Price: ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combo Benefits */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xs font-light text-gray-600 mb-4 uppercase tracking-widest">
                  Combo Benefits
                </h3>
                <ul className="space-y-2 text-xs text-gray-600 font-light">
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">✓</span>
                    <span>Special bundle pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">✓</span>
                    <span>Curated fragrance pairs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black mt-0.5">✓</span>
                    <span>Perfect for gifting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-sm font-light text-gray-900 tracking-wide">
                {filteredProducts.length} {filteredProducts.length !== 1 ? 'Combos' : 'Combo'}
              </h2>
              <div className="hidden md:flex items-center text-xs text-gray-500 font-light">
                Showing {filteredProducts.length} of {comboProducts.length}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50">
                <div className="mb-6">
                  <div className="w-16 h-16 border border-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide">
                  {comboProducts.length === 0 ? 'No Combos Available' : 'No Results Found'}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto font-light text-sm">
                  {comboProducts.length === 0 
                    ? 'Check back soon for exclusive combo offers.'
                    : 'We could not find any combos matching your criteria.'}
                </p>
                {comboProducts.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-block px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id}
                    product={{
                      ...product,
                      slug: product.slug || `combo-${product.id}`
                    } as ProductWithSlug} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-20 border-t border-gray-200 bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
            Need Help Choosing?
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-sm text-gray-600 mb-8 font-light">
            Our experts can help you select the perfect combo for any occasion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:care@edaperfumes.com"
              className="inline-block px-8 py-3 text-xs text-black border border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors tracking-widest uppercase font-light"
            >
              Email Us
            </a>
            <a 
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
