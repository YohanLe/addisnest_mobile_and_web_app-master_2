import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSimilarProperties } from "../../../Redux-store/Slices/PropertyDetailSlice";
import { isAuthenticated } from "../../../utils/tokenHandler";
import LoginPopup from "../../../helper/LoginPopup";
import PaymentModal from "../PaymentModal";
import "../../../assets/css/property-detail-enhanced.css";
import "../../../assets/css/about-place.css";
import "../../../assets/css/nearby-properties-slider.css";
import AboutThisHome from "./AboutThisHome";
import SafetyTipsSection from "./SafetyTipsSection";
import MortgageCalculatorModern from "../../mortgage-calculator/MortgageCalculatorModern";
import {
    SvgArrowLeftIcon,
    SvgArrowRightIcon,
    SvgClockIcon as SvgClock,
    SvgClockIcon,
    SvgFavoriteFillIcon,
    SvgFavoriteIcon,
    SvgShareIcon,
    SvgLocationIcon,
    SvgPhoneIcon,
    SvgMailIcon,
    SvgThermom,
    SvgBulding,
    SvgBounder,
    SvgFinanceIcon,
    SvgCarParking,
} from "../../../assets/svg-files/SvgFiles.jsx";
import { formatDistanceToNow } from "date-fns";
import PhotoPopup from "../PhotoPopup";

// Format date function
const MakeFormat = (data) => {
    if (!data) return "Invalid date";

    const date = new Date(data?.createdAt || data);
    if (isNaN(date)) return "Invalid date";

    return formatDistanceToNow(date, { addSuffix: true });
};

