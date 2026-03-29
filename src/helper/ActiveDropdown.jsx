import React from 'react';
import { Link } from 'react-router-dom';

const ActiveDropdown = ({ item }) => {
  return (
    <div className="dropdown">
      <button className="dropdown-toggle btn btn-sm btn-light">
        Actions
      </button>
      <div className="dropdown-menu">
        <Link to={`/property-detail/${item?.id || '0'}`} className="dropdown-item">
          View
        </Link>
        <Link to={`/property-edit/${item?.id || '0'}`} className="dropdown-item">
          Edit
        </Link>
        {/* More actions can be added here if needed */}
      </div>
    </div>
  );
};

export default ActiveDropdown;
