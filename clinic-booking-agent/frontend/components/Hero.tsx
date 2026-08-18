"use client";

import React from 'react';
import { Calendar, Bot, ShieldCheck, Sparkles, MessageCircle, Mic } from 'lucide-react';

interface HeroProps {
  onOpenChat: () => void;
  onScrollToSlots: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat, onScrollToSlots }) => {
  return (
    <section className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background ambient lighting blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            AI-Powered Smart Booking • WhatsApp Confirmed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Compassionate Care by <br className="hidden sm:inline" />
            <span className="gradient-text">Dr. Fatima</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Welcome to CarePulse Wellness Clinic. Enjoy dedicated, unhurried 1-on-1 medical care with Dr. Fatima. Available daily from <strong className="text-teal-400 font-semibold">12:00 PM to 6:00 PM</strong>. Roman Urdu & English voice / chat supported.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenChat}
              className="gradient-btn px-6 py-3.5 rounded-2xl text-sm font-semibold flex items-center gap-2.5 shadow-xl shadow-teal-500/25 transition-transform hover:scale-105"
            >
              <Bot className="w-5 h-5" />
              Book via AI Chatbot (Text / Voice)
            </button>

            <button
              onClick={onScrollToSlots}
              className="px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              Check Available Slots
            </button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-400">Doctor Availability</p>
              <p className="text-sm font-semibold text-white mt-0.5">12 PM – 6 PM Daily</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Booking Confirmation</p>
              <p className="text-sm font-semibold text-teal-400 mt-0.5 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Record System</p>
              <p className="text-sm font-semibold text-cyan-400 mt-0.5">Google Sheets Live</p>
            </div>
          </div>

        </div>

        {/* Right Column: Hero Visual Card */}
        <div className="lg:col-span-5 relative">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl relative z-10 border border-white/15 shadow-2xl">
            
            {/* Doctor Profile Card */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-navy-800 rounded-[14px] flex items-center justify-center text-teal-300 font-bold text-xl">
                  DF
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Dr. Fatima, MBBS</h3>
                <p className="text-xs text-teal-400 font-medium">General Physician & Consultant</p>
                <p className="text-xs text-slate-400 mt-1">Single Doctor Practice • 12 PM - 6 PM</p>
              </div>
            </div>

            {/* Chatbot Demonstration Teaser */}
            <div className="space-y-3 bg-navy-900/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
                <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                  <Bot className="w-3.5 h-3.5" /> CarePulse AI Assistant
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Mic className="w-3 h-3 text-cyan-400" /> Voice Supported
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl text-slate-300 border border-white/5">
                  👋 Assalam-o-Alaikum! Main Dr. Fatima ke clinic ki AI assistant hoon. Main aapki appointment book kar sakti hoon.
                </div>
                <div className="bg-teal-500/20 p-2.5 rounded-xl text-teal-200 ml-6 border border-teal-500/30">
                  Mujhe kal 2:00 PM pe Dr. Fatima ke sath appointment chahiye.
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl text-slate-300 border border-white/5 flex items-center justify-between">
                  <span>✅ 2:00 PM slot open hai! Aapka naam aur phone number kya hai?</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                </div>
              </div>
            </div>

            <button
              onClick={onOpenChat}
              className="w-full mt-5 py-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-medium text-xs sm:text-sm text-center transition-all"
            >
              Click Here to Start Interactive Booking Chat →
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};
