import React from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './hooks/useTheme';
import { ENV } from './config/env';

// Custom Toaster that responds to theme
const ThemeToaster = () => {
  const { isDark } = useTheme();
  
  return (
    <Toaster 
      position="bottom-right"
      toastOptions={{
        duration: ENV.TOAST_DURATION,
        style: isDark ? {
          background: '#1F2937',
          color: '#F9FAFB',
          border: '1px solid rgba(249,115,22,0.2)',
        } : {
          background: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid rgba(249,115,22,0.3)',
        }
      }}
    />
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
          <ThemeToaster />
        </HashRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
