"use client";

import React from 'react';
import { Stethoscope, Clock, MapPin, Phone, MessageSquare, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChat }) => {
  return (
    <footer id="contact" className="bg-text-dark text-white pt-16 pb-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-700">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-heading">
                AL-RAFAI CLINIC
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Single-doctor medical practice led by Dr. Fatima. Providing compassionate, unhurried 1-on-1 healthcare for all your primary medical needs.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-accent-light font-semibold bg-accent/20 px-3 py-1 rounded-full border border-accent/40">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Healthcare Practice
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li>
                <a href="#services" className="hover:text-primary-mid transition-colors">
                  Our Medical Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary-mid transition-colors">
                  How AI Booking Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary-mid transition-colors">
                  About Dr. Fatima
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-primary-mid transition-colors">
                  Patient Testimonials
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenChat}
                  className="hover:text-primary-mid transition-colors text-primary-light font-semibold"
                >
                  Book Instant Appointment →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Clinic Timings
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-primary-mid shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Monday – Sunday</p>
                  <p className="text-xs text-gray-400">12:00 PM – 6:00 PM Daily</p>
                </div>
              </li>
              <li className="text-xs text-gray-400 pl-6.5">
                * Consultations by appointment. 30-minute reserved slots.
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-mid shrink-0 mt-0.5" />
                <span>742 Evergreen Terrace, Suite 100</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-mid shrink-0" />
                <a href="tel:+15552345678" className="hover:text-white transition-colors">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-accent shrink-0" />
                <span className="text-accent-light font-medium">WhatsApp Booking Confirmed</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} AL-RAFAI CLINIC. Powered by AI Booking Technology.</p>
          <p className="flex items-center gap-1.5">
            Designed & Developed by{" "}
            <a 
              href="https://www.linkedin.com/in/huzaifasys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-primary-mid hover:text-white hover:underline transition-colors"
            >
              Huzaifa Developer
            </a>{" "}
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </p>
        </div>

      </div>
    </footer>
  );
};
