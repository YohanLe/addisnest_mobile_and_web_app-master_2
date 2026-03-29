import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch wishlist data
export const GetWishList = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      const response = await Api.getWithtoken("wishlist/list");
      return response;
    } catch (error) {
      // For development, return mock data when API fails
      console.error("Error fetching wishlist:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch wishlist"
      });
    }
  }
);

// Create the wishlist slice
const WishListSlice = createSlice({
  name: "WishList",
  initialState: {
    data: {
      data: {
        data: [], // Wishlist items
        totalCount: 0,
        currentPage: 1,
        totalPages: 1
      },
      pending: false,
      error: false,
      success: false,
      message: ""
    }
  },
  reducers: {
    clearWishlistData: (state) => {
      state.data.data.data = [];
      state.data.success = false;
      state.data.pending = false;
      state.data.error = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // GetWishList actions
      .addCase(GetWishList.pending, (state) => {
        state.data.pending = true;
        state.data.error = false;
        state.data.success = false;
      })
      .addCase(GetWishList.fulfilled, (state, action) => {
        state.data.pending = false;
        
        // Handle successful response
        if (action.payload?.data) {
          state.data.data = action.payload.data;
          state.data.success = true;
        } else {
          // If response structure is different than expected
          state.data.data = {
            data: [],
            totalCount: 0,
            currentPage: 1,
            totalPages: 1
          };
          state.data.error = true;
        }
        
        state.data.message = action.payload?.message || "";
      })
      .addCase(GetWishList.rejected, (state, action) => {
        state.data.pending = false;
        state.data.error = true;
        state.data.message = action.payload?.message || "Failed to fetch wishlist";
        
        // Clear data on error
        state.data.data = {
          data: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1
        };
      });
  }
});

export const { clearWishlistData } = WishListSlice.actions;
export default WishListSlice.reducer;
