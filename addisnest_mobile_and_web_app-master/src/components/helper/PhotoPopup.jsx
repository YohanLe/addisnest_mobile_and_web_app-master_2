import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    SvgCloseIcon, 
    SvgArrowLeftIcon, 
    SvgArrowRightIcon
} from '../../assets/svg-files/SvgFiles';

const PhotoPopup = ({ isOpen, images, selectedIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(selectedIndex);
    const [showThumbnails, setShowThumbnails] = useState(true);
    const galleryRef = useRef(null);
    
    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                navigate('prev');
            } else if (e.key === 'ArrowRight') {
                navigate('next');
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        
        // Prevent body scrolling when popup is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);
    
    // Reset current index when selected index changes
    useEffect(() => {
        setCurrentIndex(selectedIndex);
    }, [selectedIndex]);
    
    const navigate = (direction) => {
        if (direction === 'next') {
            setCurrentIndex(prevIndex => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        } else {
            setCurrentIndex(prevIndex => 
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        }
    };
    
    // Handle click outside to close
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('photo-popup-overlay')) {
            onClose();
        }
    };
    
    // Handle horizontal scrolling with mouse wheel
    const handleWheel = (e) => {
        if (galleryRef.current) {
            e.preventDefault();
            galleryRef.current.scrollLeft += e.deltaY;
        }
    };
    
    if (!isOpen) return null;
    
    return createPortal(
        <div className="photo-popup-overlay" onClick={handleOverlayClick}>
            <div className="photo-popup-container">
                <button className="close-button" onClick={onClose}>
                    <SvgCloseIcon />
                </button>
                
                <div className="photo-counter">
                    <span>{currentIndex + 1} of {images.length}</span>
                </div>
                
                {/* Main large image */}
                <div className="main-image-container">
                    <img 
                        className="main-photo-image"
                        src={images[currentIndex]} 
                        alt={`Property image ${currentIndex + 1}`} 
                    />
                </div>
                
                {/* Horizontal scrollable gallery */}
                <div 
                    className="thumbnails-gallery"
                    ref={galleryRef}
                    onWheel={handleWheel}
                >
                    {images.map((image, index) => (
                        <div 
                            key={index} 
                            className={`thumbnail-container ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <img 
                                className="thumbnail-image"
                                src={image} 
                                alt={`Thumbnail ${index + 1}`} 
                            />
                        </div>
                    ))}
                </div>
                
                <button 
                    className="nav-button prev-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('prev');
                    }}
                >
                    <SvgArrowLeftIcon />
                </button>
                
                <button 
                    className="nav-button next-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('next');
                    }}
                >
                    <SvgArrowRightIcon />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default PhotoPopup;
