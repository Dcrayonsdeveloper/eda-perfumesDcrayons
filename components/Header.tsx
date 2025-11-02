'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import { useTypewriter } from 'react-simple-typewriter';

const navItems = [
  { name: "Home", to: "/" },
  { 
    name: "Unisex 100ml", 
    to: "/shop/unisex",
    submenu: [
      { name: "Bite Me", to: "https://www.edaperfumes.com/product/bite-me-seductive-floral-citrus-eau-de-parfum", price: "549" },
      { name: "Nude Poison", to: "https://www.edaperfumes.com/product/nude-poison-elegant-unisex-eau-de-parfum-100ml", price: "569" },
      { name: "Bad Habits", to: "https://www.edaperfumes.com/product/bad-habits-eau-de-parfum-100ml", price: "529" },
      { name: "Oudh Shukran", to: "https://www.edaperfumes.com/product/oudh-shukran-eau-de-parfum-100ml", price: "499" },
      { name: "Lusty Nights", to: "https://www.edaperfumes.com/product/lusty-nights-premium-unisex-eau-de-parfum-100ml", price: "569" },
      { name: "Guilty Midnight", to: "https://www.edaperfumes.com/product/guilty-premium-eau-de-parfum-100ml", price: "599" }
    ]
  },
  { 
    name: "Combos", to: "/combos"
  },
  { name: "Shop All", to: "/shop" },
  { name: "About", to: "/about" },
];

export default function Header() {
  const location = usePathname();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileActiveSubmenu, setMobileActiveSubmenu] = useState<string | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect for search placeholder
  const [text] = useTypewriter({
    words: ['Bite Me', 'Nude Poison', 'Lusty Nights', 'Guilty Midnight', 'Dark Knight', 'Oudh Shukran'],
    loop: 0,
    typeSpeed: 80,
    deleteSpeed: 60,
    delaySpeed: 2000,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setShowMobileSearch(false);
    }
  }

  const handleSubmenuMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveSubmenu(menuName);
  };

  const handleSubmenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveSubmenu(null);
    }, 200);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo + Brand - Now visible on mobile */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <img 
                  className="h-8 sm:h-9 md:h-11 transition-opacity duration-300 group-hover:opacity-80" 
                  src="/eda-perfumes-logo.jpeg" 
                  alt='ÉCLAT D&apos;AMOUR' 
                />
                <div className="border-l border-gray-300 pl-2 sm:pl-3 ml-1">
                  <span className="block text-black font-light text-xs sm:text-base md:text-lg lg:text-xl tracking-[0.1em] sm:tracking-[0.15em] leading-none">
                  EDA PERFUMES
                  </span>
                  <span className="block text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase mt-0.5">
                    Luxury
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1 justify-center" ref={menuRef}>
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.submenu ? (
                    <div
                      className="relative"
                      onMouseEnter={() => handleSubmenuMouseEnter(item.name)}
                      onMouseLeave={handleSubmenuMouseLeave}
                    >
                      <button
                        className={`text-sm tracking-wide font-light transition-all duration-200 py-2 flex items-center gap-1 ${
                          location.startsWith(item.to) 
                            ? "text-black" 
                            : "text-gray-600 hover:text-black"
                        }`}
                      >
                        {item.name}
                        <BiChevronDown className={`text-xs transition-transform duration-200 ${activeSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Minimal Dropdown */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white shadow-lg border border-gray-200 min-w-[280px] transition-all duration-200 ${
                        activeSubmenu === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}>
                        <div className="py-3">
                          {item.submenu.map((subItem, idx) => (
                            <Link
                              key={subItem.name}
                              href={subItem.to}
                              className={`block px-6 py-3 text-sm transition-colors duration-200 ${
                                location === subItem.to 
                                  ? 'text-black bg-gray-50' 
                                  : 'text-gray-600 hover:text-black hover:bg-gray-50'
                              } ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-light tracking-wide">{subItem.name}</span>
                                <span className="text-xs text-gray-500">₹{subItem.price}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 px-6 py-3">
                          <Link 
                            href={item.to}
                            className="text-xs text-gray-500 hover:text-black transition-colors tracking-wide"
                          >
                            View All →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.to}
                      className={`text-sm tracking-wide font-light transition-colors duration-200 py-2 ${
                        location === item.to 
                          ? "text-black" 
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 justify-end">
              {/* Desktop Search with Typewriter - Fixed overlap issue */}
              {!isMobile && (
                <form className="hidden lg:flex items-center group" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="w-48 xl:w-64 px-3 py-2 text-sm text-black bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors font-light placeholder:text-gray-500"
                    placeholder={`Search: ${text}`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="ml-3 text-gray-600 hover:text-black transition-colors p-1"
                  >
                    <FiSearch className="text-xl" />
                  </button>
                </form>
              )}

              {/* Mobile Search - Fixed for better visibility */}
              {isMobile && !showMobileSearch && (
                <button
                  className="text-gray-600 hover:text-black transition-colors p-1.5"
                  onClick={() => setShowMobileSearch(true)}
                >
                  <FiSearch className="text-xl" />
                </button>
              )}

              {isMobile && showMobileSearch && (
                <form className="flex items-center" onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="w-32 sm:w-40 px-2 py-1.5 text-sm text-black bg-transparent border-b-2 border-gray-300 focus:border-black focus:outline-none placeholder:text-gray-500 font-light"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="ml-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <FiSearch className="text-lg" />
                  </button>
                </form>
              )}

              {/* Cart */}
              <div className="flex items-center">
                <CartIcon />
              </div>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-600 hover:text-black transition-colors p-1.5"
              >
                {mobileMenuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenuAlt3 className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transition-transform duration-300 lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <img className="h-9 sm:h-10" src="/eda-perfumes-logo.jpeg" alt='ÉCLAT D&apos;AMOUR' />
            <div>
              <span className="block text-black font-light text-sm sm:text-base tracking-[0.12em]">
                EDA PERFUMES
              </span>
              <span className="block text-gray-500 text-[8px] sm:text-[9px] tracking-[0.2em] uppercase">
                Luxury
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-600 hover:text-black p-1"
          >
            <HiOutlineX className="text-2xl" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col p-4 sm:p-6 space-y-1 h-full overflow-y-auto pb-20">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    className={`w-full text-left px-3 sm:px-4 py-3 text-sm tracking-wide font-light transition-colors flex items-center justify-between ${
                      location.startsWith(item.to) 
                        ? "text-black" 
                        : "text-gray-600 hover:text-black"
                    }`}
                    onClick={() => setMobileActiveSubmenu(mobileActiveSubmenu === item.name ? null : item.name)}
                  >
                    {item.name}
                    <BiChevronDown className={`text-sm transition-transform duration-200 ${mobileActiveSubmenu === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`ml-3 sm:ml-4 transition-all duration-300 overflow-hidden ${
                    mobileActiveSubmenu === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.to}
                        className={`block px-3 sm:px-4 py-2.5 text-sm transition-colors border-l border-gray-200 ${
                          location === subItem.to 
                            ? 'text-black' 
                            : 'text-gray-500 hover:text-black'
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileActiveSubmenu(null);
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-light tracking-wide">{subItem.name}</span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">₹{subItem.price}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.to}
                  className={`block px-3 sm:px-4 py-3 text-sm tracking-wide font-light transition-colors ${
                    location === item.to 
                      ? "text-black" 
                      : "text-gray-600 hover:text-black"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}
