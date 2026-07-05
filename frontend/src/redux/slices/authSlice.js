import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';

// =======================
// Async Thunks
// =======================

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const verifyOtpCode = createAsyncThunk(
  'auth/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.verifyOtp(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const selectUserRole = createAsyncThunk(
  'auth/selectRole',
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.selectRole(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =======================
// Initial State
// =======================

const initialState = {
  user: null,
  isAuthenticated: false,
  status: 'idle', // idle | loading | succeeded | failed
  bootstrapped: false,
  error: null,
};

// =======================
// Slice
// =======================

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // Register
      // =======================

      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.status === 'PENDING_VERIFICATION') {
          state.user = null;
          state.isAuthenticated = false;
        } else {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Verify OTP
      // =======================

      .addCase(verifyOtpCode.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(verifyOtpCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(verifyOtpCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Login
      // =======================

      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload?.status === 'PENDING_VERIFICATION') {
          state.user = null;
          state.isAuthenticated = false;
        } else {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Fetch Current User
      // =======================

      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
        state.bootstrapped = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapped = true;
        state.error = null;
      })

      // =======================
      // Logout
      // =======================

      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = 'idle';
        state.bootstrapped = true;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Select User Role
      // =======================

      .addCase(selectUserRole.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(selectUserRole.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(selectUserRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;