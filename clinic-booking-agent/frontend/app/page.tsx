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
    <div className="min-h-screen flex flex-col bg-navy-900 text-slate-100 selection:bg-teal-500 selection:text-navy-900">
      
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
      <footer className="border-t border-white/10 bg-navy-950 py-12 px-4 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-slate-400">
          
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              CarePulse Wellness Clinic
            </div>
            <p className="leading-relaxed text-slate-400">
              Single-doctor medical practice led by Dr. Fatima. Providing compassionate, unhurried, 1-on-1 healthcare for all your primary medical needs.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Clinic Hours & Location</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Working Hours: 12:00 PM – 6:00 PM Daily</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>742 Evergreen Terrace, Suite 100</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Phone: +1 (555) 234-5678</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Single Doctor Commitment</h4>
            <p className="leading-relaxed">
              Every booking is saved to our doctor-facing Google Sheet and triggers an instant WhatsApp alert directly to Dr. Fatima. Zero double-booking guarantee.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> HIPAA Compliant & Secure
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} CarePulse Wellness Clinic. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 14, FastAPI & OpenAI Agents SDK <Heart className="w-3 h-3 text-teal-400 fill-teal-400" />
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
