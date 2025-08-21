"use client";

import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  headerProps?: {
    currentLanguage?: string;
    onLanguageChange?: (lang: string) => void;
  };
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = "",
  headerProps = {}
}) => {
  return (
    <div className={`container-modern ${className}`}>
      <Header {...headerProps} />
      
      {/* Main Content */}
      <main className="relative pt-16 min-h-screen">
        {children}
      </main>
      
      {/* Optional Footer */}
      <footer className="relative mt-auto">
        <div className="bg-deep-teal text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand */}
              <div>
                <h3 className="font-playfair text-xl font-bold mb-4">Bright Ears</h3>
                <p className="font-inter text-white/80 text-sm">
                  Discover amazing music and connect with artists worldwide.
                </p>
              </div>
              
              {/* Links */}
              <div>
                <h4 className="font-inter font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#discover" className="text-white/80 hover:text-brand-cyan transition-colors">Discover</a></li>
                  <li><a href="#artists" className="text-white/80 hover:text-brand-cyan transition-colors">Artists</a></li>
                  <li><a href="#events" className="text-white/80 hover:text-brand-cyan transition-colors">Events</a></li>
                  <li><a href="#about" className="text-white/80 hover:text-brand-cyan transition-colors">About</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h4 className="font-inter font-semibold mb-4">Connect</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <p>support@brightears.io</p>
                  <div className="flex gap-4 mt-4">
                    <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center hover:bg-brand-cyan/30 transition-colors cursor-pointer">
                      <span className="text-xs">📧</span>
                    </div>
                    <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center hover:bg-brand-cyan/30 transition-colors cursor-pointer">
                      <span className="text-xs">🐦</span>
                    </div>
                    <div className="w-8 h-8 bg-brand-cyan/20 rounded-lg flex items-center justify-center hover:bg-brand-cyan/30 transition-colors cursor-pointer">
                      <span className="text-xs">📱</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="font-inter text-sm text-white/60">
                © 2024 Bright Ears. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;