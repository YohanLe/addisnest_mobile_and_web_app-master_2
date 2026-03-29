import React from 'react';
import { useSelector } from 'react-redux';
import { 
  SvgPropertyIcon, 
  SvgMoneyIcon, 
  SvgLocationPinIcon, 
  SvgHappyClientIcon 
} from '../../../assets/svg-files/SvgFiles';

const StatisticsBar = () => {
  const { data } = useSelector((state) => state.Home?.HomeData || { data: null });
  
  // Calculate statistics (default values if data isn't available)
  const stats = React.useMemo(() => {
    // Default values
    let totalProperties = 1223;
    let avgPrice = 5200000;
    let mostPopularArea = 'Bole';
    let clientsSatisfied = 500;
    
    // Update with real data if available
    if (data && data.data && data.data.length > 0) {
      totalProperties = data.total || data.data.length;
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
    
    return { totalProperties, avgPrice, mostPopularArea, clientsSatisfied };
  }, [data]);
  
  // Format price to display with commas and ETB
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(price).replace('ETB', 'ETB ');
  };

  // Keep only the Happy Clients statistic
  const statItems = [
    {
      value: `${stats.clientsSatisfied}+`,
      label: 'Happy Clients',
      icon: <SvgHappyClientIcon />,
      color: '#f6bb42'
    }
  ];

  return (
    <section className="statistics-bar py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          {statItems.map((item, index) => (
            <div 
              key={index} 
              className="col-8 col-md-6 col-lg-4"
            >
              <div 
                className="stat-card"
                style={{ 
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '20px 15px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: '1px solid #f0f0f0',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div 
                  className="stat-icon mb-3"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item.color === '#4a89dc' ? '#e8f1fd' :
                                    item.color === '#37bc9b' ? '#e6f7f3' :
                                    item.color === '#e9573f' ? '#feeae6' : '#fff8e1',
                    color: item.color
                  }}
                >
                  <div style={{ 
                    transform: 'scale(0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {item.icon}
                  </div>
                </div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 10px 0',
                    color: '#333'
                  }}
                >
                  {item.value}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: '0',
                    fontWeight: '500'
                  }}
                >
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsBar;
