import React, { useState, useEffect, useRef } from 'react';

const ClientSlider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const sliderRef = useRef(null);
  const childrenArray = React.Children.toArray(children);
  const totalSlides = childrenArray.length;

  useEffect(() => {
    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 100) {
      // Swipe left
      nextSlide();
    } else if (touchEndX - touchStartX > 100) {
      // Swipe right
      prevSlide();
    }
    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <div className="client-slider-container">
      <div 
        className="client-slider-wrapper" 
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <div 
          className="client-slider-track"
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease',
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${totalSlides * 100}%`
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div 
              className="client-slide" 
              key={index}
              style={{
                width: `${100 / totalSlides}%`,
                padding: '0 15px',
                boxSizing: 'border-box'
              }}
            >
              {child}
            </div>
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button 
          className="slider-arrow prev"
          onClick={prevSlide}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          ‹
        </button>
        <button 
          className="slider-arrow next"
          onClick={nextSlide}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: 'none',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          ›
        </button>
      </div>
      
      {/* Navigation Dots */}
      <div 
        className="slider-dots"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px'
        }}
      >
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              margin: '0 5px',
              border: 'none',
              background: currentSlide === index ? '#0066cc' : '#ddd',
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientSlider;
