import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Heart, Mail, Phone, MapPin, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-100 via-white to-gray-50 text-gray-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200">
                <img className="h-20" src="/eda-perfumes-logo.jpeg" alt="EDA Perfumes logo" />
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="font-bold text-gray-800 text-lg">EDA PERFUMES</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-4">
                Dare to indulge in the forbidden. EDA Perfumes crafts intoxicating fragrances for the bold, the daring, and those who are not afraid to make a statement.
              </p>
              <div className="inline-flex items-center gap-2 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span className="text-rose-600 text-xs font-medium">For those who play after dark</span>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <Link 
                href="https://www.facebook.com/edaperfumes" 
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 group"
              >
                <FaFacebookF className="text-gray-600 group-hover:text-rose-500 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 group"
              >
                <FaTwitter className="text-gray-600 group-hover:text-rose-500 transition-colors" />
              </Link>
              <Link 
                href="https://www.instagram.com/edaperfumes" 
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 group"
              >
                <FaInstagram className="text-gray-600 group-hover:text-rose-500 transition-colors" />
              </Link>
              <Link 
                href="#" 
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 group"
              >
                <FaLinkedinIn className="text-gray-600 group-hover:text-rose-500 transition-colors" />
              </Link>
              <Link 
                href="https://www.youtube.com/@edaperfumes" 
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:bg-rose-50 hover:border-rose-200 transition-all duration-300 group"
              >
                <FaYoutube className="text-gray-600 group-hover:text-rose-500 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy-policy" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/returns-and-refunds-policy" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-600 hover:text-rose-500 transition-colors duration-200 text-sm font-medium flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 mt-0.5">
                  <Mail className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-medium">care@edaperfumes.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 mt-0.5">
                  <Phone className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-medium">+91 87997 95681</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 mt-0.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <span className="text-gray-600 text-sm font-medium leading-relaxed">
                WZ-11B Ground Floor, Sahib Pura, Tilak Nagar, New Delhi - 110018
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 mt-12 p-6 text-gray-600 text-center text-sm gap-4 sm:gap-0">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>
            © {new Date().getFullYear()} EDA Perfumes. All rights reserved. Developed with passion by{" "}
            <span className="text-rose-600 font-semibold">
              <Link href="https://www.proshala.com" className="hover:text-rose-700 transition-colors">
                Proshala Tech
              </Link>
            </span>
          </span>
        </div>
        <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200">
          <img className="h-8" src="/badges.png" alt="trust badges" />
        </div>
      </div>
    </footer>
  );
}
