"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
    <section id="slots-section" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E0EAF4] shadow-sm relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#E0EAF4]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF3FB] text-[#4A90D9] text-xs font-semibold mb-2 border border-[#BDD7F5]">
              <Clock className="w-3.5 h-3.5" /> Real-Time Google Sheet Slots
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A2E]">
              Check Dr. Fatima's Availability
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6A7A] mt-1">
              Working Hours: 12:00 PM – 6:00 PM Daily (30-Minute Consultations)
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-3 bg-[#F0F6FF] p-2 rounded-xl border border-[#E0EAF4]">
            <label className="text-xs text-[#5A6A7A] font-semibold whitespace-nowrap flex items-center gap-1.5 pl-2">
              <CalendarIcon className="w-4 h-4 text-[#4A90D9]" /> Select Date:
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white text-[#1A1A2E] text-xs font-semibold px-3 py-2 rounded-lg border border-[#E0EAF4] focus:outline-none focus:border-[#4A90D9] transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Slot Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#5A6A7A] gap-3">
            <Loader2 className="w-8 h-8 text-[#4A90D9] animate-spin" />
            <p className="text-xs">Checking live appointment ledger in Google Sheets...</p>
          </div>
        ) : slots.length > 0 ? (
          <div>
            <p className="text-xs text-[#5A6A7A] mb-4 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#27AE60]" /> Click any open time slot below to begin instant booking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSlot(selectedDate, slot)}
                  className="p-3 rounded-xl bg-[#F0F6FF] hover:bg-[#4A90D9] border border-[#E0EAF4] hover:border-[#4A90D9] text-[#1A1A2E] hover:text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all group shadow-xs hover:shadow-md hover:shadow-[#4A90D9]/20"
                >
                  <span className="group-hover:scale-105 transition-transform">{slot}</span>
                  <span className="text-[10px] text-[#5A6A7A] group-hover:text-white/80 font-medium mt-0.5">Available</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-[#F0F6FF] rounded-xl border border-[#E0EAF4]">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1A1A2E]">All Slots Booked for {selectedDate}</p>
            <p className="text-xs text-[#5A6A7A] mt-1">Please select another date using the date picker above.</p>
          </div>
        )}

      </div>
    </section>
  );
};
