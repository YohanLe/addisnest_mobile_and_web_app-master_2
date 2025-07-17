import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch chat list
export const GetChatlistData = createAsyncThunk(
  "chat/getChatlist",
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would call the API
      // const response = await Api.get("chat/list");
      // return response.data;
      
      // For now, we'll return mock data
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "John Smith",
            lastMessage: "Hello, I'm interested in the property listing",
            lastMessageTime: new Date().toISOString(),
            profileImage: null,
            isOnline: true,
            messages: [
              {
                id: 1,
                content: "Hello, I'm interested in the property listing on Main Street",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                isFromUser: false,
                sender: 'user'
              },
              {
                id: 2,
                content: "Great! I'd be happy to help you with that property. What would you like to know?",
                timestamp: new Date(Date.now() - 3000000).toISOString(),
                isFromUser: true,
                sender: 'agent'
              }
            ],
            isAccepted: true
          },
          {
            id: 2,
            name: "Sarah Johnson",
            lastMessage: "Is the property still available?",
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
            profileImage: null,
            isOnline: false,
            messages: [
              {
                id: 1,
                content: "Is the property still available?",
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                isFromUser: false,
                sender: 'user'
              }
            ],
            isAccepted: false
          }
        ]
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the chat list slice
const ChatlistSlice = createSlice({
  name: "Chatlist",
  initialState: {
    Data: {
      data: [],
      pending: false,
      error: false,
      success: false
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GetChatlistData actions
      .addCase(GetChatlistData.pending, (state) => {
        state.Data.pending = true;
        state.Data.error = false;
        state.Data.success = false;
      })
      .addCase(GetChatlistData.fulfilled, (state, action) => {
        state.Data.pending = false;
        state.Data.data = action.payload.data;
        state.Data.success = true;
      })
      .addCase(GetChatlistData.rejected, (state) => {
        state.Data.pending = false;
        state.Data.error = true;
      });
  }
});

export default ChatlistSlice.reducer;
