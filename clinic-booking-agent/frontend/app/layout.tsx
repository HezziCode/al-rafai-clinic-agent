import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: "#2B6CB0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://al-rafai-clinic.vercel.app"),
  title: {
    default: "AL-RAFAI CLINIC | Dr. Fatima | Medical Consultation & Appointment Booking",
    template: "%s | AL-RAFAI CLINIC",
  },
  description: "Book 1-on-1 medical consultations with Dr. Fatima at AL-RAFAI CLINIC in 5A/2 North Karachi. AI-powered 24/7 voice & online booking, instant slot availability, and unhurried care.",
  keywords: [
    "AL-RAFAI CLINIC",
    "Dr. Fatima",
    "Doctor in North Karachi",
    "General Physician North Karachi",
    "Online Clinic Booking Karachi",
    "Medical Consultation Karachi",
    "AI Voice Doctor Booking",
    "Clinic 5A/2 North Karachi",
    "MBBS Doctor Appointment",
    "Best General Physician Karachi",
    "Family Doctor North Karachi",
  ],
  authors: [
    { name: "Dr. Fatima" },
    { name: "Huzaifa Developer", url: "https://www.linkedin.com/in/huzaifasys" },
  ],
  creator: "Huzaifa Developer",
  publisher: "AL-RAFAI CLINIC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://al-rafai-clinic.vercel.app",
  },
  openGraph: {
    title: "AL-RAFAI CLINIC | Dr. Fatima | Medical Consultation & Appointment Booking",
    description: "Book 1-on-1 medical consultations with Dr. Fatima at AL-RAFAI CLINIC in North Karachi. AI-powered 24/7 booking and instant slot availability.",
    url: "https://al-rafai-clinic.vercel.app",
    siteName: "AL-RAFAI CLINIC",
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "AL-RAFAI CLINIC Logo & Medical Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AL-RAFAI CLINIC | Dr. Fatima | Medical Consultation & Appointment Booking",
    description: "Book 1-on-1 medical consultations with Dr. Fatima at AL-RAFAI CLINIC in North Karachi. 24/7 AI Voice & Online Booking.",
    images: ["/icon.png"],
    creator: "@huzaifasys",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  category: "Health & Medical",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "AL-RAFAI CLINIC",
  "alternateName": "Al-Rafai Medical Clinic",
  "description": "Dedicated single-doctor primary healthcare clinic offering general consultation, routine checkups, chronic disease management, and 24/7 AI voice & online booking.",
  "url": "https://al-rafai-clinic.vercel.app",
  "logo": "https://al-rafai-clinic.vercel.app/icon.png",
  "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80",
  "telephone": "+1-555-234-5678",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "5A/2, Sector 5A",
    "addressLocality": "North Karachi",
    "addressRegion": "Sindh",
    "postalCode": "75850",
    "addressCountry": "PK"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 24.9754,
    "longitude": 67.0653
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "12:00",
      "closes": "18:00"
    }
  ],
  "medicalSpecialty": "GeneralPractice",
  "physician": {
    "@type": "Physician",
    "name": "Dr. Fatima",
    "jobTitle": "General Physician & Consultant",
    "medicalSpecialty": "GeneralPractice",
    "alumniOf": "PMDC Registered",
    "description": "PMDC Registered General Physician offering unhurried, personalized 1-on-1 medical consultations."
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "350",
    "bestRating": "5",
    "worstRating": "1"
  },
  "availableService": [
    {
      "@type": "MedicalProcedure",
      "name": "General Health Consultation"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Routine Physical Checkups"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Chronic Condition Management"
    },
    {
      "@type": "MedicalProcedure",
      "name": "Preventive Care & Wellness"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preload" as="image" href="/doctor-fatima.jpg" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-[#1A1A2E]">
        {children}
      </body>
    </html>
  );
}
