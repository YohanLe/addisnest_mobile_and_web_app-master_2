import React, { useState, useEffect } from 'react';
import Api from '../../../../Apis/Api';
import { getPropertiesByUser } from '../../../../utils/netlifyApiHandler';
import { Link } from 'react-router-dom';
import { isAuthenticated, getTokenData } from '../../../../utils/tokenHandler';
import "../../../../assets/css/mobile-property-listings.css";
import "../../../../assets/css/manage-listings.css";

// Add inline styles for status badges and selects
const statusStyles = `
  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    min-width: 60px;
  }
  
  .status-badge.active {
    background-color: #e6f7e6;
    color: #4caf50;
  }
  
  .status-badge.sold {
    background-color: #e3f2fd;
    color: #2196f3;
  }
  
  .status-badge.rented {
    background-color: #e8f5e8;
    color: #28a745;
  }
  
  .status-badge.pending {
    background-color: #fff8e1;
    color: #ff9800;
  }
  
  .status-badge.rejected {
    background-color: #ffebee;
    color: #f44336;
  }
  
  .status-select {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    min-width: 80px;
  }
  
  .status-select.published {
    background-color: #e6f7e6;
    color: #4caf50;
  }
  
  .status-select.pending {
    background-color: #fff8e1;
    color: #ff9800;
  }
  
  .status-select.sold {
    background-color: #e3f2fd;
    color: #2196f3;
  }
  
  .status-select:hover {
    border-color: #999;
  }
  
  .status-select:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
  }
`;

// Inject styles into the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = statusStyles;
  document.head.appendChild(styleElement);
}

