"use client";

import React, { useState, useEffect } from 'react';
import { Stethoscope, Calendar, Phone, Clock, FileText, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onOpenDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md border-b border-border py-3' 
          : 'bg-white border-b border-border py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-primary-light border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-xs">
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-xl font-extrabold font-heading tracking-tight text-text-dark flex items-center gap-2">
              AL-RAFAI CLINIC
            </span>
            <p className="text-[11px] text-text-light flex items-center gap-1 font-medium -mt-0.5">
              <Clock className="w-3 h-3 text-primary" /> 12PM–6PM Daily
            </p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-text-mid">
          <a href="#services" className="hover:text-primary transition-colors">
            Services
          </a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#about" className="hover:text-primary transition-colors">
            About Dr. Fatima
          </a>
          <a href="#testimonials" className="hover:text-primary transition-colors">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-primary transition-colors flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-primary" /> Contact
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark px-4 py-2.5 rounded-full bg-primary-light hover:bg-blue-100 border border-blue-200 transition-all shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            Doctor Dashboard
          </button>

          <button
            onClick={onOpenChat}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenChat}
            className="bg-primary text-white p-2 rounded-full sm:hidden"
            title="Book Appointment"
          >
            <Calendar className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-primary-light text-text-dark border border-border"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-xl px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-text-mid">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-primary-light hover:text-primary transition-colors"
            >
              Services
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-primary-light hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-primary-light hover:text-primary transition-colors"
            >
              About Dr. Fatima
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-primary-light hover:text-primary transition-colors"
            >
              Testimonials
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-primary-light hover:text-primary transition-colors"
            >
              Contact & Location
            </a>
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDashboard();
              }}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary py-3 rounded-full bg-primary-light border border-blue-200"
            >
              <FileText className="w-4 h-4" />
              Doctor Dashboard
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full bg-primary text-white py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
