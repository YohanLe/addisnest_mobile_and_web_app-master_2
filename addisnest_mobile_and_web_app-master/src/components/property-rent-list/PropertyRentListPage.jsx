import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetAllPropertyListings } from '../../Redux-store/Slices/HomeSlice';
import { Property1, Property2, Property3 } from '../../assets/images';

const PropertyRentListPage = () => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home?.PropertyListings || { data: null, pending: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [rentalTerm, setRentalTerm] = useState('any');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Fetch all property listings
    dispatch(GetAllPropertyListings({ type: 'rent', page: 1, limit: 50 }));
  }, [dispatch]);

  // Fallback properties if API fails or is pending
  const fallbackProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in City Center',
      address: 'Bole, Addis Ababa',
      price: 55000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      propertyType: 'Apartment',
      imageUrl: Property1,
      featured: true,
      rentalTerm: 'Long-term'
    },
    {
      _id: '2',
      title: 'Luxury Villa with Garden',
      address: 'CMC, Addis Ababa',
      price: 120000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3200,
      propertyType: 'House',
      imageUrl: Property2,
      featured: false,
      rentalTerm: 'Long-term'
    },
    {
      _id: '3',
      title: 'Cozy Studio for Professionals',
      address: 'Kazanchis, Addis Ababa',
      price: 28000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 800,
      propertyType: 'Studio',
      imageUrl: Property3,
      featured: false,
      rentalTerm: 'Short-term'
    },
    {
      _id: '4',
      title: 'Family Home with Beautiful View',
      address: 'Ayat, Addis Ababa',
      price: 78000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2200,
      propertyType: 'House',
      imageUrl: Property2,
      featured: true,
      rentalTerm: 'Long-term'
    },
    {
      _id: '5',
      title: 'Penthouse with City Skyline View',
      address: 'Bole, Addis Ababa',
      price: 150000,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 1800,
      propertyType: 'Apartment',
      imageUrl: Property1,
      featured: false,
      rentalTerm: 'Long-term'
    },
    {
      _id: '6',
      title: 'Spacious Apartment Near Park',
      address: 'Gerji, Addis Ababa',
      price: 42000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      propertyType: 'Apartment',
      imageUrl: Property3,
      featured: false,
      rentalTerm: 'Long-term'
    },
    {
      _id: '7',
      title: 'Modern Townhouse in Gated Community',
      address: 'Lebu, Addis Ababa',
      price: 67000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      propertyType: 'Townhouse',
      imageUrl: Property1,
      featured: true,
      rentalTerm: 'Long-term'
    },
    {
      _id: '8',
      title: 'Elegant Villa with Pool',
      address: 'Old Airport, Addis Ababa',
      price: 180000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 4000,
      propertyType: 'Villa',
      imageUrl: Property2,
      featured: false,
      rentalTerm: 'Long-term'
    },
    {
      _id: '9',
      title: 'Affordable Studio for Students',
      address: 'Mexico, Addis Ababa',
      price: 18000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      propertyType: 'Studio',
      imageUrl: Property3,
      featured: false,
      rentalTerm: 'Short-term'
    }
  ];

  // Use data from API if available, otherwise use fallback
  const properties = data?.data?.length > 0 ? data.data : fallbackProperties;

  // Format price to display with commas
  const formatPrice = (property) => {
    const price = property.price?.amount || property.price || 0;
    const currency = property.price?.currency || '$';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price).replace('$', currency) + '/month';
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
  
  const getLotSize = (property) => {
    if (property.specifications?.lotSize?.size) {
      const size = property.specifications.lotSize.size;
      const unit = property.specifications.lotSize.unit || 'sqft';
      
      if (unit === 'acre') {
        return { size, unit: 'acre' };
      } else {
        return { size, unit: 'sq ft' };
      }
    }
    return null;
  };
  
  const getAddress = (property) => {
    if (property.location) {
      return `${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zipCode}`;
    }
    return property.address || '';
  };
  
  const getListingAgent = (property) => {
    if (property.agent) {
      const name = `${property.agent.firstName || ''} ${property.agent.lastName || ''}`.trim();
      const company = property.agent.company || '';
      return company ? `${name} • ${company}` : name;
    }
    return property.listingAgent || '';
  };
  
  const getListingTags = (property) => {
    const tags = [];
    
    if (property.listingSource === 'REDFIN') {
      tags.push('LISTED BY REDFIN');
    }
    
    if (property.virtualTour) {
      if (property.virtualTour.type === '3d') {
        tags.push('3D WALKTHROUGH');
      } else if (property.virtualTour.type === 'video') {
        tags.push('VIDEO TOUR');
      } else {
        tags.push('3D & VIDEO TOUR');
      }
    }
    
    if (property.listingTags?.includes('HOT HOME') || property.featured) {
      tags.push('HOT HOME');
    }
    
    if (property.rentalTerm) {
      tags.push(property.rentalTerm.toUpperCase());
    }
    
    return tags;
  };

  return (
    <div className="property-rent-list-page py-5">
      <div className="container">
        <div className="page-header mb-4">
          <h1 className="mb-2" style={{ fontSize: '2.2rem', fontWeight: '700', color: '#333' }}>Properties for Rent</h1>
          <p className="text-muted">Find the perfect rental property in Ethiopia</p>
        </div>
        
        <div className="filters-section mb-4" style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', 
          padding: '24px',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s ease'
        }}>
          <div className="search-filter mb-4">
            <div className="input-group" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <input 
                type="text" 
                placeholder="Search by location, property type, or keyword..." 
                className="form-control form-control-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px 0 0 8px',
                  padding: '12px 16px',
                  fontSize: '16px'
                }}
              />
              <button 
                className="btn btn-primary px-4"
                style={{
                  backgroundColor: '#a4ff2a',
                  color: '#222',
                  border: 'none',
                  fontWeight: 600,
                  borderRadius: '0 8px 8px 0',
                  padding: '12px 24px'
                }}
              >
                <i className="bi bi-search me-2"></i>
                Search
              </button>
            </div>
          </div>
          
          <div className="d-flex flex-wrap gap-3">
            <div className="filter-item" style={{ minWidth: '200px', flex: '1' }}>
              <label className="form-label fw-medium mb-2">Monthly Rent</label>
              <select 
                className="form-select" 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '15px',
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="any">Any Price</option>
                <option value="10000-30000">ETB 10,000 - 30,000</option>
                <option value="30000-60000">ETB 30,000 - 60,000</option>
                <option value="60000-100000">ETB 60,000 - 100,000</option>
                <option value="100000+">ETB 100,000+</option>
              </select>
            </div>
            
            <div className="filter-item" style={{ minWidth: '200px', flex: '1' }}>
              <label className="form-label fw-medium mb-2">Property Type</label>
              <select 
                className="form-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '15px',
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="room">Room</option>
              </select>
            </div>
            
            <div className="filter-item" style={{ minWidth: '200px', flex: '1' }}>
              <label className="form-label fw-medium mb-2">Bedrooms</label>
              <select 
                className="form-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '15px',
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            <div className="filter-item" style={{ minWidth: '200px', flex: '1' }}>
              <label className="form-label fw-medium mb-2">Rental Term</label>
              <select 
                className="form-select"
                value={rentalTerm}
                onChange={(e) => setRentalTerm(e.target.value)}
                style={{ 
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '15px',
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="any">Any</option>
                <option value="short-term">Short-term</option>
                <option value="long-term">Long-term</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="property-results">
          <div className="results-header d-flex justify-content-between align-items-center mb-4">
            <h3 className="m-0" style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333' }}>
              <span style={{ color: '#0066cc' }}>{properties.length}</span> Properties Found
            </h3>
            <div className="view-options">
              <div className="btn-group" role="group" aria-label="View options">
                <button 
                  className="btn active" 
                  style={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '1px solid #dee2e6',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    padding: '8px 16px',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-grid-3x3-gap-fill me-2"></i>Grid
                </button>
                <button 
                  className="btn" 
                  style={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #dee2e6',
                    borderRadius: '0 6px 6px 0',
                    padding: '8px 16px',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-list-ul me-2"></i>List
                </button>
              </div>
            </div>
          </div>
          
          {pending ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading properties...</p>
            </div>
          ) : properties.length > 0 ? (
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {properties.map((property) => (
                <div key={property._id} style={{ flex: '1 0 calc(33.33% - 15px)', minWidth: '300px', maxWidth: 'calc(33.33% - 15px)', marginBottom: '15px' }}>
                    <div 
                      className="property-card"
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                        height: '100%',
                        border: '1px solid #f0f0f0',
                        position: 'relative',
                        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0, 0, 0, 0.15)';
                        e.currentTarget.querySelector('.property-image img').style.transform = 'scale(1.05)';
                        e.currentTarget.querySelector('.property-tag') && 
                          (e.currentTarget.querySelector('.property-tag').style.background = '#98e020');
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
                        e.currentTarget.querySelector('.property-image img').style.transform = 'scale(1)';
                        e.currentTarget.querySelector('.property-tag') && 
                          (e.currentTarget.querySelector('.property-tag').style.background = '#a4ff2a');
                      }}
                    >
                    <div 
                      className="property-image"
                      style={{
                        position: 'relative',
                        height: '160px',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
                        zIndex: 1
                      }}></div>
                      <img 
                        src={property.images?.[0]?.url || property.imageUrl || Property1} 
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease',
                          transform: 'scale(1)'
                        }}
                      />
                      
                      {/* For rent tag */}
                      <div 
                        className="property-tag"
                        style={{
                          position: 'absolute',
                          top: '20px',
                          left: '20px',
                          background: '#a4ff2a',
                          color: '#222',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '5px 15px',
                          borderRadius: '6px',
                          zIndex: 3,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        For rent
                      </div>
                      
                      {/* Property tags (3D TOUR, HOT HOME, etc.) */}
                      {getListingTags(property).map((tag, index) => (
                        <div 
                          key={index}
                          style={{
                            position: 'absolute',
                            top: index === 0 ? '12px' : `${12 + (index * 30)}px`,
                            left: '12px',
                            background: tag === 'HOT HOME' ? '#ff5e50' : 
                                      tag === 'LISTED BY REDFIN' ? '#d42928' : 
                                      tag.includes('TERM') ? '#0066cc' : '#614bb3',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            zIndex: 2
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                      
                      {/* Year tag in top right if it exists */}
                      {property.yearBuilt && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '60px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          {property.yearBuilt}
                        </div>
                      )}
                      
                      {/* Favorite heart icon */}
                      <button
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                          zIndex: 2
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#777" viewBox="0 0 16 16">
                          <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                        </svg>
                      </button>
                    </div>

                      <div style={{ padding: '18px 22px' }}>
                      {/* Price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#333' }}>
                          {formatPrice(property)}
                        </h3>
                        <button
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: 0
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#777" viewBox="0 0 16 16">
                            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                          </svg>
                        </button>
                      </div>
                      
                      {/* Property specs */}
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px',
                        fontSize: '0.95rem',
                        color: '#333',
                        marginBottom: '10px'
                      }}>
                        <span>{getBeds(property)} beds</span>
                        <span>•</span>
                        <span>{getBaths(property)} baths</span>
                        <span>•</span>
                        <span>{getArea(property).size.toLocaleString()} {getArea(property).unit}</span>
                        {getLotSize(property) && (
                          <>
                            <span>•</span>
                            <span>{getLotSize(property).size.toLocaleString()} {getLotSize(property).unit} {getLotSize(property).unit === 'acre' ? 'lot' : ''}</span>
                          </>
                        )}
                      </div>
                      
                      {/* Address */}
                      <div style={{ 
                        fontSize: '0.95rem',
                        color: '#333',
                        marginBottom: '8px'
                      }}>
                        {getAddress(property)}
                      </div>
                      
                      {/* Listing agent/source */}
                      <div style={{ 
                        fontSize: '0.85rem',
                        color: '#666',
                        marginTop: '10px'
                      }}>
                        {getListingAgent(property)}
                      </div>
                    </div>
                    <Link 
                      to={`/property/${property._id}`} 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        textDecoration: 'none',
                        color: 'transparent'
                      }}
                      aria-label={`View details for ${property.title}`}
                    >
                      <span className="sr-only">View property details</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-5">
              <div className="mb-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="mb-2">No rental properties match your search criteria</h3>
              <p className="text-muted">Try adjusting your filters or search terms</p>
            </div>
          )}
          
          {properties.length > 0 && (
            <div className="pagination-container text-center mt-5 mb-4">
              <nav aria-label="Property listing pagination">
                <ul className="pagination justify-content-center" style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
                  <li className="page-item" style={{ margin: '0 5px' }}>
                    <a 
                      className="page-link" 
                      href="#" 
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                        e.target.style.color = '#333';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.color = '#666';
                      }}
                    >
                      Previous
                    </a>
                  </li>
                  
                  <li className="page-item active" style={{ margin: '0 5px' }}>
                    <a 
                      className="page-link" 
                      href="#"
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: '1px solid #0066cc',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      1
                    </a>
                  </li>
                  
                  <li className="page-item" style={{ margin: '0 5px' }}>
                    <a 
                      className="page-link" 
                      href="#"
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#333',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      2
                    </a>
                  </li>
                  
                  <li className="page-item" style={{ margin: '0 5px' }}>
                    <a 
                      className="page-link" 
                      href="#"
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#333',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                      }}
                    >
                      3
                    </a>
                  </li>
                  
                  <li className="page-item" style={{ margin: '0 5px' }}>
                    <a 
                      className="page-link" 
                      href="#"
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        backgroundColor: 'white',
                        color: '#333',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                        e.target.style.color = '#333';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#333';
                      }}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyRentListPage;
