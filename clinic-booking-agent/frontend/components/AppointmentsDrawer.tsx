"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, User, Phone, CheckCircle, RefreshCw, MessageSquare, Clock } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-navy-900 border-l border-white/10 h-full p-6 flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Doctor Dashboard</span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <FileText className="w-5 h-5 text-cyan-400" /> Google Sheets Ledger
            </h2>
            <p className="text-xs text-slate-400">Dr. Fatima • Single Doctor Practice</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAppointments}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
              title="Refresh Google Sheet Ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {loading && appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading appointment records from Google Sheets...
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((apt, idx) => (
              <div key={idx} className="glass-card p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-teal-400 px-2.5 py-1 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    {apt.Booking_ID}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {apt.Status || 'BOOKED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 flex items-center gap-1"><User className="w-3 h-3 text-cyan-400" /> Patient:</span>
                    <p className="font-semibold text-white mt-0.5">{apt.Patient_Name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3 text-teal-400" /> Phone:</span>
                    <p className="font-semibold text-white mt-0.5">{apt.Patient_Phone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3 text-purple-400" /> Date:</span>
                    <p className="font-semibold text-white mt-0.5">{apt.Appointment_Date}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Time:</span>
                    <p className="font-semibold text-white mt-0.5">{apt.Start_Time}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs text-slate-300">
                  <span className="text-slate-400">Reason for visit: </span>
                  <span className="text-slate-200">{apt.Visit_Reason}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 p-6">
              <MessageSquare className="w-8 h-8 text-teal-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Appointments Booked Yet</p>
              <p className="text-xs text-slate-400 mt-1">Book an appointment via the AI Chatbot to see it automatically appear here and in your Google Sheet!</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Sheet ID: 1DYIMdEyNscWOnn1u6naMQW5kCMTCO9EfS5NN5p2vxmo</span>
          <span className="text-teal-400 font-medium">WhatsApp Enabled</span>
        </div>

      </div>
    </div>
  );
};
