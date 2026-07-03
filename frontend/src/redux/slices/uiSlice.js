import { createSlice } from '@reduxjs/toolkit';

const THEME_KEY = 'rentify-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const initialState = {
  theme: getInitialTheme(),
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',

  initialState,

  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, state.theme);
      }
    },

    setTheme: (state, action) => {
      state.theme = action.payload;

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_KEY, action.payload);
      }
    },

    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },

    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleMobileMenu,
  closeMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;