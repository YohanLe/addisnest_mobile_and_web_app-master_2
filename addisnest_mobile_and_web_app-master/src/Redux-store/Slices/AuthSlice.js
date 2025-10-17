import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

const initialState = {
    Details: { pending: false, data: null, error: null },
};

export const AuthUserDetails = createAsyncThunk("userdataupdate",
    async (state) => {
        try {
            // Get user data directly from OTP verification response if available
            const userData = localStorage.getItem('userData');
            if (userData) {
                try {
                    const parsedUserData = JSON.parse(userData);
                    console.log('Using cached user data:', parsedUserData);
                    // Clear the cached data after using it
                    localStorage.removeItem('userData');
                    return { data: parsedUserData };
                } catch (parseError) {
                    console.error('Error parsing cached user data:', parseError);
                    // Continue with API call if parsing fails
                }
            }
            
            // Normal API call for real token
            console.log('Fetching user profile from API...');
            const response = await Api.get(`auth/profile`);
            console.log('AuthUserDetails response:', response);
            
            if (response && response.data && response.data.result) {
                const { result } = response.data;
                return { data: result };
            } else if (response && response.data && response.data.data) {
                // Alternative response format
                return { data: response.data.data };
            } else {
                console.error('Unexpected response format:', response);
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            
            // If we have a userId in localStorage, create a minimal user object
            // This helps prevent the app from breaking when profile fetch fails
            const userId = localStorage.getItem('userId');
            if (userId) {
                console.log('Creating fallback user object with userId:', userId);
                return { 
                    data: {
                        _id: userId,
                        isAuthenticated: true
                    }
                };
            }
            
            return {
                error: {
                    type: "server",
                    message: "Failed to fetch user data",
                },
            };
        }
    }
);

const Authentication = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        UserAuthLogin: (state , action) => {
            state.Details = { pending: false, data:action.payload, error: null }
        },
        clearUserAuthLogin: (state) => {
            state.Details = { pending: false, data: null, error: null }
        },
        logout: (state) => {
            state.Details = { pending: false, data: null, error: null }
        },
        login: (state, action) => {
            state.Details = { pending: false, data: action.payload, error: null }
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(AuthUserDetails.pending, (state, action) => {
                state.Details.pending = true;
            })
            .addCase(AuthUserDetails.fulfilled, (state, action) => {
                state.Details.pending = false;
                if (action.payload.data) {
                    state.Details.data = action.payload.data;
                } else {
                    state.Details.error = action.payload.error;
                }
            })
            .addCase(AuthUserDetails.rejected, (state, action) => {
                state.Details.pending = false;
                if (action?.payload?.error) {
                    state.Details.error = action?.payload?.error;
                } else {
                    state.Details.error = {
                        type: "server",
                        message: "Internal server Error",
                    }
                }
            })
    },
});


export const { clearUserAuthLogin, UserAuthLogin, logout, login } = Authentication.actions;
export default Authentication.reducer;
