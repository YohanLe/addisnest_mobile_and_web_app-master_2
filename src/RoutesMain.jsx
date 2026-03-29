import React from 'react';
import HomePage from './components/home/index';
import SigninPage from './components/auth/SigninPage';
import SignUpPage from './components/auth/SignUpPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import NewPasswordPage from './components/auth/NewPasswordPage';
import OTPPage from './components/auth/OTPPage';
import TestOtpFlow from './helper/TestOtpFlow';
import PropertyListPage from './components/Property-list/PropertyListPage';
import PropertyRentListPage from './components/property-rent-list/PropertyRentListPage';
import PropertySellListPage from './components/Property-sell-list/index';
import PropertyDetailMain from './components/property-detail/index';
import FindAgentPage from './components/find-agent/FindAgentPage';
import ContactusPage from './components/contact-us/ContactusPage';
import ChatPage from './components/chat/index';
import FavoritePage from './components/favorite/index';
import AccountManagementPage from './components/account-management/index';
import MyProfilePage from './components/account-management/MyProfilePage';
import { UploaderDemo } from './components/image-uploder';
import { LocationPopupDemo } from './components/location-popup';
import { MortgageCalculatorDemo } from './components/mortgage-calculator';
import AboutUsPage from './components/about-us/index';
import PrivacyPolicyPage from './components/privacy-policy/index';
import TermsOfServicePage from './components/terms-of-service/index';
import PartnerWithUsPage from './components/partner-with-us/index';
import PartnershipRequestsPage from './components/admin/PartnershipRequestsPage';

// All main routes are now implemented with actual components

export {
  HomePage,
  SigninPage,
  SignUpPage,
  ForgotPasswordPage,
  NewPasswordPage,
  OTPPage,
  TestOtpFlow,
  PropertyListPage,
  PropertyRentListPage,
  PropertySellListPage,
  PropertyDetailMain,
  FindAgentPage,
  ContactusPage,
  ChatPage,
  FavoritePage,
  AccountManagementPage,
  UploaderDemo,
  LocationPopupDemo,
  MortgageCalculatorDemo,
  MyProfilePage,
  AboutUsPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  PartnerWithUsPage,
  PartnershipRequestsPage
};
