import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GetAllPropertyListings } from '../../Redux-store/Slices/HomeSlice';
import { GetUserPayments } from '../../Redux-store/Slices/PaymentSlice';
import { isAuthenticated } from '../../utils/tokenHandler';
import { Property1, Property2, Property3 } from '../../assets/images';

// Utility function to fix broken image URLs
const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return Property1; // Default fallback

  // Use VITE_API_BASE_URL to construct the base URL for images
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api';
  const baseUrl = apiBaseUrl.replace('/api', '/uploads');

  // Extract the filename from the URL, handling various formats
  const filename = imageUrl.split('/').pop();

  // If the filename is empty or just a placeholder, return a default
  if (!filename || filename === 'undefined' || filename === 'null') {
    return Property1;
  }

  // Construct the full URL
  const fullUrl = `${baseUrl}/${filename}`;

  // Check if the URL is one of the known placeholders that should not be modified
  if (imageUrl.includes('unsplash') || imageUrl.includes('placeholder')) {
    return imageUrl;
  }

  return fullUrl;
};
import { applyFilters, parseQueryParams, createFilterParams, FILTER_OPTIONS } from '../../utils/propertyFilters';
import '../../assets/css/mobile-property-list.css';
import api from '../../Apis/Api';
import Select from 'react-select';
import { removeDuplicateProperties, logPropertyStats } from '../../utils/propertyDeduplication';

