import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginThunk, clearError } from '../store/slices/authSlice';
import { loginSchema } from '../utils/validators';
import { pageVariants } from '../utils/animations';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Where to redirect after login
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginFormValues) => {
    dispatch(clearError());
    const resultAction = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-page"
    >
      <Card className="w-full max-w-md">
        <Card.Body className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Log in to your Road Watch account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-start text-danger" role="alert" aria-live="assertive">
              <AlertCircle size={20} className="mr-2 mt-0.5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-danger mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-danger mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Sign up
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-center text-text-muted mb-4">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-elevated p-2 rounded text-center">
                <div className="font-medium text-text-primary">Citizen</div>
                <div className="text-text-secondary">user@roadwatch.in</div>
                <div className="text-text-secondary">user@123</div>
              </div>
              <div className="bg-elevated p-2 rounded text-center">
                <div className="font-medium text-text-primary">Admin</div>
                <div className="text-text-secondary">admin@roadwatch.in</div>
                <div className="text-text-secondary">admin@123</div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default Login;
