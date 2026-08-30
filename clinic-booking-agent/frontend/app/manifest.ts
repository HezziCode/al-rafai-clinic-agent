import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AL-RAFAI CLINIC | Dr. Fatima',
    short_name: 'Al-Rafai Clinic',
    description: 'Book 1-on-1 medical consultations with Dr. Fatima at AL-RAFAI CLINIC North Karachi. AI-powered 24/7 appointment booking.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2B6CB0',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
