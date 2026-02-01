import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const IMAGES = [
  {
    src: '/edaperfumes-banner.jpg',
    alt: 'Healthy skin with bottle',
  },
  {
    src: 'https://cms.edaperfumes.com/wp-content/uploads/2025/10/eda-banner2-scaled.jpg',
    alt: 'Model smiling with serum',
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);


  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % IMAGES.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="w-full relative bg-gray-50 rounded-lg overflow-hidden shadow-lg">
      {/* Main carousel container - Using banner-like aspect ratio */}
      <div className="w-full relative overflow-hidden" style={{ aspectRatio: '16/6' }}>
        
        {/* Images container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {IMAGES.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              { (
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-contain bg-gray-50 transition-transform duration-300 hover:scale-105"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              
              )}
              
              {/* Subtle overlay for better contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 
            bg-white/90 hover:bg-white border border-gray-200 text-gray-700 
            w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
            flex items-center justify-center shadow-lg hover:shadow-xl"
          aria-label="Previous image"
        >
          <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 
            bg-white/90 hover:bg-white border border-gray-200 text-gray-700 
            w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 hover:scale-110
            flex items-center justify-center shadow-lg hover:shadow-xl"
          aria-label="Next image"
        >
          <ChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>

        {/* Slide indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 
          flex gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              className={`rounded-full cursor-pointer transition-all duration-300 
                hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500/50 
                ${index === current
                  ? 'bg-red-500 w-6 sm:w-8 h-2 sm:h-2.5' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2 sm:w-2.5 h-2 sm:h-2.5'
                }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>


      {/* Image info for debugging */}
      <div className="hidden">
        <p className="text-xs text-gray-400 mt-2">
          Current slide: {current + 1} of {IMAGES.length}
        </p>
      </div>
    </div>
  );
}