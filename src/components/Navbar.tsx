import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSidebar } from '../store/slices/uiSlice';
import { logoutThunk } from '../store/slices/authSlice';
import ThemeToggle from './ui/ThemeToggle';
import Button from './ui/Button';
import toast from 'react-hot-toast';

interface NavbarProps {
  isDashboard?: boolean;
}

export const Navbar = ({ isDashboard = false }: NavbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-30 h-16 w-full">
      <div className={`flex items-center justify-between h-full px-4 ${isDashboard ? '' : 'container mx-auto'}`}>
        <div className="flex items-center">
          {isDashboard && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="mr-4 p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-elevated transition-colors lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} />
            </button>
          )}
          
          {!isDashboard && (
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <span className="w-3 h-3 bg-white rounded-full"></span>
              </span>
              <span className="font-bold text-xl hidden sm:block tracking-tight text-text-primary">Road Watch</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-text-primary">{user?.name}</span>
                <span className="text-xs text-text-muted capitalize">{user?.role}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} />
                )}
              </div>
              {!isDashboard && (
                <Link to="/dashboard" tabIndex={-1}>
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" tabIndex={-1}>
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register" tabIndex={-1}>
                <Button variant="primary" size="sm" className="hidden sm:inline-flex">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
