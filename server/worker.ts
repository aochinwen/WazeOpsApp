
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment Setup
dotenv.config({ path: path.resolve(fileURLToPath(import.meta.url), '../../.env.local') });

const app = express();
const PORT = 3001; // Backend runs on 3001
// Use FRONTEND_URL from env, or default to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
// Define Feed Sources
const FEED_SOURCES = [
  { id: 'west', name: 'West Area', url: "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/b9eb1444-6cef-4cbd-b681-2937ad70dc9c?format=1" },
  { id: 'thomson', name: 'Thomson Road', url: "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9?format=1" }
];
const API_KEY = process.env.API_KEY;
const NOTIFY_URL = process.env.NOTIFY_URL || "http://localhost:3002/api/notify";

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://aochinwen.github.io",
    "https://aochinwen.github.io/WazeOpsApp"
  ],
  credentials: true
}));
app.use(bodyParser.json());

// --- API Endpoints ---

// POST /api/notify
app.post('/api/notify', async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid API Key' });
  }

  const { alertSlug, message, parseMode } = req.body;

  if (!alertSlug || !message) {
    return res.status(400).json({ error: 'Bad Request', message: 'Missing alertSlug or message' });
  }

  console.log(`\n[NOTIFICATION RECEIVED]`);
  console.log(`Topic: ${alertSlug}`);
  console.log(`Forwarding to: ${NOTIFY_URL}`);

  // LOG THE PAYLOAD AS REQUESTED
  const payload = req.body;
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    await axios.post(NOTIFY_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });
    console.log("Forwarding successful.");
    return res.status(200).json({ success: true, message: 'Notification forwarded successfully' });
  } catch (error: any) {
    console.error("Forwarding failed:", error.message);
    return res.status(502).json({ error: 'Bad Gateway', message: 'Failed to forward notification to downstream service' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Forwarding notifications to ${NOTIFY_URL}`);
});


// --- Waze Worker Logic ---
// We keep this in the same process for simplicity
interface WazeRawAlert {
  uuid: string;
  type: string;
  subtype?: string;
  street?: string;
  city?: string;
  location: { x: number; y: number };
  pubMillis: number;
  reportDescription?: string;
}

interface WazeFeedResponse {
  alerts: WazeRawAlert[];
}

class WazeMonitor {
  private seenIncidents: Set<string> = new Set();
  private isFirstRun: boolean = true;
  private notifyUrl: string;

  constructor(notifyUrl: string) {
    this.notifyUrl = notifyUrl;
    console.log(`WazeMonitor initialized. Target: ${this.notifyUrl}`);
    console.log(`Monitoring ${FEED_SOURCES.length} feed sources.`);
  }

  public start() {
    // Schedule task to run every 5 minutes
    cron.schedule('*/2 * * * *', () => {
      this.checkAllFeeds();
    });
    // Run immediately
    this.checkAllFeeds();
  }

  private async checkAllFeeds() {
    console.log(`[WazeMonitor] Checking all feeds...`);
    let allAlerts: WazeRawAlert[] = [];

    for (const source of FEED_SOURCES) {
      try {
        const incidents = await this.fetchFeed(source.url);
        await this.processFeedAlerts(incidents, source);
        allAlerts = [...allAlerts, ...incidents];
      } catch (e: any) {
        console.error(`[WazeMonitor] Failed to fetch ${source.name}: ${e.message}`);
      }
    }

    // Global deduplication cleanup
    if (!this.isFirstRun) {
      this.cleanupOldIncidents(allAlerts);
    }
    this.isFirstRun = false;
  }

  private async fetchFeed(url: string): Promise<WazeRawAlert[]> {
    const response = await axios.get<WazeFeedResponse>(url);
    return response.data.alerts || [];
  }

  private async processFeedAlerts(alerts: WazeRawAlert[], source: { id: string, name: string }) {
    if (this.isFirstRun) {
      alerts.forEach(alert => this.seenIncidents.add(alert.uuid));
      console.log(`[WazeMonitor] [${source.name}] First run. Cached ${alerts.length} existing incidents.`);
      return;
    }

    const newAlerts = alerts.filter(alert => !this.seenIncidents.has(alert.uuid));

    if (newAlerts.length > 0) {
      console.log(`[WazeMonitor] [${source.name}] Found ${newAlerts.length} new incidents.`);
      for (const alert of newAlerts) {
        this.seenIncidents.add(alert.uuid);
        await this.sendNotification(alert, source);
      }
    } else {
      console.log(`[WazeMonitor] [${source.name}] No new incidents.`);
    }
  }

  private cleanupOldIncidents(currentAlerts: WazeRawAlert[]) {
    const currentIds = new Set(currentAlerts.map(a => a.uuid));
    for (const id of this.seenIncidents) {
      if (!currentIds.has(id)) {
        this.seenIncidents.delete(id);
      }
    }
  }

  private async sendNotification(alert: WazeRawAlert, source: { id: string, name: string }) {
    const subtype = alert.subtype || alert.type;
    const street = alert.street || "Unknown Street";
    const city = alert.city || "Unknown City";
    // NOTE: Link includes hash routing and source parameter
    const detailsUrl = `${FRONTEND_URL}/#/detail/${alert.uuid}?source=${source.id}`;

    const message = `⚠️ <b>${subtype}</b>\n\nDetected on ${street}, ${city}.\nSource: ${source.name}\n<a href="${detailsUrl}">View Details</a>`;

    // Determine slug based on source ID
    let slug = 'road_incident';
    if (source.id === 'thomson') slug = 'Thompson_Road';
    if (source.id === 'west') slug = 'West_Region';

    try {
      // The worker calls the API on the LOCAL server port directly
      await axios.post(this.notifyUrl, {
        alertSlug: slug,
        message: message,
        parseMode: 'HTML'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        }
      });
      console.log(`[WazeMonitor] Notification TRIGGERED for ${alert.uuid}`);
    } catch (error: any) {
      console.error(`[WazeMonitor] Notification FAILED for ${alert.uuid}: ${error.message}`);
    }
  }
}

// Start Monitor
const monitor = new WazeMonitor(NOTIFY_URL);
monitor.start();
