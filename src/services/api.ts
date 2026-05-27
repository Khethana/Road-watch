import axios from 'axios';
import { ENV } from '../config/env';
import toast from 'react-hot-toast';


const generateUuid = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
};

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    const authState = localStorage.getItem(ENV.AUTH_KEY);
    if (authState) {
      const { token } = JSON.parse(authState);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // Ignore error
  }
  
  config.headers['X-Request-ID'] = generateUuid();
  config.headers['X-App-Version'] = ENV.APP_NAME; // Assuming version is passed this way or we just use ENV var
  
  // For development timing
  (config as any).metadata = { startTime: new Date() };
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Development logging
    if ((import.meta as any).env?.DEV) {
      const duration = new Date().getTime() - (response.config as any).metadata.startTime.getTime();
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration}ms`);
    }
    return response.data; // Return data directly as per requirements
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem(ENV.AUTH_KEY);
          // Redux logout needs to be dispatched from the store, but we can't import store here due to circular dependency
          // This will be handled by the app reloading or a global event listener
          window.location.href = '/login';
          break;
        case 403:
          toast.error("Access denied");
          break;
        case 404:
          toast.error("Resource not found");
          break;
        case 422:
          // Return validation errors
          return Promise.reject(error.response.data);
        case 500:
          toast.error("Server error. Please try again.");
          break;
        default:
          toast.error(error.response.data?.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      toast.error("Check your internet connection");
    } else {
      toast.error("Error setting up request");
    }
    return Promise.reject(error);
  }
);

// Mock Interceptor
if (ENV.ENABLE_MOCK) {
  // We'll mock specific calls in the services instead of adapter to keep it simple,
  // or use Axios Mock Adapter if we had it, but we can just override api methods.
  // Given constraints, I will handle mocks in the service layer using helpers.sleep() to simulate delays.
}

export default api;
