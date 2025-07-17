import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch dashboard data
export const GetDashboardList = createAsyncThunk(
  "dashboard/getDashboardList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("dashboard");
      return response;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch dashboard data"
      });
    }
  }
);

// Create the dashboard slice
const DashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    Data: {
      data: null,
      pending: false,
      error: false,
      success: false,
      message: ""
    }
  },
  reducers: {
    clearDashboardData: (state) => {
      state.Data.data = null;
      state.Data.success = false;
      state.Data.pending = false;
      state.Data.error = false;
      state.Data.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetDashboardList.pending, (state) => {
        state.Data.pending = true;
        state.Data.error = false;
        state.Data.success = false;
      })
      .addCase(GetDashboardList.fulfilled, (state, action) => {
        state.Data.pending = false;
        
        if (action.payload?.data) {
          state.Data.data = action.payload;
          state.Data.success = true;
        } else {
          state.Data.data = null;
          state.Data.error = true;
        }
        
        state.Data.message = action.payload?.message || "";
      })
      .addCase(GetDashboardList.rejected, (state, action) => {
        state.Data.pending = false;
        state.Data.error = true;
        state.Data.data = null;
        state.Data.message = action.payload?.message || "Failed to fetch dashboard data";
      });
  }
});

export const { clearDashboardData } = DashboardSlice.actions;
export default DashboardSlice.reducer;
