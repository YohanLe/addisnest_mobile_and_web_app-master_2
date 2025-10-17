// Redux Slices index file
// This file exports all slices for easy import in the store

// Import actual slices
import ChatlistReducer, { GetChatlistData } from './ChatlistSlice';
import WishListReducer, { GetWishList, clearWishlistData } from './WishListSlice';
import AgentAllReducer, { GetAgentAll, clearAgentData } from './AgentAllSlice';
import PropertyListReducer from './PropertyListSlice';
import PropertyDetailReducer, { getPropertyDetails, clearPropertyDetails, getSimilarProperties } from './PropertyDetailSlice';
import RatesListReducer from './RatesListSlice';
import PaymentReducer, { GetUserPayments, resetPayments } from './PaymentSlice';
import HelpSupportReducer, { 
  GetFaqCategories, 
  GetFaqsByCategory, 
  SearchFaqs, 
  clearFaqCategories, 
  clearFaqsByCategory, 
  clearSearchResults 
} from './HelpSupportSlice';
import DashboardReducer, {
  GetDashboardList,
  clearDashboardData
} from './DashboardSlice';
import AuthReducer, { login, logout } from './AuthSlice';
import HomeReducer, { GetHomeData } from './HomeSlice';

// Export the slices
export const AuthSlice = AuthReducer;
export const HomeSlice = HomeReducer;
export const PropertyDetailSlice = PropertyDetailReducer;
export const ChatlistSlice = ChatlistReducer;
export const ClientlistSlice = (state = {}, action) => state;
export const TicketListSlice = (state = {}, action) => state;
export const CitylistSlice = (state = {}, action) => state;
export const WishListSlice = WishListReducer;
export const AgentAllSlice = AgentAllReducer;
export const AgentDetailsSlice = (state = {}, action) => state;
export const LocationaddSlice = (state = {}, action) => state;
export const ServicesListSlice = (state = {}, action) => state;
export const HelpSupportSlice = HelpSupportReducer;
export const DashboardSlice = DashboardReducer;
export const PropertyListSlice = PropertyListReducer;
export const RatesListSlice = RatesListReducer;
export const PaymentSlice = PaymentReducer;

// Export actions for easier access
export {
  GetChatlistData,
  GetWishList,
  clearWishlistData,
  GetAgentAll,
  clearAgentData,
  GetFaqCategories,
  GetFaqsByCategory,
  SearchFaqs,
  clearFaqCategories,
  clearFaqsByCategory,
  clearSearchResults,
  GetDashboardList,
  clearDashboardData,
  login,
  logout,
  GetHomeData,
  getPropertyDetails,
  clearPropertyDetails,
  getSimilarProperties,
  GetUserPayments,
  resetPayments
};
