"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { ServicesBento } from '@/components/ServicesBento';
import { SlotChecker } from '@/components/SlotChecker';
import { ChatWidget } from '@/components/ChatWidget';
import { AppointmentsDrawer } from '@/components/AppointmentsDrawer';
import { Phone, MapPin, Clock, Stethoscope, ShieldCheck, Heart } from 'lucide-react';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const handleSelectSlot = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    setIsChatOpen(true);
  };

  const handleScrollToSlots = () => {
    const el = document.getElementById('slots-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A2E] selection:bg-[#EAF3FB] selection:text-[#2C6FAC]">
      
      {/* Navigation Bar */}
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero 
          onOpenChat={() => setIsChatOpen(true)}
          onScrollToSlots={handleScrollToSlots}
        />

        <StatsBar />

        <ServicesBento 
          onOpenChat={() => setIsChatOpen(true)}
        />

        <SlotChecker 
          onSelectSlot={handleSelectSlot}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E0EAF4] bg-[#F0F6FF] py-12 px-4 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#5A6A7A]">
          
          <div>
            <div className="flex items-center gap-2 text-[#1A1A2E] font-bold text-base mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#EAF3FB] border border-[#BDD7F5] flex items-center justify-center text-[#4A90D9]">
                <Stethoscope className="w-4 h-4" />
              </div>
              AL-RAFAI CLINIC
            </div>
            <p className="leading-relaxed text-[#5A6A7A]">
              Single-doctor medical practice led by Dr. Fatima. Providing compassionate, unhurried, 1-on-1 healthcare for all your primary medical needs.
            </p>
          </div>

          <div>
            <h4 className="text-[#1A1A2E] font-bold text-sm mb-3">Clinic Hours & Location</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-[#5A6A7A]">
                <Clock className="w-4 h-4 text-[#4A90D9]" />
                <span>Working Hours: 12:00 PM – 6:00 PM Daily</span>
              </li>
              <li className="flex items-center gap-2 text-[#5A6A7A]">
                <MapPin className="w-4 h-4 text-[#4A90D9]" />
                <span>742 Evergreen Terrace, Suite 100</span>
              </li>
              <li className="flex items-center gap-2 text-[#5A6A7A]">
                <Phone className="w-4 h-4 text-[#4A90D9]" />
                <span>Phone: +1 (555) 234-5678</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1A1A2E] font-bold text-sm mb-3">Single Doctor Commitment</h4>
            <p className="leading-relaxed">
              Every booking is saved to our doctor-facing Google Sheet and triggers an instant WhatsApp alert directly to Dr. Fatima. Zero double-booking guarantee.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-[#27AE60] font-semibold bg-[#E8F8F0] px-2.5 py-1 rounded-full border border-[#B7ECC9]">
              <ShieldCheck className="w-4 h-4" /> Verified & Secure Practice
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#E0EAF4] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5A6A7A]">
          <p>© {new Date().getFullYear()} AL-RAFAI CLINIC. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Designed & Developed by{" "}
            <a 
              href="https://www.linkedin.com/in/huzaifasys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#4A90D9] hover:text-[#2C6FAC] hover:underline transition-colors"
            >
              Huzaifa Developer
            </a>{" "}
            <Heart className="w-3.5 h-3.5 text-[#4A90D9] fill-[#4A90D9]" />
          </p>
        </div>
      </footer>

      {/* Floating Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(!isChatOpen)}
        initialDateSlot={selectedSlot}
      />

      {/* Doctor Dashboard Drawer */}
      <AppointmentsDrawer 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

    </div>
  );
}
