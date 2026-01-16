'use client';

import { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Store in localStorage so it doesn't show again in this session
      localStorage.setItem('announcementBarClosed', 'true');
    }, 300);
  };

  useEffect(() => {
    // Check if user has already closed the bar
    const isClosed = localStorage.getItem('announcementBarClosed');
    if (isClosed) {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-black text-white py-2.5 px-4 relative transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-center justify-center flex-1 gap-2 text-center">
            <Tag className="w-3.5 h-3.5 text-gray-300 hidden sm:block" />
            <p className="text-xs sm:text-sm font-light tracking-wide">
              <span className="hidden sm:inline">Limited Time Offer: </span>
              <span className="font-semibold text-white px-2 py-0.5 bg-white/20 rounded">
                Buy 4 at ₹1000
              </span>
              {' '}
              <span className="hidden sm:inline">- Use code </span>
              <span className="font-semibold tracking-wider">BUY4NOW</span>
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-200 group"
            aria-label="Close announcement"
          >
            <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
