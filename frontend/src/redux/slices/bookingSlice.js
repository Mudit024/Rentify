import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService.js';

// =======================
// Async Thunks
// =======================

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (payload, { rejectWithValue }) => {
    try {
      return await bookingService.createBooking(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingService.getMyBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelMyBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      return await bookingService.cancelBooking(bookingId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// =======================
// Initial State
// =======================

const initialState = {
  list: [],
  lastCreatedBooking: null,

  status: 'idle',
  createStatus: 'idle',

  error: null,
};

// =======================
// Slice
// =======================

const bookingSlice = createSlice({
  name: 'bookings',

  initialState,

  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },

    clearLastCreatedBooking: (state) => {
      state.lastCreatedBooking = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // Create Booking
      // =======================

      .addCase(createBooking.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })

      .addCase(createBooking.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.lastCreatedBooking = action.payload;

        state.list.unshift(action.payload);
      })

      .addCase(createBooking.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Fetch My Bookings
      // =======================

      .addCase(fetchMyBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })

      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Cancel Booking
      // =======================

      .addCase(cancelMyBooking.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(cancelMyBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';

        const index = state.list.findIndex(
          (booking) => booking._id === action.payload._id
        );

        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(cancelMyBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  clearBookingError,
  clearLastCreatedBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;