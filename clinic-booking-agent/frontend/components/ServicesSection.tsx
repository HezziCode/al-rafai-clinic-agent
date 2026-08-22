"use client";

import React from 'react';
import { ArrowRight, Stethoscope, Pill, Eye, FlaskConical, HeartPulse, UserCheck } from 'lucide-react';

interface ServicesSectionProps {
  onOpenChat: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenChat }) => {
  const services = [
    {
      icon: Stethoscope,
      iconBg: "bg-primary-light text-primary border-blue-200",
      title: "General Consultation",
      desc: "Routine checkups, health concerns, symptom evaluations, and trusted second opinions.",
    },
    {
      icon: Pill,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200",
      title: "Prescription & Follow-up",
      desc: "Comprehensive medication management, renewal plans, and structured recovery follow-ups.",
    },
    {
      icon: Eye,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      title: "Eye Examination",
      desc: "Basic primary vision assessments, eye strain checks, and specialist referrals when needed.",
    },
    {
      icon: FlaskConical,
      iconBg: "bg-rose-50 text-rose-600 border-rose-200",
      title: "Lab Test Coordination",
      desc: "Guidance on diagnostic blood work, requisitions, and in-depth lab report interpretation.",
    },
    {
      icon: HeartPulse,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200",
      title: "Mental Wellness",
      desc: "Compassionate, confidential primary care for stress, burnout, mild anxiety, and wellbeing.",
    },
    {
      icon: UserCheck,
      iconBg: "bg-emerald-50 text-emerald-600 border-green-200",
      title: "Women's Health",
      desc: "Dedicated primary healthcare for women, preventive screenings, and personalized guidance.",
    },
  ];

  return (
    <section id="services" className="bg-white py-20 px-4 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase bg-primary-light px-3.5 py-1 rounded-full border border-blue-200">
          OUR SERVICES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-dark tracking-tight mt-3">
          What Dr. Fatima Treats
        </h2>
        <p className="text-base text-text-mid mt-2 font-normal">
          Comprehensive primary care in a calm, unhurried 1-on-1 setting.
        </p>
      </div>

      {/* 6-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const IconComponent = service.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-border rounded-2xl p-6 hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs ${service.iconBg}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-text-dark mt-4 font-heading">
                  {service.title}
                </h3>
                <p className="text-text-mid text-sm mt-1.5 leading-relaxed">
                  {service.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-border/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-text-light">30 Min Session</span>
                <button 
                  onClick={onOpenChat}
                  className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                >
                  <span>Book This</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
