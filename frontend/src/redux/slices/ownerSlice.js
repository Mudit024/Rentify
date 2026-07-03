import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ownerService from '../../services/ownerService.js';

// =======================
// Async Thunks
// =======================

export const fetchOwnerDashboard = createAsyncThunk(
  'owner/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      return await ownerService.getDashboard();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOwnerCars = createAsyncThunk(
  'owner/fetchCars',
  async (_, { rejectWithValue }) => {
    try {
      return await ownerService.getMyCars();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createOwnerCar = createAsyncThunk(
  'owner/createCar',
  async (carData, { rejectWithValue }) => {
    try {
      return await ownerService.createCar(carData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOwnerCar = createAsyncThunk(
  'owner/updateCar',
  async ({ carId, carData }, { rejectWithValue }) => {
    try {
      return await ownerService.updateCar(carId, carData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteOwnerCar = createAsyncThunk(
  'owner/deleteCar',
  async (carId, { rejectWithValue }) => {
    try {
      await ownerService.deleteCar(carId);
      return carId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOwnerBookings = createAsyncThunk(
  'owner/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await ownerService.getOwnerBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateOwnerBookingStatus = createAsyncThunk(
  'owner/updateBookingStatus',
  async ({ bookingId, id, payload }, { rejectWithValue }) => {
    try {
      const actualId = bookingId || id;
      return await ownerService.updateBookingStatus(actualId, payload);
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

  bookings: [],

  status: 'idle',

  carActionStatus: 'idle',

  error: null,
};

// =======================
// Slice
// =======================

const ownerSlice = createSlice({
  name: 'owner',

  initialState,

  reducers: {
    clearOwnerError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // Dashboard
      // =======================

      .addCase(fetchOwnerDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboard = action.payload;
      })

      .addCase(fetchOwnerDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Cars
      // =======================

      .addCase(fetchOwnerCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchOwnerCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })

      .addCase(fetchOwnerCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Car

      .addCase(createOwnerCar.pending, (state) => {
        state.carActionStatus = 'loading';
        state.error = null;
      })

      .addCase(createOwnerCar.fulfilled, (state, action) => {
        state.carActionStatus = 'succeeded';
        state.cars.unshift(action.payload);
      })

      .addCase(createOwnerCar.rejected, (state, action) => {
        state.carActionStatus = 'failed';
        state.error = action.payload;
      })

      // Update Car

      .addCase(updateOwnerCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(
          (car) => car._id === action.payload._id
        );

        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })

      // Delete Car

      .addCase(deleteOwnerCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter(
          (car) => car._id !== action.payload
        );
      })

      // =======================
      // Bookings
      // =======================

      .addCase(fetchOwnerBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })

      .addCase(fetchOwnerBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Booking Status

      .addCase(updateOwnerBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking._id === action.payload._id
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearOwnerError } = ownerSlice.actions;

export default ownerSlice.reducer;