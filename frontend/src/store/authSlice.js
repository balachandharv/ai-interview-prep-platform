import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authAPI.login(credentials);
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.warn("Backend login failed, using mock data for local testing:", err.message);
      const mockData = {
        token: "mock-jwt-token-123",
        refreshToken: "mock-refresh-token",
        user: { id: "1", name: credentials.email.split('@')[0], email: credentials.email, onboardingComplete: true }
      };
      sessionStorage.setItem('token', mockData.token);
      sessionStorage.setItem('refreshToken', mockData.refreshToken);
      return mockData;
    }
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const response = await authAPI.register(data);
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (err) {
    if (import.meta.env.VITE_USE_MOCK_API === 'true') {
      console.warn("Backend registration failed, using mock data for local testing:", err.message);
      const mockData = {
        token: "mock-jwt-token-123",
        refreshToken: "mock-refresh-token",
        user: { id: "1", name: data.name, email: data.email, onboardingComplete: false }
      };
      sessionStorage.setItem('token', mockData.token);
      sessionStorage.setItem('refreshToken', mockData.refreshToken);
      return mockData;
    }
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const refreshToken = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const token = sessionStorage.getItem('refreshToken');
    const response = await authAPI.refresh(token);
    sessionStorage.setItem('token', response.data.token);
    return response.data;
  } catch (err) {
    return rejectWithValue('Session expired');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: sessionStorage.getItem('token'),
    isAuthenticated: !!sessionStorage.getItem('token'),
    isLoading: false,
    error: null,
    onboardingComplete: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.onboardingComplete = false;
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingComplete: (state) => {
      state.onboardingComplete = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.onboardingComplete = action.payload.user?.onboardingComplete || false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearError, setOnboardingComplete } = authSlice.actions;
export default authSlice.reducer;
