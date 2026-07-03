import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
  clearAuthError,
  verifyOtpCode,
} from '../redux/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();

  const {
    user,
    isAuthenticated,
    status,
    bootstrapped,
    error,
  } = useSelector((state) => state.auth);

  const login = useCallback(
    (payload) => dispatch(loginUser(payload)).unwrap(),
    [dispatch]
  );

  const register = useCallback(
    (payload) => dispatch(registerUser(payload)).unwrap(),
    [dispatch]
  );

  const verifyOtp = useCallback(
    (payload) => dispatch(verifyOtpCode(payload)).unwrap(),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutUser()).unwrap(),
    [dispatch]
  );

  const refreshUser = useCallback(
    () => dispatch(fetchCurrentUser()).unwrap(),
    [dispatch]
  );

  const clearError = useCallback(
    () => dispatch(clearAuthError()),
    [dispatch]
  );

  return {
    user,
    role: user?.role,

    isAuthenticated,
    bootstrapped,

    isLoading: status === 'loading',
    status,
    error,

    login,
    register,
    verifyOtp,
    logout,
    refreshUser,
    clearError,
  };
};