const PropertyListPage = ({ isHomePage = false, propertyCount, propertyType: homePagePropertyType }) => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home?.HomeData || { data: null, pending: false });
  const userPayments = useSelector((state) => state.Payments?.userPayments || { data: null, pending: false });
  const isLoggedIn = isAuthenticated();
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const [mixedProperties, setMixedProperties] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [priceRange, setPriceRange] = useState(queryParams.get('priceRange') || 'any');
  const [propertyType, setPropertyType] = useState(homePagePropertyType || queryParams.get('propertyType') || 'all');
  const [bedrooms, setBedrooms] = useState(queryParams.get('bedrooms') || 'any');
  const [bathrooms, setBathrooms] = useState(queryParams.get('bathrooms') || 'any');
  const [regionalState, setRegionalState] = useState(queryParams.get('regionalState') || 'all');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'newest');
  const [offeringType, setOfferingType] = useState(
    homePagePropertyType === 'rent' ? 'For Rent' : 
    homePagePropertyType === 'sell' ? 'For Sale' : 
    homePagePropertyType === 'mixed' ? 'mixed' :
    location.search.includes('rent') ? 'For Rent' : 'For Sale'
  );
  const [filtersVisible, setFiltersVisible] = useState(!isHomePage);
  const [totalPropertyCount, setTotalPropertyCount] = useState(0);
  const navigate = useNavigate();

  // Normalization function for partial matching
  const normalized = (text) => text.toLowerCase().trim();

  // Convert regional state value to react-select format
  const getRegionalStateOption = (value) => {
    if (!value || value === 'all') {
      return FILTER_OPTIONS.regionalStates[0]; // "All Regions"
    }
    return FILTER_OPTIONS.regionalStates.find(option => option.value === value) || FILTER_OPTIONS.regionalStates[0];
  };

  // Handle regional state change for react-select
  const handleRegionalStateChange = (selectedOption) => {
    setRegionalState(selectedOption ? selectedOption.value : 'all');
  };

  // Custom filter function for react-select with partial matching
  const customFilterOption = (option, inputValue) => {
    if (!inputValue) return true;
    const normalizedInput = normalized(inputValue);
    const normalizedLabel = normalized(option.label);
    
    // Support partial matching for common abbreviations and partial names
    // For "Addis Ababa City Administration", allow matching:
    // - "addis" -> matches "Addis Ababa"
    // - "addis a" -> matches "Addis Ababa"
    // - "ababa" -> matches "Addis Ababa"
    // - "city" -> matches "City Administration"
    // - "admin" -> matches "Administration"
    
    return normalizedLabel.includes(normalizedInput) || 
           normalizedLabel.split(' ').some(word => word.startsWith(normalizedInput));
  };

  // Use the filter utility to apply filters
  const handleApplyFilters = () => {
    applyFilters(navigate, {
      searchQuery,
      priceRange,
      propertyType,
      bedrooms,
      bathrooms,
      regionalState,
      sortBy,
      offeringType
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Use the utility function to parse filter values from URL
    const filterValues = parseQueryParams(queryParams);
    
    const currentOfferingType = homePagePropertyType === 'rent' ? 'For Rent' : 
                               homePagePropertyType === 'sell' ? 'For Sale' : 
                               homePagePropertyType === 'mixed' ? 'mixed' :
                               filterValues.offeringType;
    const currentPropertyType = homePagePropertyType || filterValues.propertyType;

    // Update local state with the parsed values
    setSearchQuery(filterValues.searchQuery);
    setPriceRange(filterValues.priceRange);
    setPropertyType(currentPropertyType);
    setBedrooms(filterValues.bedrooms);
    setBathrooms(filterValues.bathrooms);
    setRegionalState(filterValues.regionalState);
    setSortBy(filterValues.sortBy);
    setOfferingType(currentOfferingType);

    // If propertyType is "mixed", fetch both sale and rent properties
    if (homePagePropertyType === 'mixed') {
      fetchMixedProperties();
    } else {
      // Create filter parameters for API request using our utility function
      const filterParams = createFilterParams({
        ...filterValues,
        offeringType: currentOfferingType,
        propertyType: currentPropertyType,
        page: 1,
        limit: 50
      });
      
      // Fetch properties with the filter parameters
      dispatch(GetAllPropertyListings(filterParams));
    }

    if (isLoggedIn) {
      dispatch(GetUserPayments());
    }
    
    // Fetch total property count
    fetchTotalPropertyCount();
  }, [dispatch, location.search, isLoggedIn, homePagePropertyType]);
  
  // Function to fetch mixed properties (both sale and rent)
  const fetchMixedProperties = async () => {
    try {
      console.log('Fetching mixed properties...');
      
      // Fetch ALL properties in a single call instead of separate calls
      const response = await axios.get('/api/properties', {
        params: {
          page: 1,
          limit: 50, // Get more properties to ensure we have variety
          // Don't filter by offeringType - get all properties
        }
      });

      const allProperties = response.data?.data || [];
      console.log('Total properties fetched:', allProperties.length);
      
      // Log property stats before deduplication
      logPropertyStats(allProperties, 'before deduplication');
      
      // Remove duplicates based on _id
      const uniqueProperties = removeDuplicateProperties(allProperties);
      
      console.log('Unique properties after deduplication:', uniqueProperties.length);
      
      // Log property stats after deduplication
      logPropertyStats(uniqueProperties, 'after deduplication');
      
      // Shuffle the array to mix different property types
      const shuffledProperties = uniqueProperties.sort(() => Math.random() - 0.5);
      
      // Update the mixedProperties state
      setMixedProperties(shuffledProperties);
      
    } catch (error) {
      console.error('Error fetching mixed properties:', error);
    }
  };

  // Function to fetch the total property count from the API
  const fetchTotalPropertyCount = async () => {
    try {
      const response = await axios.get('/api/properties/count');
      if (response.data && response.data.total) {
        setTotalPropertyCount(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching property count:', error);
      // If the API call fails, fall back to using the properties.length
    }
  };

  // Process user payments to identify purchased properties
  useEffect(() => {
    if (userPayments.data && userPayments.data.success && data && data.data) {
      // Extract property IDs from completed payments
      const purchasedPropertyIds = userPayments.data.data
        .filter(payment => payment.status === 'completed')
        .map(payment => payment.property?._id);

      // Find purchased properties in the property list
      const purchased = data.data.filter(property => 
        purchasedPropertyIds.includes(property._id)
      );

      setPurchasedProperties(purchased);
    }
  }, [userPayments.data, data]);

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Use actual data from database or mixed properties for home page
  const allProperties = homePagePropertyType === 'mixed' ? mixedProperties : (data?.data || []);
  
  // Filter out purchased properties from main list to avoid duplication
  const properties = allProperties.filter(property => 
    !purchasedProperties.some(p => p._id === property._id)
  );

  // Format price to display with commas
  const formatPrice = (property) => {
    const price = property.price?.amount || property.price || 0;
    const currency = property.price?.currency || 'ETB';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price).replace('$', currency + ' ');
  };
  
  // Get beds, baths, area from property
  const getBeds = (property) => {
    return property.specifications?.bedrooms || property.bedrooms || 0;
  };
  
  const getBaths = (property) => {
    return property.specifications?.bathrooms || property.bathrooms || 0;
  };
  
  const getArea = (property) => {
    const size = property.specifications?.area?.size || property.squareFeet || 0;
    const unit = property.specifications?.area?.unit || 'sqft';
    return { size, unit };
  };
  
  const getAddress = (property) => {
    const subCity = property?.address?.subCity || property?.address?.sub_city || property?.sub_city;
    const city = property?.address?.city;
    const regionalState = property?.address?.regionalState || property?.address?.state || property?.regional_state || property?.state;

    // Build address array with available components
    const addressParts = [subCity, city, regionalState].filter(Boolean);
    
    if (addressParts.length > 0) {
      return addressParts.join(', ');
    }
    
    // Fallback to legacy location field
    if (property.location) {
      const parts = [
        property.location.address,
        property.location.city,
        property.location.state
      ].filter(Boolean);
      if(parts.length > 0) return parts.join(', ');
    }
    
    // Fallback
    if(typeof property.address === 'string') return property.address
    return 'Unknown Location';
  };
  
  const getListingTags = (property) => {
    const tags = [];
    
    if (property.featured) {
      tags.push('HOT HOME');
    }
    
    return tags;
  };

  return (
    <div className="property-list-page py-5">
      <style>{`
        .property-card .property-image img:hover {
          transform: scale(1.1);
        }
      `}</style>
      <div className="container">
        {/* Purchased Properties Section */}
        {purchasedProperties.length > 0 && (
          <div className="purchased-properties mb-5">
            <h2 className="mb-4" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>
              Your Purchased Properties
            </h2>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {purchasedProperties.map((property) => (
                <div key={`purchased-${property._id}`} className="col-lg-4 col-md-6" style={{ flex: '0 0 calc(33.333% - 20px)' }}>
                  <div 
                    className="property-card"
                    style={{
                      background: '#000',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                      height: '100%',
                      border: '1px solid #222',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      marginBottom: '20px'
                    }}
                  >
                    <div 
                      className="property-image"
                      style={{
                        position: 'relative',
                        height: '200px',
                        overflow: 'hidden'
                      }}
                    >
                    <img 
                      src={fixImageUrl(property.images?.[0]?.url || property.imageUrl) || Property1} 
                      alt={property.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        display: 'block'
                      }}
                    />
                      
                      {/* Purchased tag */}
                      <div 
                        className="property-tag"
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          background: '#007bff',
                          color: '#fff',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '5px 15px',
                          borderRadius: '6px',
                          zIndex: 2
                        }}
                      >
                        Purchased
                      </div>
                    </div>

                  <div style={{ padding: '20px 20px 10px 20px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                      {formatPrice(property)}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px',
                      fontSize: '0.9rem',
                      color: '#e0e0e0',
                      marginBottom: '10px'
                    }}>
                      <span>{getBeds(property)} beds</span>
                      <span>•</span>
                      <span>{getBaths(property)} baths</span>
                      <span>•</span>
                      <span>{getArea(property).size} {getArea(property).unit}</span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: '#fff',
                      marginBottom: '5px'
                    }}>
                      {getAddress(property)}
                    </p>
                    
                    <p style={{ fontSize: '0.9rem', color: '#e0e0e0', marginBottom: '0' }}>
                      {property.title}
                    </p>
                  </div>
                    
                    <Link 
                      to={`/property/${property._id || '648a97f4d254d67c1e5f461b'}`} 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                      }}
                      aria-label={`View details for ${property.title}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isHomePage && (
          <div className="page-header mb-4">
            <h1 className="mb-2" style={{ fontSize: '2.2rem', fontWeight: '700', color: '#333' }}>
              <Link 
                to="/property-list" 
                style={{ textDecoration: 'none', color: '#333' }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  if (window.location.pathname === '/property-list') {
                    window.location.reload();
                  }
                }}
              >
                {location.search.includes('rent') ? 'Properties for Rent' : 'Properties for Sale'}
              </Link>
            </h1>
            <p className="text-muted">Find the perfect property to call home in Ethiopia</p>
          </div>
        )}
        
        {/* Apply Filters button moved to inside the filters section */}
        {/* Filter toggle button - Hide on home page */}
        {!isHomePage && (
          <div className="filters-toggle mb-3">
            <button 
              className="btn" 
              onClick={toggleFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: filtersVisible ? '#e8f7c4' : 'white',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#444',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
              </svg>
              {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        )}
        
        {/* Collapsible filters section - Hide on home page */}
        {!isHomePage && (
          <div 
            className="filters-section mb-4" 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', 
              padding: filtersVisible ? '20px' : '0',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              maxHeight: filtersVisible ? '1000px' : '0',
              opacity: filtersVisible ? 1 : 0,
              marginBottom: filtersVisible ? '24px' : '0'
            }}
          >
          <div className="filter-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Offering Type filter removed as it's now handled by the header navigation */}
            {/* Search Input */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  fontWeight: '500',
                  color: '#444'
                }}
              />
            </div>

            {/* Price Range Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Price Range</label>
              <select 
                className="form-select" 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.priceRanges.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Regional State Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Regional State</label>
              <select 
                className="form-select"
                value={regionalState}
                onChange={(e) => setRegionalState(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.regionalStates.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Property Type Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Property Type</label>
              <select 
                className="form-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.propertyTypes.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Bedrooms Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Bedrooms</label>
              <select 
                className="form-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.bedBathOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Bathrooms Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Bathrooms</label>
              <select 
                className="form-select"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.bedBathOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Sort By Filter */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Sort By</label>
              <select 
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  border: '1px solid #e8e8e8',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#444',
                  background: 'white',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
              >
                {FILTER_OPTIONS.sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            {/* Apply Filters button moved next to Sort By */}
            <div className="filter-item">
              <label className="form-label" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '8px', 
                color: '#444'
              }}>Apply</label>
              <button
                className="btn btn-primary"
                onClick={handleApplyFilters}
                style={{
                  backgroundColor: '#a4ff2a',
                  color: '#222',
                  border: 'none',
                  fontWeight: '700',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  width: '100%',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.07)',
                  height: '47px', // Match height of other filter inputs
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{ marginRight: '8px' }}
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Removed duplicate Apply Filters button as it's now next to Sort By */}
          </div>
        )}
        
        {/* Property results count */}
        <div className="results-header mb-4">
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333', marginBottom: '10px' }}>
            <span style={{ color: '#0066cc' }}>{totalPropertyCount > 0 ? totalPropertyCount : properties.length}</span> Properties Found
          </h3>
        </div>
        
        {/* Property listings */}
        {pending ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading properties...</p>
          </div>
        ) : (
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {/* If on home page and propertyCount is provided, limit the number of properties shown */}
            {(isHomePage && propertyCount ? properties.slice(0, propertyCount) : properties).map((property) => (
              <div key={property._id} className="col-lg-4 col-md-6" style={{ flex: '0 0 calc(33.333% - 20px)' }}>
                <div 
                  className="property-card"
                  style={{
                    background: '#000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    border: '1px solid #222',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    marginBottom: '20px'
                  }}
                >
                  <div 
                    className="property-image"
                    style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={fixImageUrl(property.images?.[0]?.url || property.imageUrl) || Property1} 
                      alt={property.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        display: 'block'
                      }}
                    />
                    
                    {/* Property offering type tag */}
                    <div 
                      className="property-tag"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        background: property.offeringType === 'For Rent' ? '#007bff' : '#a4ff2a',
                        color: property.offeringType === 'For Rent' ? '#fff' : '#222',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        padding: '5px 15px',
                        borderRadius: '6px',
                        zIndex: 2
                      }}
                    >
                      {property.offeringType || (location.search.includes('rent') ? 'For Rent' : 'For Sale')}
                    </div>
                  </div>

                  <div style={{ padding: '20px 20px 10px 20px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
                      {formatPrice(property)}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px',
                      fontSize: '0.9rem',
                      color: '#e0e0e0',
                      marginBottom: '10px'
                    }}>
                      <span>{getBeds(property)} beds</span>
                      <span>•</span>
                      <span>{getBaths(property)} baths</span>
                      <span>•</span>
                      <span>{getArea(property).size} {getArea(property).unit}</span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: '#fff',
                      marginBottom: '5px'
                    }}>
                      {getAddress(property)}
                    </p>
                    
                    <p style={{ fontSize: '0.9rem', color: '#e0e0e0', marginBottom: '0' }}>
                      {property.title}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/property/${property._id || '648a97f4d254d67c1e5f461b'}`} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1
                    }}
                    aria-label={`View details for ${property.title}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;
