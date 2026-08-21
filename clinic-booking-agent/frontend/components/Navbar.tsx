"use client";

import React from 'react';
import { Stethoscope, Calendar, Phone, Clock, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onOpenDashboard }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E0EAF4] px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3FB] border border-[#BDD7F5] flex items-center justify-center text-[#4A90D9] shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-heading tracking-tight text-[#1A1A2E] flex items-center gap-2">
              AL-RAFAI CLINIC
            </span>
            <p className="text-xs text-[#5A6A7A] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#4A90D9]" /> 12:00 PM – 6:00 PM Daily
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#5A6A7A]">
          <a href="#services" className="hover:text-[#4A90D9] transition-colors">
            Services
          </a>
          <a href="#slots-section" className="hover:text-[#4A90D9] transition-colors">
            Timings & Slots
          </a>
          <a href="#about" className="hover:text-[#4A90D9] transition-colors">
            About Dr. Fatima
          </a>
          <a href="tel:+15552345678" className="hover:text-[#4A90D9] transition-colors flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#4A90D9]" /> Contact
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDashboard}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#4A90D9] hover:text-[#2C6FAC] px-3.5 py-2 rounded-full bg-[#EAF3FB] hover:bg-[#D8EAF8] border border-[#BDD7F5] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#4A90D9]" />
            Doctor Dashboard
          </button>

          <button
            onClick={onOpenChat}
            className="bg-[#4A90D9] hover:bg-[#2C6FAC] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md shadow-[#4A90D9]/20 transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </div>

      </div>
    </header>
  );
};
