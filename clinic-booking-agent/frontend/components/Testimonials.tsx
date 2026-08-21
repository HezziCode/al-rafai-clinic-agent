"use client";

import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      stars: 5,
      quote: "Dr. Fatima listened to every concern without rushing. Booked the appointment via the AI chat in under a minute. WhatsApp confirmation came instantly.",
      author: "Ahmed K.",
      city: "Lahore",
      tag: "Verified Consultation"
    },
    {
      stars: 5,
      quote: "Pehli dafa kisi clinic ne itna smooth booking system diya. Urdu mein chat kiya, slot mila, appointment confirm hua. Zabardast experience.",
      author: "Sana M.",
      city: "Karachi",
      tag: "Urdu Voice Booking"
    },
    {
      stars: 5,
      quote: "Very professional and caring. The voice assistant made booking so easy for my elderly mother. Highly recommend Dr. Fatima to anyone seeking personal attention.",
      author: "Usman R.",
      city: "Islamabad",
      tag: "Family Health"
    }
  ];

  return (
    <section id="testimonials" className="bg-warm py-20 px-4 lg:px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-primary text-xs sm:text-sm font-bold tracking-widest uppercase bg-white px-4 py-1.5 rounded-full border border-border shadow-xs">
            PATIENT REVIEWS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-dark tracking-tight mt-3">
            What Our Patients Say
          </h2>
          <p className="text-base text-text-mid mt-2 font-normal">
            Real feedback from verified patients who booked 1-on-1 consultations with Dr. Fatima.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-7 border border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Rating Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-accent bg-accent-light px-2.5 py-0.5 rounded-full border border-green-200">
                    {rev.tag}
                  </span>
                </div>

                {/* Quote */}
                <p className="italic text-text-mid text-sm sm:text-base leading-relaxed mb-6">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="font-bold text-text-dark text-sm">{rev.author}</p>
                  <p className="text-xs text-text-light">{rev.city}, Pakistan</p>
                </div>
                <Quote className="w-6 h-6 text-primary/20 shrink-0" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
