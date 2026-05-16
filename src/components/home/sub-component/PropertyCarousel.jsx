import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Property1, Property2, Property3 } from '../../../assets/images';
import { getSafeMongoId } from '../../../utils/mongoIdHelper';
import FavoriteButton from '../../common/FavoriteButton';
import ShareButton from '../../common/ShareButton';
import { useCurrency } from '../../../contexts/CurrencyContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7002';

const fixImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null' || imageUrl === '') return Property1;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('uploads/')) {
    const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${API_BASE_URL}${cleanPath}`;
  }
  if (!imageUrl.includes('/')) return `${API_BASE_URL}/uploads/${imageUrl}`;
  return Property1;
};

const getPropertyImage = (property) => {
  const possibleImages = [
    property.images?.[0]?.url, property.imageUrl, property.image,
    property.photos?.[0], property.mainImage
  ];
  for (const img of possibleImages) {
    if (img && img !== 'undefined' && img !== 'null' && img !== '') return fixImageUrl(img);
  }
  const defaultImages = [Property1, Property2, Property3];
  const idx = Math.abs(property._id?.toString().charCodeAt(0) || 0) % defaultImages.length;
  return defaultImages[idx];
};

const PropertyCarousel = ({ properties = [] }) => {
  const { formatAmount: formatCurrencyAmount, currency, convert } = useCurrency();
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef(null);
  /* === DIAMOND_FEATURE_START === */
  const [activeAnimIndex, setActiveAnimIndex] = useState(-1);
  const isDiamond = (index) => index === 0 || index === 1;
  /* === DIAMOND_FEATURE_END === */

  // Take up to 10 properties
  const carouselItems = properties.slice(0, 10);

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current || carouselItems.length === 0) return;
    const container = scrollRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    const gap = 16;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
    setCurrentIndex(index);
    /* === DIAMOND_FEATURE_START === */
    if (index === 0 || index === 1) {
      setActiveAnimIndex(index);
      setTimeout(() => setActiveAnimIndex(-1), 700);
    }
    /* === DIAMOND_FEATURE_END === */
  }, [carouselItems.length]);

  const scrollNext = useCallback(() => {
    const nextIndex = currentIndex >= carouselItems.length - 1 ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  }, [currentIndex, carouselItems.length, scrollToIndex]);

  const scrollPrev = useCallback(() => {
    const prevIndex = currentIndex <= 0 ? carouselItems.length - 1 : currentIndex - 1;
    scrollToIndex(prevIndex);
  }, [currentIndex, carouselItems.length, scrollToIndex]);

  // Auto-play
  useEffect(() => {
    if (isAutoPlaying && carouselItems.length > 1) {
      autoPlayRef.current = setInterval(scrollNext, 3500);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying, scrollNext, carouselItems.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Update current index on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    const gap = 16;
    const idx = Math.round(container.scrollLeft / (cardWidth + gap));
    const newIndex = Math.min(idx, carouselItems.length - 1);
    setCurrentIndex(newIndex);
    /* === DIAMOND_FEATURE_START === */
    if (newIndex === 0 || newIndex === 1) {
      setActiveAnimIndex(newIndex);
      setTimeout(() => setActiveAnimIndex(-1), 700);
    }
    /* === DIAMOND_FEATURE_END === */
  };

  if (carouselItems.length === 0) return null;

  const formatPrice = (property) => {
    const price = property.price?.amount || property.price || 0;
    const sourceCurrency = property.price?.currency || 'ETB';
    return formatCurrencyAmount(price, sourceCurrency);
  };

  const getAddress = (property) => {
    const subCity = property?.address?.subCity || property?.address?.sub_city || property?.sub_city;
    const regionalState = property?.address?.regionalState || property?.address?.state || property?.regional_state;
    const parts = [subCity, regionalState].filter(Boolean);
    if (parts.length > 0) return parts.join(', ');
    if (property.location) {
      const lparts = [property.location.city, property.location.state].filter(Boolean);
      if (lparts.length > 0) return lparts.join(', ');
    }
    return typeof property.address === 'string' ? property.address : '';
  };

  const isRent = (property) => {
    const raw = (property.offeringType || property.offering_type || property.listingType || property.type || '').toLowerCase();
    return raw.includes('rent');
  };

  /* === EXTRA_FEATURES_START === Helper functions */
  const getBedBath = (property) => {
    const beds = property.bedrooms || property.bed || property.beds || 0;
    const baths = property.bathrooms || property.bath || property.baths || 0;
    return { beds, baths };
  };

  const getArea = (property) => {
    return property.area || property.size || property.sqft || property.squareFeet || 0;
  };

  const isNew = (property) => {
    const created = property.createdAt || property.created_at || property.dateAdded;
    if (!created) return false;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(created) >= thirtyDaysAgo;
  };

  const getPricePerSqft = (property) => {
    const price = property.price?.amount || property.price || 0;
    const sourceCurrency = property.price?.currency || 'ETB';
    const area = getArea(property);
    if (price > 0 && area > 0) {
      return Math.round(convert(price, sourceCurrency) / area);
    }
    return 0;
  };

  // View counter is delivered under different keys depending on the API
  // version and on whether the property comes from a list or detail call.
  // Read every common variant so the count never silently shows 0 on mobile.
  const getViews = (property) => {
    return Number(
      property?.views ??
      property?.viewCount ??
      property?.view_count ??
      property?.totalViews ??
      property?.stats?.views ??
      0
    ) || 0;
  };


  const getLocationPin = (property) => {
    const subCity = property?.address?.subCity || property?.address?.sub_city || property?.sub_city;
    const city = property?.address?.city || '';
    return subCity || city || '';
  };
  /* === EXTRA_FEATURES_END === */

  return (
    <div
      style={{ position: 'relative', padding: '0 0 20px', marginBottom: '10px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#222', margin: 0 }}>
            🔥 Featured Properties
          </h2>
          {/* === EXTRA_FEATURES_START === Property count indicator */}
          <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: '500' }}>
            {currentIndex + 1} of {carouselItems.length}
          </span>
          {/* === EXTRA_FEATURES_END === */}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={scrollPrev}
            style={{
              width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #ccc',
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', color: '#444', transition: 'all 0.2s'
            }}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={scrollNext}
            style={{
              width: '34px', height: '34px', borderRadius: '50%', border: '1.5px solid #ccc',
              background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', color: '#444', transition: 'all 0.2s'
            }}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          paddingBottom: '6px',
        }}
      >
        <style>{`
          .carousel-track::-webkit-scrollbar { display: none; }
          /* === DIAMOND_FEATURE_START === */
          @keyframes diamondPopUp {
            0% { transform: perspective(800px) translateZ(-80px) scale(0.85); opacity: 0.2; box-shadow: 0 2px 8px rgba(185,142,255,0.1); }
            35% { transform: perspective(800px) translateZ(60px) scale(1.12); opacity: 1; box-shadow: 0 20px 50px rgba(185,142,255,0.6), 0 0 30px rgba(124,58,237,0.3); }
            60% { transform: perspective(800px) translateZ(20px) scale(1.04); box-shadow: 0 12px 35px rgba(185,142,255,0.45); }
            80% { transform: perspective(800px) translateZ(35px) scale(1.06); box-shadow: 0 16px 40px rgba(185,142,255,0.5); }
            100% { transform: perspective(800px) translateZ(0px) scale(1); opacity: 1; box-shadow: 0 10px 28px rgba(185,142,255,0.4); }
          }
          @keyframes diamondBadgeShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes diamondGlow {
            0%, 100% { transform: perspective(800px) translateZ(0px) scale(1); box-shadow: 0 8px 20px rgba(185, 142, 255, 0.4), 0 4px 16px rgba(0,0,0,0.15); }
            50% { transform: perspective(800px) translateZ(25px) scale(1.04); box-shadow: 0 16px 40px rgba(185, 142, 255, 0.65), 0 6px 20px rgba(0,0,0,0.25); }
          }
          /* === DIAMOND_FEATURE_END === */
        `}</style>

        {carouselItems.map((property, index) => {
          const rent = isRent(property);
          const accent = rent ? '#3b82f6' : '#a4ff2a';
          const accentText = rent ? '#fff' : '#000';
          const bg = rent
            ? 'linear-gradient(155deg,#060e1e 0%,#0b1c3d 100%)'
            : 'linear-gradient(155deg,#071207 0%,#0c1f0c 100%)';

          /* === DIAMOND_FEATURE_START === */
          const isThisDiamond = isDiamond(index);
          const isPopping = activeAnimIndex === index;
          const diamondBorder = isThisDiamond ? '2px solid #b98eff' : `1px solid ${rent ? '#1e3a70' : '#1a3a18'}`;
          const diamondShadow = isThisDiamond
            ? '0 0 12px rgba(185, 142, 255, 0.5), 0 4px 16px rgba(0,0,0,0.15)'
            : '0 4px 16px rgba(0,0,0,0.15)';
          /* === DIAMOND_FEATURE_END === */

          return (
            <div
              key={property._id}
              style={{
                flex: '0 0 260px',
                scrollSnapAlign: 'start',
                borderRadius: '14px',
                overflow: 'hidden',
                background: bg,
                /* === DIAMOND_FEATURE_CHANGE === */ border: diamondBorder, /* was: `1px solid ${rent ? '#1e3a70' : '#1a3a18'}` */
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                /* === DIAMOND_FEATURE_CHANGE === */ boxShadow: diamondShadow, /* was: '0 4px 16px rgba(0,0,0,0.15)' */
                /* === DIAMOND_FEATURE_START === */
                ...(isPopping ? { animation: 'diamondPopUp 0.7s ease-out forwards' } : {}),
                ...(isThisDiamond && currentIndex === index ? { animation: 'diamondGlow 2s ease-in-out infinite' } : {}),
                /* === DIAMOND_FEATURE_END === */
              }}
            >
              {/* Verified badge — top-right (always visible, small) */}
              <div
                title="Verified by Addisnest"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: '800',
                  padding: '3px 7px',
                  borderRadius: '50px',
                  zIndex: 4,
                  letterSpacing: '0.3px',
                  boxShadow: '0 2px 8px rgba(22,163,74,0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  lineHeight: 1,
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified
              </div>

              {/* === DIAMOND_FEATURE_START === Diamond Badge (shifted down to avoid Verified pill) */}
              {isThisDiamond && (
                <div style={{
                  position: 'absolute',
                  top: '34px',
                  right: '8px',
                  background: 'linear-gradient(135deg, #7c3aed, #b98eff, #7c3aed)',
                  backgroundSize: '200% auto',
                  animation: 'diamondBadgeShimmer 3s linear infinite',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: '800',
                  padding: '4px 10px',
                  borderRadius: '50px',
                  zIndex: 3,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.5)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  💎 Diamond
                </div>
              )}
              {/* === DIAMOND_FEATURE_END === */}
              {/* Image — taller to give the photo more visual space */}
              <div style={{ position: 'relative', height: '170px', overflow: 'hidden' }}>

                <img
                  src={getPropertyImage(property)}
                  alt={property.title || 'Property'}
                  onError={(e) => {
                    const defaults = [Property1, Property2, Property3];
                    e.target.src = defaults[Math.abs(property._id?.toString().charCodeAt(0) || 0) % defaults.length];
                  }}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center', display: 'block'
                  }}
                />
                {/* Tag */}
                <div style={{
                  position: 'absolute', top: '8px', left: '8px',
                  background: accent, color: accentText,
                  fontSize: '0.65rem', fontWeight: '700',
                  padding: '3px 8px', borderRadius: '50px', zIndex: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                }}>
                  {rent ? '🔑 For Rent' : '🏠 For Sale'}
                </div>
                {/* === EXTRA_FEATURES_START === "NEW" Badge */}
                {isNew(property) && (
                  <div style={{
                    position: 'absolute', bottom: '8px', left: '8px',
                    background: '#ef4444', color: '#fff',
                    fontSize: '0.58rem', fontWeight: '800',
                    padding: '2px 8px', borderRadius: '50px', zIndex: 2,
                    boxShadow: '0 2px 6px rgba(239,68,68,0.4)',
                    letterSpacing: '1px', textTransform: 'uppercase',
                  }}>
                    ✨ NEW
                  </div>
                )}
                {/* === EXTRA_FEATURES_END === */}
              </div>

              {/* Info — compacted: smaller fonts, fewer rows so the photo gets more space */}
              <div style={{ padding: '6px 10px 6px' }}>
                {/* Price + Share/Heart row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: '800', color: accent, margin: 0, lineHeight: 1.15 }}>
                    {formatPrice(property)}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ShareButton
                      propertyId={getSafeMongoId(property._id)}
                      title={property.title || 'Check out this property on Addisnest'}
                      size={11}
                      variant="dark"
                      style={{ width: '22px', height: '22px', boxShadow: 'none' }}
                    />
                    <FavoriteButton
                      propertyId={getSafeMongoId(property._id)}
                      property={property}
                      size={13}
                      style={{ width: '24px', height: '24px', boxShadow: 'none', background: 'transparent' }}
                    />
                  </div>
                </div>

                {/* Location + title — single combined line to save vertical space */}
                {(getLocationPin(property) || property.title) && (
                  <p style={{
                    fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontWeight: '500',
                  }}>
                    {getLocationPin(property) ? `📍 ${getLocationPin(property)}` : ''}
                    {getLocationPin(property) && property.title ? ' · ' : ''}
                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>{property.title}</span>
                  </p>
                )}

                {/* Bed/Bath/Area + Views — single line */}
                {(() => {
                  const { beds, baths } = getBedBath(property);
                  const area = getArea(property);
                  const parts = [];
                  if (beds > 0) parts.push(`🛏 ${beds}`);
                  if (baths > 0) parts.push(`🛁 ${baths}`);
                  if (area > 0) parts.push(`📐 ${area.toLocaleString()} sqft`);
                  // views go on the same row, pushed to the right
                  return (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: '6px', marginTop: '3px', paddingTop: '3px',
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      fontSize: '0.55rem', color: 'rgba(255,255,255,0.55)', fontWeight: '600',
                    }}>
                      <div style={{ display: 'flex', gap: '6px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {parts.map((part, i) => (<span key={i}>{part}</span>))}
                      </div>
                      <span style={{ flexShrink: 0, color: 'rgba(255,255,255,0.4)' }}>
                        👁 {getViews(property).toLocaleString()}
                      </span>
                    </div>
                  );
                })()}
              </div>


              {/* Clickable overlay */}
              <Link
                to={`/property/${getSafeMongoId(property._id)}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
                aria-label={`View ${property.title}`}
              />
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {carouselItems.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              style={{
                width: currentIndex === idx ? '18px' : '7px',
                height: '7px',
                borderRadius: '4px',
                border: 'none',
                background: currentIndex === idx ? '#a4ff2a' : '#ccc',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyCarousel;
