import React from 'react';
import { Link } from 'react-router-dom';

const ClickablePropertyCard = ({ property }) => {
  return (
    <Link to={`/property/${property._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="property-card" style={{ border: '1px solid #ccc', padding: '16px', margin: '16px', cursor: 'pointer' }}>
        <h3>{property.title}</h3>
        <p>{property.address.street}, {property.address.city}, {property.address.state}</p>
        <p>{property.price}</p>
      </div>
    </Link>
  );
};

const TestClickableCards = () => {
  const properties = [
    {
      _id: '123',
      title: 'Test Property 1',
      address: {
        street: '123 Main St',
        city: 'Testville',
        state: 'TS',
      },
      price: '$500,000',
    },
  ];

  return (
    <div>
      {properties.map((property) => (
        <ClickablePropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};

export default TestClickableCards;
