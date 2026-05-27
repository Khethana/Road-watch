import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, Shield, LogOut, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSidebarOpen } from '../store/slices/uiSlice';
import { logoutThunk } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { sidebarVariants } from '../utils/animations';
import toast from 'react-hot-toast';

export const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/report', icon: PlusCircle, label: 'Report Issue' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin', icon: Shield, label: 'Admin Panel' });
  }

  const sidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface">
        <NavLink to="/" className="flex items-center space-x-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1 -ml-2">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <span className="w-3 h-3 bg-white rounded-full"></span>
          </span>
          <span className="font-bold text-xl text-text-primary tracking-tight">Road Watch</span>
        </NavLink>
        <button
          onClick={() => dispatch(setSidebarOpen(false))}
          className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <nav className="space-y-1 px-4" role="navigation" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                    : 'text-text-secondary hover:bg-elevated hover:text-text-primary border border-transparent'
                }`
              }
            >
              <link.icon size={20} className="mr-3 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border bg-surface">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-danger hover:bg-danger/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-danger"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col bg-surface border-r border-border z-10 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen ? 'open' : 'closed'}
        transition={prefersReducedMotion ? { duration: 0 } : sidebarVariants.transition}
        className="fixed inset-y-0 left-0 z-30 w-[280px] flex flex-col bg-surface border-r border-border lg:hidden shadow-2xl"
        aria-hidden={!sidebarOpen}
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
};

export default Sidebar;
