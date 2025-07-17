import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Sample data for agents (this would be replaced with API data in production)
const sampleAgents = [
  {
    id: 1,
    name: 'Samuel Tesfaye',
    profilePicture: '',
    region: 'Addis Ababa',
    rating: 4.8,
    experience: 5,
    phone: '+251 91 234 5678',
    specialties: ['Buying', 'Selling', 'Luxury'],
    languages: ['Amharic', 'English'],
    bio: 'Experienced real estate agent specialized in luxury properties in Addis Ababa. Dedicated to helping clients find their dream homes.',
    email: 'samuel.tesfaye@example.com',
    isVerified: true,
    licenseNumber: 'ET-RE-12345',
    currentListings: 12,
    transactionsClosed: 45,
    reviews: [
      {
        id: 1,
        rating: 5,
        text: 'Samuel helped us find our dream home in a very competitive market. His knowledge of Addis Ababa neighborhoods was invaluable.'
      },
      {
        id: 2,
        rating: 4,
        text: 'Great communication throughout the buying process. Would recommend for anyone looking for properties in the city center.'
      }
    ]
  },
  {
    id: 2,
    name: 'Frehiwot Haile',
    profilePicture: '',
    region: 'Bahir Dar',
    rating: 4.5,
    experience: 3,
    phone: '+251 92 345 6789',
    specialties: ['Residential', 'Renting'],
    languages: ['Amharic', 'English', 'Tigrinya'],
    bio: 'Helping families find the perfect home in Bahir Dar. Specializing in residential properties with focus on customer satisfaction.',
    email: 'frehiwot.haile@example.com',
    isVerified: true,
    licenseNumber: 'ET-RE-23456',
    currentListings: 8,
    transactionsClosed: 27,
    reviews: [
      {
        id: 1,
        rating: 5,
        text: 'Frehiwot was amazing to work with! She found us the perfect apartment with a lake view.'
      }
    ]
  },
  {
    id: 3,
    name: 'Dawit Bekele',
    profilePicture: '',
    region: 'Adama',
    rating: 5.0,
    experience: 7,
    phone: '+251 93 456 7890',
    specialties: ['Commercial', 'Investment', 'Farmland'],
    languages: ['Amharic', 'Afaan Oromo'],
    bio: 'Commercial real estate expert with 7 years of experience in the Adama market. Specialized in investment properties and farmland.',
    email: 'dawit.bekele@example.com',
    isVerified: true,
    licenseNumber: 'ET-RE-34567',
    currentListings: 15,
    transactionsClosed: 63,
    reviews: [
      {
        id: 1,
        rating: 5,
        text: 'Dawit helped me find the perfect commercial space for my business. Highly recommend!'
      },
      {
        id: 2,
        rating: 5,
        text: 'Excellent knowledge of the local market and investment opportunities.'
      },
      {
        id: 3,
        rating: 5,
        text: 'Great experience working with Dawit on purchasing farmland outside Adama.'
      }
    ]
  }
];

// Async thunks for API calls
export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await Api.get("/agents");
      // return response.data;
      
      // For now, just return sample data
      return sampleAgents;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAgentDetails = createAsyncThunk(
  "agents/fetchAgentDetails",
  async (agentId, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await Api.get(`/agents/${agentId}`);
      // return response.data;
      
      // For now, just find the agent in sample data
      const agent = sampleAgents.find(agent => agent.id === parseInt(agentId));
      if (!agent) {
        throw new Error("Agent not found");
      }
      return agent;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
  filters: {
    region: '',
    specialty: '',
    language: '',
    rating: '',
    verifiedOnly: false
  }
};

const AgentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    setAgentDetails: (state, action) => {
      state.selectedAgent = action.payload;
    },
    clearAgentDetails: (state) => {
      state.selectedAgent = null;
    },
    setAgentFilters: (state, action) => {
      state.filters = action.payload;
    },
    resetAgentFilters: (state) => {
      state.filters = {
        region: '',
        specialty: '',
        language: '',
        rating: '',
        verifiedOnly: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAgents
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchAgentDetails
      .addCase(fetchAgentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAgent = action.payload;
      })
      .addCase(fetchAgentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setAgentDetails,
  clearAgentDetails,
  setAgentFilters,
  resetAgentFilters
} = AgentSlice.actions;
export default AgentSlice.reducer;
