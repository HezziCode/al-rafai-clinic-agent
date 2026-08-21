"use client";

import React from 'react';
import { Calendar, Bot, ShieldCheck, Sparkles, MessageCircle, Mic, Star, CheckCircle, Clock } from 'lucide-react';

interface HeroProps {
  onOpenChat: () => void;
  onScrollToSlots: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat, onScrollToSlots }) => {
  return (
    <section id="about" className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-gradient-to-b from-[#F0F6FF]/60 via-white to-white">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF3FB] border border-[#BDD7F5] text-[#2C6FAC] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#4A90D9]" />
            AI-Powered Smart Booking • WhatsApp Confirmed
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#1A1A2E]">
            <span className="italic font-bold text-[#1A1A2E]">Your Health, Our Priority.</span> <br />
            <span className="text-[#4A90D9]">Compassionate Care by Dr. Fatima</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A6A7A] max-w-2xl leading-relaxed">
            Welcome to <strong className="text-[#1A1A2E] font-semibold">AL-RAFAI CLINIC</strong>. Experience dedicated, unhurried 1-on-1 consultations with Dr. Fatima. Available daily from <strong className="text-[#4A90D9] font-semibold">12:00 PM to 6:00 PM</strong>. Roman Urdu & English voice / chat supported.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenChat}
              className="bg-[#4A90D9] hover:bg-[#2C6FAC] text-white px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 shadow-md shadow-[#4A90D9]/25 transition-all hover:scale-[1.02]"
            >
              <Bot className="w-5 h-5" />
              Book via AI Assistant (Text / Voice)
            </button>

            <button
              onClick={onScrollToSlots}
              className="border border-[#4A90D9] text-[#4A90D9] hover:bg-[#EAF3FB] hover:text-[#2C6FAC] px-6 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 bg-white shadow-sm"
            >
              <Calendar className="w-4 h-4 text-[#4A90D9]" />
              Check Available Slots
            </button>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E0EAF4]">
            <div>
              <p className="text-xs text-[#5A6A7A]">Doctor Availability</p>
              <p className="text-sm font-bold text-[#1A1A2E] mt-0.5">12 PM – 6 PM Daily</p>
            </div>
            <div>
              <p className="text-xs text-[#5A6A7A]">Booking Confirmation</p>
              <p className="text-sm font-bold text-[#27AE60] mt-0.5 flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5A6A7A]">Record System</p>
              <p className="text-sm font-bold text-[#4A90D9] mt-0.5">Google Sheets Live</p>
            </div>
          </div>

        </div>

        {/* Right Column: Doctor Card & AI Demo (HecDoc Style) */}
        <div className="lg:col-span-5 relative">
          
          {/* Main Doctor Profile Card */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E0EAF4] shadow-lg shadow-[#4A90D9]/10 relative z-10 space-y-5">
            
            <div className="flex items-center gap-4 pb-5 border-b border-[#E0EAF4]">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF3FB] border border-[#BDD7F5] flex items-center justify-center text-[#4A90D9] font-bold text-xl shadow-sm">
                DF
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1A1A2E]">Dr. Fatima, MBBS</h3>
                  <span className="text-[11px] font-semibold text-[#27AE60] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full border border-[#B7ECC9]">
                    Available Today
                  </span>
                </div>
                <p className="text-xs text-[#4A90D9] font-medium mt-0.5">Senior General Physician & Consultant</p>
                <p className="text-xs text-[#5A6A7A] mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#4A90D9]" /> 12:00 PM – 6:00 PM Daily
                </p>
              </div>
            </div>

            {/* AI Assistant Chat Preview */}
            <div className="space-y-3 bg-[#F0F6FF]/80 p-4 rounded-xl border border-[#E0EAF4]">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E0EAF4]">
                <span className="flex items-center gap-1.5 text-[#4A90D9] font-semibold">
                  <Bot className="w-3.5 h-3.5" /> AL-RAFAI AI Assistant
                </span>
                <span className="flex items-center gap-1 text-[#5A6A7A] text-[11px] bg-white px-2 py-0.5 rounded-full border border-[#E0EAF4]">
                  <Mic className="w-3 h-3 text-[#4A90D9]" /> Voice & Text
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl text-[#1A1A2E] border border-[#E0EAF4] shadow-xs">
                  👋 Assalam-o-Alaikum! Main Dr. Fatima ke clinic ki AI assistant hoon. Main aapki appointment book kar sakti hoon.
                </div>
                <div className="bg-[#4A90D9] p-2.5 rounded-xl text-white font-medium ml-6 shadow-xs">
                  Mujhe kal 2:00 PM pe Dr. Fatima ke sath appointment chahiye.
                </div>
                <div className="bg-white p-2.5 rounded-xl text-[#1A1A2E] border border-[#E0EAF4] flex items-center justify-between shadow-xs">
                  <span>✅ 2:00 PM slot open hai! Aapka naam aur phone number kya hai?</span>
                  <CheckCircle className="w-4 h-4 text-[#27AE60] shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* Clickable CTA inside Card */}
            <button
              onClick={onOpenChat}
              className="w-full py-3 rounded-full bg-[#EAF3FB] hover:bg-[#D8EAF8] border border-[#BDD7F5] text-[#2C6FAC] font-semibold text-xs sm:text-sm text-center transition-all shadow-xs"
            >
              Start Interactive Booking Chat →
            </button>

          </div>

          {/* Floating Review / Rating Card (HecDoc Style) */}
          <div className="absolute -bottom-4 -left-4 sm:-left-6 z-20 bg-white p-3.5 rounded-xl border border-[#E0EAF4] shadow-lg shadow-[#4A90D9]/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFF9E6] border border-[#FFE7A3] flex items-center justify-center text-amber-500">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1A1A2E]">⭐ 4.9 • 350+ Patients</p>
              <p className="text-[10px] text-[#5A6A7A]">Verified 1-on-1 Consultations</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