// Main PropertyDetail component
const PropertyDetail = ({ PropertyDetails, similarProperties }) => {
    const formatFeatureName = (key) => {
        return key
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const featureIcons = {
        'parking-space': '🚗',
        'garage': '🏢',
        '24-7-security': '👮',
        'cctv-surveillance': '📹',
        'gym-fitness-center': '💪',
        'swimming-pool': '🏊',
    };

    const availableFeatures = PropertyDetails?.features && typeof PropertyDetails.features === 'object' ?
        Object.entries(PropertyDetails.features)
            .filter(([key, value]) => value === true || value === 'true' && key !== '_id')
        : [];
    const [activeTab, setActiveTab] = useState('details');
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const [selectedTourType, setSelectedTourType] = useState('in-person');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const navigate = useNavigate();
    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    // Fetch similar properties from the Redux store
    const dispatch = useDispatch();
    const similarPropertiesFromRedux = useSelector((state) => state.propertyDetail?.similarProperties || []);
    const loadingSimilar = useSelector((state) => state.propertyDetail?.loadingSimilar);
    const [nearbyProperties, setNearbyProperties] = useState([]);
    
    // Fetch similar properties when PropertyDetails loads - using propertyId to prevent infinite updates
    useEffect(() => {
        if (PropertyDetails && PropertyDetails._id) {
            // Dispatch action to get similar properties - only pass the ID to avoid re-renders
            dispatch(getSimilarProperties({ _id: PropertyDetails._id }));
        }
    }, [dispatch, PropertyDetails?._id]);
    
    // Update nearby properties when similar properties data changes
    // Using a ref to track if this is the first mount to avoid unnecessary updates
    const initialRender = React.useRef(true);
    
    useEffect(() => {
        // Skip the first render to avoid update loops
        if (initialRender.current) {
            initialRender.current = false;
            
            // Set initial data on first render
            if (similarPropertiesFromRedux && similarPropertiesFromRedux.length > 0) {
                setNearbyProperties(similarPropertiesFromRedux);
            } else if (similarProperties && similarProperties.length > 0) {
                setNearbyProperties(similarProperties);
            }
            return;
        }
        
        // Only update if Redux state changes, not when component re-renders
        if (similarPropertiesFromRedux && similarPropertiesFromRedux.length > 0) {
            setNearbyProperties(similarPropertiesFromRedux);
        }
    }, [similarPropertiesFromRedux]);
    
    // If PropertyDetails is empty or undefined, show a fallback message
    if (!PropertyDetails || Object.keys(PropertyDetails).length === 0) {
        return (
            <div className="property-not-found-container">
                <div className="container">
                    <div className="property-not-found">
                        <h2>Property Not Found</h2>
                        <p>The property you're looking for is not available or doesn't exist.</p>
                        <Link to="/property-list" className="back-to-list">
                            Browse Available Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
    
    // Format price with commas
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US').format(price);
    };
    
    // Handle image navigation
    const nextImage = () => {
        if (PropertyDetails?.media && PropertyDetails.media.length > 0) {
            setActiveImageIndex((prev) => (prev + 1) % PropertyDetails.media.length);
        }
    };
    
    const prevImage = () => {
        if (PropertyDetails?.media && PropertyDetails.media.length > 0) {
            setActiveImageIndex((prev) => (prev - 1 + PropertyDetails.media.length) % PropertyDetails.media.length);
        }
    };

    return (
        <div className="property-detail-page">
            {/* Property Images Grid (Redfin Style) */}
            <div className="property-images-container">
                {PropertyDetails?.media && PropertyDetails.media.length > 0 ? (
                    <div className="property-photos-grid">
                        {/* Main large photo - left side */}
                        <div className="main-photo">
                            <div 
                                className="property-image main-property-image"
                                onClick={() => {
                                    setActiveImageIndex(0);
                                }}
                                style={{ height: '100%', cursor: 'pointer', position: 'relative' }}
                            >
                                {/* Main image - this span contains the actual property image as background */}
                                <span style={{ 
                                    backgroundImage: `url(${PropertyDetails.media[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '100%',
                                    display: 'block',
                                    borderRadius: '4px',
                                    position: 'relative',
                                    zIndex: 1
                                }}></span>
                                
                                {/* Navigation controls - we keep these visible */}
                                <div className="image-navigation" style={{ background: 'transparent' }}>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }} className="nav-btn prev-btn">
                                        <SvgArrowLeftIcon />
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }} className="nav-btn next-btn">
                                        <SvgArrowRightIcon />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Thumbnail grid - 2x2 layout - right side */}
                        <div className="thumbnail-grid">
                            {PropertyDetails.media.slice(1, 5).map((img, index) => (
                                <div 
                                    key={index} 
                                    className="property-image"
                                    onClick={() => {
                                        setActiveImageIndex(index + 1);
                                    }}
                                    style={{ 
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span style={{ 
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        height: '175px',
                                        display: 'block'
                                    }}></span>
                                    
                                    {/* Show "View all photos" overlay on the last thumbnail if there are more than 5 images */}
                                    {index === 3 && PropertyDetails.media.length > 5 && (
                                        <div 
                                            className="view-all-overlay"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIndex(0);
                                            }}
                                        >
                                            +{PropertyDetails.media.length - 5} more photos
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* Fill in empty spots in the grid if there aren't enough images */}
                            {Array.from({ length: Math.max(0, 4 - Math.min(4, PropertyDetails.media.length - 1)) }).map((_, index) => (
                                <div 
                                    key={`empty-${index}`} 
                                    className="property-image"
                                    style={{ 
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <span></span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Photo count badge in bottom right of the grid */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '15px', 
                            right: '15px', 
                            zIndex: 2
                        }}>
                            <button 
                                onClick={() => setActiveImageIndex(0)}
                                style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '30px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>📷</span> {PropertyDetails.media.length} photos
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-image-placeholder">No images available</div>
                )}
            </div>

            {/* Fullscreen Image Popup */}
            {activeImageIndex !== null && PropertyDetails?.media?.length > 0 && (
                <div 
                    className="fullscreen-image-popup"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {/* Header with close button */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
                        zIndex: 2
                    }}>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                            Property Images
                        </div>
                        <button
                            onClick={() => setActiveImageIndex(null)}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px'
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Main image container */}
                    <div style={{
                        width: '100%',
                        height: 'calc(100% - 120px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src={PropertyDetails.media[activeImageIndex]}
                            alt={`Property Image ${activeImageIndex + 1}`}
                            style={{
                                maxHeight: '100%',
                                maxWidth: '100%',
                                objectFit: 'contain'
                            }}
                        />

                        {/* Navigation arrows */}
                        <button
                            onClick={prevImage}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '24px'
                            }}
                        >
                            <SvgArrowLeftIcon />
                        </button>

                        <button
                            onClick={nextImage}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '24px'
                            }}
                        >
                            <SvgArrowRightIcon />
                        </button>
                    </div>

                    {/* Image counter */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        textAlign: 'center',
                        color: 'white',
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
                    }}>
                        {activeImageIndex + 1} OF {PropertyDetails.media.length}
                    </div>
                </div>
            )}

            {/* About this House section and Safety Tips Box side by side */}
            <div className="container" style={{ marginTop: '30px', marginBottom: '30px' }}>
                <div className="row" style={{ display: 'flex', flexDirection: 'row' }}>
                    {/* About this House section - Left Column */}
                    <div className="col-md-7" style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* Property Information Box */}
                        <div className="property-info-box" style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            padding: '10px',
                            height: '100%'
                        }}>
                            <div>
                                {/* Listed by information with profile picture */}
                                <div style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '0 0 10px 0'
                                }}>
                                    {/* Circular profile picture */}
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: '#e0e0e0',
                                        marginRight: '10px',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '1px solid #ddd'
                                    }}>
                                        {PropertyDetails?.owner?.profilePicture || PropertyDetails?.ownerProfilePic ? (
                                            <img 
                                                src={PropertyDetails?.owner?.profilePicture || PropertyDetails?.ownerProfilePic} 
                                                alt="Owner" 
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <span style={{ 
                                                fontSize: '18px',
                                                color: '#555'
                                            }}>
                                                {(PropertyDetails?.ownerName?.charAt(0) || 
                                                  (PropertyDetails?.owner?.firstName?.charAt(0)) || 'P').toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Owner name */}
                                    <p style={{ 
                                        fontSize: '18px', 
                                        color: '#333', 
                                        margin: '0',
                                        fontWeight: '600'
                                    }}>
                                        Listed by {PropertyDetails?.ownerName || 
                                        (PropertyDetails?.owner && typeof PropertyDetails.owner === 'object' ? 
                                        `${PropertyDetails.owner.firstName || ''} ${PropertyDetails.owner.lastName || ''}` : 
                                        '')}
                                    </p>
                                </div>
                                
                                {/* Title inside the box */}
                                <h2 style={{ 
                                    fontSize: '22px',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    color: '#333'
                                }}>
                                    {PropertyDetails?.title}
                                </h2>
                                
                                {/* Status indicator */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ 
                                        width: '12px', 
                                        height: '12px', 
                                        backgroundColor: '#4CAF50', 
                                        borderRadius: '50%',
                                        marginRight: '8px'
                                    }}></div>
                                    <span style={{ 
                                        color: '#4D4D4D', 
                                        fontWeight: '600', 
                                        fontSize: '15px'
                                    }}>
                                        {PropertyDetails?.property_for || PropertyDetails?.offeringType} - <span style={{ 
                                            textDecoration: 'underline', 
                                            textUnderlineOffset: '4px', 
                                            textDecorationStyle: 'dotted' 
                                        }}>ACTIVE</span>
                                    </span>
                                </div>
                                
                                {/* Address */}
                                <h1 style={{ 
                                    margin: '0 0 15px 0',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#333'
                                }}>
                                    {[
                                        PropertyDetails?.address?.subCity,
                                        PropertyDetails?.address?.city,
                                        PropertyDetails?.address?.regionalState
                                    ].filter(Boolean).join(', ') || 'Location not specified'}
                                </h1>
                                
                                {/* Price */}
                                <div style={{ marginBottom: '20px' }}>
                                    <h2 style={{ 
                                        margin: '0 0 5px 0',
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#333'
                                    }}>
                                        {formatPrice(PropertyDetails?.total_price || PropertyDetails?.price)}
                                    </h2>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#666' }}>
                                        Est. {PropertyDetails?.currency || ''}{Math.round(((PropertyDetails?.total_price || PropertyDetails?.price) * 0.005))}/mo
                                    </p>
                                </div>
                                
                                {/* Property Description */}
                                <div style={{ marginBottom: '20px' }}>
                                    <p style={{ 
                                        fontSize: '15px', 
                                        lineHeight: '1.6', 
                                        color: '#555',
                                        margin: '0'
                                    }}>
                                        {PropertyDetails?.description}
                                    </p>
                                </div>
                                
                                {/* Property Specifications Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '16px',
                                    fontSize: '14px'
                                }}>
                                    {/* Property Type */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🏠</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Property Type</div>
                                            <div>{
                                              typeof PropertyDetails?.property_type === 'object' && PropertyDetails?.property_type?.label ? 
                                                PropertyDetails?.property_type?.label : 
                                                (typeof PropertyDetails?.propertyType === 'object' && PropertyDetails?.propertyType?.label ? 
                                                  PropertyDetails?.propertyType?.label : 
                                                  (typeof PropertyDetails?.property_type === 'string' ? 
                                                    PropertyDetails?.property_type : 
                                                    (typeof PropertyDetails?.propertyType === 'string' ? 
                                                      PropertyDetails?.propertyType : '')))
                                            }</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bedrooms */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🛏️</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Bedrooms</div>
                                            <div>{PropertyDetails?.number_of_bedrooms || PropertyDetails?.bedrooms || PropertyDetails?.specifications?.bedrooms}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Bathrooms */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>🚿</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Bathrooms</div>
                                            <div>{PropertyDetails?.number_of_bathrooms || PropertyDetails?.bathrooms || PropertyDetails?.specifications?.bathrooms}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Living Area */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>📏</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Living Area</div>
                                            <div>{PropertyDetails?.property_size || PropertyDetails?.size || PropertyDetails?.specifications?.area?.size} sqm</div>
                                        </div>
                                    </div>
                                    
                                    
                                    {/* Days on Addisnest */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            marginRight: '8px', 
                                            width: '24px',
                                            textAlign: 'center' 
                                        }}>📅</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#555', marginBottom: '4px' }}>Days on Addisnest</div>
                                            <div>1 days</div>
                                        </div>
                                    </div>
                                    
                                    
                                </div>

                                {/* Property Features Section */}
                                <div style={{ marginTop: '25px' }}>
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        marginBottom: '15px',
                                        color: '#333'
                                    }}>
                                        Property Features
                                    </h3>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '12px',
                                        fontSize: '14px'
                                    }}>
                                        {availableFeatures.length > 0 ? (
                                            availableFeatures.map(([key]) => (
                                                <div key={key} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px'
                                                }}>
                                                    <span style={{ marginRight: '8px' }}>
                                                        {featureIcons[key.replace(/_/g, '-')] || '✅'}
                                                    </span>
                                                    <span>
                                                        {formatFeatureName(key)}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{
                                                gridColumn: '1 / -1',
                                                padding: '12px',
                                                color: '#666',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '6px',
                                                textAlign: 'center'
                                            }}>
                                                No specific features listed for this property.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column - Post Ad Button and Safety Tips (visible only on web view) */}
                    <div className="col-md-5 desktop-only-safety-tips">
                        {/* Post Ad Like This Button - Web View Only */}
                        <div style={{ marginBottom: '20px' }}>
                            <button 
                                onClick={() => {
                                    if (!isAuthenticated()) {
                                        setShowLoginPopup(true);
                                    } else {
                                        navigate('/property-list-form');
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '15px',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                            >
                                <span style={{ fontSize: '16px', marginRight: '6px' }}>📝</span> Post Ad Like This
                            </button>
                        </div>
                        <div className="safety-tips-box" style={{
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            height: '100%'
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '15px',
                                color: '#333'
                            }}>Safety Tips</h3>
                            
                            <ul style={{
                                listStyleType: 'disc',
                                paddingLeft: '20px',
                                marginBottom: '0'
                            }}>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    It's safer not to pay ahead for inspections
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Ask friends or somebody you trust to accompany you for viewing.
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Look around the apartment to ensure it meets your expectations
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Don't pay before hand if they won't let you move in immediately
                                </li>
                                <li style={{ marginBottom: '0', fontSize: '14px', color: '#555' }}>
                                    Verify that the account details belong to the right property owner before initiating payment
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Owner information for mobile view */}
            <div className="container mobile-only-owner-info" style={{ marginBottom: '15px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            padding: '12px 15px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            {/* Circular profile picture */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#e0e0e0',
                                marginRight: '12px',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #ddd'
                            }}>
                                {PropertyDetails?.owner?.profilePicture || PropertyDetails?.ownerProfilePic ? (
                                    <img 
                                        src={PropertyDetails?.owner?.profilePicture || PropertyDetails?.ownerProfilePic} 
                                        alt="Owner" 
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span style={{ 
                                        fontSize: '20px',
                                        color: '#555'
                                    }}>
                                        {(PropertyDetails?.ownerName?.charAt(0) || 
                                          (PropertyDetails?.owner?.firstName?.charAt(0)) || 'P').toUpperCase()}
                                    </span>
                                )}
                            </div>
                            
                            {/* Owner name */}
                            <p style={{ 
                                fontSize: '18px', 
                                color: '#333', 
                                margin: '0',
                                fontWeight: '600'
                            }}>
                                Listed by {PropertyDetails?.ownerName || 
                                (PropertyDetails?.owner && typeof PropertyDetails.owner === 'object' ? 
                                `${PropertyDetails.owner.firstName || ''} ${PropertyDetails.owner.lastName || ''}` : 
                                'Property Owner')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Post Ad Like This button above the three boxes (mobile view only) */}
            <div className="container mobile-only-post-ad" style={{ marginBottom: '20px' }}>
                <div className="row">
                    <div className="col-md-12" style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button 
                            onClick={() => {
                                if (!isAuthenticated()) {
                                    setShowLoginPopup(true);
                                } else {
                                    navigate('/property-list-form');
                                }
                            }}
                            style={{
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '15px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                        >
                            <span style={{ fontSize: '16px', marginRight: '6px' }}>📝</span> Post Ad Like This
                        </button>
                    </div>
                </div>
            </div>

            {/* Three boxes in one row: Message, Schedule Visit, and Mortgage Calculator */}
            <div className="container" style={{ marginBottom: '40px' }}>
                <div className="row" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '0 -10px' }}>
                    {/* Message Box - Send a message to the agent */}
                    <div style={{ width: '30%', padding: '0 10px', boxSizing: 'border-box' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            height: '100%'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#333'
                            }}>Message the Agent</h2>
                            
                            {/* Message form */}
                            <div style={{ marginBottom: '12px' }}>
                                <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '500', 
                                    marginBottom: '8px',
                                    color: '#555'
                                }}>Have questions about this property?</p>
                                
                                {/* Message textarea */}
                                <div style={{ marginBottom: '10px' }}>
                                    <textarea 
                                        placeholder="I'm interested in this property and would like to know more about..."
                                        rows="3"
                                        id="property-message-content"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '15px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            transition: 'border-color 0.3s ease',
                                            boxSizing: 'border-box',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                                
                                {/* Checkbox for terms */}
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    marginBottom: '10px'
                                }}>
                                    <input 
                                        type="checkbox" 
                                        id="terms-consent"
                                        style={{
                                            marginTop: '3px'
                                        }}
                                    />
                                    <label 
                                        htmlFor="terms-consent"
                                        style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            lineHeight: '1.4'
                                        }}
                                    >
                                        I agree to be contacted by Addisnest regarding this property and other relevant services.
                                    </label>
                                </div>
                            </div>
                            
                            {/* Send Message Button */}
                            <button 
                                onClick={() => {
                                    if (!isAuthenticated()) {
                                        setShowLoginPopup(true);
                                    } else {
                                        // Get message content
                                        const messageContent = document.getElementById('property-message-content').value;
                                        if (!messageContent.trim()) {
                                            alert('Please enter a message');
                                            return;
                                        }
                                        
                                        // Check if terms are accepted
                                        const termsAccepted = document.getElementById('terms-consent').checked;
                                        if (!termsAccepted) {
                                            alert('Please accept the terms to continue');
                                            return;
                                        }
                                        
                                        // Create message status element if it doesn't exist
                                        let messageStatusElement = document.getElementById('message-status-element');
                                        if (!messageStatusElement) {
                                            messageStatusElement = document.createElement('div');
                                            messageStatusElement.id = 'message-status-element';
                                            messageStatusElement.style.marginTop = '10px';
                                            messageStatusElement.style.padding = '10px';
                                            messageStatusElement.style.borderRadius = '6px';
                                            messageStatusElement.style.fontSize = '14px';
                                            messageStatusElement.style.textAlign = 'center';
                                            
                                            // Insert after the send button
                                            const sendButton = document.activeElement;
                                            if (sendButton && sendButton.parentNode) {
                                                sendButton.parentNode.parentNode.appendChild(messageStatusElement);
                                            } else {
                                                // Fallback - find the message form container
                                                const messageForm = document.getElementById('property-message-content').closest('div[style*="padding"]');
                                                if (messageForm) {
                                                    messageForm.appendChild(messageStatusElement);
                                                }
                                            }
                                        }
                                        
                                        // Show loading state
                                        messageStatusElement.style.backgroundColor = '#f0f7ff';
                                        messageStatusElement.style.color = '#0056b3';
                                        messageStatusElement.style.border = '1px solid #cce5ff';
                                        messageStatusElement.innerHTML = `
                                            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                                                <div style="width: 16px; height: 16px; border: 2px solid #0056b3; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
                                                <span>Sending your message...</span>
                                            </div>
                                            <style>
                                                @keyframes spin {
                                                    0% { transform: rotate(0deg); }
                                                    100% { transform: rotate(360deg); }
                                                }
                                            </style>
                                        `;
                                        
                                        // Disable the send button
                                        const sendButton = document.activeElement;
                                        if (sendButton) {
                                            sendButton.disabled = true;
                                            sendButton.style.opacity = '0.7';
                                            sendButton.style.cursor = 'not-allowed';
                                        }
                                        
                                        // Send message to property owner/agent
                                        const sendPropertyMessage = async () => {
                                            try {
                                                // Get the property owner/agent ID
                                                const recipientId = PropertyDetails.owner || PropertyDetails.agent || PropertyDetails.createdBy;
                                                
                                                if (!recipientId) {
                                                    throw new Error('Could not identify the property owner or agent');
                                                }
                                                
                                        // Import Api from the correct location
                                        const Api = await import('../../../Apis/Api');
                                        
                                        // Send message directly without creating conversation first
                                        const messageResponse = await Api.default.postWithtoken('messages', {
                                            recipientId: recipientId,
                                            content: messageContent,
                                            propertyId: PropertyDetails._id
                                        });
                                                
                                                // Api.postWithtoken already returns the parsed data
                                                const messageData = messageResponse;
                                                
                                                // No need to check .ok as any error would have thrown an exception
                                                
                                                // Clear the message input
                                                document.getElementById('property-message-content').value = '';
                                                
                                                // Show success message
                                                messageStatusElement.style.backgroundColor = '#d4edda';
                                                messageStatusElement.style.color = '#155724';
                                                messageStatusElement.style.border = '1px solid #c3e6cb';
                                                messageStatusElement.innerHTML = `
                                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                                        <div style="font-size: 24px; margin-bottom: 5px;">✅</div>
                                                        <div style="font-weight: 600; margin-bottom: 5px;">Message Sent Successfully!</div>
                                                        <div>Your message is pending approval from the agent.</div>
                                                        <div style="font-size: 13px; margin-top: 5px;">You'll be notified when they respond.</div>
                                                    </div>
                                                `;
                                                
                                                // Remove the success message after 3 seconds
                                                setTimeout(() => {
                                                    if (messageStatusElement) {
                                                        messageStatusElement.style.display = 'none';
                                                    }
                                                }, 3000);
                                                
                                                // Re-enable the send button
                                                if (sendButton) {
                                                    sendButton.disabled = false;
                                                    sendButton.style.opacity = '1';
                                                    sendButton.style.cursor = 'pointer';
                                                }
                                                
                                            } catch (error) {
                                                console.error('Error sending message:', error);
                                                
                                                // Show error message
                                                messageStatusElement.style.backgroundColor = '#f8d7da';
                                                messageStatusElement.style.color = '#721c24';
                                                messageStatusElement.style.border = '1px solid #f5c6cb';
                                                messageStatusElement.innerHTML = `
                                                    <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                                                        <div style="font-size: 24px; margin-bottom: 5px;">❌</div>
                                                        <div style="font-weight: 600; margin-bottom: 5px;">Message Not Sent</div>
                                                        <div>${error.message || 'Failed to send message. Please try again later.'}</div>
                                                        <button 
                                                            onclick="document.getElementById('message-status-element').style.display='none';"
                                                            style="margin-top: 10px; padding: 5px 10px; background-color: #f8d7da; border: 1px solid #721c24; border-radius: 4px; color: #721c24; cursor: pointer;"
                                                        >
                                                            Try Again
                                                        </button>
                                                    </div>
                                                `;
                                                
                                                // Re-enable the send button
                                                if (sendButton) {
                                                    sendButton.disabled = false;
                                                    sendButton.style.opacity = '1';
                                                    sendButton.style.cursor = 'pointer';
                                                }
                                            }
                                        };
                                        
                                        sendPropertyMessage();
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#2196F3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '16px',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1E88E5'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2196F3'}
                            >
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>📧</span> Send Message
                            </button>
                        </div>
                    </div>
                    
                    {/* Find Your Perfect Time box */}
                    <div style={{ width: '30%', padding: '0 10px', boxSizing: 'border-box' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            height: '100%'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#333'
                            }}>Find Your Perfect Time to Visit</h2>
                            
                            {/* Tour Type Selection */}
                            <div style={{ marginBottom: '12px' }}>
                                <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '500', 
                                    marginBottom: '8px',
                                    color: '#555'
                                }}>Select tour type:</p>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '10px'
                                }}>
                                    <div 
                                        onClick={() => setSelectedTourType('in-person')}
                                        style={{
                                            flex: '1',
                                            border: `2px solid ${selectedTourType === 'in-person' ? '#4a6cf7' : '#e0e0e0'}`,
                                            borderRadius: '8px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTourType === 'in-person' ? '#f0f5ff' : 'white',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px', marginBottom: '5px', display: 'block' }}>🏠</span>
                                        <span style={{ 
                                            fontWeight: selectedTourType === 'in-person' ? '600' : '500',
                                            color: selectedTourType === 'in-person' ? '#4a6cf7' : '#555'
                                        }}>
                                            In-Person Tour
                                        </span>
                                    </div>
                                    
                                    <div 
                                        onClick={() => setSelectedTourType('video')}
                                        style={{
                                            flex: '1',
                                            border: `2px solid ${selectedTourType === 'video' ? '#4a6cf7' : '#e0e0e0'}`,
                                            borderRadius: '8px',
                                            padding: '15px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTourType === 'video' ? '#f0f5ff' : 'white',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px', marginBottom: '5px', display: 'block' }}>📱</span>
                                        <span style={{ 
                                            fontWeight: selectedTourType === 'video' ? '600' : '500',
                                            color: selectedTourType === 'video' ? '#4a6cf7' : '#555'
                                        }}>
                                            Video Tour
                                        </span>
                    </div>
                </div>
            </div>
                            
                            {/* Date Selection - Enhanced */}
                            <div style={{ marginBottom: '12px' }}>
                                <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    marginBottom: '8px',
                                    color: '#333'
                                }}>Select Date</p>
                                
                                <div style={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    backgroundColor: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    position: 'relative'
                                }}>
                                    <span style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        marginRight: '12px',
                                        color: '#4a6cf7',
                                        fontSize: '20px'
                                    }}>📅</span>
                                    
                                    <input 
                                        type="date" 
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        style={{
                                            border: 'none',
                                            outline: 'none',
                                            fontSize: '15px',
                                            fontWeight: '500',
                                            color: '#333',
                                            width: '100%',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Time Selection - Simplified */}
                            <div style={{ marginBottom: '15px' }}>
                                <p style={{ 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    marginBottom: '8px',
                                    color: '#333'
                                }}>Select Time</p>
                                
                                <select style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    fontSize: '15px',
                                    backgroundColor: 'white',
                                    marginBottom: '0px'
                                }}>
                                    <option value="">Select a time</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="09:30">9:30 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="10:30">10:30 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="11:30">11:30 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="12:30">12:30 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="13:30">1:30 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="14:30">2:30 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="15:30">3:30 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="16:30">4:30 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                </select>
                            </div>
                            
                            {/* Schedule Button */}
                            <button style={{
                                width: '100%',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '16px',
                                padding: '10px 16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                            >
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>📅</span> Schedule Now
                            </button>
                        </div>
                    </div>
                    
                    {/* Calculate Mortgage Box */}
                    <div style={{ width: '30%', padding: '0 10px', boxSizing: 'border-box' }}>
                        <div style={{
                            padding: '16px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            height: '100%',
                            position: 'relative'
                        }}>
                            <h2 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                color: '#333'
                            }}>Calculate Your Mortgage</h2>
                            
                            {/* Simple mortgage calculator */}
                            <div>
                                {/* Home Price */}
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
                                        color: '#555'
                                    }}>
                                        Home Price
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue={formatPrice(PropertyDetails?.total_price || PropertyDetails?.price || 450000)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                
                                {/* Down Payment */}
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
                                        color: '#555'
                                    }}>
                                        Down Payment (20%)
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue={formatPrice((PropertyDetails?.total_price || PropertyDetails?.price || 450000) * 0.2)}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                
                                {/* Interest Rate */}
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
                                        color: '#555'
                                    }}>
                                        Interest Rate (%)
                                    </label>
                                    <input 
                                        type="text" 
                                        defaultValue="5.75"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #e0e0e0',
                                            fontSize: '15px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                
                                {/* Loan Term */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
                                        color: '#555'
                                    }}>
                                        Loan Term (years)
                                    </label>
                                    <select style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }}>
                                        <option value="30">30 years</option>
                                        <option value="20">20 years</option>
                                        <option value="15">15 years</option>
                                        <option value="10">10 years</option>
                                    </select>
                                </div>
                                
                                {/* Result Field */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '5px',
                                        color: '#555'
                                    }}>
                                        Result
                                    </label>
                                    <div style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        backgroundColor: '#f9f9f9',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#333',
                                        minHeight: '20px',
                                        boxSizing: 'border-box'
                                    }}>
                                        <span id="mortgage-calculation-result"></span>
                                    </div>
                                </div>
                                
                                {/* Calculate Button - Half size */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button 
                                        style={{
                                            width: '50%',
                                            backgroundColor: '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onClick={() => {
                                            try {
                                                // Get the current button that was clicked
                                                const currentButton = document.activeElement;
                                                
                                                // Find the mortgage calculator container (the parent div of the button)
                                                const mortgageBox = currentButton ? 
                                                    currentButton.closest('div[style*="padding"]') : null;
                                                
                                                // If we found the container, get the inputs directly from it
                                                let homePriceInput, downPaymentInput, interestRateInput, loanTermSelect;
                                                
                                                if (mortgageBox) {
                                                    // Get inputs within this specific container
                                                    const inputs = mortgageBox.querySelectorAll('input');
                                                    const selects = mortgageBox.querySelectorAll('select');
                                                    
                                                    if (inputs.length >= 3 && selects.length >= 1) {
                                                        homePriceInput = inputs[0];
                                                        downPaymentInput = inputs[1];
                                                        interestRateInput = inputs[2];
                                                        loanTermSelect = selects[0];
                                                    }
                                                }
                                                
                                                // If we couldn't find the inputs through the container, try direct selectors
                                                if (!homePriceInput || !downPaymentInput || !interestRateInput || !loanTermSelect) {
                                                    // Try to find inputs by their default values or other attributes
                                                    const allInputs = document.querySelectorAll('input');
                                                    const allSelects = document.querySelectorAll('select');
                                                    
                                                    // Find home price input (first input in the mortgage calculator section)
                                                    for (const input of allInputs) {
                                                        if (input.value && input.value.includes(',') && 
                                                            input.previousElementSibling && 
                                                            input.previousElementSibling.textContent.includes('Home Price')) {
                                                            homePriceInput = input;
                                                            break;
                                                        }
                                                    }
                                                    
                                                    // Find down payment input (second input in the mortgage calculator section)
                                                    for (const input of allInputs) {
                                                        if (input.value && input.value.includes(',') && 
                                                            input.previousElementSibling && 
                                                            input.previousElementSibling.textContent.includes('Down Payment')) {
                                                            downPaymentInput = input;
                                                            break;
                                                        }
                                                    }
                                                    
                                                    // Find interest rate input
                                                    for (const input of allInputs) {
                                                        if (input.value === "5.75" || 
                                                            (input.previousElementSibling && 
                                                             input.previousElementSibling.textContent.includes('Interest Rate'))) {
                                                            interestRateInput = input;
                                                            break;
                                                        }
                                                    }
                                                    
                                                    // Find loan term select
                                                    for (const select of allSelects) {
                                                        if (select.options && select.options[0] && 
                                                            select.options[0].value === "30") {
                                                            loanTermSelect = select;
                                                            break;
                                                        }
                                                    }
                                                }
                                                
                                                // Check if we found all required inputs
                                                if (!homePriceInput || !downPaymentInput || !interestRateInput || !loanTermSelect) {
                                                    // If we couldn't find the inputs, use default values
                                                    const propertyPrice = PropertyDetails?.total_price || PropertyDetails?.price || 450000;
                                                    const downPayment = propertyPrice * 0.2;
                                                    const interestRate = 0.0575; // 5.75%
                                                    const loanTerm = 30; // 30 years
                                                    
                                                    // Calculate loan amount
                                                    const loanAmount = propertyPrice - downPayment;
                                                    
                                                    // Calculate monthly interest rate
                                                    const monthlyRate = interestRate / 12;
                                                    
                                                    // Calculate number of payments
                                                    const numberOfPayments = loanTerm * 12;
                                                    
                                                    // Calculate monthly payment
                                                    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
                                                    
                                                    // Format the result
                                                    const formattedResult = new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(monthlyPayment);
                                                    
                                                    // Update the result field
                                                    document.getElementById('mortgage-calculation-result').textContent = `Monthly Payment: ${formattedResult}`;
                                                    return;
                                                }
                                                
                                                // Extract values from the inputs
                                                const homePrice = parseFloat(homePriceInput.value.replace(/[^0-9.-]+/g, ''));
                                                const downPayment = parseFloat(downPaymentInput.value.replace(/[^0-9.-]+/g, ''));
                                                const interestRate = parseFloat(interestRateInput.value) / 100;
                                                const loanTerm = parseInt(loanTermSelect.value || "30");
                                            
                                                // Calculate loan amount
                                                const loanAmount = homePrice - downPayment;
                                                
                                                // Calculate monthly interest rate
                                                const monthlyRate = interestRate / 12;
                                                
                                                // Calculate number of payments
                                                const numberOfPayments = loanTerm * 12;
                                                
                                                // Calculate monthly payment
                                                let monthlyPayment;
                                                
                                                if (monthlyRate === 0) {
                                                    // If interest rate is 0, simply divide loan amount by number of payments
                                                    monthlyPayment = loanAmount / numberOfPayments;
                                                } else {
                                                    // Standard mortgage formula
                                                    monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
                                                }
                                                
                                                // Format the result
                                                const formattedResult = new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(monthlyPayment);
                                                
                                                // Update the result field
                                                document.getElementById('mortgage-calculation-result').textContent = `Monthly Payment: ${formattedResult}`;
                                            } catch (error) {
                                                console.error('Error calculating mortgage:', error.message);
                                                
                                                // Fallback calculation if we can't get the inputs
                                                const propertyPrice = PropertyDetails?.total_price || PropertyDetails?.price || 450000;
                                                const downPayment = propertyPrice * 0.2;
                                                const loanAmount = propertyPrice - downPayment;
                                                const monthlyRate = 0.0575 / 12; // 5.75% annual rate
                                                const numberOfPayments = 30 * 12; // 30 years
                                                
                                                // Calculate monthly payment
                                                const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
                                                
                                                // Format the result
                                                const formattedResult = new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                }).format(monthlyPayment);
                                                
                                                // Update the result field
                                                document.getElementById('mortgage-calculation-result').textContent = `Monthly Payment: ${formattedResult}`;
                                            }
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#43A047'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
                                    >
                                        <span style={{ fontSize: '18px', marginRight: '8px' }}>💰</span> Calculate
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* Property Details Section removed as requested */}

            {/* Safety Tips Section - Removed as it's now part of the right sidebar */}

            {/* We don't render the MortgageCalculatorModern when it's hidden to prevent chart sizing errors */}
            {/* 
            <div className="container" style={{ marginBottom: '50px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div style={{
                            padding: '30px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                marginBottom: '25px',
                                color: '#333',
                                textAlign: 'center'
                            }}>Calculate Your Monthly Mortgage Payments</h2>
                            
                            <MortgageCalculatorModern 
                                currency=""
                                initialValues={{
                                    homePrice: PropertyDetails?.price || 15200000,
                                    downPayment: PropertyDetails?.price ? PropertyDetails.price * 0.2 : 100000,
                                    loanTerm: 20,
                                    interestRate: 10,
                                    propertyTax: PropertyDetails?.price ? PropertyDetails.price * 0.015 : 19000,
                                    homeInsurance: 2533.33,
                                    pmi: 250,
                                    hoa: 500
                                }}
                                showAdditionalCosts={true}
                                showAmortizationSchedule={true}
                                customConfig={{
                                    interestRateMax: 100,
                                    downPaymentPercentMax: 100,
                                    homePriceEditable: true
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            */}
            
            {/* Safety Tips Section at the bottom of the page (visible only on mobile) */}
            <div className="container mobile-only-safety-tips" style={{ marginBottom: '50px' }}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="safety-tips-box" style={{
                            padding: '24px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                marginBottom: '15px',
                                color: '#333'
                            }}>Safety Tips</h3>
                            
                            <ul style={{
                                listStyleType: 'disc',
                                paddingLeft: '20px',
                                marginBottom: '0'
                            }}>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    It's safer not to pay ahead for inspections
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Ask friends or somebody you trust to accompany you for viewing.
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Look around the apartment to ensure it meets your expectations
                                </li>
                                <li style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                                    Don't pay before hand if they won't let you move in immediately
                                </li>
                                <li style={{ marginBottom: '0', fontSize: '14px', color: '#555' }}>
                                    Verify that the account details belong to the right property owner before initiating payment
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Payment Modal */}
            {showPaymentModal && (
              <PaymentModal 
                isOpen={showPaymentModal} 
                onClose={() => setShowPaymentModal(false)}
                property={PropertyDetails}
              />
            )}
            {showLoginPopup && <LoginPopup handlePopup={() => setShowLoginPopup(false)} />}
        </div>
    );
};


// Safety tips section for the property
const SafetyTips = () => {
    return (
        <div className="safety-tips-container">
            <SafetyTipsSection />
        </div>
    );
};

export default PropertyDetail;
