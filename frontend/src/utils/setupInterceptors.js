import api from '../services/api.js';

// This is called ONCE in main.jsx after the Redux store is created.
// We can't import the store directly in api.js because it would create
// a circular dependency (api → store → slices → api).
// Passing the store here breaks that cycle cleanly.

let isRefreshing = false; // prevent multiple simultaneous logout dispatches

export const setupInterceptors = (store) => {
  // ─── Request interceptor ───────────────────────────────────────────────
  // Nothing needed here currently — withCredentials on the Axios instance
  // already attaches the JWT cookie automatically to every request.
  // Left in place so you can add Authorization headers later if needed.
  api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  // ─── Response interceptor ──────────────────────────────────────────────
  api.interceptors.response.use(
    // Success path — response.data is the { success, message, data } envelope
    (response) => response,

    // Error path
    async (error) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';

      // 401 — JWT expired or invalid → clear auth state and send to login
      if (status === 401 && !isRefreshing) {
        isRefreshing = true;
        try {
          // Lazy-import to avoid the circular dep at module evaluation time
          const { logoutUser } = await import('../redux/slices/authSlice.js');
          store.dispatch(logoutUser());
        } catch (_) {
          // If even the import fails, just clear storage and let the
          // ProtectedRoute redirect handle it
          console.warn('Could not dispatch logout on 401');
        } finally {
          isRefreshing = false;
        }
      }

      // 403 — Authenticated but not authorised for this action
      if (status === 403) {
        console.warn('DriveEase: Access denied —', message);
      }

      // 0 / undefined — network error (backend down, no internet)
      if (!status) {
        return Promise.reject({
          message: 'Cannot reach the server. Please check your connection.',
          statusCode: 0,
        });
      }

      return Promise.reject({ message, statusCode: status });
    }
  );
};
