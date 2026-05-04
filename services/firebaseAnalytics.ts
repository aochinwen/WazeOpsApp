import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBkjLZqLF8jG6exSV5tqJ5H6DsnCZcRjyI",
  authDomain: "wazeops.firebaseapp.com",
  projectId: "wazeops",
  storageBucket: "wazeops.firebasestorage.app",
  messagingSenderId: "881721965630",
  appId: "1:881721965630:web:783c76b10ef71d4a07e56f",
  measurementId: "G-XFSR6YPS27",
};

const BACKEND_URL =
  (typeof process !== 'undefined' && process.env?.BACKEND_URL) ||
  "https://us-central1-wazeops.cloudfunctions.net/api";

const firebaseApp = initializeApp(firebaseConfig);

// --- Client-side Firebase Analytics (best-effort, blocked by ad blockers) ---
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
let pendingEvents: Array<{ pagePath: string; pageTitle: string }> = [];

isSupported().then((supported) => {
  if (supported) {
    analyticsInstance = getAnalytics(firebaseApp);
    console.log('[Firebase] Analytics initialized');
    for (const event of pendingEvents) {
      logEvent(analyticsInstance, 'page_view', {
        page_path: event.pagePath,
        page_title: event.pageTitle,
      });
    }
    pendingEvents = [];
  }
});

// --- Persistent client ID for Measurement Protocol ---
function getClientId(): string {
  const KEY = 'wa_cid';
  let cid = localStorage.getItem(KEY);
  if (!cid) {
    cid = crypto.randomUUID?.() || `${Date.now()}.${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, cid);
  }
  return cid;
}

// --- Server-side proxy (ad-blocker proof) ---
function sendViaProxy(pagePath: string, pageTitle: string) {
  const payload = {
    client_id: getClientId(),
    events: [{ name: 'page_view', params: { page_path: pagePath, page_title: pageTitle } }],
  };
  // Use sendBeacon for reliability (fires even on page unload), fall back to fetch
  const url = `${BACKEND_URL}/collect`;
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  if (navigator.sendBeacon?.(url, blob)) {
    console.log('[Analytics] Sent via beacon:', pagePath);
  } else {
    fetch(url, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' }, keepalive: true })
      .then(() => console.log('[Analytics] Sent via fetch:', pagePath))
      .catch((e) => console.warn('[Analytics] Proxy send failed:', e));
  }
}

/**
 * Log a page_view event.
 * Always sends through the server proxy (ad-blocker proof).
 * Also attempts client-side Firebase Analytics (richer automatic data when not blocked).
 */
export function logPageView(pagePath: string, pageTitle?: string) {
  const title = pageTitle || document.title;

  // 1. Always send through our own backend (reliable)
  sendViaProxy(pagePath, title);

  // 2. Best-effort client-side (may be blocked)
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'page_view', { page_path: pagePath, page_title: title });
  } else {
    pendingEvents.push({ pagePath, pageTitle: title });
  }
}

export { analyticsInstance };
