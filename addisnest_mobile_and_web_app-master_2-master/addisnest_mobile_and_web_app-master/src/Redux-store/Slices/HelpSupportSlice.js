import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch FAQ categories
export const GetFaqCategories = createAsyncThunk(
  "helpSupport/getFaqCategories",
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the actual API
      const response = await Api.getWithtoken("faqs/categories");
      return response;
    } catch (error) {
      console.error("Error fetching FAQ categories:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch FAQ categories"
      });
    }
  }
);

// Async thunk to fetch FAQs by category
export const GetFaqsByCategory = createAsyncThunk(
  "helpSupport/getFaqsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the actual API
      const response = await Api.getWithtoken(`faqs/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error("Error fetching FAQs by category:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch FAQs"
      });
    }
  }
);

// Async thunk to search FAQs
export const SearchFaqs = createAsyncThunk(
  "helpSupport/searchFaqs",
  async (query, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the actual API
      const response = await Api.getWithtoken(`faqs/search?q=${query}`);
      return response;
    } catch (error) {
      console.error("Error searching FAQs:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to search FAQs"
      });
    }
  }
);

// Create the help support slice
const HelpSupportSlice = createSlice({
  name: "helpSupport",
  initialState: {
    faqCategories: {
      data: [],
      pending: false,
      error: false,
      success: false,
      message: ""
    },
    faqsByCategory: {
      data: {},
      pending: false,
      error: false,
      success: false,
      message: ""
    },
    searchResults: {
      data: [],
      pending: false,
      error: false,
      success: false,
      message: ""
    }
  },
  reducers: {
    clearFaqCategories: (state) => {
      state.faqCategories.data = [];
      state.faqCategories.success = false;
      state.faqCategories.pending = false;
      state.faqCategories.error = false;
    },
    clearFaqsByCategory: (state) => {
      state.faqsByCategory.data = {};
      state.faqsByCategory.success = false;
      state.faqsByCategory.pending = false;
      state.faqsByCategory.error = false;
    },
    clearSearchResults: (state) => {
      state.searchResults.data = [];
      state.searchResults.success = false;
      state.searchResults.pending = false;
      state.searchResults.error = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // GetFaqCategories actions
      .addCase(GetFaqCategories.pending, (state) => {
        state.faqCategories.pending = true;
        state.faqCategories.error = false;
        state.faqCategories.success = false;
      })
      .addCase(GetFaqCategories.fulfilled, (state, action) => {
        state.faqCategories.pending = false;
        
        if (action.payload?.data) {
          state.faqCategories.data = action.payload.data;
          state.faqCategories.success = true;
        } else {
          state.faqCategories.data = [];
          state.faqCategories.error = true;
        }
        
        state.faqCategories.message = action.payload?.message || "";
      })
      .addCase(GetFaqCategories.rejected, (state, action) => {
        state.faqCategories.pending = false;
        state.faqCategories.error = true;
        state.faqCategories.data = [];
        state.faqCategories.message = action.payload?.message || "Failed to fetch FAQ categories";
      })
      
      // GetFaqsByCategory actions
      .addCase(GetFaqsByCategory.pending, (state) => {
        state.faqsByCategory.pending = true;
        state.faqsByCategory.error = false;
        state.faqsByCategory.success = false;
      })
      .addCase(GetFaqsByCategory.fulfilled, (state, action) => {
        state.faqsByCategory.pending = false;
        
        if (action.payload?.data) {
          // Store FAQs by category ID for easy access
          const categoryId = action.meta.arg; // The category ID passed to the thunk
          state.faqsByCategory.data[categoryId] = action.payload.data;
          state.faqsByCategory.success = true;
        } else {
          state.faqsByCategory.error = true;
        }
        
        state.faqsByCategory.message = action.payload?.message || "";
      })
      .addCase(GetFaqsByCategory.rejected, (state, action) => {
        state.faqsByCategory.pending = false;
        state.faqsByCategory.error = true;
        state.faqsByCategory.message = action.payload?.message || "Failed to fetch FAQs";
      })
      
      // SearchFaqs actions
      .addCase(SearchFaqs.pending, (state) => {
        state.searchResults.pending = true;
        state.searchResults.error = false;
        state.searchResults.success = false;
      })
      .addCase(SearchFaqs.fulfilled, (state, action) => {
        state.searchResults.pending = false;
        
        if (action.payload?.data) {
          state.searchResults.data = action.payload.data;
          state.searchResults.success = true;
        } else {
          state.searchResults.data = [];
          state.searchResults.error = true;
        }
        
        state.searchResults.message = action.payload?.message || "";
      })
      .addCase(SearchFaqs.rejected, (state, action) => {
        state.searchResults.pending = false;
        state.searchResults.error = true;
        state.searchResults.data = [];
        state.searchResults.message = action.payload?.message || "Failed to search FAQs";
      });
  }
});

export const { clearFaqCategories, clearFaqsByCategory, clearSearchResults } = HelpSupportSlice.actions;
export default HelpSupportSlice.reducer;
