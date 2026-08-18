"use client";

import React from 'react';
import { HeartPulse, Activity, Stethoscope, Video, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface ServicesBentoProps {
  onOpenChat: () => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onOpenChat }) => {
  const services = [
    {
      icon: Stethoscope,
      title: "General Consultations",
      desc: "Comprehensive 1-on-1 health evaluation, symptom assessment, and individual treatment plans with Dr. Jenkins.",
      span: "lg:col-span-2",
      badge: "Most Popular",
      color: "from-teal-500/20 to-teal-500/5 text-teal-400"
    },
    {
      icon: HeartPulse,
      title: "Preventive Care",
      desc: "Routine physicals, blood pressure checks, diabetes screening, and wellness guidance.",
      span: "lg:col-span-1",
      badge: "Wellness",
      color: "from-cyan-500/20 to-cyan-500/5 text-cyan-400"
    },
    {
      icon: Activity,
      title: "Chronic Condition Care",
      desc: "Dedicated ongoing management for hypertension, asthma, thyroid issues, and arthritis.",
      span: "lg:col-span-1",
      badge: "Long-term Care",
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400"
    },
    {
      icon: Video,
      title: "Telehealth Consults",
      desc: "Convenient video or audio consultations for follow-ups and quick medical advice.",
      span: "lg:col-span-1",
      badge: "Virtual",
      color: "from-blue-500/20 to-blue-500/5 text-blue-400"
    },
    {
      icon: FileSpreadsheet,
      title: "Lab Orders & Refills",
      desc: "Fast blood work requisitions, lab interpretation, and prescription maintenance renewals.",
      span: "lg:col-span-1",
      badge: "Fast Track",
      color: "from-indigo-500/20 to-indigo-500/5 text-indigo-400"
    }
  ];

  return (
    <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Comprehensive Medical Services
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Dr. Sarah Jenkins provides expert care across general health, preventive medicine, and ongoing conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div 
              key={idx}
              className={`glass-card p-6 rounded-2xl relative flex flex-col justify-between ${service.span}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} border border-white/10`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                    {service.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{service.desc}</p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-teal-400 font-medium">30 Min Appointment</span>
                <button 
                  onClick={onOpenChat}
                  className="text-xs font-semibold text-white hover:text-teal-300 flex items-center gap-1 transition-colors"
                >
                  Book This Service →
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
