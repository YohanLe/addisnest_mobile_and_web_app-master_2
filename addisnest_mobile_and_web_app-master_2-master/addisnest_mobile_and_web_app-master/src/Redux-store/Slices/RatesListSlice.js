import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create a dummy async thunk for fetching rates
export const fetchRates = createAsyncThunk(
  'rates/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder for actual API call
      return {
        rates: [
          { id: 1, name: 'Standard Rate', value: 3.5 },
          { id: 2, name: 'Premium Rate', value: 4.2 },
          { id: 3, name: 'Special Rate', value: 2.8 },
        ]
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  rates: [],
  loading: false,
  error: null,
};

// Create the slice
const ratesListSlice = createSlice({
  name: 'rates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload.rates;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ratesListSlice.reducer;
