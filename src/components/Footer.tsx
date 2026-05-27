import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Map } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="w-3 h-3 bg-white rounded-full"></span>
              </span>
              <span className="font-bold text-xl text-text-primary">Road Watch</span>
            </div>
            <p className="text-text-secondary max-w-sm mb-4">
              Empowering citizens to build better, safer cities through transparent civic reporting and infrastructure tracking.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-muted hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">Dashboard</Link></li>
              <li><Link to="/report" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">Report an Issue</Link></li>
              <li><Link to="/analytics" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">City Analytics</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">Terms of Service</a></li>
              <li><a href="#" className="text-text-secondary hover:text-primary transition-colors focus:outline-none focus:underline">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} Road Watch. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-text-muted mt-4 md:mt-0">
            Made with <span className="text-danger mx-1">❤</span> for better cities
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
