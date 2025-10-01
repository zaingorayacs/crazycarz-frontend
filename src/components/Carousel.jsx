import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Carousel = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  // Auto-advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle responsive height based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (carouselRef.current) {
        // Improved responsive sizing with better breakpoints
        const width = carouselRef.current.offsetWidth;
        let aspectRatio;
        
        if (window.innerWidth < 375) {
          aspectRatio = 0.5; // Very small mobile
        } else if (window.innerWidth < 480) {
          aspectRatio = 0.55; // Small mobile
        } else if (window.innerWidth < 640) {
          aspectRatio = 0.6; // Mobile
        } else if (window.innerWidth < 768) {
          aspectRatio = 0.55; // Large mobile
        } else if (window.innerWidth < 1024) {
          aspectRatio = 0.45; // Tablet
        } else {
          aspectRatio = 0.4; // Desktop
        }
        
        carouselRef.current.style.height = `${width * aspectRatio}px`;
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (slideIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Handle touch events for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      goToPrevious();
    }
  };



  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div 
      ref={carouselRef}
      className="relative w-full overflow-hidden rounded-lg shadow-lg dark:shadow-gray-800"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div 
        className="w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="min-w-full h-full flex-shrink-0 relative"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex flex-col items-center justify-center h-full text-white p-1 sm:p-2 md:p-4">
              <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2 text-center px-1 sm:px-2">{slide.title}</h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-center max-w-2xl px-1 sm:px-2">{slide.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-4 mt-1 sm:mt-2 md:mt-4">
                {slide.buttonText && (
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 sm:py-1 sm:px-3 md:py-2 md:px-6 rounded-md transition-colors text-xs sm:text-sm md:text-base">
                    {slide.buttonText}
                  </button>
                )}
              </div>
            </div>
            

          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on small screens */}
      <div className="absolute inset-0 hidden sm:flex items-center justify-between p-4">
        <button 
          onClick={goToPrevious}
          className="bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={16} className="sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={goToNext}
          className="bg-black/30 hover:bg-black/50 text-white p-1 sm:p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next slide"
        >
          <FaChevronRight size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;