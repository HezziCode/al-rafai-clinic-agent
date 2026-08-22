"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Lock, X, AlertCircle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DOCTOR_PIN } from '@/lib/config';

interface DoctorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DoctorPinModal: React.FC<DoctorPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);
  const [isShaking, setIsShaking] = useState<boolean>(false);

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  // Auto focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError(null);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockoutSeconds]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, value: string) => {
    if (isLocked) return;

    // Only allow single digit
    const cleaned = value.replace(/\D/g, '');
    const digit = cleaned.slice(-1);

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError(null);

    // Auto-advance to next input
    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (digit && index === 3 && newPin.every((d) => d !== '')) {
      validatePin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isLocked) return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      const newPin = pasted.split('');
      setPin(newPin);
      inputRefs[3].current?.focus();
      validatePin(pasted);
    }
  };

  const validatePin = (enteredPin: string) => {
    if (isLocked) return;

    if (enteredPin === DOCTOR_PIN) {
      setError(null);
      setAttempts(0);
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutSeconds(30);
        setError("Too many attempts. Contact admin.");
      } else {
        setError(`Incorrect PIN. Try again. (${3 - newAttempts} attempts left)`);
      }

      setPin(['', '', '', '']);
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.some((d) => d === '')) {
      setError("Please enter all 4 digits.");
      return;
    }
    validatePin(pin.join(''));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-md bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-warm hover:bg-gray-200 text-text-mid hover:text-text-dark transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-light border border-blue-200 flex items-center justify-center text-primary shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-text-dark tracking-tight font-heading">
              Doctor Dashboard Access
            </h3>
            <p className="text-xs sm:text-sm text-text-mid mt-1 font-normal">
              Enter your 4-digit PIN to continue
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 4 Digit OTP Boxes */}
          <div className="flex justify-center items-center gap-3">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isLocked}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-2xl outline-none transition-all ${
                  error
                    ? 'border-red-500 bg-red-50/50 text-red-700 focus:border-red-600'
                    : digit
                    ? 'border-primary bg-primary-light/50 text-primary'
                    : 'border-border bg-warm focus:border-primary focus:bg-white text-text-dark'
                } ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
            ))}
          </div>

          {/* Error Message & Lockout Notice */}
          {error && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 ${
              isLocked 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {error} {isLocked && `(Unlocked in ${lockoutSeconds}s)`}
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLocked || pin.some((d) => d === '')}
            className={`w-full py-4 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
              isLocked || pin.some((d) => d === '')
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white hover:scale-[1.02] shadow-primary/25'
            }`}
          >
            <span>Access Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Footer Note */}
        <p className="text-[11px] text-text-light text-center mt-6 font-medium flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-primary" />
          <span>Secure access protected for Dr. Fatima's practice.</span>
        </p>

      </div>
    </div>
  );
};
