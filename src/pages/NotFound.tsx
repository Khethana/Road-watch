import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Home, LayoutDashboard } from 'lucide-react';
import { pageVariants } from '../utils/animations';
import Button from '../components/ui/Button';

export const NotFound = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-page text-center"
    >
      <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg shadow-primary/5 border border-primary/20">
        <Map size={48} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-7xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 mb-4 tracking-tighter">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
        Page not found
      </h2>
      
      <p className="text-lg text-text-secondary max-w-md mx-auto mb-10">
        The road to this page is under construction. It seems you've taken a wrong turn.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Link to="/dashboard" tabIndex={-1}>
          <Button size="lg" leftIcon={<LayoutDashboard size={20} />} className="w-full sm:w-auto">
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/" tabIndex={-1}>
          <Button variant="outline" size="lg" leftIcon={<Home size={20} />} className="w-full sm:w-auto">
            Go Home
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
