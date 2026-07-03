import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carService from '../../services/carService.js';

// =======================
// Async Thunks
// =======================

export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params, { rejectWithValue }) => {
    try {
      return await carService.getCars(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCarById = createAsyncThunk(
  'cars/fetchCarById',
  async (carId, { rejectWithValue }) => {
    try {
      return await carService.getCarById(carId);
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
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  },
  selectedCar: null,

  status: 'idle',
  detailStatus: 'idle',

  error: null,

  filters: {
    q: '',
    brand: '',
    location: '',
    transmission: '',
    fuelType: '',
    seats: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
  },
};

// =======================
// Slice
// =======================

const carSlice = createSlice({
  name: 'cars',

  initialState,

  reducers: {
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    clearSelectedCar: (state) => {
      state.selectedCar = null;
    },

    clearCarError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =======================
      // Fetch Cars
      // =======================

      .addCase(fetchCars.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.cars;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchCars.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // =======================
      // Fetch Car Details
      // =======================

      .addCase(fetchCarById.pending, (state) => {
        state.detailStatus = 'loading';
        state.selectedCar = null;
        state.error = null;
      })

      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedCar = action.payload;
      })

      .addCase(fetchCarById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  resetFilters,
  clearSelectedCar,
  clearCarError,
} = carSlice.actions;

export default carSlice.reducer;