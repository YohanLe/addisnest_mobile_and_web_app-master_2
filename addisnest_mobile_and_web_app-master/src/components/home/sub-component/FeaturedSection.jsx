import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
import { Property1, Property2, Property3 } from '../../../assets/images';
import { SvgLocationIcon, SvgFavoriteOutlineIcon, SvgRightIcon } from '../../../assets/svg-files/SvgFiles';

const FeaturedSection = () => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home.HomeData);
  
  useEffect(() => {
    // Fetch featured properties (type 'buy' for example)
    dispatch(GetHomeData({ type: 'buy', page: 1, limit: 6 }));
  }, [dispatch]);

  // Fallback properties if API fails or is pending
  const fallbackProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in City Center',
      address: 'Bole, Addis Ababa',
      price: 5500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      propertyType: 'Apartment',
      imageUrl: Property1
    },
    {
      _id: '2',
      title: 'Luxury Villa with Garden',
      address: 'CMC, Addis Ababa',
      price: 12000000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3200,
      propertyType: 'House',
      imageUrl: Property2
    },
    {
      _id: '3',
      title: 'Cozy Studio for Professionals',
      address: 'Kazanchis, Addis Ababa',
      price: 2800000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 800,
      propertyType: 'Studio',
      imageUrl: Property3
    }
  ];

  // Use data from API if available, otherwise use fallback
  const properties = data?.data?.length > 0 ? data.data : fallbackProperties;

  // Format price to display with commas and ETB
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="common-section featured-section">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-title d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2>Featured Properties</h2>
                <p>Explore handpicked properties across Ethiopia</p>
              </div>
              <Link to="/property-list" className="view-all-link">
                View All <SvgRightIcon />
              </Link>
            </div>
          </div>
        </div>

        <div className="row">
          {pending ? (
            <div className="col-12 text-center">
              <p>Loading properties...</p>
            </div>
          ) : (
            properties.slice(0, 3).map((property) => (
              <div key={property._id} className="col-md-4 mb-4">
                <div className="property-card">
                  <div className="property-image">
                    <img 
                      src={property.imageUrl || property.images?.[0] || Property1} 
                      alt={property.title} 
                      className="img-fluid"
                    />
                    <button className="favorite-btn">
                      <SvgFavoriteOutlineIcon />
                    </button>
                    <div className="property-type">{property.propertyType}</div>
                  </div>
                  <div className="property-content">
                    <h4 className="property-title">{property.title}</h4>
                    <div className="property-location">
                      <SvgLocationIcon /> {property.address}
                    </div>
                    <div className="property-price">
                      {formatPrice(property.price)}
                    </div>
                    <div className="property-features">
                      <span>{property.bedrooms} Beds</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>{property.squareFeet} sqft</span>
                    </div>
                    <Link 
                      to={`/property/${property._id}`} 
                      className="view-property-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
