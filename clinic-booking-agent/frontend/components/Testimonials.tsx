"use client";

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      treatment: "General Health & Recovery",
      quote: "Dr. Fatima is one of the most attentive physicians I have ever consulted. She accurately diagnosed my persistent fatigue and iron deficiency in our first visit and gave me a clear, manageable treatment plan. I felt genuinely listened to and made a complete recovery within weeks.",
      author: "Ahmed Khan",
      location: "Lahore, Pakistan",
      initials: "AK",
      badgeColor: "bg-blue-50 text-primary border-blue-200"
    },
    {
      stars: 5,
      treatment: "Hypertension & Diabetes Care",
      quote: "Dr. Fatima ne meri mother ki blood pressure aur diabetes ko bohot detail se evaluate kiya. Unka medicine dosage adjustment itna accurate tha ke ammi ka BP ab bilkul controlled hai. Unka unhurried tareeqa aur polite behavior bohot comforting tha.",
      author: "Sana Malik",
      location: "Karachi, Pakistan",
      initials: "SM",
      badgeColor: "bg-emerald-50 text-accent border-green-200"
    },
    {
      stars: 5,
      treatment: "Chronic Allergy Management",
      quote: "Dr. Fatima was extremely thorough and gentle while examining my son for chronic seasonal allergies. Her diagnosis was spot on and the tailored treatment brought him immediate relief. Truly a trustworthy and compassionate family doctor.",
      author: "Usman Rasheed",
      location: "Islamabad, Pakistan",
      initials: "UR",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    }
  ];

  return (
    <section id="testimonials" className="bg-[#F8FAFC] py-24 px-4 lg:px-8 border-y border-border relative overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border shadow-xs text-xs sm:text-sm font-bold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            VERIFIED PATIENT EXPERIENCES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-dark tracking-tight">
            What Patients Say About Dr. Fatima
          </h2>
          <p className="text-base sm:text-lg text-text-mid mt-3 font-normal leading-relaxed">
            Real stories of healing, accurate diagnoses, and compassionate 1-on-1 medical care.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: Stars + Treatment Tag */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${rev.badgeColor}`}>
                    {rev.treatment}
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-text-mid text-sm sm:text-[15px] leading-relaxed mb-8 font-normal">
                  "{rev.quote}"
                </p>
              </div>

              {/* Bottom Patient Row */}
              <div className="pt-6 border-t border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-light border border-blue-200 flex items-center justify-center text-primary font-black text-sm shadow-xs">
                    {rev.initials}
                  </div>
                  <div>
                    <p className="font-extrabold text-text-dark text-sm flex items-center gap-1.5">
                      {rev.author}
                      <span title="Verified Consultation">
                        <CheckCircle2 className="w-4 h-4 text-accent inline shrink-0" />
                      </span>
                    </p>
                    <p className="text-xs text-text-light">{rev.location}</p>
                  </div>
                </div>

                <Quote className="w-7 h-7 text-primary/15 group-hover:text-primary/30 transition-colors shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Trust Banner */}
        <div className="mt-14 max-w-xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-text-dark">4.9 ★</div>
            <div className="text-xs text-text-mid">
              <p className="font-bold text-text-dark">Exceptional Medical Rating</p>
              <p className="text-text-light">Based on 350+ in-person consultations</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent-light px-3.5 py-1.5 rounded-full border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Patient Satisfaction
          </div>
        </div>

      </div>
    </section>
  );
};
