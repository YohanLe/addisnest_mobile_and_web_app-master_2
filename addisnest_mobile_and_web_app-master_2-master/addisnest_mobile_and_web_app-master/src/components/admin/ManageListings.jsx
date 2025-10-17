import React, { useState, useEffect } from 'react';
import api from '../../Apis/Api';
import { Link } from 'react-router-dom';
import '../../assets/css/manage-listings.css';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [availableLocations, setAvailableLocations] = useState([
    { value: 'Addis Ababa City Administration', label: 'Addis Ababa City Administration' },
    { value: 'Afar Region', label: 'Afar Region' },
    { value: 'Amhara Region', label: 'Amhara Region' },
    { value: 'Benishangul-Gumuz Region', label: 'Benishangul-Gumuz Region' },
    { value: 'Dire Dawa City Administration', label: 'Dire Dawa City Administration' },
    { value: 'Gambela Region', label: 'Gambela Region' },
    { value: 'Harari Region', label: 'Harari Region' },
    { value: 'Oromia Region', label: 'Oromia Region' },
    { value: 'Sidama Region', label: 'Sidama Region' },
    { value: 'Somali Region', label: 'Somali Region' },
    { value: 'South Ethiopia Region', label: 'South Ethiopia Region' },
    { value: 'South West Ethiopia Peoples\' Region', label: 'South West Ethiopia Peoples\' Region' },
    { value: 'Tigray Region', label: 'Tigray Region' },
    { value: 'Central Ethiopia Region', label: 'Central Ethiopia Region' }
  ]);

  useEffect(() => {
    fetchListings();
  }, [currentPage, filter, locationFilter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Admin fetching properties from Atlas database...');
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:7002');
      console.log('Current filters:', { filter, locationFilter, searchTerm, currentPage });
      
      let allProperties = [];
      
      // Always fetch ALL properties first, then filter client-side
      const queryParams = new URLSearchParams({
        limit: '10000',
        page: '1',
        admin: 'true'
      });
      
      const endpoint = `properties?${queryParams.toString()}`;
      console.log('Making API call to:', endpoint);
      
      const response = await api.getWithtoken(endpoint);
      
      // Handle different response formats from Atlas
      if (Array.isArray(response)) {
        allProperties = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        allProperties = response.data;
      } else if (response && response.success && response.data && Array.isArray(response.data)) {
        allProperties = response.data;
      } else if (response && typeof response === 'object' && response._id) {
        allProperties = [response];
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        allProperties = [];
      }
      
      // Note: The main properties endpoint with admin=true should include all properties including pending ones
      console.log('Main properties endpoint should include all properties including pending ones');
      
      console.log('🏠 Total properties from Atlas:', allProperties.length);
      
      // Log sample properties for debugging
      if (allProperties.length > 0) {
        console.log('📊 Property status distribution:');
        const statusCounts = {};
        allProperties.forEach(p => {
          const status = p.status || 'undefined';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        console.table(statusCounts);
        
        console.log('🔍 Sample properties:');
        allProperties.slice(0, 3).forEach((prop, index) => {
          console.log(`${index + 1}.`, {
            id: prop._id,
            title: prop.title || 'No title',
            status: prop.status || 'No status',
            price: prop.price || 'No price',
            owner: prop.ownerName || prop.owner?.firstName || 'No owner',
            location: prop.address?.regionalState || 'No location'
          });
        });
      } else {
        console.log('❌ No properties found in Atlas database');
      }
      
      // Apply client-side filters
      let filteredProperties = allProperties;
      
      // Apply status filter
      if (filter !== 'all') {
        const originalCount = filteredProperties.length;
        filteredProperties = filteredProperties.filter(property => {
          const propertyStatus = property.status ? property.status.toLowerCase() : 'pending';
          return propertyStatus === filter.toLowerCase();
        });
        console.log(`🔍 Status filter '${filter}': ${originalCount} → ${filteredProperties.length} properties`);
      }
      
      // Apply location filter
      if (locationFilter !== 'all') {
        const originalCount = filteredProperties.length;
        filteredProperties = filteredProperties.filter(property => 
          property.address?.regionalState === locationFilter
        );
        console.log(`🌍 Location filter '${locationFilter}': ${originalCount} → ${filteredProperties.length} properties`);
      }
      
      // Apply search filter
      if (searchTerm && searchTerm.trim()) {
        const originalCount = filteredProperties.length;
        const searchLower = searchTerm.toLowerCase().trim();
        filteredProperties = filteredProperties.filter(property => 
          (property.title && property.title.toLowerCase().includes(searchLower)) ||
          (property.description && property.description.toLowerCase().includes(searchLower)) ||
          (property.address?.city && property.address.city.toLowerCase().includes(searchLower)) ||
          (property.address?.subCity && property.address.subCity.toLowerCase().includes(searchLower)) ||
          (property.address?.regionalState && property.address.regionalState.toLowerCase().includes(searchLower)) ||
          (property.ownerName && property.ownerName.toLowerCase().includes(searchLower)) ||
          (property.owner?.firstName && property.owner.firstName.toLowerCase().includes(searchLower)) ||
          (property.owner?.lastName && property.owner.lastName.toLowerCase().includes(searchLower))
        );
        console.log(`🔍 Search filter '${searchTerm}': ${originalCount} → ${filteredProperties.length} properties`);
      }
      
      // Sort by creation date (newest first)
      filteredProperties.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      // Pagination
      const itemsPerPage = 50; // Show more items per page
      const totalItems = filteredProperties.length;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage) || 1;
      
      setTotalPages(calculatedTotalPages);
      
      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
      
      console.log(`📄 Pagination: Page ${currentPage}/${calculatedTotalPages}, showing ${paginatedProperties.length} of ${totalItems} properties`);
      
      setListings(paginatedProperties);
      setLoading(false);
      
      console.log('✅ Successfully loaded properties from Atlas database');
      
    } catch (error) {
      console.error('❌ Error fetching properties from Atlas:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      setLoading(false);
      setListings([]);
      setTotalPages(1);
      
      // Show user-friendly error message
      alert(`Failed to load properties from database: ${error.message || 'Unknown error'}. Please check your connection and try again.`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchListings();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when changing location filter
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await api.putWithtoken(`properties/${listingId}`, { status: newStatus });
      
      // Update the listing in the state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { ...listing, status: newStatus } : listing
        )
      );
      
    } catch (error) {
      console.error('Error updating listing status:', error);
      alert('Failed to update listing status. Please try again.');
    }
  };

  const handleApprove = async (listingId) => {
    try {
      await api.putWithtoken(`properties/${listingId}/approve`);
      
      // Update the listing in the state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { ...listing, status: 'active' } : listing
        )
      );
      
      alert('Property approved successfully!');
      
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Failed to approve listing. Please try again.');
    }
  };

  const handleReject = async (listingId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    try {
      await api.putWithtoken(`properties/${listingId}/reject`, { reason });
      
      // Update the listing in the state
      setListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { ...listing, status: 'rejected' } : listing
        )
      );
      
      alert('Property rejected successfully!');
      
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('Failed to reject listing. Please try again.');
    }
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        await api.deleteWithtoken(`properties/${listingId}`);
        
        // Remove the listing from the state
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
    // Format as number with thousands separators without currency symbol
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
      case 'sold':
      case 'Sold':
        return 'sold';
      case 'rented':
      case 'Rented':
        return 'rented';
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
      case 'sold':
      case 'Sold':
        return 'Sold';
      case 'rented':
      case 'Rented':
        return 'Rented';
      default:
        return status;
    }
  };

  return (
    <div className="manage-listings-container">
      <div className="manage-listings-header">
        <h1>Manage Listings</h1>
        <p>View, edit, and manage all property listings.</p>
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
            <option value="active">Published</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="pending_payment">Pending Payment</option>
          </select>
          
          <select value={locationFilter} onChange={handleLocationFilterChange} className="filter-select">
            <option value="all">All Locations</option>
            {availableLocations.map(location => (
              <option key={location.value} value={location.value}>{location.label}</option>
            ))}
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
          {/* Desktop Table View */}
          <div className="listings-table" style={{ display: 'block' }}>
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
                    <div className="cell property">{listing.title || "Test Property"}</div>
                    <div className="cell offering">{listing.offeringType || "For Sale"}</div>
                    <div className="cell location">
                      {[
                        listing.address?.subCity,
                        listing.address?.city,
                        listing.address?.regionalState
                      ].filter(Boolean).join(', ') || 'Location not specified'}
                    </div>
                    <div className="cell price">{formatPrice(listing.price)}</div>
                    <div className="cell owner">{listing.ownerName || `${listing.owner?.firstName || ''} ${listing.owner?.lastName || ''}`}</div>
                    <div className="cell status">
                      <select 
                        className={`status-select ${getStatusClass(listing.status)}`}
                        value={listing.status || 'pending'}
                        onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                        title="Change status"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="cell date">{formatDate(listing.createdAt)}</div>
                    <div className="cell actions">
                      {listing.status === 'pending' ? (
                        <div className="action-buttons-container">
                          <button 
                            onClick={() => handleApprove(listing._id)}
                            className="action-btn approve-btn"
                            title="Approve Property"
                          >
                            ✓ Approve
                          </button>
                          <button 
                            onClick={() => handleReject(listing._id)}
                            className="action-btn reject-btn"
                            title="Reject Property"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons-container">
                          <Link 
                            to={`/property-edit/${listing._id}`}
                            className="action-btn edit-btn"
                            title="Edit Property"
                          >
                            <i className="fa-solid fa-edit"></i> Edit
                          </Link>
                          {listing.status === 'active' && (
                            <button 
                              onClick={() => handleDelete(listing._id)}
                              className="action-btn delete-btn"
                              title="Delete Property"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          )}
                        </div>
                      )}
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
  );
};

export default ManageListings;
