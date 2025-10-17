import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MyPropertyListings from './MyPropertyListings';
import { toast } from 'react-toastify';

const MyPropertyListingsPage = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're coming from the property creation flow
    if (location.state?.fromPromotion) {
      console.log("Detected navigation from property creation flow in MyPropertyListingsPage");
      
      // Show success toast message to confirm listing was created
      toast.success(`Your property has been listed successfully with the ${location.state?.planName || 'Basic'} plan!`, {
        autoClose: 4000,
        position: "top-center"
      });
    }
  }, [location.state]);
  
  return (
    <div className="my-property-listings-page">
      <div className="container">
        <MyPropertyListings initialLoad={true} />
      </div>
    </div>
  );
};

export default MyPropertyListingsPage;
