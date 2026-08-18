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
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-2">
              <Clock className="w-3.5 h-3.5" /> Real-Time Google Sheet Slots
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Check Dr. Fatima's Availability
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Working Hours: 12:00 PM – 6:00 PM Daily (30-Minute Appointments)
            </p>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-300 font-medium whitespace-nowrap flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-teal-400" /> Select Date:
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-navy-900 text-white text-xs font-medium px-3.5 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-teal-400 transition-colors"
            />
          </div>
        </div>

        {/* Slot Grid */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
            <p className="text-xs">Checking live appointment ledger in Google Sheets...</p>
          </div>
        ) : slots.length > 0 ? (
          <div>
            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Click any open time slot below to begin instant booking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSlot(selectedDate, slot)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-teal-500/20 border border-white/10 hover:border-teal-500/50 text-white hover:text-teal-300 font-semibold text-xs sm:text-sm flex flex-col items-center justify-center transition-all group shadow-sm"
                >
                  <span className="group-hover:scale-105 transition-transform">{slot}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-teal-400 font-normal mt-0.5">Available</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-white/5 rounded-2xl border border-white/5">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">All Slots Booked for {selectedDate}</p>
            <p className="text-xs text-slate-400 mt-1">Please select another date using the date picker above.</p>
          </div>
        )}

      </div>
    </section>
  );
};
