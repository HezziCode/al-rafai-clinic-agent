"use client";

import React from 'react';
import { HeartPulse, Activity, Stethoscope, Video, FileSpreadsheet } from 'lucide-react';

interface ServicesBentoProps {
  onOpenChat: () => void;
}

export const ServicesBento: React.FC<ServicesBentoProps> = ({ onOpenChat }) => {
  const services = [
    {
      icon: Stethoscope,
      title: "General Consultations",
      desc: "Comprehensive 1-on-1 health evaluation, symptom assessment, and personalized treatment plans with Dr. Fatima.",
      span: "lg:col-span-2",
      badge: "Most Popular",
    },
    {
      icon: HeartPulse,
      title: "Preventive Care",
      desc: "Routine physicals, blood pressure checks, diabetes screening, and wellness counseling.",
      span: "lg:col-span-1",
      badge: "Wellness",
    },
    {
      icon: Activity,
      title: "Chronic Condition Care",
      desc: "Dedicated ongoing management for hypertension, asthma, thyroid issues, and diabetes.",
      span: "lg:col-span-1",
      badge: "Long-term Care",
    },
    {
      icon: Video,
      title: "Telehealth Consults",
      desc: "Convenient remote audio/video follow-ups for lab reviews and quick medical advice.",
      span: "lg:col-span-1",
      badge: "Virtual",
    },
    {
      icon: FileSpreadsheet,
      title: "Lab Orders & Refills",
      desc: "Fast blood work requisitions, lab report interpretation, and prescription renewals.",
      span: "lg:col-span-1",
      badge: "Fast Track",
    }
  ];

  return (
    <section id="services" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold text-[#4A90D9] uppercase tracking-wider bg-[#EAF3FB] px-3 py-1 rounded-full border border-[#BDD7F5]">
          Clinical Offerings
        </span>
        <h2 className="text-3xl font-extrabold text-[#1A1A2E] tracking-tight mt-3">
          Comprehensive Medical Services
        </h2>
        <p className="text-sm text-[#5A6A7A] mt-2">
          Dr. Fatima provides expert medical care across primary health, preventive wellness, and chronic disease management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div 
              key={idx}
              className={`bg-white p-6 rounded-2xl border border-[#E0EAF4] shadow-sm hover:border-[#BDD7F5] hover:shadow-md hover:shadow-[#4A90D9]/10 transition-all flex flex-col justify-between ${service.span}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[#EAF3FB] border border-[#BDD7F5] text-[#4A90D9]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F0F6FF] border border-[#E0EAF4] text-[#5A6A7A]">
                    {service.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{service.title}</h3>
                <p className="text-xs sm:text-sm text-[#5A6A7A] leading-relaxed">{service.desc}</p>
              </div>

              <div className="pt-6 mt-4 border-t border-[#E0EAF4] flex items-center justify-between">
                <span className="text-xs text-[#4A90D9] font-semibold">30 Min Appointment</span>
                <button 
                  onClick={onOpenChat}
                  className="text-xs font-semibold text-[#4A90D9] hover:text-[#2C6FAC] flex items-center gap-1 transition-colors group"
                >
                  Book Service <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
