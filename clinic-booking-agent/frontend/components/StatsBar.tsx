"use client";

import React from 'react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: "350+",
      label: "Patients Treated",
    },
    {
      value: "4.9 ★",
      label: "Rating (Verified)",
    },
    {
      value: "12PM–6PM",
      label: "Daily Care",
    },
    {
      value: "< 60 sec",
      label: "Booking Time",
    }
  ];

  return (
    <section className="bg-primary text-white py-8 border-y border-primary-dark shadow-inner">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center px-4 pt-4 md:pt-0">
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
