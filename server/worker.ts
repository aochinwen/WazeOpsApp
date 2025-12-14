
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { InfisicalSDK } from '@infisical/sdk';

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

let API_KEY = process.env.API_KEY;
let NOTIFY_URL = process.env.NOTIFY_URL || "http://localhost:3002/api/notify";

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

    // 1. Standard Waze Feeds
    for (const source of FEED_SOURCES) {
      try {
        const incidents = await this.fetchFeed(source.url);
        await this.processFeedAlerts(incidents, source);
        allAlerts = [...allAlerts, ...incidents];
      } catch (e: any) {
        console.error(`[WazeMonitor] Failed to fetch ${source.name}: ${e.message}`);
      }
    }

    // 2. LTA DataMall Feed
    if (process.env.DATAMALL_API_KEY) {
      try {
        const ltaAlerts = await fetchLtaData();
        const ltaSource = { id: 'lta', name: 'Singapore LTA' };
        await this.processFeedAlerts(ltaAlerts, ltaSource);
        allAlerts = [...allAlerts, ...ltaAlerts];
      } catch (e: any) {
        console.error(`[WazeMonitor] Failed to fetch LTA: ${e.message}`);
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

// Start Server Logic
async function startServer() {
  if (process.env.INFISICAL_CLIENT_ID && process.env.INFISICAL_CLIENT_SECRET) {
    console.log("Infisical credentials found. Initializing SDK...");
    try {
      const client = new InfisicalSDK();
      await client.auth().universalAuth.login({
        clientId: process.env.INFISICAL_CLIENT_ID,
        clientSecret: process.env.INFISICAL_CLIENT_SECRET
      });
      console.log("Infisical authenticated.");

      const projectId = process.env.INFISICAL_PROJECT_ID;
      if (projectId) {
        const env = process.env.INFISICAL_ENVIRONMENT || 'dev';
        try {
          const apiKeySecret = await client.secrets().getSecret({ secretName: "API_KEY", projectId, environment: env });
          if (apiKeySecret) API_KEY = apiKeySecret.secretValue;

          const notifyUrlSecret = await client.secrets().getSecret({ secretName: "NOTIFY_URL", projectId, environment: env });
          if (notifyUrlSecret) NOTIFY_URL = notifyUrlSecret.secretValue;

          const ltaKeySecret = await client.secrets().getSecret({ secretName: "DATAMALL_API_KEY", projectId, environment: env });
          if (ltaKeySecret) process.env.DATAMALL_API_KEY = ltaKeySecret.secretValue;

          console.log("Secrets loaded from Infisical.");
        } catch (err: any) {
          console.error("Failed to fetch secrets from Infisical:", err.message);
        }
      } else {
        console.warn("INFISICAL_PROJECT_ID not set. Skipping secret fetch.");
      }

    } catch (err: any) {
      console.error("Failed to authenticate with Infisical:", err.message);
    }
  } else {
    console.log("Infisical credentials not found. Using local env.");
  }

  // Verify critical config
  if (!API_KEY) {
    console.error("CRITICAL: API_KEY is missing!");
    // process.exit(1); // Optional: Fail fast? For now, let it run but it won't auth.
  }

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Forwarding notifications to ${NOTIFY_URL}`);
  });

  // Start Monitor
  const monitor = new WazeMonitor(NOTIFY_URL);
  monitor.start();
}

startServer();

// --- LTA Service Integration ---
import crypto from 'crypto';

interface LtaIncident {
  Type: string;
  Latitude: number;
  Longitude: number;
  Message: string;
}

const mapLtaTypeToWaze = (ltaType: string): { type: string, subtype: string } => {
  const t = ltaType.toLowerCase();
  if (t.includes('accident')) return { type: 'ACCIDENT', subtype: 'ACCIDENT_Major' }; // Default to major to be safe
  if (t.includes('roadwork')) return { type: 'CONSTRUCTION', subtype: 'CONSTRUCTION' };
  if (t.includes('breakdown')) return { type: 'HAZARD', subtype: 'HAZARD_ON_SHOULDER_CAR_STOPPED' };
  if (t.includes('weather')) return { type: 'WEATHERHAZARD', subtype: 'HAZARD_WEATHER' };
  if (t.includes('heavy traffic')) return { type: 'JAM', subtype: 'JAM_HEAVY_TRAFFIC' };
  if (t.includes('obstacle') || t.includes('road block')) return { type: 'HAZARD', subtype: 'HAZARD_ON_ROAD' };
  return { type: 'HAZARD', subtype: 'HAZARD_ON_ROAD' };
};

const fetchLtaData = async (): Promise<WazeRawAlert[]> => {
  const ltaKey = process.env.DATAMALL_API_KEY;
  if (!ltaKey) {
    console.warn("DATAMALL_API_KEY missing. Skipping LTA fetch.");
    return [];
  }

  try {
    const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
      headers: { 'AccountKey': ltaKey }
    });

    const ltaItems: LtaIncident[] = response.data.value || [];

    return ltaItems.map(item => {
      const { type, subtype } = mapLtaTypeToWaze(item.Type);
      // Generate ID based on message content to keep it stable across polls if message is identical
      const uuid = crypto.createHash('md5').update(item.Message).digest('hex');

      return {
        uuid: `lta-${uuid}`,
        type,
        subtype,
        street: 'Singapore Road', // LTA data puts street in message. Parsing is complex.
        city: 'Singapore',
        location: { x: item.Longitude, y: item.Latitude },
        pubMillis: Date.now(), // Real-time feed
        reportDescription: item.Message
      };
    });
  } catch (error: any) {
    console.error("Error fetching LTA data:", error.message);
    return [];
  }
};

// GET /api/feed/lta
app.get('/api/feed/lta', async (req, res) => {
  try {
    const alerts = await fetchLtaData();
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch LTA data" });
  }
});

// GET /api/cameras
app.get('/api/cameras', async (req, res) => {
  const ltaKey = process.env.DATAMALL_API_KEY;
  if (!ltaKey) {
    return res.status(500).json({ error: "DATAMALL_API_KEY not configured" });
  }

  try {
    const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2', {
      headers: { 'AccountKey': ltaKey }
    });
    const cameras = response.data.value || [];
    res.json(cameras);
  } catch (error: any) {
    console.error("Error fetching cameras:", error.message);
    res.status(502).json({ error: "Failed to fetch camera data" });
  }
});
