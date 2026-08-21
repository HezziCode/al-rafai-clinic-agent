"use client";

import React from 'react';
import { UserCheck, Clock, Star, MessageSquareCode } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: UserCheck,
      title: "Single Doctor Practice",
      desc: "1-on-1 personalized attention with Dr. Fatima",
    },
    {
      icon: Clock,
      title: "12:00 PM – 6:00 PM Daily",
      desc: "Open every day for afternoon consultations",
    },
    {
      icon: Star,
      title: "4.9 ★ Patient Satisfaction",
      desc: "Based on 350+ verified patient reviews",
    },
    {
      icon: MessageSquareCode,
      title: "WhatsApp Confirmation",
      desc: "Instant booking details sent to doctor & patient",
    }
  ];

  return (
    <section className="py-8 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F0F6FF] rounded-2xl p-6 border border-[#E0EAF4] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-4 rounded-xl bg-white border border-[#E0EAF4] shadow-sm hover:border-[#BDD7F5] transition-all"
            >
              <div className="p-2.5 rounded-xl bg-[#EAF3FB] border border-[#BDD7F5] text-[#4A90D9] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1A1A2E]">{item.title}</h4>
                <p className="text-xs text-[#5A6A7A] mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
