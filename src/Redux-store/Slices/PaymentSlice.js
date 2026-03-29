import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Apis/Api';
import { getToken } from '../../utils/tokenHandler';

// Async thunk for fetching user payment history
export const GetUserPayments = createAsyncThunk(
  'payments/getUserPayments',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is authenticated before making the request
      const token = getToken();
      if (!token) {
        // Silently handle unauthenticated state - don't trigger a rejection
        return { authenticated: false, data: [] };
      }
      
      const response = await api.get('/payments/history');
      return { authenticated: true, data: response.data };
    } catch (error) {
      // If error is 401 Unauthorized, handle it silently
      if (error.response?.status === 401) {
        return { authenticated: false, data: [] };
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch payment history');
    }
  }
);

const initialState = {
  userPayments: {
    data: null,
    pending: false,
    error: null
  }
};

const PaymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    resetPayments: (state) => {
      state.userPayments = {
        data: null,
        pending: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserPayments.pending, (state) => {
        state.userPayments.pending = true;
        state.userPayments.error = null;
      })
      .addCase(GetUserPayments.fulfilled, (state, action) => {
        state.userPayments.pending = false;
        // Handle both authenticated and unauthenticated responses
        state.userPayments.data = action.payload.authenticated ? action.payload.data : null;
      })
      .addCase(GetUserPayments.rejected, (state, action) => {
        state.userPayments.pending = false;
        state.userPayments.error = action.payload;
      });
  }
});

export const { resetPayments } = PaymentSlice.actions;
export default PaymentSlice.reducer;
