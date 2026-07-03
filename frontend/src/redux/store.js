import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice.js';
import carReducer from './slices/carSlice.js';
import bookingReducer from './slices/bookingSlice.js';
import ownerReducer from './slices/ownerSlice.js';
import adminReducer from './slices/adminSlice.js';
import uiReducer from './slices/uiSlice.js';
import userReducer from './slices/userSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carReducer,
    bookings: bookingReducer,
    owner: ownerReducer,
    admin: adminReducer,
    user: userReducer,
    ui: uiReducer,
  },
});