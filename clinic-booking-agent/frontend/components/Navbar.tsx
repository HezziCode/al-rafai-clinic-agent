"use client";

import React from 'react';
import { Stethoscope, Calendar, Phone, Clock, FileText } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onOpenDashboard }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="w-5 h-5 text-navy-900" />
          </div>
          <div>
            <span className="text-xl font-bold font-heading tracking-tight text-white flex items-center gap-2">
              CarePulse <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">Single-Doctor Clinic</span>
            </span>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" /> 12:00 PM – 6:00 PM Daily
            </p>
          </div>
        </div>

        {/* Navigation Links & Action CTAs */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDashboard}
            className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            Doctor Dashboard
          </button>

          <a 
            href="tel:+15552345678"
            className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-teal-400 px-3 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            +1 (555) 234-5678
          </a>

          <button
            onClick={onOpenChat}
            className="gradient-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20"
          >
            <Calendar className="w-4 h-4" />
            Book Appointment
          </button>
        </div>

      </div>
    </header>
  );
};
