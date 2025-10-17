import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch all agents
export const GetAgentAll = createAsyncThunk(
  "agent/getAllAgents",
  async (params, { rejectWithValue }) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      
      if (params.region) queryParams.append('region', params.region);
      if (params.specialty) queryParams.append('specialty', params.specialty);
      if (params.language) queryParams.append('language', params.language);
      if (params.rating) queryParams.append('rating', params.rating);
      if (params.minExperience) queryParams.append('minExperience', params.minExperience);
      if (params.city) queryParams.append('city', params.city);
      if (params.verifiedOnly) queryParams.append('verifiedOnly', params.verifiedOnly);
      
      const queryString = queryParams.toString();
      
      // In a real implementation, this would call the API with params
      const response = await Api.getPublic(`agents/list${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching agents:", error);
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to fetch agents"
      });
    }
  }
);

// Create the agent slice
const AgentAllSlice = createSlice({
  name: "AgentAll",
  initialState: {
    data: {
      data: {
        agents: [], // Agent list
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
    clearAgentData: (state) => {
      state.data.data.agents = [];
      state.data.success = false;
      state.data.pending = false;
      state.data.error = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // GetAgentAll actions
      .addCase(GetAgentAll.pending, (state) => {
        state.data.pending = true;
        state.data.error = false;
        state.data.success = false;
      })
      .addCase(GetAgentAll.fulfilled, (state, action) => {
        state.data.pending = false;
        
        // Handle successful response
        if (action.payload?.data) {
          state.data.data = action.payload.data;
          state.data.success = true;
        } else {
          // If response structure is different than expected
          state.data.data = {
            agents: [],
            totalCount: 0,
            currentPage: 1,
            totalPages: 1
          };
          state.data.error = true;
        }
        
        state.data.message = action.payload?.message || "";
      })
      .addCase(GetAgentAll.rejected, (state, action) => {
        state.data.pending = false;
        state.data.error = true;
        state.data.message = action.payload?.message || "Failed to fetch agents";
        
        // Clear data on error
        state.data.data = {
          agents: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 1
        };
      });
  }
});

export const { clearAgentData } = AgentAllSlice.actions;
export default AgentAllSlice.reducer;
