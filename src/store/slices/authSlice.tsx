import type { User } from "@/data/UserData";
import { checkAuth } from "@/services/auth.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import webStorageClient from "@/utils/webStorageClient";
import constants from "@/settings/constants";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: webStorageClient.getToken() || null,
  isLoading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuth();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (action.payload.token) {
        webStorageClient.setToken(action.payload.token);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      webStorageClient.remove(constants.ACCESS_TOKEN);
      webStorageClient.remove(constants.REFRESH_TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
        webStorageClient.remove(constants.ACCESS_TOKEN);
        webStorageClient.remove(constants.REFRESH_TOKEN);
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
