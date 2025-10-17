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
          // Set a large limit to fetch all properties
          const propertiesResponse = await Api.getWithtoken('properties?limit=1000');
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
          
          // Get the 5 most recent listings
          const recentListings = [...properties]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          
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
          <div className="admin-card-header">
            <h2>Recent Listings</h2>
            <button className="admin-btn admin-btn-primary" onClick={() => window.location.href = '/admin/listings'}>
              View All
            </button>
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
              {recentListings.length > 0 ? (
                recentListings.map(listing => (
                  <tr key={listing._id}>
                    <td>{listing.title}</td>
                    <td>{listing.address?.city}, {listing.address?.state}</td>
                    <td>{formatPrice(listing.price)}</td>
                    <td>
                      <span className={`status ${listing.status === 'active' ? 'published' : 'pending'}`}>
                        {listing.status === 'active' ? 'Published' : 'Pending'}
                      </span>
                    </td>
                    <td>{formatDate(listing.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No listings found</td>
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
