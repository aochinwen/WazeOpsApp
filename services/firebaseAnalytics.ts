import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

// TODO: Replace with your Firebase project's web app config.
// Find it at: Firebase Console → Project Settings → General → Your apps → Web app
const firebaseConfig = {
  apiKey: "AIzaSyBkjLZqLF8jG6exSV5tqJ5H6DsnCZcRjyI",
  authDomain: "wazeops.firebaseapp.com",
  projectId: "wazeops",
  storageBucket: "wazeops.firebasestorage.app",
  messagingSenderId: "881721965630",
  appId: "1:881721965630:web:783c76b10ef71d4a07e56f",
  measurementId: "G-XFSR6YPS27",
};

const app = initializeApp(firebaseConfig);

// Analytics is only supported in browser environments (not SSR / Node)
let analyticsInstance: ReturnType<typeof getAnalytics> | null = null;
let pendingEvents: Array<{ pagePath: string; pageTitle: string }> = [];

isSupported().then((supported) => {
  if (supported) {
    analyticsInstance = getAnalytics(app);
    console.log('[Firebase] Analytics initialized');
    // Flush any events that were queued before init completed
    for (const event of pendingEvents) {
      logEvent(analyticsInstance, 'page_view', {
        page_path: event.pagePath,
        page_title: event.pageTitle,
      });
      console.log('[Firebase] Flushed queued page_view:', event.pagePath);
    }
    pendingEvents = [];
  } else {
    console.warn('[Firebase] Analytics not supported in this environment');
  }
});

/**
 * Log a page_view event manually.
 * Required because HashRouter route changes don't trigger automatic page_view events.
 */
export function logPageView(pagePath: string, pageTitle?: string) {
  const title = pageTitle || document.title;
  if (!analyticsInstance) {
    // Queue the event — analytics SDK is still initializing
    pendingEvents.push({ pagePath, pageTitle: title });
    console.log('[Firebase] Queued page_view (SDK loading):', pagePath);
    return;
  }
  logEvent(analyticsInstance, 'page_view', {
    page_path: pagePath,
    page_title: title,
  });
  console.log('[Firebase] Logged page_view:', pagePath);
}

export { analyticsInstance };
