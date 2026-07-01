import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService.js';

export const fetchAdminDashboard = createAsyncThunk('admin/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getDashboard();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchPendingCars = createAsyncThunk('admin/fetchPendingCars', async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getPendingCars();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const approveCarListing = createAsyncThunk('admin/approveCar', async (id, { rejectWithValue }) => {
  try {
    const res = await adminService.approveCar(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const rejectCarListing = createAsyncThunk(
  'admin/rejectCar',
  async ({ id, rejectionReason }, { rejectWithValue }) => {
    try {
      const res = await adminService.rejectCar(id, rejectionReason);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const adminDeleteCarListing = createAsyncThunk('admin/deleteCar', async (id, { rejectWithValue }) => {
  try {
    await adminService.deleteCar(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (role, { rejectWithValue }) => {
  try {
    const res = await adminService.getAllUsers(role);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateUserRoleThunk = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const res = await adminService.updateUserRole(id, role);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk('admin/fetchAllBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await adminService.getAllBookings();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  dashboard: null,
  pendingCars: [],
  users: [],
  bookings: [],
  status: 'idle',
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(fetchPendingCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingCars = action.payload;
      })
      .addCase(approveCarListing.fulfilled, (state, action) => {
        state.pendingCars = state.pendingCars.filter((c) => c._id !== action.payload._id);
      })
      .addCase(rejectCarListing.fulfilled, (state, action) => {
        state.pendingCars = state.pendingCars.filter((c) => c._id !== action.payload._id);
      })
      .addCase(adminDeleteCarListing.fulfilled, (state, action) => {
        state.pendingCars = state.pendingCars.filter((c) => c._id !== action.payload);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updateUserRoleThunk.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload.id || u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = { ...state.users[idx], role: action.payload.role };
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
