"use client";

import React from 'react';
import { Calendar, Bot, CheckCircle2, ShieldCheck, Star, Clock } from 'lucide-react';

interface HeroProps {
  onOpenChat: () => void;
  onScrollToSlots: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat, onScrollToSlots }) => {
  return (
    <section className="pt-28 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        
        {/* Left Side: Warm #F6F0E8 Panel (55% width) */}
        <div className="lg:col-span-7 bg-warm rounded-3xl p-6 sm:p-10 lg:p-12 border border-border flex flex-col justify-between shadow-sm">
          
          <div className="space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-xs sm:text-sm font-semibold text-text-mid shadow-xs">
              <span className="text-primary font-bold">✦</span> Trusted by 350+ Patients in the Community
            </div>

            {/* Main H1 Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-text-dark tracking-tight leading-[1.1]">
              Your Health, <br />
              <span className="text-primary">Our Priority.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-text-mid max-w-lg leading-relaxed font-normal">
              Visit Dr. Fatima at her clinic in{' '}
              <strong className="text-text-dark font-semibold">
                5A/2, North Karachi
              </strong>
              , open daily from{' '}
              <strong className="text-primary font-semibold">12 PM to 6 PM</strong>
              . Walk in or book your slot instantly via AI chat or voice call.
            </p>

            {/* CTAs Stacked Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onOpenChat}
                className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-4 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <Bot className="w-5 h-5 text-white" />
                <span>Book via AI Chat / Voice</span>
              </button>

              <button
                onClick={onScrollToSlots}
                className="border-2 border-primary text-primary hover:bg-primary-light rounded-full px-8 py-4 font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 bg-white transition-all hover:scale-[1.02] shadow-xs"
              >
                <Calendar className="w-5 h-5 text-primary" />
                <span>Check Today's Slots</span>
              </button>
            </div>
          </div>

          {/* Patient-Centric Medical Trust Signals */}
          <div className="pt-8 mt-8 border-t border-border/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-text-mid">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-accent" /> PMDC Registered Doctor
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" /> 1-on-1 Unhurried Consultations
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary-mid" /> 12 PM – 6 PM Daily Care
            </span>
          </div>

        </div>

        {/* Right Side: Doctor Card with Floating Badges (45% width) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          <div className="w-full h-[460px] sm:h-[540px] rounded-3xl overflow-hidden shadow-xl border border-border relative bg-white group">
            
            {/* Professional Doctor Photo */}
            <img 
              src="/doctor-fatima.jpg" 
              alt="Dr. Fatima MBBS - General Physician & Consultant at AL-RAFAI CLINIC North Karachi" 
              width={800}
              height={800}
              decoding="async"
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />

            {/* Gradient Overlay for bottom text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Top Right: Available Today Pill */}
            <div className="absolute top-4 right-4 z-10 bg-accent text-white text-xs font-bold rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-soft-pulse" />
              Available Today
            </div>

            {/* Floating Top-Left Card: Next Slot */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-xs rounded-xl shadow-lg p-2.5 sm:p-3 border border-border flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <p className="text-xs font-bold text-text-dark flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-primary" /> Next Slot: 2:00 PM Today
              </p>
            </div>

            {/* Bottom Overlay Label */}
            <div className="absolute bottom-4 right-4 z-10 text-right text-white">
              <p className="text-sm font-extrabold leading-tight drop-shadow-sm">Dr. Fatima, MBBS</p>
              <p className="text-[11px] text-white/90 font-medium drop-shadow-sm">General Physician & Consultant</p>
            </div>

            {/* Floating Bottom-Left Card: Rating & Verified Patients */}
            <div className="absolute -bottom-3 sm:bottom-4 left-4 z-20 bg-white rounded-2xl shadow-xl p-3.5 sm:p-4 border border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shrink-0">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-text-dark">⭐⭐⭐⭐⭐ 4.9/5</p>
                <p className="text-[11px] text-text-light font-medium">350+ Verified Patients</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
