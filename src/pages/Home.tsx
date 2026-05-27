import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { MapPin, Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { pageVariants } from '../utils/animations';

const Counter = ({ from, to }: { from: number; to: number }) => {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  React.useEffect(() => {
    if (isInView && !prefersReducedMotion) {
      const controls = animate(count, to, { duration: 2, ease: "easeOut" });
      return controls.stop;
    } else if (prefersReducedMotion) {
      count.set(to);
    }
    return undefined;
  }, [count, isInView, to, prefersReducedMotion]);

  return <motion.span ref={nodeRef}>{rounded}</motion.span>;
};

const features = [
  {
    icon: <MapPin size={24} />,
    title: 'Geotagged Reporting',
    description: 'Pinpoint exact locations of road damage for faster municipal response.',
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Real-time Tracking',
    description: 'Follow the status of your reported issues from pending to resolved.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Budget Transparency',
    description: 'See exactly how much money is allocated and spent on road repairs.',
  },
  {
    icon: <Users size={24} />,
    title: 'Community Driven',
    description: 'Upvote critical issues to prioritize them for immediate attention.',
  },
];

export const Home = () => {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col min-h-[calc(100vh-64px-300px)]" // approximate height for main content
    >
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-dot-pattern dark:bg-dot-pattern-light bg-[size:24px_24px] border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-page/50 to-page pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
            Live civic tracking for modern cities
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-primary tracking-tight max-w-4xl mx-auto mb-6"
          >
            Better roads through <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#EC4899]">radical transparency</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10"
          >
            Report road damage, track civic spending, and hold authorities accountable. Join thousands of citizens making the city safer for everyone.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/report" tabIndex={-1}>
              <Button size="lg" className="px-8 shadow-lg shadow-primary/20" rightIcon={<ArrowRight size={20} />}>
                Report an Issue
              </Button>
            </Link>
            <Link to="/dashboard" tabIndex={-1}>
              <Button variant="secondary" size="lg" className="px-8">
                View Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-primary mb-2">
                <Counter from={0} to={12847} />+
              </div>
              <div className="text-text-secondary font-medium">Issues Reported</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-success mb-2">
                <Counter from={0} to={8900} />+
              </div>
              <div className="text-text-secondary font-medium">Issues Resolved</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-info mb-2">
                ₹<Counter from={0} to={450} />Cr
              </div>
              <div className="text-text-secondary font-medium">Budget Tracked</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl font-bold text-text-primary mb-2">
                <Counter from={0} to={24} />
              </div>
              <div className="text-text-secondary font-medium">Wards Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-page">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Everything you need to be an active citizen</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Road Watch provides powerful tools for civic participation without the red tape.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
