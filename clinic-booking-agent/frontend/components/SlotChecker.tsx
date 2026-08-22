"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { API_URL } from '@/lib/config';

interface SlotCheckerProps {
  onSelectSlot: (date: string, time: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const SlotChecker: React.FC<SlotCheckerProps> = ({ onSelectSlot }) => {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Custom Calendar State
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return 'Select a date';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTo12Hour = (time: string): string => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h)) return time;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    const mins = isNaN(m) ? '00' : m.toString().padStart(2, '0');
    return `${hour}:${mins} ${period}`;
  };

  // Generate days array for the view month (including leading and trailing nulls for grid alignment)
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  };

  const handlePrevMonth = () => {
    const current = new Date();
    const isCurrentMonthOrPast = 
      viewMonth.year < current.getFullYear() || 
      (viewMonth.year === current.getFullYear() && viewMonth.month <= current.getMonth());
    
    if (isCurrentMonthOrPast) return;

    setViewMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const today = getTodayStr();
    if (dateStr < today) return; // Past date, ignore
    setSelectedDate(dateStr);
    setCalendarOpen(false);
  };

  const isPrevDisabled = () => {
    const current = new Date();
    return viewMonth.year < current.getFullYear() || 
      (viewMonth.year === current.getFullYear() && viewMonth.month <= current.getMonth());
  };

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

  const daysGrid = getDaysInMonth(viewMonth.year, viewMonth.month);
  const todayStr = getTodayStr();

  return (
    <section id="slots-section" className="py-20 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-border shadow-sm relative">
        
        {/* Top Header & Custom Calendar Trigger */}
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

          {/* Custom Date Picker Dropdown */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="flex items-center gap-3 bg-white px-4 py-2.5 sm:py-3 rounded-2xl border border-blue-200 shadow-xs hover:border-primary hover:shadow-md transition-all duration-200 w-full sm:w-fit"
            >
              <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center text-primary shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-text-light font-semibold uppercase tracking-wider">
                  Select Date
                </p>
                <p className="text-xs sm:text-sm font-bold text-text-dark">
                  {formatDisplayDate(selectedDate)}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-text-light ml-2 transition-transform duration-200 ${calendarOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>

            {/* Inline Calendar Popup */}
            {calendarOpen && (
              <div className="absolute z-50 top-full mt-2 right-0 w-72 sm:w-80 bg-white rounded-2xl border border-blue-200 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
                
                {/* Month Navigation Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <button
                    onClick={handlePrevMonth}
                    disabled={isPrevDisabled()}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isPrevDisabled()
                        ? 'border-transparent text-gray-300 cursor-not-allowed'
                        : 'border-border hover:bg-primary-light hover:text-primary text-text-dark'
                    }`}
                    title="Previous Month"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-extrabold text-text-dark font-heading">
                    {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
                  </span>

                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-xl border border-border hover:bg-primary-light hover:text-primary text-text-dark transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Names Row */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {DAY_NAMES.map((d, i) => (
                    <span key={i} className="text-[11px] font-bold text-text-light py-1">
                      {d}
                    </span>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {daysGrid.map((day, idx) => {
                    if (day === null) {
                      return <div key={idx} className="w-8 h-8 sm:w-9 sm:h-9 pointer-events-none" />;
                    }

                    const dateStr = `${viewMonth.year}-${String(viewMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isPast = dateStr < todayStr;
                    const isToday = dateStr === todayStr;
                    const isSelected = dateStr === selectedDate;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        disabled={isPast}
                        className={`w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm rounded-xl flex items-center justify-center font-medium transition-all ${
                          isSelected
                            ? 'bg-primary text-white font-bold shadow-sm shadow-primary/30'
                            : isPast
                            ? 'text-gray-300 cursor-not-allowed'
                            : isToday
                            ? 'ring-1.5 ring-primary text-primary font-bold hover:bg-primary-light'
                            : 'text-text-dark hover:bg-primary-light hover:text-primary'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Footer shortcut to Jump to Today */}
                <div className="mt-3 pt-2 border-t border-border flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      const today = getTodayStr();
                      setSelectedDate(today);
                      const d = new Date();
                      setViewMonth({ year: d.getFullYear(), month: d.getMonth() });
                      setCalendarOpen(false);
                    }}
                    className="text-primary font-bold hover:underline"
                  >
                    Today
                  </button>
                  <span className="text-text-light">
                    {formatDisplayDate(selectedDate)}
                  </span>
                </div>

              </div>
            )}
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
              <CheckCircle2 className="w-4 h-4 text-primary" /> Click any open time slot below to begin instant booking:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSlot(selectedDate, slot)}
                  className="p-3.5 rounded-2xl bg-primary-light hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-white font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all duration-200 group shadow-xs hover:shadow-md hover:scale-105"
                >
                  <span className="group-hover:scale-105 transition-transform">{formatTo12Hour(slot)}</span>
                  <span className="text-[10px] text-primary/60 group-hover:text-white/80 font-medium mt-0.5">Available</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-warm rounded-2xl border border-border">
            <AlertCircle className="w-8 h-8 text-primary/50 mx-auto mb-2" />
            <p className="text-sm font-bold text-text-dark">All Slots Booked for {formatDisplayDate(selectedDate)}</p>
            <p className="text-xs text-text-mid mt-1">Please select another date using the calendar picker above.</p>
          </div>
        )}

      </div>
    </section>
  );
};
