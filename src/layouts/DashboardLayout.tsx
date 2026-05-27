import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSidebarOpen } from '../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Close sidebar on route change on mobile
    dispatch(setSidebarOpen(false));
    
    // Focus management for accessibility on route change
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [location.pathname, dispatch]);

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg">
        Skip to main content
      </a>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm"
            onClick={() => dispatch(setSidebarOpen(false))}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Navbar isDashboard />
        
        <main 
          id="main-content"
          ref={mainRef}
          tabIndex={-1} 
          className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 focus:outline-none"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
