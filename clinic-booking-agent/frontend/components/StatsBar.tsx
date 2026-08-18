"use client";

import React from 'react';
import { UserCheck, Clock, Star, MessageSquareCode } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: UserCheck,
      title: "Single Doctor Practice",
      desc: "1-on-1 personalized attention with Dr. Jenkins",
      color: "text-teal-400"
    },
    {
      icon: Clock,
      title: "1:00 PM – 6:00 PM",
      desc: "Open daily for afternoon consultations",
      color: "text-cyan-400"
    },
    {
      icon: Star,
      title: "4.9 ★ Patient Satisfaction",
      desc: "Based on 350+ verified patient reviews",
      color: "text-amber-400"
    },
    {
      icon: MessageSquareCode,
      title: "WhatsApp Doctor Alert",
      desc: "Every booking instantly sent to doctor",
      color: "text-emerald-400"
    }
  ];

  return (
    <section className="py-8 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className={`p-2.5 rounded-xl bg-navy-900 border border-white/10 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
