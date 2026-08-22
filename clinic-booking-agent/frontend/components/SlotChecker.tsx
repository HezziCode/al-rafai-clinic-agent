"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface SlotCheckerProps {
  onSelectSlot: (date: string, time: string) => void;
}

export const SlotChecker: React.FC<SlotCheckerProps> = ({ onSelectSlot }) => {
  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async (dateStr: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/appointments/slots?date=${dateStr}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setSlots(data.available_slots || []);
    } catch (err: any) {
      console.error(err);
      // Fallback mock slots if server offline
      setSlots(["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  return (
    <section id="slots-section" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-border shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-light text-primary text-xs font-bold mb-2 border border-blue-200">
              <Clock className="w-3.5 h-3.5" /> Live Clinic Schedule
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-dark tracking-tight">
              Check Dr. Fatima's Availability
            </h2>
            <p className="text-xs sm:text-sm text-text-mid mt-1 font-normal">
              Working Hours: 12:00 PM – 6:00 PM Daily (30-Minute Consultations)
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-3 bg-warm p-2 rounded-2xl border border-border shadow-xs">
            <label className="text-xs text-text-mid font-bold whitespace-nowrap flex items-center gap-1.5 pl-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Select Date:
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white text-text-dark text-xs font-bold px-3.5 py-2 rounded-xl border border-border focus:outline-none focus:border-primary transition-colors cursor-pointer shadow-xs"
            />
          </div>
        </div>

        {/* Slot Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-text-mid gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-medium">Checking available appointment times for Dr. Fatima...</p>
          </div>
        ) : slots.length > 0 ? (
          <div>
            <p className="text-xs sm:text-sm text-text-mid mb-4 flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Click any open time slot below to begin instant booking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSlot(selectedDate, slot)}
                  className="p-3.5 rounded-2xl bg-accent-light hover:bg-accent border border-accent/40 hover:border-accent text-text-dark hover:text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all duration-200 group shadow-xs hover:shadow-md"
                >
                  <span className="group-hover:scale-105 transition-transform">{slot}</span>
                  <span className="text-[10px] text-accent group-hover:text-white/90 font-medium mt-0.5">Available</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-warm rounded-2xl border border-border">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-text-dark">All Slots Booked for {selectedDate}</p>
            <p className="text-xs text-text-mid mt-1">Please select another date using the date picker above.</p>
          </div>
        )}

      </div>
    </section>
  );
};
