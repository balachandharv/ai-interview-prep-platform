const isProd = import.meta.env.PROD;

// Read from env
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
const rawWsUrl = import.meta.env.VITE_WS_URL;
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Validation for production
if (isProd && !rawApiUrl && !isDemoMode) {
  throw new Error("Configuration Error: Missing critical environment variable VITE_API_URL or VITE_API_BASE_URL.");
}

// Fallbacks for development
export const API_BASE_URL = rawApiUrl || 'http://localhost:8080/api';

// Derive WebSocket URL if not explicitly provided
let derivedWsUrl = rawWsUrl;
if (!derivedWsUrl) {
  if (isProd && !isDemoMode) {
     throw new Error("Configuration Error: Missing critical environment variable VITE_WS_URL.");
  }
  // Base off API_BASE_URL for dev
  try {
    const url = new URL(API_BASE_URL);
    // STOMP over SockJS typically uses http/https but standard websockets use ws/wss
    // Based on previous code, the fallback was http://localhost:8080/ws
    const protocol = url.protocol; 
    derivedWsUrl = `${protocol}//${url.host}/ws`;
  } catch (e) {
    derivedWsUrl = 'http://localhost:8080/ws';
  }
}

export const WS_URL = derivedWsUrl;
export const DEMO_MODE = isProd ? false : isDemoMode; // Never allow demo mode in prod
