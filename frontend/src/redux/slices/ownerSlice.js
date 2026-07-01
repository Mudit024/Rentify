import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerService } from '../../services/ownerService.js';

export const fetchOwnerDashboard = createAsyncThunk('owner/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const res = await ownerService.getDashboard();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOwnerCars = createAsyncThunk('owner/fetchCars', async (_, { rejectWithValue }) => {
  try {
    const res = await ownerService.getMyCars();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createOwnerCar = createAsyncThunk('owner/createCar', async (carData, { rejectWithValue }) => {
  try {
    const res = await ownerService.createCar(carData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateOwnerCar = createAsyncThunk('owner/updateCar', async ({ id, carData }, { rejectWithValue }) => {
  try {
    const res = await ownerService.updateCar(id, carData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteOwnerCar = createAsyncThunk('owner/deleteCar', async (id, { rejectWithValue }) => {
  try {
    await ownerService.deleteCar(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOwnerBookings = createAsyncThunk('owner/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const res = await ownerService.getOwnerBookings();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateOwnerBookingStatus = createAsyncThunk(
  'owner/updateBookingStatus',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await ownerService.updateBookingStatus(id, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  dashboard: null,
  cars: [],
  bookings: [],
  status: 'idle',
  carActionStatus: 'idle',
  error: null,
};

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
      .addCase(fetchOwnerDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })
      .addCase(fetchOwnerCars.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOwnerCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cars = action.payload;
      })
      .addCase(fetchOwnerCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
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
      .addCase(updateOwnerCar.fulfilled, (state, action) => {
        const idx = state.cars.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.cars[idx] = action.payload;
      })
      .addCase(deleteOwnerCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c._id !== action.payload);
      })
      .addCase(fetchOwnerBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      })
      .addCase(updateOwnerBookingStatus.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.bookings[idx] = action.payload;
      });
  },
});

export const { clearOwnerError } = ownerSlice.actions;
export default ownerSlice.reducer;
