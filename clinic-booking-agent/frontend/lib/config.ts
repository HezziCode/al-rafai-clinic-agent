/**
 * Centralized configuration helper for CarePulse AI Frontend.
 * Ensures consistent environment variable resolution with sensible defaults.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Auto-derive WebSocket URL from API_URL if NEXT_PUBLIC_WS_URL is not explicitly set
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 
  API_URL.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

export const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
export const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

export const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'carepulse-secret-admin-key-2026';
