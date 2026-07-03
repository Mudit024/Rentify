import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService.js';

// =======================
// Async Actions
// =======================

// Get Wishlist
export const fetchWishlist = createAsyncThunk(
  'user/fetchWishlist',
  async (_, thunkAPI) => {
    try {
      return await userService.getWishlist();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist.'
      );
    }
  }
);

// Add To Wishlist
export const addToWishlist = createAsyncThunk(
  'user/addToWishlist',
  async (carId, thunkAPI) => {
    try {
      await userService.addToWishlist(carId);
      return carId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add car.'
      );
    }
  }
);

// Remove From Wishlist
export const removeFromWishlist = createAsyncThunk(
  'user/removeFromWishlist',
  async (carId, thunkAPI) => {
    try {
      await userService.removeFromWishlist(carId);
      return carId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to remove car.'
      );
    }
  }
);

// =======================
// Initial State
// =======================

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

// =======================
// Slice
// =======================

const userSlice = createSlice({
  name: 'user',

  initialState,

  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },

    clearWishlist: (state) => {
      state.wishlist = [];
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add To Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const exists = state.wishlist.some(
          (car) => car._id === action.payload
        );

        if (!exists) {
          state.wishlist.push({
            _id: action.payload,
          });
        }
      })

      // Remove From Wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = state.wishlist.filter(
          (car) => car._id !== action.payload
        );
      });
  },
});

export const {
  clearUserError,
  clearWishlist,
} = userSlice.actions;

export default userSlice.reducer;