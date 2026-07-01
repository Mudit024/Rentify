import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookingService.js';

export const createBooking = createAsyncThunk('bookings/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await bookingService.createBooking(payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await bookingService.getMyBookings();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const cancelMyBooking = createAsyncThunk('bookings/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await bookingService.cancelBooking(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  list: [],
  status: 'idle',
  createStatus: 'idle',
  error: null,
  lastCreatedBooking: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearLastCreatedBooking: (state) => {
      state.lastCreatedBooking = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.lastCreatedBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(cancelMyBooking.fulfilled, (state, action) => {
        const idx = state.list.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      });
  },
});

export const { clearLastCreatedBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
