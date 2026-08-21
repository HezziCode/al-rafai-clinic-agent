"use client";

import React from 'react';
import { Award, HeartHandshake, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';

interface AboutDoctorProps {
  onOpenChat: () => void;
}

export const AboutDoctor: React.FC<AboutDoctorProps> = ({ onOpenChat }) => {
  return (
    <section id="about" className="bg-white py-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Doctor Portrait Image */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-md h-[480px] rounded-3xl overflow-hidden shadow-xl border border-border relative group">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80" 
              alt="Dr. Fatima - AL-RAFAI CLINIC" 
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Credentials Badge */}
          <div className="absolute -bottom-5 bg-white rounded-2xl shadow-xl px-5 py-3 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light border border-blue-200 flex items-center justify-center text-primary font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-text-dark">Dr. Fatima, MBBS</p>
              <p className="text-[11px] text-text-light font-medium">General Physician & Consultant</p>
            </div>
          </div>
        </div>

        {/* Right Column: Doctor Story & Credentials */}
        <div className="lg:col-span-7 space-y-6 pt-6 lg:pt-0">
          
          <div>
            <span className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase bg-primary-light px-3.5 py-1 rounded-full border border-blue-200">
              ABOUT YOUR DOCTOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-dark tracking-tight mt-3">
              Meet Dr. Fatima
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-text-mid leading-relaxed">
            <p>
              At <strong className="text-text-dark font-semibold">AL-RAFAI CLINIC</strong>, healthcare is personal. Dr. Fatima believes in unhurried, attentive consultations where patients are heard, respected, and treated with complete compassion.
            </p>
            <p>
              As a dedicated single-doctor practice, you see Dr. Fatima directly for every visit — ensuring thorough continuity of care, deep understanding of your medical history, and zero administrative disconnect.
            </p>
            <p>
              Whether you need routine preventive screenings, chronic disease management, or urgent medical guidance, Dr. Fatima provides evidence-based medical care tailored to your family's needs.
            </p>
          </div>

          {/* 3 Credential Pills */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-warm border border-border text-xs sm:text-sm font-bold text-text-dark">
              <ShieldCheck className="w-4 h-4 text-accent" /> MBBS Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-warm border border-border text-xs sm:text-sm font-bold text-text-dark">
              <UserCheck className="w-4 h-4 text-primary" /> General Physician
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-warm border border-border text-xs sm:text-sm font-bold text-text-dark">
              <HeartHandshake className="w-4 h-4 text-primary-mid" /> 1-on-1 Unhurried Care
            </span>
          </div>

          {/* CTA */}
          <div className="pt-3">
            <button
              onClick={onOpenChat}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-full px-8 py-3.5 font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
