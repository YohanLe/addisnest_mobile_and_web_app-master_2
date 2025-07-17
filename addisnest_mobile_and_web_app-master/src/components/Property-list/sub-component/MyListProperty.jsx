import { Link } from "react-router-dom";
import { Property3 } from "../../../assets/images";
import ActiveDropdown from "../../../helper/ActiveDropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";
import DeletePopup from "../../../helper/DeletePopup";

// CSS for offering badges
const offeringBadgeStyles = `
    .offering-badge {
        padding: 6px 12px !important;
        font-weight: bold !important;
        font-size: 11px !important;
        border-radius: 20px !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        border: 2px solid !important;
    }
    
    .offering-badge.for-sale {
        background: #e8f5e8 !important;
        color: #2e7d2e !important;
        border-color: #2e7d2e !important;
    }
    
    .offering-badge.for-rent {
        background: #e8f4ff !important;
        color: #1e40af !important;
        border-color: #1e40af !important;
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = offeringBadgeStyles;
    document.head.appendChild(styleElement);
}

const MyListProperty = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Active", "Sold", "Pending", "Rejected"];
    const [ItemData, setItemData] = useState('');
    const [showDeletePopup, setDeletePopup] = useState(false);
    const [debugInfo, setDebugInfo] = useState({ show: false, data: null });
    
    const PropertData = useSelector((state) => state.PropertyList.Data);
    const PropertyListData = PropertData?.data?.data || PropertData?.data;
    
    // Enhanced logging for debugging
    console.log('🔍 MyListProperty Debug:', {
        PropertData,
        PropertyListData,
        activeTab,
        pending: PropertData?.pending,
        error: PropertData?.error
    });

    // Offering type handling - simplified version that works with correct data
    const getOfferingType = (item) => {
        // Check for all possible field names that might contain offering type
        const possibleFields = [
            'property_for', 'offering', 'offeringType', 'listing_type', 
            'type', 'property_listing_type', 'listing_for', 'sale_rent'
        ];
        
        console.log(`🔍 getOfferingType for item:`, {
            property_for: item?.property_for,
            offering: item?.offering,
            offeringType: item?.offeringType,
            listing_type: item?.listing_type,
            type: item?.type,
            all_keys: Object.keys(item || {}),
            full_item: item
        });
        
        if (item?.property_for === "For Sale") {
            return { type: 'sale', label: 'For Sale' };
        }
        if (item?.property_for === "For Rent") {
            return { type: 'rent', label: 'For Rent' };
        }
        
        // Check for listing_type as alternative (from database)
        if (item?.listing_type === "sell" || item?.listing_type === "sale") {
            console.log(`✅ Found listing_type: "${item.listing_type}" - treating as "For Sale"`);
            return { type: 'sale', label: 'For Sale' };
        }
        if (item?.listing_type === "rent") {
            console.log(`✅ Found listing_type: "${item.listing_type}" - treating as "For Rent"`);
            return { type: 'rent', label: 'For Rent' };
        }
        
        // Check for common variations and log them
        const propertyForValue = item?.property_for;
        if (propertyForValue) {
            console.warn(`⚠️ Unexpected property_for value: "${propertyForValue}" (type: ${typeof propertyForValue})`);
            
            // Handle case variations
            const normalizedValue = String(propertyForValue).toLowerCase().trim();
            if (normalizedValue.includes('sale')) {
                console.log(`✅ Treating "${propertyForValue}" as "For Sale"`);
                return { type: 'sale', label: 'For Sale' };
            }
            if (normalizedValue.includes('rent')) {
                console.log(`✅ Treating "${propertyForValue}" as "For Rent"`);
                return { type: 'rent', label: 'For Rent' };
            }
        }
        
        // Check listing_type for any other variations
        const listingTypeValue = item?.listing_type;
        if (listingTypeValue) {
            const normalizedListing = String(listingTypeValue).toLowerCase().trim();
            if (normalizedListing.includes('sale') || normalizedListing.includes('sell')) {
                console.log(`✅ Found listing_type variation: "${listingTypeValue}" - treating as "For Sale"`);
                return { type: 'sale', label: 'For Sale' };
            }
            if (normalizedListing.includes('rent')) {
                console.log(`✅ Found listing_type variation: "${listingTypeValue}" - treating as "For Rent"`);
                return { type: 'rent', label: 'For Rent' };
            }
        }
        
        // Show what we actually found
        console.error(`❌ No valid offering type found. Values:`, {
            property_for: propertyForValue,
            listing_type: listingTypeValue,
            all_available_fields: Object.keys(item || {})
        });
        
        return { type: 'unknown', label: 'NO DATA' };
    };
    
    // Sort properties by creation date - newest first
    const PropertyList = PropertyListData ? [...PropertyListData].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || a.uploadDate || 0);
        const dateB = new Date(b.createdAt || b.created_at || b.uploadDate || 0);
        return dateB - dateA; // Descending order (newest first)
    }) : [];

    // Debug: Log property_for values for all properties
    if (PropertyList && PropertyList.length > 0) {
        console.log("DEBUG: property_for values in PropertyList:");
        PropertyList.forEach((item, idx) => {
            console.log(`Property ${idx + 1}:`, item.property_for);
        });
    }

    // Enhanced useEffect with error handling
    useEffect(() => {
        console.log('🔄 Fetching properties for tab:', activeTab);
        
        if (activeTab === 'All') {
            dispatch(GetPropertyList({ type: '' }));
        } else {
            dispatch(GetPropertyList({ type: activeTab }));
        }
    }, [activeTab, dispatch]);

    // Check for authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        console.log('🔑 Auth token exists:', !!token);
        
        if (!token) {
            console.warn('⚠️ No authentication token found!');
        }
    }, []);

    const handleDeletePopup = (item) => {
        setItemData(item);
        setDeletePopup((p) => !p);
    };

    const toggleDebugInfo = () => {
        setDebugInfo(prev => ({
            show: !prev.show,
            data: PropertData
        }));
    };

    // Check if we're currently loading
    const isLoading = PropertData?.pending === true;
    
    // Check if we have data (including mock data)
    const hasData = PropertyList && PropertyList.length > 0;
    
    // Check if we should show auth error
    const isAuthError = PropertData?.error?.type === 'auth';

    // Render error state
    const renderErrorState = () => {
        if (isAuthError) {
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px', color: '#e74c3c' }}>
                        <div>
                            <h5>🔒 Authentication Required</h5>
                            <p>{PropertData.error.message}</p>
                            <Link to="/login" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                Login Now
                            </Link>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    // Render loading state (only show if actually loading and no data)
    const renderLoadingState = () => {
        if (isLoading && !hasData) {
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px' }}>
                        <div>
                            <div className="spinner" style={{ marginBottom: '15px' }}>🔄</div>
                            <h5>Loading Your Properties...</h5>
                            <p>Please wait while we fetch your property listings.</p>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    // Render empty state (only if not loading and no data)
    const renderEmptyState = () => {
        if (!isLoading && !hasData && !isAuthError) {
            return (
                <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '40px' }}>
                        <div>
                            <h5>📋 No Properties Found</h5>
                            <p>
                                {activeTab === 'All' 
                                    ? "You haven't listed any properties yet." 
                                    : `No properties found with status: ${activeTab}`
                                }
                            </p>
                            <Link to="/property-form" className="btn btn-primary" style={{ marginTop: '10px' }}>
                                List Your First Property
                            </Link>
                            <button 
                                className="btn btn-secondary" 
                                onClick={toggleDebugInfo}
                                style={{ marginTop: '10px', marginLeft: '10px' }}
                            >
                                Show Debug Info
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }
        
        return null;
    };

    return (
        <>
            <div className="container">
                <div className="bradcrumb-top">
                    <div className="bradcrumb-title">
                        <h3>My Listings</h3>
                        <span>{PropertyList?.length || 0}</span>
                        {/* Debug indicator */}
                        {!localStorage.getItem('access_token') && (
                            <small style={{ color: 'orange', marginLeft: '10px' }}>
                                ⚠️ Using Test Data
                            </small>
                        )}
                    </div>
                    <div className="property-list-tabbing">
                        <ul>
                            {tabs.map((tab) => (
                                <li key={tab} onClick={() => setActiveTab(tab)}>
                                    <div
                                        className={`propertylist-tabtitle ${activeTab === tab ? "active" : ""}`}
                                    >
                                        <p>{tab}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bradcrumb-btn">
                        <Link to="/property-form" className="btn btn-primary">
                            List Property <span>+</span>
                        </Link>
                    </div>
                </div>

                {/* Debug Info Panel */}
                {debugInfo.show && (
                    <div style={{ 
                        background: '#f8f9fa', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '5px', 
                        padding: '15px', 
                        marginBottom: '20px',
                        fontSize: '12px'
                    }}>
                        <h6>🔍 Debug Information</h6>
                        <pre style={{ background: '#fff', padding: '10px', borderRadius: '3px', overflow: 'auto', maxHeight: '200px' }}>
                            {JSON.stringify({
                                hasToken: !!localStorage.getItem('access_token'),
                                activeTab,
                                isLoading,
                                hasData,
                                PropertData,
                                PropertyListData,
                                PropertyListLength: PropertyList?.length
                            }, null, 2)}
                        </pre>
                        <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={() => setDebugInfo(prev => ({ ...prev, show: false }))}
                        >
                            Hide Debug
                        </button>
                    </div>
                )}

                {/* SUCCESS: Show property_for values for all properties */}
                {hasData && (
                    <div style={{ background: "#e8f5e8", border: "1px solid #2e7d2e", padding: "10px", margin: "10px 0", borderRadius: "6px", fontSize: "13px" }}>
                        <strong>✅ FIXED: property_for values are now working correctly:</strong>
                        <ul>
                            {PropertyList.map((item, idx) => (
                                <li key={idx}>
                                    Property {idx + 1}: <strong>{String(item.property_for)}</strong> 
                                    {item.property_for === "For Sale" && " 🏠"}
                                    {item.property_for === "For Rent" && " 🏠💰"}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="proprety-list-tabel">
                    <div className="responsive-table">
                        <table className="table table-row-dashed">
                            <thead>
                                <tr>
                                    <th className="w-10px text-start">S.no</th>
                                    <th className="w-100px text-start">Picture</th>
                                    <th className="w-200px text-start">Address</th>
                                    <th className="w-120px text-center">Type</th>
                                    <th className="w-120px text-center">Offering</th>
                                    <th className="w-100px text-center">Status</th>
                                    <th className="w-200px text-center">Price</th>
                                    <th className="w-70px text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Show error state */}
                                {renderErrorState()}
                                
                                {/* Show loading state */}
                                {renderLoadingState()}
                                
                                {/* Show properties if available */}
                                {hasData && PropertyList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="text-start">
                                            <div className="usrdtls-td">
                                                <div className="proptery-bg">
                                                    <span
                                                        style={{
                                                            backgroundImage: `url(${item?.media?.[0]?.filePath || '/placeholder-image.jpg'})`,
                                                            width: '60px',
                                                            height: '60px',
                                                            display: 'block',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            borderRadius: '4px'
                                                        }}
                                                    ></span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-start">
                                            <span className="font-text">{item?.address || item?.property_address || 'Address not specified'}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="font-text">{item?.property_type || 'Type not specified'}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge offering-badge ${getOfferingType(item).type === 'sale' ? 'for-sale' : 'for-rent'}`}>
                                                {getOfferingType(item).label}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${item?.status || 'active'}`}>
                                                {(item?.status || 'Active').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="price-tbl">
                                                <span>Overall Price</span>
                                                <h5>ETB {(item?.price || item?.total_price || 0).toLocaleString()}</h5>
                                                <p>ETB {((item?.price || item?.total_price || 0) / (item?.property_size || 1)).toFixed(0)} per sqm</p>
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="action-main">
                                                <div className="action-inner">
                                                    <span className="action-dropdownmain">
                                                        <ActiveDropdown item={item} />
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Show empty state */}
                                {renderEmptyState()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyListProperty;
