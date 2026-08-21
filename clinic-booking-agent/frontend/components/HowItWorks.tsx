"use client";

import React from 'react';
import { ArrowRight, MessageSquare, CalendarCheck, CheckCircle } from 'lucide-react';

interface HowItWorksProps {
  onOpenChat: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenChat }) => {
  const steps = [
    {
      num: "01",
      icon: MessageSquare,
      title: "Chat or Call",
      desc: "Open the AI assistant. Type or speak in Roman Urdu or English at your convenience.",
    },
    {
      num: "02",
      icon: CalendarCheck,
      title: "Pick a Slot",
      desc: "The AI checks Dr. Fatima's real-time Google Sheets schedule and shows open times.",
    },
    {
      num: "03",
      icon: CheckCircle,
      title: "You're Confirmed",
      desc: "Get an instant WhatsApp booking confirmation with date, time, and clinic directions.",
    }
  ];

  return (
    <section id="how-it-works" className="bg-primary-light py-20 px-4 lg:px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase bg-white px-4 py-1.5 rounded-full border border-blue-200 shadow-xs">
            BOOK IN 3 STEPS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-dark tracking-tight mt-3">
            Easier Than Calling a Receptionist
          </h2>
          <p className="text-base text-text-mid mt-2 font-normal">
            No waiting on hold. Fast, AI-assisted scheduling in Roman Urdu or English.
          </p>
        </div>

        {/* 3-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 border-t-2 border-dashed border-primary/30 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-7 border border-border shadow-sm relative z-10 flex flex-col items-center text-center group hover:shadow-md hover:border-primary transition-all duration-200"
              >
                {/* Circle Number Badge */}
                <div className="w-14 h-14 rounded-full bg-primary text-white font-black text-lg flex items-center justify-center mb-5 shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                  {step.num}
                </div>

                <h3 className="text-xl font-bold text-text-dark mb-2 flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {step.title}
                </h3>

                <p className="text-sm text-text-mid leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}

        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-full px-9 py-4 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
          >
            <span>Try It Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
