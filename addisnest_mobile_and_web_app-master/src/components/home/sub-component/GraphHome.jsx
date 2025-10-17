import React from 'react';
import { useSelector } from 'react-redux';

const GraphHome = () => {
  const { data } = useSelector((state) => state.Home.HomeData || { data: null });
  
  // Calculate statistics (default values if data isn't available)
  const stats = React.useMemo(() => {
    // Default values
    let totalProperties = 1223;
    let avgPrice = 5200000;
    let mostPopularArea = 'Bole';
    
    // Update with real data if available
    if (data && data.data && data.data.length > 0) {
      totalProperties = data.data.length;
      avgPrice = data.data.reduce((sum, property) => sum + (property.price || 0), 0) / data.data.length;
      
      // Count properties by area to find most popular
      const areaCounts = data.data.reduce((counts, property) => {
        const area = property.address ? property.address.split(',')[0].trim() : 'Unknown';
        counts[area] = (counts[area] || 0) + 1;
        return counts;
      }, {});
      
      const mostPopular = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])[0];
      if (mostPopular) {
        mostPopularArea = mostPopular[0];
      }
    }
    
    return { totalProperties, avgPrice, mostPopularArea };
  }, [data]);
  
  // Format price to display with commas and ETB
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="graph-home-section py-4 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="stat-card text-center p-3">
              <h3>{stats.totalProperties}+</h3>
              <p>Properties Available</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card text-center p-3">
              <h3>{formatPrice(stats.avgPrice)}</h3>
              <p>Average Property Price</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stat-card text-center p-3">
              <h3>{stats.mostPopularArea}</h3>
              <p>Most Popular Area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphHome;
