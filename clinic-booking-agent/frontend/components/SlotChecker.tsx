"use client";

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface SlotCheckerProps {
  onSelectSlot: (date: string, time: string) => void;
}

// Convert "14:00" → "2:00 PM", "12:30" → "12:30 PM"
const formatTo12Hour = (time: string): string => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
};

// Format date nicely: "2026-08-22" → "Fri, 22 Aug"
const formatDateLabel = (dateStr: string): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const SlotChecker: React.FC<SlotCheckerProps> = ({ onSelectSlot }) => {
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const fetchSlots = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments/slots?date=${dateStr}`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setSlots(data.available_slots || []);
    } catch {
      // Fallback mock slots if server offline
      setSlots(["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(selectedDate); }, [selectedDate]);

  const isToday = selectedDate === getTodayStr();

  return (
    <section id="slots-section" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">

        {/* Header */}
        <div className="bg-primary-light border-b border-blue-100 px-6 sm:px-10 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold mb-2 border border-blue-200 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Clinic Schedule
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-dark tracking-tight">
                Check Dr. Fatima's Availability
              </h2>
              <p className="text-xs sm:text-sm text-text-mid mt-1">
                Working Hours: <span className="font-semibold text-primary">12:00 PM – 6:00 PM Daily</span> &nbsp;·&nbsp; 30-Minute Slots
              </p>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-blue-200 shadow-sm w-fit">
              <CalendarIcon className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-text-light font-semibold uppercase tracking-wider">Select Date</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-sm font-bold text-text-dark bg-transparent focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slot Body */}
        <div className="px-6 sm:px-10 py-8">

          {/* Date label */}
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-text-mid">
              {isToday ? 'Today' : formatDateLabel(selectedDate)}
              {!loading && slots.length > 0 && (
                <span className="ml-2 text-primary font-bold">{slots.length} slots open</span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="py-14 flex flex-col items-center gap-3 text-text-mid">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <p className="text-xs font-medium">Checking live schedule...</p>
            </div>

          ) : slots.length > 0 ? (
            <>
              <p className="text-xs text-text-light mb-4 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                Tap a slot to start booking instantly
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {slots.map((slot, idx) => {
                  const isHovered = hoveredSlot === slot;
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectSlot(selectedDate, slot)}
                      onMouseEnter={() => setHoveredSlot(slot)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      className={`
                        relative flex flex-col items-center justify-center
                        px-2 py-3.5 rounded-2xl border font-semibold
                        transition-all duration-200 group
                        ${isHovered
                          ? 'bg-primary border-primary text-white shadow-md scale-105'
                          : 'bg-primary-light border-blue-200 text-primary hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="text-sm font-extrabold leading-none">
                        {formatTo12Hour(slot).split(' ')[0]}
                      </span>
                      <span className={`text-[10px] font-bold mt-1 ${isHovered ? 'text-white/80' : 'text-primary/70'}`}>
                        {formatTo12Hour(slot).split(' ')[1]}
                      </span>
                      <span className={`text-[9px] mt-1 font-medium ${isHovered ? 'text-white/60' : 'text-text-light'}`}>
                        Open
                      </span>
                    </button>
                  );
                })}
              </div>
            </>

          ) : (
            <div className="py-10 text-center bg-primary-light rounded-2xl border border-blue-100">
              <AlertCircle className="w-8 h-8 text-primary mx-auto mb-3 opacity-50" />
              <p className="text-sm font-bold text-text-dark">No slots available for {formatDateLabel(selectedDate)}</p>
              <p className="text-xs text-text-mid mt-1">Try selecting a different date above.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};