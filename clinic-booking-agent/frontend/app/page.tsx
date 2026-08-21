"use client";

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { ServicesSection } from '@/components/ServicesSection';
import { HowItWorks } from '@/components/HowItWorks';
import { SlotChecker } from '@/components/SlotChecker';
import { AboutDoctor } from '@/components/AboutDoctor';
import { Testimonials } from '@/components/Testimonials';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';
import { AppointmentsDrawer } from '@/components/AppointmentsDrawer';

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
    <div className="min-h-screen flex flex-col bg-white text-text-dark selection:bg-primary-light selection:text-primary-dark">
      
      {/* 1. Smart Sticky Navbar */}
      <Navbar 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Main Content Sections (Alternating Backgrounds: warm -> white -> primary-light -> white -> warm) */}
      <main className="flex-1">
        
        {/* 2. Hero Section (Warm #F6F0E8 Left, Doctor Photo Right) */}
        <Hero 
          onOpenChat={() => setIsChatOpen(true)}
          onScrollToSlots={handleScrollToSlots}
        />

        {/* 3. Full-width Trust Stats Bar (Deep Blue #2B6CB0) */}
        <StatsBar />

        {/* 4. Services Section (White Background) */}
        <ServicesSection 
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* 5. How It Works (Primary-Light #EBF4FF Background) */}
        <HowItWorks 
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* 6. Real-Time Slot Checker (White Background) */}
        <SlotChecker 
          onSelectSlot={handleSelectSlot}
        />

        {/* 7. About Dr. Fatima (White Background) */}
        <AboutDoctor 
          onOpenChat={() => setIsChatOpen(true)}
        />

        {/* 8. Patient Testimonials (Warm #F6F0E8 Background) */}
        <Testimonials />

      </main>

      {/* 9. 4-Column Footer */}
      <Footer 
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* 10. Floating WhatsApp-Style AI Chat Widget Button & Slide-up Panel */}
      <ChatWidget 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(!isChatOpen)}
        initialDateSlot={selectedSlot}
      />

      {/* 11. Doctor Dashboard Drawer */}
      <AppointmentsDrawer 
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

    </div>
  );
}
