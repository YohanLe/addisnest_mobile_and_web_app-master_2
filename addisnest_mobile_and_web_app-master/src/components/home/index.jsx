import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetHomeData } from '../../Redux-store/Slices/HomeSlice';
import PropertyListPage from '../Property-list/PropertyListPage';
import BannerSection from './sub-component/BannerSection';
//import TestimonialsSection from './sub-component/TestimonialsSection';
//import CTASection from './sub-component/CTASection';
//import NeighborhoodGuide from './sub-component/NeighborhoodGuide';

const HomePage = () => {
  const dispatch = useDispatch();
  const homeData = useSelector((state) => state.Home?.HomeData);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Determine property count based on screen width
  const propertyCount = windowWidth <= 767 ? 5 : 12;

  // Add event listener to track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("HomePage component mounted");
    
    // Debug Redux state
    if (homeData) {
      console.log("HomeData in HomePage:", homeData);
    }
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [homeData]);

  return (
    <div className="home-page" style={{ 
      backgroundColor: '#f9f9f9',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <BannerSection />
      
      <div className="property-section" style={{ marginTop: '40px', marginBottom: '50px' }}>
        <PropertyListPage isHomePage={true} propertyCount={propertyCount} propertyType="mixed" />
      </div>
      
      <style jsx="true">{`
        @media screen and (max-width: 767px) {
          .property-section {
            margin-top: 0 !important;
            margin-left: -50vw !important;
            margin-right: -50vw !important;
            margin-bottom: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            background-color: #f9f9f9;
            width: 100vw !important;
            max-width: 100vw !important;
            position: relative !important;
            left: 50% !important;
            right: 50% !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          
          .property-section .container {
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          .property-section .row {
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          .home-page {
            width: 100% !important;
            max-width: 100% !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Ensure property images are edge-to-edge */
          .property-card .property-image {
            width: 100vw !important;
            max-width: 100vw !important;
            position: relative !important;
            overflow: hidden !important;
            left: 0 !important;
            right: 0 !important;
            margin: 0 auto !important;
          }
          
          .property-card .property-image img {
            width: 100vw !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
            border-radius: 0 !important;
            margin: 0 auto !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Fix for property card container */
          .property-card {
            width: 100vw !important;
            max-width: 100vw !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border-radius: 0 !important;
            left: 0 !important;
            right: 0 !important;
          }
          
          /* Fix for row and column containers */
          .property-list-page .row,
          .home-page .row {
            width: 100vw !important;
            max-width: 100vw !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          
          .property-list-page .col,
          .property-list-page [class*="col-"],
          .home-page .col,
          .home-page [class*="col-"] {
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
