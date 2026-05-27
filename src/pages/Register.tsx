import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerThunk, clearError } from '../store/slices/authSlice';
import { registerSchema } from '../utils/validators';
import { pageVariants } from '../utils/animations';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type RegisterFormValues = z.infer<typeof registerSchema>;

const wards = ['A', 'B', 'C', 'D', 'E', 'F North', 'F South', 'G North', 'G South', 'H East', 'H West', 'K East', 'K West', 'L', 'M East', 'M West', 'N', 'P North', 'P South', 'R Central', 'R North', 'R South', 'S', 'T'];

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);

  const { register: registerForm, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch('password', '');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-elevated' };
    
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (pass.length > 0 && pass.length < 8) return { score: 1, label: 'Weak', color: 'bg-danger w-1/4' };
    if (score === 1 || score === 2) return { score: 2, label: 'Fair', color: 'bg-warning w-2/4' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-orange-500 w-3/4' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-success w-full' };
    
    return { score: 0, label: '', color: 'bg-elevated w-0' };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterFormValues) => {
    dispatch(clearError());
    const resultAction = await dispatch(registerThunk(data));
    if (registerThunk.fulfilled.match(resultAction)) {
      toast.success('Welcome to Road Watch!');
      navigate('/dashboard', { replace: true });
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
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Join the civic movement today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-start text-danger" role="alert" aria-live="assertive">
              <AlertCircle size={20} className="mr-2 mt-0.5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                {...registerForm('name')}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-sm text-danger mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                {...registerForm('email')}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-danger mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-text-primary mb-1">Resident Ward</label>
              <select
                id="ward"
                {...registerForm('ward')}
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-text-primary appearance-none"
                aria-invalid={!!errors.ward}
              >
                <option value="" disabled selected>Select your ward</option>
                {wards.map(w => (
                  <option key={w} value={w}>Ward {w}</option>
                ))}
              </select>
              {errors.ward && <p className="text-sm text-danger mt-1">{errors.ward.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <div className="relative mb-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...registerForm('password')}
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
              
              {/* Password Strength Meter */}
              <div 
                className="w-full bg-elevated h-1.5 rounded-full overflow-hidden" 
                aria-label={`Password strength: ${strength.label}`}
                role="progressbar"
                aria-valuenow={strength.score * 25}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className={`h-full transition-all duration-300 ${strength.color}`}></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-text-muted">{strength.label && strength.label}</span>
              </div>
              
              {errors.password && <p className="text-sm text-danger mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
              Log in
            </Link>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default Register;
