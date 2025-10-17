import React from "react";
import ManageListings from "../../../admin/ManageListings";
import "../../../../assets/css/mobile-property-listings.css";
import "../../../../assets/css/manage-listings.css";

const PropertyListingsTab = () => {
  return (
    <div className="property-listings-tab">
      <ManageListings />
    </div>
  );
};

export default PropertyListingsTab;
