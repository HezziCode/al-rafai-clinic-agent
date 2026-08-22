import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AL-RAFAI CLINIC | Dr. Fatima | Medical Consultation & Appointment Booking",
  description: "Book 1-on-1 medical consultations with Dr. Fatima at AL-RAFAI CLINIC. AI-powered booking, instant slot availability, and instant booking confirmations.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" }
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased bg-white text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
