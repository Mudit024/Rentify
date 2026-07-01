import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser, clearAuthError } from '../redux/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, status, bootstrapped, error } = useSelector((state) => state.auth);

  const login = useCallback((payload) => dispatch(loginUser(payload)).unwrap(), [dispatch]);
  const register = useCallback((payload) => dispatch(registerUser(payload)).unwrap(), [dispatch]);
  const logout = useCallback(() => dispatch(logoutUser()), [dispatch]);
  const refreshUser = useCallback(() => dispatch(fetchCurrentUser()), [dispatch]);
  const clearError = useCallback(() => dispatch(clearAuthError()), [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading: status === 'loading',
    bootstrapped,
    error,
    role: user?.role,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
};
