"use client";

import React from 'react';
import { Stethoscope, Clock, MapPin, Phone, MessageSquare, Heart, ShieldCheck, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenChat }) => {
  return (
    <footer id="contact" className="bg-[#0F2847] text-white relative">
      
      {/* 1. Pre-Footer Call to Action Card (Dribbble Medical Style) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 -translate-y-12">
        <div className="bg-gradient-to-r from-primary via-[#2C6FAC] to-primary-mid rounded-3xl p-8 sm:p-12 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-white/20 relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              1-on-1 Consultation with Dr. Fatima
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Prioritize Your Health?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base font-normal">
              Book your appointment in 60 seconds with our AI Assistant. Available daily from 12:00 PM – 6:00 PM.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <button
              onClick={onOpenChat}
              className="bg-white hover:bg-primary-light text-primary hover:text-primary-dark font-extrabold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <Calendar className="w-5 h-5 text-primary" />
              <span>Book Appointment Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Practice Intro (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold shadow-sm">
                <Stethoscope className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white font-heading block">
                  AL-RAFAI CLINIC
                </span>
                <span className="text-xs text-blue-200 font-medium">Healthcare by Dr. Fatima, MBBS</span>
              </div>
            </div>

            <p className="text-sm text-blue-100/80 leading-relaxed max-w-sm font-normal">
              A dedicated single-doctor clinic offering comprehensive primary healthcare, preventive wellness, and chronic disease management in an unhurried, caring setting.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-3.5 h-3.5" /> PMDC Verified Practice
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-200 font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/15">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Notifications
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-blue-200">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-blue-100/80 font-medium">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Dr. Fatima
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#slots-section" className="hover:text-white transition-colors">
                  Live Slot Checker
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-blue-200">
              Clinic Timings
            </h4>
            <div className="space-y-3 text-sm text-blue-100/80">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Daily Consultations</p>
                  <p className="text-xs text-blue-200 mt-0.5">12:00 PM – 6:00 PM</p>
                  <p className="text-[11px] text-blue-300/70 mt-1">Monday through Sunday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Location (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-blue-200">
              Contact & Location
            </h4>
            <ul className="space-y-3 text-sm text-blue-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <span>5A/2, North Karachi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                <a href="tel:+15552345678" className="text-white font-bold hover:text-blue-200 transition-colors">
                  +1 (555) 234-5678
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenChat}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Start WhatsApp / AI Chat</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Legal & Developer Credits Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/70 gap-4">
          <p>© {new Date().getFullYear()} AL-RAFAI CLINIC. All rights reserved.</p>
          
          <p className="flex items-center gap-1.5 font-medium text-blue-100">
            <span>Designed & Developed with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
            <span>by</span>
            <a 
              href="https://www.linkedin.com/in/huzaifasys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-blue-200 underline underline-offset-4 transition-colors"
            >
              Huzaifa Developer
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
};