const PropertyAlert = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [availableLocations, setAvailableLocations] = useState([]);

  // Comprehensive Ethiopian regions and cities mapping
  const ethiopianLocations = [
    // Addis Ababa City Administration
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration', type: 'region' },
    { value: 'Addis Ababa', label: 'Addis Ababa', type: 'city', region: 'Addis Ababa City Administration' },
    { value: 'Arada', label: 'Arada', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Bole', label: 'Bole', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Gulele', label: 'Gulele', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Kirkos', label: 'Kirkos', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Kolfe Keranio', label: 'Kolfe Keranio', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Lideta', label: 'Lideta', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Nifas Silk-Lafto', label: 'Nifas Silk-Lafto', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Yeka', label: 'Yeka', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Akaky Kaliti', label: 'Akaky Kaliti', type: 'subcity', region: 'Addis Ababa City Administration' },
    { value: 'Addis Ketema', label: 'Addis Ketema', type: 'subcity', region: 'Addis Ababa City Administration' },
    
    // Oromia Region
    { value: 'Oromia Region', label: 'Oromia Region', type: 'region' },
    { value: 'Adama', label: 'Adama (Nazret)', type: 'city', region: 'Oromia Region' },
    { value: 'Jimma', label: 'Jimma', type: 'city', region: 'Oromia Region' },
    { value: 'Bishoftu', label: 'Bishoftu (Debre Zeit)', type: 'city', region: 'Oromia Region' },
    { value: 'Shashamane', label: 'Shashamane', type: 'city', region: 'Oromia Region' },
    { value: 'Ambo', label: 'Ambo', type: 'city', region: 'Oromia Region' },
    { value: 'Nekemte', label: 'Nekemte', type: 'city', region: 'Oromia Region' },
    { value: 'Sebeta', label: 'Sebeta', type: 'city', region: 'Oromia Region' },
    { value: 'Holeta', label: 'Holeta', type: 'city', region: 'Oromia Region' },
    
    // Amhara Region
    { value: 'Amhara Region', label: 'Amhara Region', type: 'region' },
    { value: 'Bahir Dar', label: 'Bahir Dar', type: 'city', region: 'Amhara Region' },
    { value: 'Gondar', label: 'Gondar', type: 'city', region: 'Amhara Region' },
    { value: 'Dessie', label: 'Dessie', type: 'city', region: 'Amhara Region' },
    { value: 'Debre Markos', label: 'Debre Markos', type: 'city', region: 'Amhara Region' },
    { value: 'Debre Birhan', label: 'Debre Birhan', type: 'city', region: 'Amhara Region' },
    { value: 'Kombolcha', label: 'Kombolcha', type: 'city', region: 'Amhara Region' },
    
    // Tigray Region
    { value: 'Tigray Region', label: 'Tigray Region', type: 'region' },
    { value: 'Mekelle', label: 'Mekelle', type: 'city', region: 'Tigray Region' },
    { value: 'Adigrat', label: 'Adigrat', type: 'city', region: 'Tigray Region' },
    { value: 'Axum', label: 'Axum', type: 'city', region: 'Tigray Region' },
    { value: 'Shire', label: 'Shire', type: 'city', region: 'Tigray Region' },
    
    // Dire Dawa City Administration
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration', type: 'region' },
    { value: 'Dire Dawa', label: 'Dire Dawa', type: 'city', region: 'Dire Dawa City Administration' },
    
    // Somali Region
    { value: 'Somali Region', label: 'Somali Region', type: 'region' },
    { value: 'Jijiga', label: 'Jijiga', type: 'city', region: 'Somali Region' },
    { value: 'Gode', label: 'Gode', type: 'city', region: 'Somali Region' },
    { value: 'Kebri Dehar', label: 'Kebri Dehar', type: 'city', region: 'Somali Region' },
    
    // Afar Region
    { value: 'Afar Region', label: 'Afar Region', type: 'region' },
    { value: 'Semera', label: 'Semera', type: 'city', region: 'Afar Region' },
    { value: 'Asaita', label: 'Asaita', type: 'city', region: 'Afar Region' },
    
    // Benishangul-Gumuz Region
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region', type: 'region' },
    { value: 'Asosa', label: 'Asosa', type: 'city', region: 'Benishangul-Gumuz Region' },
    
    // Gambela Region
    { value: 'Gambela Region', label: 'Gambela Region', type: 'region' },
    { value: 'Gambela', label: 'Gambela', type: 'city', region: 'Gambela Region' },
    
    // Harari Region
    { value: 'Harari Region', label: 'Harari Region', type: 'region' },
    { value: 'Harar', label: 'Harar', type: 'city', region: 'Harari Region' },
    
    // Sidama Region
    { value: 'Sidama Region', label: 'Sidama Region', type: 'region' },
    { value: 'Hawassa', label: 'Hawassa', type: 'city', region: 'Sidama Region' },
    { value: 'Yirgalem', label: 'Yirgalem', type: 'city', region: 'Sidama Region' },
    
    // South Ethiopia Region (formerly SNNPR)
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region', type: 'region' },
    { value: 'Wolaita Sodo', label: 'Wolaita Sodo', type: 'city', region: 'South Ethiopia Region' },
    { value: 'Arba Minch', label: 'Arba Minch', type: 'city', region: 'South Ethiopia Region' },
    { value: 'Hosanna', label: 'Hosanna', type: 'city', region: 'South Ethiopia Region' },
    
    // South West Ethiopia Peoples' Region
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region', type: 'region' },
    { value: 'Mizan Teferi', label: 'Mizan Teferi', type: 'city', region: 'South West Ethiopia Peoples\' Region' },
    
    // Central Ethiopia Region
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region', type: 'region' },
    { value: 'Ziway', label: 'Ziway', type: 'city', region: 'Central Ethiopia Region' }
  ];

  useEffect(() => {
    fetchListings();
  }, [currentPage, filter, locationFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!isAuthenticated()) {
        console.log('PropertyAlert - User not authenticated');
        setLoading(false);
        setListings([]);
        return;
      }

      const tokenData = getTokenData();
      console.log('PropertyAlert - Token data:', tokenData);
      
      if (!tokenData || (!tokenData.id && !tokenData._id)) {
        console.log('PropertyAlert - No valid user ID found in token data');
        setLoading(false);
        setListings([]);
        return;
      }

      // Get user ID from various possible fields
      const userId = tokenData.id || tokenData._id || tokenData.userId;
      console.log('PropertyAlert - Using user ID:', userId);
      
      // Fetch only the current user's properties using the new netlify handler
      const response = await getPropertiesByUser(userId);
      console.log('PropertyAlert - User Properties API Response:', response);
      
      // Handle MongoDB response format
      let allProperties = [];
      
      if (Array.isArray(response)) {
        allProperties = response;
      } else if (response && response.data) {
        allProperties = Array.isArray(response.data) ? response.data : [];
      } else if (response && typeof response === 'object') {
        allProperties = [response];
      }
      
      console.log('User properties:', allProperties);
      
      // Extract unique locations from database and map properly
      const uniqueLocations = new Set();
      allProperties.forEach(property => {
        if (property.address?.regionalState) {
          uniqueLocations.add(property.address.regionalState);
        }
      });
      
      // Set available locations from actual data, fallback to comprehensive Ethiopian locations
      const locationsFromData = Array.from(uniqueLocations).map(location => ({
        value: location,
        label: location,
        type: 'region'
      }));
      
      setAvailableLocations(locationsFromData.length > 0 ? locationsFromData : ethiopianLocations);
      
      // Apply status filter
      let filteredProperties = allProperties;
      if (filter !== 'all') {
        filteredProperties = allProperties.filter(property => 
          property.status && property.status.toLowerCase() === filter.toLowerCase()
        );
      }
      
      // Apply location filter if selected - check multiple address fields
      if (locationFilter !== 'all') {
        filteredProperties = filteredProperties.filter(property => 
          property.address?.regionalState === locationFilter ||
          property.address?.city === locationFilter ||
          property.address?.subCity === locationFilter
        );
      }
      
      // Apply search filter if present - include proper address mapping
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredProperties = filteredProperties.filter(property => 
          (property.title && property.title.toLowerCase().includes(searchLower)) ||
          (property.address?.city && property.address.city.toLowerCase().includes(searchLower)) ||
          (property.address?.subCity && property.address.subCity.toLowerCase().includes(searchLower)) ||
          (property.address?.regionalState && property.address.regionalState.toLowerCase().includes(searchLower)) ||
          (property.ownerName && property.ownerName.toLowerCase().includes(searchLower)) ||
          (property.owner?.firstName && property.owner.firstName.toLowerCase().includes(searchLower)) ||
          (property.owner?.lastName && property.owner.lastName.toLowerCase().includes(searchLower))
        );
      }
      
      // Sort by creation date (newest first)
      filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Simple pagination
      const itemsPerPage = 10;
      const totalItems = filteredProperties.length;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
      
      setTotalPages(calculatedTotalPages || 1);
      
      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
      
      setListings(paginatedProperties);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
      setListings([]);
      setTotalPages(1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchListings();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (listingId, newStatus) => {
    // Find the current listing to check its current status
    const currentListing = listings.find(listing => listing._id === listingId);
    if (!currentListing) {
      alert('Property not found.');
      return;
    }

    const currentStatus = currentListing.status?.toLowerCase();
    const targetStatus = newStatus.toLowerCase();

    // BUSINESS RULE: Users cannot change status to 'active' - only admins can approve properties
    if (targetStatus === 'active') {
      alert('Only administrators can approve properties to Active status. Your property will remain Pending until admin approval.');
      return;
    }

    // Validate status transitions according to business rules
    if (currentStatus === 'sold' || currentStatus === 'rented') {
      alert(`Cannot change property status from ${currentStatus.toUpperCase()}. This status is permanent.`);
      return;
    }

    if (currentStatus !== 'active' && (targetStatus === 'sold' || targetStatus === 'rented')) {
      alert(`Only active properties can be marked as ${targetStatus.toUpperCase()}. Current status: ${currentStatus.toUpperCase()}`);
      return;
    }

    if (currentStatus === 'active' && !['sold', 'rented'].includes(targetStatus)) {
      alert(`Active properties can only be changed to 'Sold' or 'Rented'`);
      return;
    }

    // Show confirmation dialog for permanent status changes
    if (targetStatus === 'sold' || targetStatus === 'rented') {
      const confirmMessage = `Are you sure you want to mark this property as ${targetStatus.toUpperCase()}? This action cannot be undone.`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    try {
      // Use the dedicated status update endpoint with proper validation
      await Api.putWithtoken(`properties/${listingId}/status`, { 
        status: targetStatus,
        reason: `Property status changed to ${targetStatus} by owner`
      });
      
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { 
            ...listing, 
            status: targetStatus,
            statusUpdatedAt: new Date().toISOString()
          } : listing
        )
      );

      // Show success message for permanent changes
      if (targetStatus === 'sold' || targetStatus === 'rented') {
        alert(`Property successfully marked as ${targetStatus.toUpperCase()}! This change is permanent.`);
      } else {
        alert(`Property status updated to ${targetStatus.toUpperCase()}.`);
      }
      
    } catch (error) {
      console.error('Error updating listing status:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update listing status. Please try again.';
      alert(errorMessage);
    }
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await Api.deleteWithtoken(`properties/${listingId}`);
        
        setListings(prevListings => 
          prevListings.filter(listing => listing._id !== listingId)
        );
        
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'published';
      case 'pending':
      case 'pending_payment':
        return 'pending';
      case 'Sold':
        return 'sold';
      default:
        return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Published';
      case 'pending':
        return 'Pending';
      case 'pending_payment':
        return 'Pending Payment';
      case 'Sold':
        return 'Sold';
      case 'Rented':
        return 'Rented';
      default:
        return status;
    }
  };

  // Helper function to format location display with proper database mapping
  const formatLocationDisplay = (property) => {
    const parts = [];
    
    if (property.address?.subCity) {
      parts.push(property.address.subCity);
    }
    if (property.address?.city) {
      parts.push(property.address.city);
    }
    if (property.address?.regionalState) {
      parts.push(property.address.regionalState);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  // Status cell renderer with proper user restrictions
  const renderStatusCell = (listing) => {
    // Get the actual status from the database, handle various status formats
    let currentStatus = listing.status;
    
    // Normalize status values to match our dropdown options
    if (currentStatus) {
      currentStatus = currentStatus.toLowerCase();
      // Handle legacy status values
      if (currentStatus === 'published') currentStatus = 'active';
      if (currentStatus === 'pending_payment') currentStatus = 'pending';
    } else {
      currentStatus = 'pending'; // Default fallback
    }
    
    console.log('Rendering status for', listing.title, ':', listing.status, 'normalized:', currentStatus);
    
    // Simple dropdown style
    const dropdownStyle = {
      display: 'block',
      padding: '8px',
      fontSize: '12px',
      fontWeight: 'bold',
      textAlign: 'center',
      border: '2px solid #333',
      borderRadius: '4px',
      minWidth: '100px',
      margin: '4px 0',
      cursor: 'pointer'
    };

    // Get background color based on current status
    const getStatusColor = (statusValue) => {
      switch (statusValue) {
        case 'pending':
          return { backgroundColor: '#fff8e1', color: '#ff9800' };
        case 'active':
          return { backgroundColor: '#e6f7e6', color: '#4caf50' };
        case 'sold':
          return { backgroundColor: '#e3f2fd', color: '#2196f3' };
        case 'rented':
          return { backgroundColor: '#e8f5e8', color: '#28a745' };
        default:
          return { backgroundColor: '#f5f5f5', color: '#666' };
      }
    };

    const statusColors = getStatusColor(currentStatus);

    // For pending properties, show read-only status with info
    if (currentStatus === 'pending') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            ...dropdownStyle,
            ...statusColors,
            cursor: 'default'
          }}>
            Pending
          </span>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              backgroundColor: '#ff9800',
              color: 'white',
              borderRadius: '50%',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'help'
            }}
            title="Pending properties require admin approval. Users cannot change status to Active."
          >
            ⓘ
          </div>
        </div>
      );
    }

    // For active properties, allow only sold/rented transitions
    if (currentStatus === 'active') {
      return (
        <select 
          style={{
            ...dropdownStyle,
            ...statusColors
          }}
          value={currentStatus}
          onChange={(e) => handleStatusChange(listing._id, e.target.value)}
          title="Active properties can only be marked as sold or rented"
        >
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="rented">Rented</option>
        </select>
      );
    }

    // For other statuses (sold, rented, etc.), show read-only badge
    return (
      <span style={{
        ...dropdownStyle,
        ...statusColors,
        cursor: 'default'
      }}>
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="property-alert-container">
      <div className="manage-listings-container">
        <div className="manage-listings-header">
          <h1>Listed Property Alerts</h1>
          <p>View and manage your property listings with enhanced location data mapping.</p>
        </div>
        
        <div className="manage-listings-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search listings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          
          <div className="filter-selects">
            <select value={filter} onChange={handleFilterChange} className="filter-select">
              <option value="all">All Listings</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
            
            <select value={locationFilter} onChange={handleLocationFilterChange} className="filter-select">
              <option value="all">All Locations</option>
              <optgroup label="Regions">
                {ethiopianLocations.filter(loc => loc.type === 'region').map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </optgroup>
              <optgroup label="Cities">
                {ethiopianLocations.filter(loc => loc.type === 'city').map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </optgroup>
              <optgroup label="Sub-Cities (Addis Ababa)">
                {ethiopianLocations.filter(loc => loc.type === 'subcity').map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading listings...</p>
          </div>
        ) : (
          <>
            <div className="listings-table">
              <div className="table-header">
                <div className="header-cell property">Property</div>
                <div className="header-cell offering">Offering</div>
                <div className="header-cell location">Location</div>
                <div className="header-cell price">Price/ETB</div>
                <div className="header-cell owner">Owner</div>
                <div className="header-cell status">Status</div>
                <div className="header-cell date">Date Added</div>
                <div className="header-cell actions">Actions</div>
              </div>
              
              <div className="table-body">
                {listings.length > 0 ? (
                  listings.map(listing => (
                    <div className="table-row" key={listing._id}>
                      <div className="cell property">{listing.title || "Property"}</div>
                      <div className="cell offering">{listing.offeringType || "For Sale"}</div>
                      <div className="cell location">{formatLocationDisplay(listing)}</div>
                      <div className="cell price">{formatPrice(listing.price)}</div>
                      <div className="cell owner">{listing.ownerName || `${listing.owner?.firstName || ''} ${listing.owner?.lastName || ''}`}</div>
                      <div className="cell status">
                        {renderStatusCell(listing)}
                      </div>
                      <div className="cell date">{formatDate(listing.createdAt)}</div>
                      <div className="cell actions">
                        <Link 
                          to={`/property-edit/${listing._id}`}
                          className="action-icon edit"
                          title="Edit"
                        >
                          <i className="fa-solid fa-edit"></i>
                        </Link>
                        <button 
                          onClick={() => handleDelete(listing._id)}
                          className="action-icon delete"
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No listings found</p>
                    <Link to="/property-list-form" className="add-listing-link">
                      + Add Listing
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyAlert;
