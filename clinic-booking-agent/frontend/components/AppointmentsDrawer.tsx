"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Phone, CheckCircle, RefreshCw, MessageSquare, Clock, History, Filter } from 'lucide-react';
import { API_URL, ADMIN_API_KEY } from '@/lib/config';

interface AppointmentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Appointment {
  Booking_ID: string;
  Patient_Name: string;
  Patient_Phone: string;
  Visit_Reason: string;
  Appointment_Date: string;
  Start_Time: string;
  Status: string;
  Created_At: string;
}

export const AppointmentsDrawer: React.FC<AppointmentsDrawerProps> = ({ isOpen, onClose }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPast, setShowPast] = useState(false);

  // Format 24-hour time "14:00" to 12-hour "2:00 PM"
  const formatTo12Hour = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h)) return time;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    const mins = isNaN(m) ? '00' : m.toString().padStart(2, '0');
    return `${hour}:${mins} ${period}`;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/appointments/list`, {
        headers: {
          'X-Admin-Key': ADMIN_API_KEY
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAppointments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter today & upcoming vs past appointments
  const today = new Date().toISOString().split('T')[0];
  const filteredAppointments = appointments.filter((apt) => {
    if (showPast) return true;
    return apt.Appointment_Date >= today;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white border-l border-border h-full flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header - Deep Primary Blue */}
        <div className="bg-primary p-6 text-white flex items-center justify-between shadow-md">
          <div>
            <span className="text-[11px] text-blue-200 font-bold uppercase tracking-wider bg-white/15 px-3 py-1 rounded-full">
              Doctor Dashboard
            </span>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-2">
              <FileText className="w-5 h-5 text-blue-200" /> Google Sheets Ledger
            </h2>
            <p className="text-xs text-blue-100 mt-0.5 font-medium">
              AL-RAFAI CLINIC • Dr. Fatima (12 PM – 6 PM Daily)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAppointments}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Refresh Google Sheets Ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar: Today/Upcoming vs Past Appointments */}
        <div className="bg-white px-6 py-3 border-b border-border flex items-center justify-between gap-2">
          <div className="text-xs text-text-mid font-medium flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-primary" />
            <span>Showing:</span>
            <span className="font-bold text-text-dark">
              {showPast ? 'All Records (Including Past)' : 'Today & Upcoming'}
            </span>
            <span className="text-xs font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full ml-1">
              {filteredAppointments.length}
            </span>
          </div>

          <button
            onClick={() => setShowPast(!showPast)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-border bg-warm hover:bg-primary-light hover:text-primary hover:border-primary transition-all flex items-center gap-1.5 shadow-xs"
          >
            <History className="w-3.5 h-3.5" />
            <span>{showPast ? 'Hide Past' : 'Show Past'}</span>
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
          {loading && appointments.length === 0 ? (
            <div className="text-center py-16 text-text-light text-sm font-medium">
              Loading real-time appointment records from Google Sheets...
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((apt, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-border space-y-3.5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary px-3 py-1 rounded-lg bg-primary-light border border-blue-200">
                    {apt.Booking_ID}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent-light text-accent border border-green-200">
                    {apt.Status || 'BOOKED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-light flex items-center gap-1 font-medium"><User className="w-3.5 h-3.5 text-primary" /> Patient:</span>
                    <p className="font-bold text-text-dark text-sm mt-0.5">{apt.Patient_Name}</p>
                  </div>
                  <div>
                    <span className="text-text-light flex items-center gap-1 font-medium"><Phone className="w-3.5 h-3.5 text-accent" /> Phone:</span>
                    <p className="font-bold text-text-dark text-sm mt-0.5">{apt.Patient_Phone}</p>
                  </div>
                  <div>
                    <span className="text-text-light flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5 text-primary-mid" /> Date:</span>
                    <p className="font-bold text-text-dark text-sm mt-0.5">{apt.Appointment_Date}</p>
                  </div>
                  <div>
                    <span className="text-text-light flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5 text-amber-500" /> Time:</span>
                    <p className="font-bold text-text-dark text-sm mt-0.5">{formatTo12Hour(apt.Start_Time)}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-border text-xs text-text-mid">
                  <span className="font-semibold text-text-light">Reason for visit: </span>
                  <span className="text-text-dark font-medium">{apt.Visit_Reason}</span>
                </div>
              </div>
            ))
          ) : appointments.length > 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 shadow-xs">
              <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-base font-bold text-text-dark">No Upcoming Appointments</p>
              <p className="text-xs text-text-mid mt-1 mb-4">You have appointments in past dates.</p>
              <button
                onClick={() => setShowPast(true)}
                className="px-4 py-2 bg-primary-light hover:bg-primary text-primary hover:text-white rounded-full text-xs font-bold border border-blue-200 transition-colors inline-flex items-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>Show Past Appointments</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-border p-8 shadow-xs">
              <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-base font-bold text-text-dark">No Appointments Booked Yet</p>
              <p className="text-xs text-text-mid mt-1">Book an appointment via the AI Chatbot to see it automatically appear here and in your Google Sheet!</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-border text-xs text-text-mid flex items-center justify-between font-medium">
          <span>AL-RAFAI CLINIC • Google Sheets Live</span>
          <span className="text-accent font-bold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> WhatsApp Alert Enabled
          </span>
        </div>

      </div>
    </div>
  );
};
