import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Spinner from '../components/ui/Spinner';

const MainLayout = lazy(() => import('../layouts/MainLayout'));
const DashboardLayout = lazy(() => import('../layouts/DashboardLayout'));

const Home = lazy(() => import('../pages/Home'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const ReportIssue = lazy(() => import('../pages/ReportIssue'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));
const NotFound = lazy(() => import('../pages/NotFound'));

const PageLoadingSpinner = () => (
  <div className="flex flex-col h-screen w-full items-center justify-center bg-page space-y-4" aria-live="polite" aria-busy="true">
    <div className="flex items-center space-x-2 text-primary font-bold text-2xl mb-4">
      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="w-3 h-3 bg-white rounded-full"></span>
      </span>
      <span>Road Watch</span>
    </div>
    <Spinner size="lg" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>

        <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
