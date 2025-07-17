import React, { useEffect, useState } from "react";
import "../sub-component/my-property-listings.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";
import { toast } from "react-toastify";
import "./my-property-listings.css";
import DeletePopup from "../../../helper/DeletePopup";
import Api from "../../../Apis/Api";

const MyPropertyListings = ({ filters, initialLoad }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(12); // Show 12 properties per page to match Redfin layout

  // Mock data for development and testing - Expanded to 15 properties
  const mockProperties = [
    {
      id: "mock1",
      property_type: "House",
      property_for: "For Sale",
      total_price: 5000000,
      property_address: "Bole Road, Addis Ababa",
      number_of_bedrooms: "3",
      number_of_bathrooms: "2",
      property_size: "250",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Beautiful house in prime location",
      media: ["https://via.placeholder.com/300x200?text=Luxury+House"]
    },
    {
      id: "mock2",
      property_type: "Apartment",
      property_for: "For Rent",
      total_price: 25000,
      property_address: "CMC Area, Addis Ababa",
      number_of_bedrooms: "2",
      number_of_bathrooms: "1",
      property_size: "120",
      status: "pending",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Modern apartment with great amenities",
      media: ["https://via.placeholder.com/300x200?text=Modern+Apartment"]
    },
    {
      id: "mock3",
      property_type: "Villa",
      property_for: "For Sale",
      total_price: 12000000,
      property_address: "Old Airport, Addis Ababa",
      number_of_bedrooms: "5",
      number_of_bathrooms: "4",
      property_size: "450",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Luxurious villa with garden and pool",
      media: ["https://via.placeholder.com/300x200?text=Luxury+Villa"]
    },
    {
      id: "mock4",
      property_type: "Condominium",
      property_for: "For Sale",
      total_price: 3500000,
      property_address: "Jemo, Addis Ababa",
      number_of_bedrooms: "2",
      number_of_bathrooms: "1",
      property_size: "85",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Newly built condominium unit",
      media: ["https://via.placeholder.com/300x200?text=New+Condominium"]
    },
    {
      id: "mock5",
      property_type: "Office Space",
      property_for: "For Rent",
      total_price: 75000,
      property_address: "Kazanchis, Addis Ababa",
      number_of_bedrooms: "0",
      number_of_bathrooms: "2",
      property_size: "200",
      status: "pending",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Premium office space in business district",
      media: ["https://via.placeholder.com/300x200?text=Office+Space"]
    },
    {
      id: "mock6",
      property_type: "House",
      property_for: "For Sale",
      total_price: 7800000,
      property_address: "Summit Area, Addis Ababa",
      number_of_bedrooms: "4",
      number_of_bathrooms: "3",
      property_size: "320",
      status: "sold",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Family home with large backyard",
      media: ["https://via.placeholder.com/300x200?text=Family+Home"]
    },
    {
      id: "mock7",
      property_type: "Apartment",
      property_for: "For Rent",
      total_price: 35000,
      property_address: "Bisrate Gabriel, Addis Ababa",
      number_of_bedrooms: "3",
      number_of_bathrooms: "2",
      property_size: "150",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Fully furnished luxury apartment",
      media: ["https://via.placeholder.com/300x200?text=Furnished+Apartment"]
    },
    {
      id: "mock8",
      property_type: "Commercial Space",
      property_for: "For Sale",
      total_price: 15000000,
      property_address: "Mexico, Addis Ababa",
      number_of_bedrooms: "0",
      number_of_bathrooms: "4",
      property_size: "500",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Prime commercial space for business",
      media: ["https://via.placeholder.com/300x200?text=Commercial+Space"]
    },
    {
      id: "mock9",
      property_type: "Penthouse",
      property_for: "For Sale",
      total_price: 9500000,
      property_address: "Bole Atlas, Addis Ababa",
      number_of_bedrooms: "4",
      number_of_bathrooms: "3",
      property_size: "280",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Luxury penthouse with city view",
      media: ["https://via.placeholder.com/300x200?text=Luxury+Penthouse"]
    },
    {
      id: "mock10",
      property_type: "Studio Apartment",
      property_for: "For Rent",
      total_price: 15000,
      property_address: "Gerji, Addis Ababa",
      number_of_bedrooms: "1",
      number_of_bathrooms: "1",
      property_size: "45",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Cozy studio apartment for singles",
      media: ["https://via.placeholder.com/300x200?text=Studio+Apartment"]
    },
    {
      id: "mock11",
      property_type: "Guesthouse",
      property_for: "For Rent",
      total_price: 45000,
      property_address: "Sarbet, Addis Ababa",
      number_of_bedrooms: "6",
      number_of_bathrooms: "4",
      property_size: "380",
      status: "pending",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Fully furnished guesthouse for rent",
      media: ["https://via.placeholder.com/300x200?text=Guesthouse"]
    },
    {
      id: "mock12",
      property_type: "Townhouse",
      property_for: "For Sale",
      total_price: 6500000,
      property_address: "Ayat, Addis Ababa",
      number_of_bedrooms: "3",
      number_of_bathrooms: "2",
      property_size: "180",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Modern townhouse in gated community",
      media: ["https://via.placeholder.com/300x200?text=Modern+Townhouse"]
    },
    {
      id: "mock13",
      property_type: "Farmhouse",
      property_for: "For Sale",
      total_price: 8500000,
      property_address: "Sululta, Oromia",
      number_of_bedrooms: "4",
      number_of_bathrooms: "3",
      property_size: "10000",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Oromia Regional State",
      city: "Sululta",
      description: "Farmhouse with large land for agriculture",
      media: ["https://via.placeholder.com/300x200?text=Farmhouse"]
    },
    {
      id: "mock14",
      property_type: "Retail Space",
      property_for: "For Rent",
      total_price: 55000,
      property_address: "Piassa, Addis Ababa",
      number_of_bedrooms: "0",
      number_of_bathrooms: "1",
      property_size: "120",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Prime retail space in shopping district",
      media: ["https://via.placeholder.com/300x200?text=Retail+Space"]
    },
    {
      id: "mock15",
      property_type: "Guest Room",
      property_for: "For Rent",
      total_price: 8000,
      property_address: "Megenagna, Addis Ababa",
      number_of_bedrooms: "1",
      number_of_bathrooms: "1",
      property_size: "30",
      status: "active",
      createdAt: new Date().toISOString(),
      regional_state: "Addis Ababa City Administration",
      city: "Addis Ababa",
      description: "Furnished guest room with private entrance",
      media: ["https://via.placeholder.com/300x200?text=Guest+Room"]
    }
  ];

  // Get property list from Redux store
  const propertyListData = useSelector((state) => state.PropertyList.Data);
  
  // Always use mock data for now, comment this to use real API data when available
  const shouldUseMockData = true;
  
  console.log("Using mock data for property listings");
  
  // Use mock data
  // Get property list from Redux
  const propertyList = propertyListData?.data?.data || [];
  
  // Fall back to mock data if the Redux data is empty
  const unfilteredList = propertyList.length > 0 ? propertyList : mockProperties;
  
  // Apply filters if they're set
  const applyFilters = (properties) => {
    if (initialLoad) return properties;
    
    return properties.filter(property => {
      // Filter by price range
      if (filters.priceMin && property.total_price < parseInt(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && property.total_price > parseInt(filters.priceMax)) {
        return false;
      }
      
      // Filter by regional state
      if (filters.regionalState && property.regional_state !== filters.regionalState) {
        return false;
      }
      
      // Filter by property type
      if (filters.propertyType && property.property_type !== filters.propertyType) {
        return false;
      }
      
      // Filter by bedrooms
      if (filters.bedrooms && parseInt(property.number_of_bedrooms) < parseInt(filters.bedrooms)) {
        return false;
      }
      
      // Filter by bathrooms
      if (filters.bathrooms && parseInt(property.number_of_bathrooms) < parseInt(filters.bathrooms)) {
        return false;
      }
      
      // Filter by property for (sale/rent)
      if (filters.propertyFor && property.property_for !== filters.propertyFor) {
        return false;
      }
      
      return true;
    });
  };
  
  // Apply filters to property list
  const finalPropertyList = applyFilters(unfilteredList);
  
  const isError = shouldUseMockData ? null : propertyListData?.error;
  const isPending = propertyListData?.pending;

  const location = useLocation();
  
  useEffect(() => {
    console.log("MyPropertyListings component mounted");
    console.log("Current activeTab:", activeTab);
    
    // Check if we're coming from the property creation flow
    if (location.state?.fromPromotion) {
      console.log("Detected navigation from property creation flow");
      console.log("Property data:", location.state?.propertyData);
    }
    
    loadProperties();
  }, [activeTab, location.state]);

  const loadProperties = async () => {
    console.log("Loading properties...");
    setIsLoading(true);
    try {
      // Pass the active tab as type parameter for filtering
      const type = activeTab === "all" ? "" : activeTab;
      console.log("Dispatching GetPropertyList with type:", type);
      
      // For testing purposes, we'll use the mock data
      // In production, this would fetch from API
      setTimeout(() => {
        setIsLoading(false);
        console.log("Properties loaded successfully");
      }, 500);
      
    } catch (error) {
      console.error("Error loading properties:", error);
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleEdit = (propertyId) => {
    console.log("Editing property with ID:", propertyId);
    
    // Add debug log for navigation
    console.log(`Navigating to: /property-edit/${propertyId}`);
    
    // Navigate to edit form with property ID
    navigate(`/property-edit/${propertyId}`);
    
    // Optional: Show feedback to user
    toast.info(`Opening property editor for ID: ${propertyId}`);
  };

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProperty) return;
    
    try {
      const response = await Api.deleteWithtoken(`agent/properties/${selectedProperty.id}`);
      
      if (response) {
        toast.success("Property deleted successfully");
        // Refresh property list
        loadProperties();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      let errorMessage = "Failed to delete property";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setShowDeleteModal(false);
      setSelectedProperty(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedProperty(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderPropertyStatus = (status) => {
    const statusMap = {
      active: { label: "Active", className: "status-active" },
      pending: { label: "Pending", className: "status-pending" },
      sold: { label: "Sold", className: "status-sold" },
      expired: { label: "Expired", className: "status-expired" },
      inactive: { label: "Inactive", className: "status-inactive" },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || {
      label: status || "Unknown",
      className: "status-unknown",
    };

    return (
      <span className={`status-badge ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPropertyImage = (property) => {
    if (property.media && property.media.length > 0) {
      // Handle different media formats
      if (typeof property.media[0] === "string") {
        return property.media[0];
      } else if (property.media[0].filePath) {
        return property.media[0].filePath;
      }
    }
    // Default placeholder image
    return "https://via.placeholder.com/300x200?text=No+Image";
  };

  return (
    <div className="my-property-listings">
      <div className="listings-header">
        <h2>My Property Listings</h2>
        <Link to="/property-list-form" className="add-property-btn">
          + Add New Property
        </Link>
      </div>

      <div className="filter-tabs">
        <button
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Properties
        </button>
        <button
          className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
          onClick={() => handleTabChange("active")}
        >
          Active
        </button>
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          Pending
        </button>
        <button
          className={`tab-btn ${activeTab === "sold" ? "active" : ""}`}
          onClick={() => handleTabChange("sold")}
        >
          Sold
        </button>
      </div>

      {/* Debug information section */}
      <div className="debug-info" style={{
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: '#f9f9f9',
        fontSize: '12px'
      }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Debug Information</h4>
        <p><strong>isLoading:</strong> {String(isLoading)}</p>
        <p><strong>isPending:</strong> {String(isPending)}</p>
        <p><strong>isError:</strong> {isError ? JSON.stringify(isError) : 'No errors'}</p>
        <p><strong>PropertyList length:</strong> {propertyList?.length || 0}</p>
        <p><strong>Redux Store Data:</strong> {propertyListData ? 'Available' : 'Undefined'}</p>
        <details>
          <summary>View Redux Data</summary>
          <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
            {JSON.stringify(propertyListData, null, 2)}
          </pre>
        </details>
      </div>

      {isPending || isLoading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your properties...</p>
        </div>
      ) : isError ? (
        <div className="error-container">
          <p>
            {isError.type === "auth"
              ? "Please login to view your properties"
              : isError.message || "Failed to load properties"}
          </p>
          {isError.type === "auth" && (
            <button
              onClick={() => navigate("/login")}
              className="login-redirect-btn"
            >
              Login Now
            </button>
          )}
        </div>
      ) : finalPropertyList.length === 0 ? (
          <div className="empty-state" style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="empty-icon" style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>No Properties Found</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              {initialLoad 
                ? `You don't have any ${activeTab !== "all" ? activeTab : ""} properties listed yet.`
                : "No properties match your current filter criteria. Try adjusting your filters."}
            </p>
            {initialLoad ? (
              <Link to="/property-list-form" className="add-property-btn" style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#0066cc',
                color: 'white',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}>
                + Add Your First Property
              </Link>
            ) : null}
          </div>
      ) : (
        <>
          <div className="property-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Implement pagination - only show properties for current page */}
            {finalPropertyList
              .slice(
                (currentPage - 1) * propertiesPerPage,
                currentPage * propertiesPerPage
              )
              .map((property) => (
                <div 
                  key={property.id || property._id} 
                  className="property-card" 
                  onClick={() => navigate(`/property-detail/${property.id || property._id}`)} 
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    width: '100%'
                  }}
                >
                  <div className="property-image" style={{ height: '215px', position: 'relative' }}>
                    <img
                      src={getPropertyImage(property)}
                      alt={property.property_address || "Property"}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Redfin-style status banner */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '0px', 
                      background: property.status === 'active' ? '#00AE43' : 
                                   property.status === 'pending' ? '#E93131' : 
                                   property.status === 'sold' ? '#CE5E2A' : '#58A33D', 
                      color: 'white',
                      padding: '4px 12px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      {property.status === 'active' ? "NEW" : 
                       property.status === 'pending' ? "PENDING" : 
                       property.status === 'sold' ? "SOLD" : 
                       property.property_for.toUpperCase()}
                    </div>
                    
                    {/* Year indicator */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      background: 'rgba(0,0,0,0.5)', 
                      color: 'white',
                      padding: '2px 8px', 
                      fontSize: '10px', 
                      borderRadius: '4px',
                      zIndex: 2
                    }}>
                      2023
                    </div>
                  </div>
                  
                  <div className="property-details" style={{ padding: '16px' }}>
                    {/* Price and action buttons */}
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: '#2b2b2b'
                      }}>
                        ETB {property.total_price?.toLocaleString() || "N/A"}
                        {property.property_for === "For Rent" ? " / month" : ""}
                      </h3>
                      <div className="property-actions" style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(property.id || property.propertyId);
                          }}
                          title="Edit property"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(property);
                          }}
                          title="Delete property"
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {/* Property details */}
                    <div style={{ marginBottom: '10px' }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '0.95rem', 
                        color: '#333',
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {property.property_address || "Address not provided"}
                      </p>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '0.9rem', 
                        color: '#666'
                      }}>
                        {property.property_type || "Property"} - {property.property_for}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        fontSize: '0.9rem', 
                        color: '#444', 
                        fontWeight: '500'
                      }}>
                        {property.number_of_bedrooms && (
                          <span>{property.number_of_bedrooms} beds</span>
                        )}
                        {property.number_of_bathrooms && (
                          <span>{property.number_of_bathrooms} baths</span>
                        )}
                        {property.property_size && (
                          <span>{property.property_size} m²</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Agent info */}
                    <p style={{ 
                      margin: '12px 0 0 0', 
                      fontSize: '0.8rem', 
                      color: '#666',
                      borderTop: '1px solid #eee',
                      paddingTop: '12px'
                    }}>
                      Listed: {formatDate(property.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Pagination Controls */}
          <div className="pagination-controls" style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
            gap: '10px'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? '#e0e0e0' : '#4a6cf7',
                color: currentPage === 1 ? '#666' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {[...Array(Math.ceil(finalPropertyList.length / propertiesPerPage))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: currentPage === index + 1 ? '#4a6cf7' : 'white',
                    color: currentPage === index + 1 ? 'white' : '#333',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(finalPropertyList.length / propertiesPerPage)))}
              disabled={currentPage === Math.ceil(finalPropertyList.length / propertiesPerPage)}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === Math.ceil(finalPropertyList.length / propertiesPerPage) ? '#e0e0e0' : '#4a6cf7',
                color: currentPage === Math.ceil(finalPropertyList.length / propertiesPerPage) ? '#666' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === Math.ceil(finalPropertyList.length / propertiesPerPage) ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
          
          {/* Page information */}
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Showing page {currentPage} of {Math.ceil(finalPropertyList.length / propertiesPerPage)} 
            ({finalPropertyList.length} total properties)
          </div>
        </>
      )}

      {showDeleteModal && selectedProperty && (
        <DeletePopup
          isOpen={showDeleteModal}
          title="Delete Property"
          message={`Are you sure you want to delete this property at ${selectedProperty.property_address}? This action cannot be undone.`}
          confirmButtonText="Delete Property"
          cancelButtonText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <div className="refresh-section">
        <button onClick={loadProperties} className="refresh-btn">
          🔄 Refresh Properties
        </button>
      </div>
    </div>
  );
};

export default MyPropertyListings;
