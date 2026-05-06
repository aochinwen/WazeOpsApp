/**
 * cctvHealthService.ts
 *
 * Subscribes to the Firestore `cctv_health` collection and delivers a
 * real-time map of cameraId → CctvHealthRecord to the caller.
 *
 * The collection is populated by the Firebase Scheduled Function
 * `cctvHealthCheck` which runs every 15 minutes and pings each camera
 * via the Cloud Run snapshot endpoint.
 */
import { getFirestore, collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { CctvHealthRecord } from '../types';

// Reuse existing Firebase app if already initialised by firebaseAnalytics.ts
const firebaseConfig = {
  apiKey: 'AIzaSyBkjLZqLF8jG6exSV5tqJ5H6DsnCZcRjyI',
  authDomain: 'wazeops.firebaseapp.com',
  projectId: 'wazeops',
  storageBucket: 'wazeops.firebasestorage.app',
  messagingSenderId: '881721965630',
  appId: '1:881721965630:web:783c76b10ef71d4a07e56f',
  measurementId: 'G-XFSR6YPS27',
};

const firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

/**
 * Subscribe to all CCTV health records in real-time.
 *
 * @param onUpdate  Called immediately and on every Firestore change.
 *                  Receives a map of { [cameraId]: CctvHealthRecord }.
 * @returns         An unsubscribe function — call it when cameras are toggled off.
 */
export function subscribeToCctvHealth(
  onUpdate: (health: Record<string, CctvHealthRecord>) => void
): () => void {
  const colRef = collection(db, 'cctv_health');

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const health: Record<string, CctvHealthRecord> = {};

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Convert Firestore Timestamp → JS Date
        let lastChecked: Date | null = null;
        if (data.lastChecked instanceof Timestamp) {
          lastChecked = data.lastChecked.toDate();
        }

        health[doc.id] = {
          cameraId: doc.id,
          name: data.name ?? '',
          area: data.area ?? '',
          status: data.status ?? 'unknown',
          lastChecked,
          responseTimeMs: data.responseTimeMs ?? null,
          errorMessage: data.errorMessage,
        };
      });

      onUpdate(health);
    },
    (error) => {
      console.error('[CctvHealth] Firestore subscription error:', error);
      // On permission error, deliver an empty map — UI will show "unknown"
      onUpdate({});
    }
  );

  return unsubscribe;
}
