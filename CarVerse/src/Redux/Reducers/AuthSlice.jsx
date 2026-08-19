import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user ? user : null,
  token: token ? token : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.message || 'Registration failed');
    }
    const tokenVal = data.token || (data.data && data.data.token);
    const userVal = data.user || (data.data && data.data.user) || data.data;

    if (tokenVal) {
      localStorage.setItem('token', tokenVal);
      localStorage.setItem('user', JSON.stringify(userVal));
    }
    return { token: tokenVal, user: userVal };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.message || 'Login failed');
    }
    const tokenVal = data.token || (data.data && data.data.token);
    const userVal = data.user || (data.data && data.data.user) || data.data;

    if (tokenVal) {
      localStorage.setItem('token', tokenVal);
      localStorage.setItem('user', JSON.stringify(userVal));
    }
    return { token: tokenVal, user: userVal };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update Profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (updateData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.message || 'Profile update failed');
    }
    const updatedUser = data.data || data.user || data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Get Current User Profile (Me)
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return thunkAPI.rejectWithValue('No token found');

    const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.message || 'Failed to fetch user');
    }
    const currentUser = data.data || data.user || data;
    localStorage.setItem('user', JSON.stringify(currentUser));
    return currentUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/auth/logout`, { method: 'POST' });
  } catch (e) {
    // Ignore network error on logout
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.token = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
