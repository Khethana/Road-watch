import { configureStore, Middleware } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import reportReducer from './slices/reportSlice';
import filterReducer from './slices/filterSlice';
import uiReducer from './slices/uiSlice';
import { ENV } from '../config/env';

const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Persist auth state to localStorage
  if ((action as any).type?.startsWith('auth/')) {
    const authState = store.getState().auth;
    try {
      localStorage.setItem(ENV.AUTH_KEY, JSON.stringify({
        user: authState.user,
        token: authState.token,
        isAuthenticated: authState.isAuthenticated,
      }));
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }
  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportReducer,
    filters: filterReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
