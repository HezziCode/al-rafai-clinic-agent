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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white border-l border-[#E0EAF4] h-full p-6 flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E0EAF4]">
          <div>
            <span className="text-xs text-[#4A90D9] font-bold uppercase tracking-wider bg-[#EAF3FB] px-2.5 py-0.5 rounded-full border border-[#BDD7F5]">
              Doctor Dashboard
            </span>
            <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-2 mt-2">
              <FileText className="w-5 h-5 text-[#4A90D9]" /> Google Sheets Ledger
            </h2>
            <p className="text-xs text-[#5A6A7A] mt-0.5">AL-RAFAI CLINIC • Dr. Fatima (12 PM – 6 PM Daily)</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAppointments}
              className="p-2 rounded-xl bg-[#F0F6FF] hover:bg-[#EAF3FB] border border-[#E0EAF4] text-[#5A6A7A] hover:text-[#4A90D9] transition-colors"
              title="Refresh Google Sheet Ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#4A90D9]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F0F6FF] hover:bg-[#EAF3FB] border border-[#E0EAF4] text-[#5A6A7A] hover:text-[#1A1A2E] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {loading && appointments.length === 0 ? (
            <div className="text-center py-12 text-[#5A6A7A] text-xs">
              Loading appointment records from Google Sheets...
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((apt, idx) => (
              <div key={idx} className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E0EAF4] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#2C6FAC] px-2.5 py-1 rounded-lg bg-[#EAF3FB] border border-[#BDD7F5]">
                    {apt.Booking_ID}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#27AE60] border border-[#B7ECC9]">
                    {apt.Status || 'BOOKED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#5A6A7A] flex items-center gap-1"><User className="w-3 h-3 text-[#4A90D9]" /> Patient:</span>
                    <p className="font-bold text-[#1A1A2E] mt-0.5">{apt.Patient_Name}</p>
                  </div>
                  <div>
                    <span className="text-[#5A6A7A] flex items-center gap-1"><Phone className="w-3 h-3 text-[#4A90D9]" /> Phone:</span>
                    <p className="font-bold text-[#1A1A2E] mt-0.5">{apt.Patient_Phone}</p>
                  </div>
                  <div>
                    <span className="text-[#5A6A7A] flex items-center gap-1"><Calendar className="w-3 h-3 text-[#4A90D9]" /> Date:</span>
                    <p className="font-bold text-[#1A1A2E] mt-0.5">{apt.Appointment_Date}</p>
                  </div>
                  <div>
                    <span className="text-[#5A6A7A] flex items-center gap-1"><Clock className="w-3 h-3 text-[#4A90D9]" /> Time:</span>
                    <p className="font-bold text-[#1A1A2E] mt-0.5">{apt.Start_Time}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E0EAF4] text-xs text-[#5A6A7A]">
                  <span className="font-medium text-[#5A6A7A]">Reason for visit: </span>
                  <span className="text-[#1A1A2E] font-medium">{apt.Visit_Reason}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#F0F6FF] rounded-xl border border-[#E0EAF4] p-6">
              <MessageSquare className="w-8 h-8 text-[#4A90D9] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#1A1A2E]">No Appointments Booked Yet</p>
              <p className="text-xs text-[#5A6A7A] mt-1">Book an appointment via the AI Chatbot to see it automatically appear here and in your Google Sheet!</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#E0EAF4] text-[11px] text-[#5A6A7A] flex items-center justify-between">
          <span>AL-RAFAI CLINIC • Google Sheets Live</span>
          <span className="text-[#27AE60] font-semibold">WhatsApp Enabled</span>
        </div>

      </div>
    </div>
  );
};
