import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePulse Wellness Clinic | Dr. Sarah Jenkins | AI Appointment Booking",
  description: "Book 1-on-1 medical consultations with Dr. Sarah Jenkins. AI-powered text and voice booking, instant slot verification, and WhatsApp notifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-navy-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
