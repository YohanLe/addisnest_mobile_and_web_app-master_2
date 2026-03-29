import React, { useState, useEffect } from 'react';
import Api from '../../Apis/Api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    totalUsers: 0,
    totalAgents: 0,
    listingsChange: 0,
    activeListingsChange: 0,
    usersChange: 0,
    agentsChange: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      console.log(`Attempting to update status for ${listingId} to ${newStatus}`);
      
      // Admin can directly update any status using the regular PUT endpoint
      // The backend now allows admins to bypass all status validation
      const response = await Api.putWithtoken(`properties/${listingId}`, { 
        status: newStatus,
        reason: `Status changed to ${newStatus} by admin from dashboard`
      });
      
      console.log('Update response:', response);
      
      // Update the listing in the state
      setRecentListings(prevListings => 
        prevListings.map(listing => 
          listing._id === listingId ? { ...listing, status: newStatus } : listing
        )
      );
      
      console.log(`✅ Status updated to ${newStatus} for listing ${listingId}`);
      
      // Show success message
      alert(`Property status successfully updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating listing status:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update listing status';
      alert(`Error: ${errorMessage}. Please try again.`);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching dashboard data...");
        
        // Fetch user stats
        const usersResponse = await Api.getWithtoken('users');
        console.log('Users API Response:', usersResponse);
        
        // MongoDB returns the data directly, not nested in a data property
        const users = Array.isArray(usersResponse) ? usersResponse : [];
        const totalUsers = users.length;
        const totalAgents = users.filter(user => 
          user.role === 'agent' || user.role === 'AGENT'
        ).length;
        
        // For demo purposes, generate random change percentages
        const usersChange = Math.floor(Math.random() * 15) + 1;
        const agentsChange = Math.floor(Math.random() * 15) + 1;
        
        // Fetch property stats - using getWithtoken for authenticated access
        try {
          // Set a large limit to fetch all properties with admin=true to see ALL statuses
          const propertiesResponse = await Api.getWithtoken('properties?limit=1000&admin=true');
          console.log('Properties API Response:', propertiesResponse);
          
          // Handle MongoDB response format
          let properties = [];
          
          // Check if the response is an array or an object with a data property
          if (Array.isArray(propertiesResponse)) {
            properties = propertiesResponse;
          } else if (propertiesResponse && propertiesResponse.data) {
            // If it's an object with a data property, use that
            properties = Array.isArray(propertiesResponse.data) ? propertiesResponse.data : [];
          } else if (propertiesResponse && typeof propertiesResponse === 'object') {
            // If it's just an object, use it directly
            properties = [propertiesResponse];
          }
          
          console.log('Processed properties:', properties.length);
          const totalListings = properties.length;
          const activeListings = properties.filter(property => 
            property.status === 'active' || property.status === 'ACTIVE'
          ).length;
          
          // For demo purposes, generate random change percentages
          const listingsChange = Math.floor(Math.random() * 15) + 1;
          const activeListingsChange = Math.floor(Math.random() * 15) + 1;
          
          // Get all listings sorted by most recent
          const recentListings = [...properties]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          console.log('📋 Recent listings with statuses:');
          recentListings.forEach((prop, idx) => {
            console.log(`${idx + 1}. ${prop.title} - Status: "${prop.status}" (type: ${typeof prop.status})`);
          });
          
          setStats(prevStats => ({
            ...prevStats,
            totalListings,
            activeListings,
            totalUsers,
            totalAgents,
            listingsChange,
            activeListingsChange,
            usersChange,
            agentsChange
          }));
          
          setRecentListings(recentListings);
        } catch (propertiesError) {
          console.error('Error fetching properties:', propertiesError);
          
          // Still set user stats even if properties fail
          setStats(prevStats => ({
            ...prevStats,
            totalListings: 0,
            activeListings: 0,
            totalUsers,
            totalAgents,
            listingsChange: 0,
            activeListingsChange: 0,
            usersChange,
            agentsChange
          }));
          
          setRecentListings([]);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message || 'An error occurred');
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
        
        // Set empty data instead of mock data to show real state
        setStats({
          totalListings: 0,
          activeListings: 0,
          totalUsers: 0,
          totalAgents: 0,
          listingsChange: 0,
          activeListingsChange: 0,
          usersChange: 0,
          agentsChange: 0
        });
        
        setRecentListings([]);
      }
    };

    fetchDashboardData();
  }, []);

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
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Filter and sort listings
  const filteredListings = recentListings
    .filter(listing => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const title = listing.title?.toLowerCase() || '';
        const location = [
          listing.address?.subCity,
          listing.address?.city,
          listing.address?.regionalState
        ].filter(Boolean).join(', ').toLowerCase();
        const price = listing.price?.toString() || '';
        
        const matchesSearch = (
          title.includes(searchLower) ||
          location.includes(searchLower) ||
          price.includes(searchLower)
        );
        
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (statusFilter !== 'all') {
        if (listing.status?.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sorting
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to the admin dashboard. Here's an overview of your platform.</p>
      </div>
      
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>Total Listings</h3>
          <div className="stat-value">{stats.totalListings}</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i> {stats.listingsChange}% from last month
          </div>
        </div>
        
        <div className="admin-stat-card">
          <h3>Active Listings</h3>
          <div className="stat-value">{stats.activeListings}</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i> {stats.activeListingsChange}% from last month
          </div>
        </div>
        
        <div className="admin-stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i> {stats.usersChange}% from last month
          </div>
        </div>
        
        <div className="admin-stat-card">
          <h3>Total Agents</h3>
          <div className="stat-value">{stats.totalAgents}</div>
          <div className="stat-change positive">
            <i className="fa-solid fa-arrow-up"></i> {stats.agentsChange}% from last month
          </div>
        </div>
        
      </div>
      
      <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="admin-card">
          <div className="admin-card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <h2>All Listings ({filteredListings.length} of {recentListings.length})</h2>
              <button className="admin-btn admin-btn-primary" onClick={() => window.location.href = '/admin/listings'}>
                Manage All
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
              {/* Search Input */}
              <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '200px' }}>
                <i className="fa-solid fa-search" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888',
                  fontSize: '14px'
                }}></i>
                <input
                  type="text"
                  placeholder="Search by title, location, or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '10px 12px 10px 36px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    width: '100%',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                />
              </div>
              
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: 'white',
                  minWidth: '140px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
                <option value="rejected">Rejected</option>
              </select>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: 'white',
                  minWidth: '160px'
                }}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
              </select>
              
              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== 'all' || sortBy !== 'date-desc') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setSortBy('date-desc');
                  }}
                  style={{
                    padding: '10px 16px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#d32f2f'}
                  onMouseLeave={(e) => e.target.style.background = '#f44336'}
                >
                  <i className="fa-solid fa-times"></i> Clear Filters
                </button>
              )}
            </div>
          </div>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length > 0 ? (
                filteredListings.map(listing => (
                  <tr key={listing._id}>
                    <td>{listing.title}</td>
                    <td>
                      {[
                        listing.address?.subCity,
                        listing.address?.city,
                        listing.address?.regionalState
                      ].filter(Boolean).join(', ') || 'Location not specified'}
                    </td>
                    <td>{formatPrice(listing.price)}</td>
                    <td>
                      <select 
                        className={`status-select ${
                          listing.status === 'active' ? 'published' : 
                          listing.status === 'sold' ? 'sold' : 
                          listing.status === 'rented' ? 'rented' : 
                          listing.status === 'rejected' ? 'rejected' : 
                          'pending'
                        }`}
                        value={listing.status || 'pending'}
                        onChange={(e) => handleStatusChange(listing._id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td>{formatDate(listing.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    {searchTerm ? `No listings found matching "${searchTerm}"` : 'No listings found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      
      </div>
    </div>
  );
};

export default AdminDashboard;
