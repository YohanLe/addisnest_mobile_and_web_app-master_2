import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Apis/Api';
import propertyApi from '../../utils/netlifyApiHandler';
import { transformApiDataToPropertyDetail } from '../../utils/propertyTransformers';

// Async thunk for fetching property details
export const getPropertyDetails = createAsyncThunk(
  'propertyDetail/getPropertyDetails',
  async (propertyId, { rejectWithValue }) => {
    try {
      // Validate the property ID
      if (!propertyId || propertyId === 'undefined' || propertyId === 'null') {
        console.log('Invalid property ID');
        return rejectWithValue('Invalid property ID');
      }
      
      // Check if this is a valid MongoDB ObjectID
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
      if (!isValidMongoId) {
        console.log('Not a valid MongoDB ID');
        return rejectWithValue('Not a valid MongoDB ID');
      }
      
      console.log('Fetching property with ID:', propertyId);
      
      const response = await propertyApi.getPropertyById(propertyId);
        
      // Validate response
      if (!response || !response.data) {
        console.log('API returned no data');
        return rejectWithValue('API returned no data');
      }
      
      // Check for success/failure in the response
      if (response.data.hasOwnProperty('success') && response.data.success === false) {
        console.log('API returned unsuccessful response');
        return rejectWithValue(response.data.error || 'API returned unsuccessful response');
      }
      
      console.log('API returned successful response');
      
      // Extract and transform the data
      const apiData = response.data.data || response.data;
      console.log('Raw API data structure:', JSON.stringify(apiData, null, 2));
      
      if (!apiData) {
        console.log('API data is empty or undefined');
        return rejectWithValue('API data is empty or undefined');
      }
      
      // Transform the API data
      return transformApiDataToPropertyDetail(apiData);

    } catch (error) {
      console.error('Error in getPropertyDetails thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property details');
    }
  }
);

// Async thunk for fetching similar properties
export const getSimilarProperties = createAsyncThunk(
  'propertyDetail/getSimilarProperties',
  async (propertyDetails, { rejectWithValue }) => {
    try {
      if (!propertyDetails) {
        console.log('No property details provided for getting similar properties');
        return rejectWithValue('No property details provided');
      }
      
      // Extract criteria to find similar properties
      const { 
        property_type, 
        propertyType, 
        regional_state, 
        city, 
        property_for, 
        propertyFor,
        offeringType,
        price,
        total_price,
        _id
      } = propertyDetails;
      
      // Build query params to find similar properties
      const queryParams = new URLSearchParams({
        propertyType: property_type || propertyType || 'all',
        regionalState: regional_state || 'all',
        limit: 6,
        page: 1
      });
      
      // Add optional parameters if they exist
      if (city) queryParams.append('city', city);
      if (property_for || propertyFor || offeringType) {
        queryParams.append('for', property_for || propertyFor || offeringType);
      }
      
      console.log('Fetching similar properties with query parameters');
      
      const queryObj = Object.fromEntries(queryParams.entries());
      const response = await propertyApi.getProperties(queryObj);
      
      if (!response || !response.data) {
        console.log('API returned no data for similar properties');
        return rejectWithValue('API returned no data for similar properties');
      }
      
      console.log('Similar properties response:', response.data);
      
      // Get properties from the response
      const properties = response.data.properties || response.data.data || [];
      
      // Filter out the current property
      const filteredProperties = properties.filter(prop => 
        prop._id !== _id && prop.id !== _id
      );
      
      // Transform each property to consistent format
      return filteredProperties.map(prop => transformApiDataToPropertyDetail(prop));
      
    } catch (error) {
      console.error('Error in getSimilarProperties thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch similar properties');
    }
  }
);

// Initial state
const initialState = {
  property: null,
  similarProperties: [],
  loading: false,
  loadingSimilar: false,
  error: null,
  errorSimilar: null
};

// Create slice
const propertyDetailSlice = createSlice({
  name: 'propertyDetail',
  initialState,
  reducers: {
    clearPropertyDetails: (state) => {
      state.property = null;
      state.similarProperties = [];
      state.error = null;
      state.errorSimilar = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPropertyDetails
      .addCase(getPropertyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(getPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch property details';
      })
      
      // getSimilarProperties
      .addCase(getSimilarProperties.pending, (state) => {
        state.loadingSimilar = true;
        state.errorSimilar = null;
      })
      .addCase(getSimilarProperties.fulfilled, (state, action) => {
        state.loadingSimilar = false;
        state.similarProperties = action.payload;
      })
      .addCase(getSimilarProperties.rejected, (state, action) => {
        state.loadingSimilar = false;
        state.errorSimilar = action.payload || 'Failed to fetch similar properties';
      });
  },
});

// Export actions and reducer
export const { clearPropertyDetails } = propertyDetailSlice.actions;

export default propertyDetailSlice.reducer;
