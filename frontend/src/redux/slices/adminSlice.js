import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService.js';

// =======================
// Async Thunks
// =======================

export const fetchAdminDashboard = createAsyncThunk(
  'admin/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getDashboard();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllCars = createAsyncThunk(
  'admin/fetchAllCars',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllCars();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const blockCar = createAsyncThunk(
  'admin/blockCar',
  async (carId, { rejectWithValue }) => {
    try {
      return await adminService.blockCar(carId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unblockCar = createAsyncThunk(
  'admin/unblockCar',
  async (carId, { rejectWithValue }) => {
    try {
      return await adminService.unblockCar(carId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCar = createAsyncThunk(
  'admin/deleteCar',
  async (carId, { rejectWithValue }) => {
    try {
      await adminService.deleteCar(carId);
      return carId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (role, { rejectWithValue }) => {
    try {
      return await adminService.getAllUsers(role);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const blockUser = createAsyncThunk(
  'admin/blockUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminService.blockUser(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'admin/unblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      return await adminService.unblockUser(userId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      return await adminService.updateUserRole(userId, role);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'admin/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =======================
// Initial State
// =======================

const initialState = {
  dashboard: null,
  cars: [],
  users: [],
  bookings: [],
  status: 'idle',
  error: null,
};

// =======================
// Slice
// =======================

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

      // Dashboard

      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })

      // Cars

      .addCase(fetchAllCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })

      .addCase(fetchAllCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(blockCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car._id === action.payload._id
        );

        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })

      .addCase(unblockCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car._id === action.payload._id
        );

        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })

      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter(
          (car) => car._id !== action.payload
        );
      })

      // Users

      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

      .addCase(blockUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(unblockUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      // Bookings

      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      });
  },
});

export const {
  clearAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;