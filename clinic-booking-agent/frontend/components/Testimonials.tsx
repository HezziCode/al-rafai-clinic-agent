"use client";

import React from 'react';
import { Star, CheckCircle2, Quote, Sparkles, ShieldCheck } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      treatment: "General Health & Recovery",
      quote: "Dr. Fatima is one of the most attentive physicians I have ever consulted. She accurately diagnosed my persistent fatigue and iron deficiency in our first visit and gave me a clear, manageable treatment plan. I felt genuinely listened to and made a complete recovery within weeks.",
      author: "Ahmed Khan",
      location: "Lahore, Pakistan",
      initials: "AK",
      badgeColor: "bg-primary-light text-primary border-blue-200"
    },
    {
      stars: 5,
      treatment: "Hypertension & Diabetes Care",
      quote: "Dr. Fatima ne meri mother ki blood pressure aur diabetes ko bohot detail se evaluate kiya. Unka medicine dosage adjustment itna accurate tha ke ammi ka BP ab bilkul controlled hai. Unka unhurried tareeqa aur polite behavior bohot comforting tha.",
      author: "Sana Malik",
      location: "Karachi, Pakistan",
      initials: "SM",
      badgeColor: "bg-blue-50 text-primary border-blue-200"
    },
    {
      stars: 5,
      treatment: "Chronic Allergy Management",
      quote: "Dr. Fatima was extremely thorough and gentle while examining my son for chronic seasonal allergies. Her diagnosis was spot on and the tailored treatment brought him immediate relief. Truly a trustworthy and compassionate family doctor.",
      author: "Usman Rasheed",
      location: "Islamabad, Pakistan",
      initials: "UR",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    }
  ];

  return (
    <section id="testimonials" className="bg-[#F8FAFC] py-20 px-4 lg:px-8 border-y border-border relative overflow-hidden">
      
      {/* Background Decorative Pattern */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs text-xs sm:text-sm font-bold text-primary mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>VERIFIED PATIENT REVIEWS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-dark tracking-tight font-heading">
            What Patients Say About Dr. Fatima
          </h2>
          <p className="text-base sm:text-lg text-text-mid mt-3 font-normal leading-relaxed">
            Real stories of healing, accurate diagnoses, and compassionate 1-on-1 medical care.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <div>
                {/* Top Row: 5 Gold Stars + Treatment Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${rev.badgeColor}`}>
                    {rev.treatment}
                  </span>
                </div>

                {/* Patient Quote */}
                <p className="text-text-mid text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                  "{rev.quote}"
                </p>
              </div>

              {/* Patient Info Footer */}
              <div className="pt-5 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light border border-blue-200 flex items-center justify-center text-primary font-extrabold text-sm shadow-xs shrink-0">
                    {rev.initials}
                  </div>
                  <div>
                    <p className="font-extrabold text-text-dark text-sm flex items-center gap-1.5">
                      {rev.author}
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    </p>
                    <p className="text-xs text-text-light">{rev.location}</p>
                  </div>
                </div>

                <Quote className="w-6 h-6 text-primary/20 group-hover:text-primary/40 transition-colors shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Medical Trust Banner */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl p-5 border border-blue-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-primary font-black text-lg border border-blue-200 shrink-0">
              4.9
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-0.5 justify-center sm:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-text-dark ml-1">Overall Rating</span>
              </div>
              <p className="text-xs text-text-mid font-medium">Based on 350+ verified patient consultations</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-4 py-2 rounded-full border border-blue-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>100% Verified Reviews</span>
          </div>
        </div>

      </div>
    </section>
  );
};
