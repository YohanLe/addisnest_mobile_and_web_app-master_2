import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Apis/Api';
import propertyApi from '../../utils/netlifyApiHandler';

// Async thunk for fetching home page data (all properties)
export const GetHomeData = createAsyncThunk(
  'home/GetHomeData',
  async (params, { rejectWithValue }) => {
    try {
      const { type = 'buy', page = 1, limit = 12, featured = false } = params;
      
      // Enhanced logging for debugging
      console.log('Fetching all properties for home page, not filtering by featured status');
      
      // Make the API request using the dedicated properties handler
      const response = await propertyApi.getProperties({
        for: type,
        page,
        limit
      });
      
      // Log the response
      console.log('API Response for properties:', response);
      
      // Return the data
      return response;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch home data');
    }
  }
);

// Async thunk for fetching all property listings
export const GetAllPropertyListings = createAsyncThunk(
  'home/GetAllPropertyListings',
  async (params, { rejectWithValue }) => {
    try {
      const {
        type = 'buy',
        page = 1,
        limit = 9,
        search = '',
        priceRange = 'any',
        propertyType = 'all',
        bedrooms = 'any',
        bathrooms = 'any',
        regionalState = 'all',
        sortBy = 'newest',
        offeringType = 'For Sale',
      } = params;

      // Use the properties handler instead of direct API call
      console.log(`Fetching properties with query params for ${type}`);
      
      const response = await propertyApi.getProperties({
        for: type,
        page,
        limit,
        search,
        priceRange,
        propertyType,
        bedrooms,
        bathrooms,
        regionalState,
        sortBy,
        offeringType,
      });
      
      console.log('Properties response:', response);
       response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return response;
    } catch (error) {
      console.error('Error fetching property listings:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch property listings');
    }
  }
);

const initialState = {
  HomeData: {
    data: null,
    pending: false,
    error: null
  },
  PropertyListings: {
    data: null,
    pending: false,
    error: null
  }
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    resetHomeData: (state) => {
      state.HomeData = {
        data: null,
        pending: false,
        error: null
      };
    },
    resetPropertyListings: (state) => {
      state.PropertyListings = {
        data: null,
        pending: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Featured properties reducers
      .addCase(GetHomeData.pending, (state) => {
        state.HomeData.pending = true;
        state.HomeData.error = null;
      })
      .addCase(GetHomeData.fulfilled, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.data = action.payload;
      })
      .addCase(GetHomeData.rejected, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.error = action.payload;
      })
      
      // All property listings reducers
      .addCase(GetAllPropertyListings.pending, (state) => {
        state.HomeData.pending = true;
        state.HomeData.error = null;
      })
      .addCase(GetAllPropertyListings.fulfilled, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.data = action.payload;
      })
      .addCase(GetAllPropertyListings.rejected, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.error = action.payload;
      });
  }
});

export const { resetHomeData } = HomeSlice.actions;
export default HomeSlice.reducer;
