import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PropertyAlert = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Generate sample property listings data (up to 50 listings)
  const generateSampleListings = () => {
    const propertyTypes = ["House", "Apartment", "Villa", "Commercial", "Land"];
    const cities = ["Addis Ababa", "Hawassa", "Bahir Dar", "Gondar", "Mekelle", "Dire Dawa", "Adama"];
    const streets = ["Main St", "Central Ave", "Ring Road", "Market St", "Lake View", "Mountain Dr", "Park Blvd"];
    const statuses = ["ACTIVE", "PENDING", "SOLD"];
    const offerings = ["For Sale", "For Rent"];
    
    const sampleListings = [];
    
    // Generate between 15-25 sample listings
    const numberOfListings = Math.floor(Math.random() * 10) + 15; 
    
    for (let i = 1; i <= numberOfListings; i++) {
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const houseNumber = Math.floor(Math.random() * 9000) + 1000;
      const offering = offerings[Math.floor(Math.random() * offerings.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const price = Math.floor(Math.random() * 9000000) + 1000000;
      
      sampleListings.push({
        id: i,
        image: `https://via.placeholder.com/150?text=${propertyType}`,
        address: `${houseNumber} ${street}, ${city}`,
        type: propertyType,
        offering: offering,
        status: status,
        price: price.toString()
      });
    }
    
    // Add a few specific listings for consistency
    sampleListings.unshift({
      id: numberOfListings + 1,
      image: "https://via.placeholder.com/150",
      address: "19085 SW Vista St, Beaverton, OR 97006, USA",
      type: "House",
      offering: "For Sale",
      status: "ACTIVE",
      price: "15200000"
    });
    
    sampleListings.unshift({
      id: numberOfListings + 2,
      image: "https://via.placeholder.com/150",
      address: "106250 Meredith dr Apt#8",
      type: "Apartment",
      offering: "For Rent",
      status: "ACTIVE",
      price: "5626262"
    });
    
    return sampleListings;
  };
  
  // Load saved listings from localStorage or generate sample data if none exist
  const loadSavedListings = () => {
    try {
      const savedListings = localStorage.getItem('propertyListings');
      if (savedListings) {
        console.log("Found saved listings in localStorage");
        return JSON.parse(savedListings);
      }
    } catch (error) {
      console.error("Error loading saved listings:", error);
    }
    
    console.log("No saved listings found, generating sample data");
    return generateSampleListings();
  };
  
  const [listings, setListings] = useState(loadSavedListings());

  // Use a ref to track if we've already processed this property
  const processedPropertyRef = useRef(null);
  
  // Process incoming new property from payment flow
  useEffect(() => {
    console.log("PropertyAlert received location state:", location.state);
    
    // FIXED: Check if we have propertyData directly from location state
    if (location.state?.propertyData) {
      console.log("Found propertyData in location state:", location.state.propertyData);
      
      // Create a new listing from the propertyData
      const newProperty = location.state.propertyData;
      
      // Save the ID of this property to prevent duplicate processing
      if (processedPropertyRef.current === JSON.stringify(newProperty._id || newProperty.id)) {
        console.log("Already processed this property, skipping");
        return;
      }
      
      processedPropertyRef.current = JSON.stringify(newProperty._id || newProperty.id);
      
      // Create a new listing object from the property data
      const newListing = {
        id: newProperty._id || newProperty.id || Date.now(),
        createdAt: new Date().toISOString(),
        isNew: true,
        
        // Get image from property data
        image: (() => {
          // First try images array
          if (newProperty.images && Array.isArray(newProperty.images) && newProperty.images.length > 0) {
            const firstImage = newProperty.images[0];
            if (typeof firstImage === 'string') return firstImage;
            return firstImage.url || firstImage.filePath || firstImage.path || null;
          }
          
          // Then try media_paths
          if (newProperty.media_paths && Array.isArray(newProperty.media_paths) && newProperty.media_paths.length > 0) {
            const firstImage = newProperty.media_paths[0];
            if (typeof firstImage === 'string') return firstImage;
            return firstImage.url || firstImage.filePath || firstImage.path || null;
          }
          
          // Default image if none found
          return "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
        })(),
        
        // Get address
        address: newProperty.property_address || 
                (newProperty.address?.street ? 
                  `${newProperty.address.street}, ${newProperty.address.city || ''}` : 
                  "New Property Address"),
        
        // Get property type
        type: newProperty.property_type || newProperty.propertyType || "Commercial",
        
        // Get offering type
        offering: newProperty.property_for || newProperty.offeringType || "For Sale",
        
        // Default status
        status: "ACTIVE",
        
        // Get price
        price: newProperty.total_price || newProperty.price || "0"
      };
      
      console.log("Created new listing:", newListing);
      
      // Check if this listing already exists in our list
      const isDuplicate = listings.some(listing => 
        listing.id === newListing.id || 
        (listing.address === newListing.address && 
         listing.price === newListing.price && 
         listing.type === newListing.type)
      );
      
      if (!isDuplicate) {
        console.log("Adding new listing to the display list");
        
        // Add the new listing to the list and ensure it's at the top
        setListings(prevListings => {
          // Add the new listing at the beginning of the array
          const updatedListings = [newListing, ...prevListings];
          
          // Save listings to localStorage for persistence
          try {
            localStorage.setItem('propertyListings', JSON.stringify(updatedListings));
            console.log("Successfully saved listings to localStorage");
          } catch (error) {
            console.error("Failed to save listings to localStorage:", error);
          }
          
          return updatedListings;
        });
        
        // Show a notification that a new property has been added
        toast.success('Your property has been successfully added!', {
          position: "top-center",
          autoClose: 3000
        });
      } else {
        console.log("Duplicate listing detected - not adding again");
      }
      
      // Clear the location state to prevent duplicated entries on refresh
      window.history.replaceState({}, document.title);
    }
    // Original handler for legacy data formats
    else if ((location.state?.propertyData || location.state?.formData) && 
        (location.state?.listing === 'new' || location.state?.newProperty === true) && 
        processedPropertyRef.current !== JSON.stringify((location.state.propertyData?._id || location.state.formData?.id || Date.now()))) {
      
      // Handle both propertyData (API response) and formData (direct form submission)
      const newProperty = location.state?.propertyData || location.state?.formData || {};
      console.log("New property data received:", newProperty);
      
      // Save the ID of this property to prevent duplicate processing
      processedPropertyRef.current = JSON.stringify(newProperty._id);
      
      // Create a new listing object from the property data
      const newListing = {
        id: Date.now(), // Generate a unique ID
        createdAt: new Date().toISOString(), // Add timestamp for sorting
        isNew: true, // Flag to highlight new properties
        
        // Get the main image from property form submission
        image: (() => {
          // APPROACH 1: Look in media_paths (from property form)
          if (newProperty.media_paths && newProperty.media_paths.length > 0) {
            const mainImage = newProperty.media_paths[0];
            
            // Handle different possible formats from the property form
            if (typeof mainImage === 'string') {
              return mainImage;
            } else if (mainImage.filePath) {
              return mainImage.filePath;
            } else if (mainImage.url) {
              return mainImage.url;
            } else if (mainImage.path) {
              return mainImage.path;
            }
          }
          
          // APPROACH 2: Look in images array (from API response)
          if (newProperty.images && newProperty.images.length > 0) {
            // First check if any image is marked as primary
            const primaryImage = newProperty.images.find(img => 
              (typeof img === 'object' && img.isPrimary === true) || 
              (typeof img === 'object' && img.primary === true)
            );
            
            if (primaryImage) {
              return typeof primaryImage === 'string' ? primaryImage :
                primaryImage.url || primaryImage.filePath || primaryImage.path || primaryImage;
            }
            
            // Otherwise use first image
            const firstImage = newProperty.images[0];
            return typeof firstImage === 'string' ? firstImage :
              firstImage.url || firstImage.filePath || firstImage.path;
          }
          
          // Use upload folder images for fallback
          return "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
        })(),
        
        // Handle different address formats - original form data has property_address
        address: (() => {
          if (newProperty.location?.address) {
            return newProperty.location.address;
          } else if (newProperty.property_address) {
            return newProperty.property_address;
          } else {
            return "New Property Address";
          }
        })(),
        
        // Handle different property type formats - original form data has property_type
        type: (() => {
          if (newProperty.propertyType) {
            return newProperty.propertyType.charAt(0).toUpperCase() + newProperty.propertyType.slice(1);
          } else if (newProperty.property_type) {
            // Handle both string and object with value property (from Select component)
            return typeof newProperty.property_type === 'string' 
              ? newProperty.property_type
              : newProperty.property_type.value || "Property";
          } else {
            return "Property";
          }
        })(),
        
        // Handle different offering formats - original form data has property_for
        offering: (() => {
          if (newProperty.propertyFor) {
            return newProperty.propertyFor === 'sale' ? 'For Sale' : 'For Rent';
          } else if (newProperty.property_for) {
            return newProperty.property_for; // Already in "For Sale" or "For Rent" format
          } else {
            return "For Sale";
          }
        })(),
        
        status: "ACTIVE",
        
        // Handle different price formats - original form data has total_price
        price: (() => {
          if (newProperty.price?.amount) {
            return newProperty.price.amount;
          } else if (newProperty.total_price) {
            return newProperty.total_price;
          } else {
            return "0";
          }
        })()
      };
      
      console.log("Created new listing:", newListing);
      
      // Check if this listing already exists in our list (by ID or similar properties)
      const isDuplicate = listings.some(listing => 
        // Check by ID if available
        (newListing.id === listing.id) || 
        // Otherwise check for similar properties (address + price + type) 
        (listing.address === newListing.address && 
         listing.price === newListing.price && 
         listing.type === newListing.type)
      );
      
      if (!isDuplicate) {
        console.log("Adding new listing to the display list");
        
        // Set a timestamp for the new listing if not already set
        if (!newListing.createdAt) {
          newListing.createdAt = new Date().toISOString();
        }
        
        // Add the new listing to the list and ensure it's at the top
        setListings(prevListings => {
          // Add the new listing at the beginning of the array
          const updatedListings = [newListing, ...prevListings];
          
          // Save listings to localStorage for persistence
          try {
            localStorage.setItem('propertyListings', JSON.stringify(updatedListings));
            console.log("Successfully saved listings to localStorage");
          } catch (error) {
            console.error("Failed to save listings to localStorage:", error);
          }
          
          return updatedListings;
        });
        
        // Show a notification or visual cue that a new property has been added
        toast.success('Your property has been successfully added!', {
          position: "top-center",
          autoClose: 3000
        });
      } else {
        console.log("Duplicate listing detected - not adding again");
      }
      
      // Clear the location state to prevent duplicated entries on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, listings]);

  // Filter states
  const [activeFilter, setActiveFilter] = useState("All");
  
  const totalListings = listings.length;
  
  const filters = ["All", "ACTIVE", "SOLD", "PENDING", "REJECTED"];

  // Filter listings based on selected filter (support up to 50 listings)
  const filteredListings = activeFilter === "All" 
    ? listings.slice(0, 50) 
    : listings.filter(listing => listing.status === activeFilter).slice(0, 50);
    
  // Function to handle image load errors
  const handleImageError = (e) => {
    // On image load error, show the house emoji instead
    e.target.style.display = 'none';
    
    // Use DOM methods instead of innerHTML to avoid React warnings
    const parent = e.target.parentNode;
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.color = '#666';
    container.style.backgroundColor = '#e8f4f8';
    
    const emoji = document.createElement('div');
    emoji.style.fontSize = '32px';
    emoji.style.color = '#4a6cf7';
    emoji.textContent = '🏠';
    
    container.appendChild(emoji);
    parent.appendChild(container);
  };

  return (
    <div className="my-listings-container">
      <div className="listings-header">
        <h2>My Listings <span className="listing-count">{totalListings}</span></h2>
        
        <div className="filter-tabs">
          {filters.map(filter => (
            <button 
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <button 
          className="list-property-btn"
          onClick={() => navigate('/property-list-form')}
        >
          List Property +
        </button>
      </div>
      
      <div className="listings-table" style={{ maxHeight: 700, overflowY: 'auto' }}>
        <div className="table-header">
          <div className="header-cell serial-number">S.no</div>
          <div className="header-cell picture">Picture</div>
          <div className="header-cell address">Address</div>
          <div className="header-cell type">Type</div>
          <div className="header-cell offering">Offering</div>
          <div className="header-cell status">Status</div>
          <div className="header-cell price">Price</div>
          <div className="header-cell action">Action</div>
        </div>
        
        <div className="table-body">
          {filteredListings.map((listing, index) => (
            <div 
              className={`table-row ${listing.isNew ? 'new-listing' : ''}`} 
              key={listing.id}
            >
              <div className="cell serial-number">{index + 1}</div>
              <div className="cell picture">
                <div className="property-image-container" style={{ 
                    width: 80, 
                    height: 60, 
                    overflow: 'hidden',
                    borderRadius: 4,
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd'
                }}>
                  {listing.image ? (
                    <img 
                      src={listing.image} 
                      alt={`Property at ${listing.address}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={handleImageError}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: "100%",
                      height: "100%",
                      color: '#666',
                      backgroundColor: '#e8f4f8'
                    }}>
                      <div style={{ fontSize: 32, color: '#4a6cf7' }}>🏠</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="cell address">{listing.address}</div>
              <div className="cell type">
                {listing.type ? 
                  (typeof listing.type === 'string' ? 
                    listing.type.charAt(0).toUpperCase() + listing.type.slice(1) : 
                    'Property') : 
                  'Property'}
              </div>
              <div className="cell offering">
                <span className={`offering-badge ${listing.offering?.toLowerCase().includes('sale') ? "sale" : "rent"}`}>
                  {listing.offering || (listing.propertyFor === 'sale' ? 'For Sale' : 'For Rent')}
                </span>
              </div>
              <div className="cell status">
                <span className={`status-badge ${listing.status.toLowerCase()}`}>
                  {listing.status}
                </span>
              </div>
              <div className="cell price">
                <div className="price-value">
                  {Number(listing.price).toLocaleString()} ETB
                </div>
              </div>
              <div className="cell action">
                <div className="action-dropdown">
                  <button className="action-btn">Action ▼</button>
                  <div className="action-dropdown-content">
                    <button 
                      className="dropdown-action-btn"
                      onClick={() => {
                        console.log(`Editing property with ID: ${listing.id}`);
                        
                        // Save the full property data to localStorage before navigating
                        try {
                          // Store this specific property in localStorage for the edit form to retrieve
                          localStorage.setItem('property_edit_data', JSON.stringify({
                            id: listing.id,
                            property_type: listing.type,
                            property_for: listing.offering,
                            total_price: listing.price,
                            property_address: listing.address,
                            number_of_bedrooms: listing.bedrooms || "3",
                            number_of_bathrooms: listing.bathrooms || "2",
                            property_size: listing.area || "200",
                            status: listing.status,
                            regional_state: listing.regional_state || "Addis Ababa City Administration",
                            city: listing.city || "Addis Ababa",
                            description: listing.description || "Property description not available",
                            media: listing.image ? [listing.image] : [],
                            amenities: listing.amenities || ["parking_space", "internet_wifi", "water_supply", "electricity"]
                          }));
                          console.log('Property data saved to localStorage for editing');
                        } catch (error) {
                          console.error('Error saving property data to localStorage:', error);
                        }
                        
                        // Navigate to the edit form with the property ID
                        navigate(`/property-edit/${listing.id}`);
                      }}
                    >Edit</button>
                    <button 
                      className="dropdown-action-btn"
                      onClick={(e) => e.preventDefault()}
                    >Delete</button>
                    <button 
                      className="dropdown-action-btn"
                      onClick={(e) => e.preventDefault()}
                    >View Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .my-listings-container {
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
        }
        
        .listings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        h2 {
          font-size: 24px;
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .listing-count {
          display: inline-block;
          background-color: #8cc63f;
          color: white;
          border-radius: 20px;
          padding: 2px 12px;
          margin-left: 10px;
          font-size: 16px;
        }
        
        .filter-tabs {
          display: flex;
          gap: 10px;
        }
        
        .filter-tab {
          background: none;
          border: none;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          border-radius: 4px;
          color: #555;
        }
        
        .filter-tab.active {
          background-color: #f0f7ff;
          color: #2196f3;
          font-weight: bold;
        }
        
        .list-property-btn {
          background-color: #8cc63f;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .listings-table {
          width: 100%;
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .table-header {
          display: flex;
          background-color: #f5f5f5;
          padding: 12px 16px;
          font-weight: bold;
          color: #555;
          border-bottom: 1px solid #eee;
        }
        
        .header-cell, .cell {
          padding: 8px;
        }
        
        .serial-number {
          flex: 0 0 50px;
        }
        
        .picture {
          flex: 0 0 100px;
          text-align: center;
        }
        
        .address {
          flex: 1;
        }
        
        .type {
          flex: 0 0 100px;
        }
        
        .offering {
          flex: 0 0 100px;
          text-align: center;
        }
        
        .status {
          flex: 0 0 100px;
          text-align: center;
        }
        
        .price {
          flex: 0 0 180px;
        }
        
        .action {
          flex: 0 0 100px;
        }
        
        .table-row {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }
        
        .table-row:last-child {
          border-bottom: none;
        }
        
        .table-row:hover {
          background-color: #f9f9f9;
        }
        
        .table-row.new-listing {
          background-color: #f0f9eb;
          border-left: 4px solid #8cc63f;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .table-row.new-listing::after {
          content: "NEW";
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #8cc63f;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
        }
        
        .cell img {
          width: 80px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
          max-width: 100%;
        }
        
        .offering-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .offering-badge.sale {
          background-color: #e3f2fd;
          color: #2196f3;
        }
        
        .offering-badge.rent {
          background-color: #f3e5f5;
          color: #9c27b0;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .status-badge.active {
          background-color: #e6f7e6;
          color: #4caf50;
        }
        
        .status-badge.sold {
          background-color: #e3f2fd;
          color: #2196f3;
        }
        
        .status-badge.pending {
          background-color: #fff8e1;
          color: #ff9800;
        }
        
        .status-badge.rejected {
          background-color: #ffebee;
          color: #f44336;
        }
        
        .price-value {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        
        .action-dropdown {
          position: relative;
          display: inline-block;
        }
        
        .action-btn {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .action-dropdown-content {
          display: none;
          position: absolute;
          right: 0;
          background-color: white;
          min-width: 150px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 1;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .dropdown-action-btn {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          font-size: 14px;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .dropdown-action-btn:hover {
          background-color: #f1f1f1;
        }
        
        .action-dropdown:hover .action-dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default PropertyAlert;
