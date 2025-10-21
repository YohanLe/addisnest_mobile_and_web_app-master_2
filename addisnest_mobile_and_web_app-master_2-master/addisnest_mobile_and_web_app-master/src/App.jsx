import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import HomePage from './components/home';
import PropertyListPage from './components/Property-list/PropertyListPage';
import PropertyDetail from './components/property-detail';
import AccountManager from './components/account-management';
import AboutUs from './components/about-us';
import ContactUs from './components/contact-us';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageListings from './components/admin/ManageListings';
import ManageUsers from './components/admin/ManageUsers';
import PartnershipRequests from './components/admin/PartnershipRequestsPage';
import Chat from './components/chat';
import Favorite from './components/favorite';
import FindAgent from './components/find-agent';
import HelpSupport from './components/Help-support';
import PrivacyPolicy from './components/privacy-policy';
import TermsOfService from './components/terms-of-service';
import PropertyListForm from './components/property-list-form';
import PropertyEditForm from './components/property-edit-form';
import ChoosePromotion from './components/payment-method/choose-propmo';
import { AuthUserDetails } from './Redux-store/Slices/AuthSlice';
import { isAuthenticated } from './utils/tokenHandler';

// Simple placeholder component for missing routes
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>This page is under development.</p>
  </div>
);

const App = () => {
  const dispatch = useDispatch();

  // Initialize user authentication on app load
  useEffect(() => {
    if (isAuthenticated()) {
      console.log('User is authenticated, fetching user details...');
      dispatch(AuthUserDetails());
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property-list" element={<PropertyListPage />} />
          <Route path="/property-detail/:id" element={<PropertyDetail />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/account-management" element={<AccountManager />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/find-agent/*" element={<FindAgent />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/manage-listings" element={<ManageListings />} />
          <Route path="/admin/manage-listings" element={<ManageListings />} />
          <Route path="/partnership-requests" element={<PartnershipRequests />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/property-list-form" element={<PropertyListForm />} />
          <Route path="/property-edit/:id" element={<PropertyEditForm />} />
          <Route path="/payment-method/choose-promotion" element={<ChoosePromotion />} />
          <Route path="/for-sale" element={<PlaceholderPage title="For Sale" />} />
          <Route path="/for-rent" element={<PlaceholderPage title="For Rent" />} />
          <Route path="/notification" element={<PlaceholderPage title="Notifications" />} />
          <Route path="/mortgage-calculator" element={<PlaceholderPage title="Mortgage Calculator" />} />
          <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
