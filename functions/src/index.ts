import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { InfisicalClient } from '@infisical/sdk';
import crypto from 'crypto';

admin.initializeApp();

// --- Types ---
interface WazeRawAlert {
    uuid: string;
    type: string;
    subtype?: string;
    street?: string;
    city?: string;
    country?: string;
    location: { x: number; y: number };
    reportRating?: number;
    reportDescription?: string;
    pubMillis: number;
}
interface LtaIncident {
    Type: string;
    Latitude: number;
    Longitude: number;
    Message: string;
}
interface WazeFeedResponse {
    alerts: WazeRawAlert[];
    jams?: any[];
}

// --- Secrets & Config ---
let API_KEY = "default_key";
// NEW: Updated Production Notification URL
let NOTIFY_URL = "https://api-xkkfhwymhq-uc.a.run.app/api/notify";
let ALERTS_URL = "https://api-xkkfhwymhq-uc.a.run.app/api/alerts";

let DATAMALL_API_KEY = "";
let secretsLoaded = false;

const FEED_SOURCES = [
    { id: 'west', name: 'West Area', url: "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/b9eb1444-6cef-4cbd-b681-2937ad70dc9c?format=1" },
    { id: 'thomson', name: 'Thomson Road', url: "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9?format=1" }
];

// Initialize Infisical
async function loadSecrets() {
    if (secretsLoaded) return;

    // Access secret value via process.env (String binding workaround)
    let secretVal: any = {};
    if (process.env.INFISICAL) {
        try {
            secretVal = JSON.parse(process.env.INFISICAL);
        } catch (e) {
            console.error("Failed to parse INFISICAL env var", e);
        }
    }

    const { client_id, client_secret, project_id, environment } = secretVal.infisical || {};

    if (client_id && client_secret && project_id) {
        try {
            console.log("Initializing Infisical SDK...");
            const client = new InfisicalClient({ clientId: client_id, clientSecret: client_secret });

            const env = environment || 'dev';

            const apiKeySecret = await client.getSecret({ secretName: "API_KEY", projectId: project_id, environment: env });
            if (apiKeySecret) API_KEY = apiKeySecret.secretValue;

            // const notifyUrlSecret = await client.getSecret({ secretName: "NOTIFY_URL", projectId: project_id, environment: env });
            // if (notifyUrlSecret) NOTIFY_URL = notifyUrlSecret.secretValue;

            const ltaKeySecret = await client.getSecret({ secretName: "DATAMALL_API_KEY", projectId: project_id, environment: env });
            if (ltaKeySecret) DATAMALL_API_KEY = ltaKeySecret.secretValue;

            secretsLoaded = true;
            console.log("Secrets loaded from Infisical.");
        } catch (e: any) {
            console.error("Infisical Load Error:", e.message);
        }
    } else {
        console.error("Infisical credentials missing in secret payload.");
    }
}

// --- Helpers ---
const mapLtaTypeToWaze = (ltaType: string) => {
    const t = ltaType.toLowerCase();
    if (t.includes('accident')) return { type: 'ACCIDENT', subtype: 'ACCIDENT_Major' };
    if (t.includes('roadwork')) return { type: 'CONSTRUCTION', subtype: 'CONSTRUCTION' };
    if (t.includes('breakdown')) return { type: 'HAZARD', subtype: 'HAZARD_ON_SHOULDER_CAR_STOPPED' };
    if (t.includes('weather')) return { type: 'WEATHERHAZARD', subtype: 'HAZARD_WEATHER' };
    if (t.includes('heavy traffic')) return { type: 'JAM', subtype: 'JAM_HEAVY_TRAFFIC' };
    return { type: 'HAZARD', subtype: 'HAZARD_ON_ROAD' };
};

const fetchLtaData = async (): Promise<WazeRawAlert[]> => {
    if (!DATAMALL_API_KEY) return [];
    try {
        const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
            headers: { 'AccountKey': DATAMALL_API_KEY }
        });
        const ltaItems: LtaIncident[] = response.data.value || [];
        return ltaItems.map(item => {
            const { type, subtype } = mapLtaTypeToWaze(item.Type);
            const uuid = crypto.createHash('md5').update(item.Message).digest('hex');
            return {
                uuid: `lta-${uuid}`,
                type,
                subtype,
                street: 'Singapore Road',
                city: 'Singapore',
                location: { x: item.Longitude, y: item.Latitude },
                pubMillis: Date.now(), // Live polling
                reportDescription: item.Message
            };
        });
    } catch (e: any) {
        console.error("LTA Fetch Error:", e.message);
        return [];
    }
};

const fetchWazeFeed = async (url: string): Promise<WazeRawAlert[]> => {
    try {
        const response = await axios.get<WazeFeedResponse>(url);
        const alerts = response.data.alerts || [];
        // Map jams to alerts if needed for notification?
        // Typically notifications are for Incidents/Alerts, not just flow (Jams). 
        // We'll stick to alerts for notifications to avoid spamming "Heavy Traffic".
        return alerts;
    } catch (e: any) {
        console.error(`Waze Fetch Error (${url}):`, e.message);
        return [];
    }
};

const sendNotification = async (alert: WazeRawAlert, sourceName: string, sourceId: string) => {
    const subtype = alert.subtype || alert.type;
    const street = alert.street || "Unknown Street";
    const city = alert.city || "Unknown City";
    // NOTE: Hardcoded frontend URL pattern. Can be moved to env.
    const detailsUrl = `https://aochinwen.github.io/WazeOpsApp/#/detail/${alert.uuid}?source=${sourceId}`;

    const message = `⚠️ <b>${subtype}</b>\n\nDetected on ${street}, ${city}.\nSource: ${sourceName}\n<a href="${detailsUrl}">View Details</a>`;

    let slug = 'road_incident';
    if (sourceId === 'thomson') slug = 'Thompson_Road';
    if (sourceId === 'west') slug = 'West_Region';
    if (sourceId === 'LTA_Traffic') slug = 'LTA_Traffic';

    try {
        await axios.post(NOTIFY_URL, {
            alertSlug: slug,
            message: message,
            parseMode: 'HTML'
        }, {
            headers: { 'x-api-key': API_KEY }
        });
        console.log(`Notification sent for ${alert.uuid}`);
    } catch (error: any) {
        console.error(`Notification failed for ${alert.uuid}:`, error.message);
    }
};

// --- API App ---
const app = express();
app.use(cors({ origin: true }));

// Middleware to load secrets
app.use(async (req, res, next) => {
    await loadSecrets();
    next();
});

app.get('/feed/lta', async (req, res) => {
    const alerts = await fetchLtaData();
    res.json({ alerts });
});

app.get('/cameras', async (req, res) => {
    if (!DATAMALL_API_KEY) {
        res.status(500).json({ error: "LTA Key missing" });
        return;
    }
    try {
        const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2', {
            headers: { 'AccountKey': DATAMALL_API_KEY }
        });
        res.json(response.data.value || []);
    } catch (e: any) {
        res.status(502).json({ error: e.message });
    }
});

app.post('/notify', async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        await axios.post(NOTIFY_URL, req.body, { headers: { 'x-api-key': API_KEY } });
        res.json({ success: true, forwardedTo: NOTIFY_URL });
    } catch (e: any) {
        res.status(502).json({ error: "Forward failed", details: e.message });
    }
});

// Proxy for verifying alerts list
app.get('/alerts', async (req, res) => {
    try {
        const response = await axios.get(ALERTS_URL, { headers: { 'x-api-key': API_KEY } });
        res.json(response.data);
    } catch (e: any) {
        res.status(502).json({ error: "Fetch alerts failed", details: e.message });
    }
});

// Bind express app to /api
exports.api = functions
    .runWith({ secrets: ["INFISICAL"] })
    .https.onRequest(app);

// Scheduled Monitor
// Stateless implementation: Uses time-based window to find "New" alerts
exports.monitor = functions
    .runWith({ secrets: ["INFISICAL"] })
    .pubsub.schedule('every 5 minutes')
    .onRun(async (context) => {
        await loadSecrets();
        console.log("Running scheduled monitor...");

        // Define "New" as published in the last 5.5 minutes
        // This covers the schedule interval + 30s buffer
        const TIME_WINDOW = 5.5 * 60 * 1000;
        const now = Date.now();

        // 1. Check Waze Feeds
        for (const source of FEED_SOURCES) {
            const alerts = await fetchWazeFeed(source.url);
            const newAlerts = alerts.filter(a => (now - a.pubMillis) < TIME_WINDOW);

            console.log(`[${source.name}] Found ${alerts.length} total, ${newAlerts.length} new.`);

            for (const alert of newAlerts) {
                await sendNotification(alert, source.name, source.id);
            }
        }

        // 2. Check LTA
        // 2. Check LTA
        const ltaAlerts = await fetchLtaData();

        // Deduplication: Use Firestore to track sent UUIDs
        const db = admin.firestore();
        const sentRef = db.collection('sent_lta_notifications');

        let sentCount = 0;

        for (const alert of ltaAlerts) {
            const docRef = sentRef.doc(alert.uuid);

            try {
                const doc = await docRef.get();
                if (doc.exists) {
                    // Already sent
                    continue;
                }

                // If not sent, send it now
                await sendNotification(alert, "Singapore LTA", "LTA_Traffic");

                // Mark as sent in Firestore with a timestamp
                await docRef.set({
                    sentAt: admin.firestore.FieldValue.serverTimestamp(),
                    message: alert.reportDescription || ""
                });

                sentCount++;

            } catch (e: any) {
                console.error(`Firestore Check Error for ${alert.uuid}:`, e.message);
            }
        }

        console.log(`[LTA] Processed ${ltaAlerts.length} alerts. Sent ${sentCount} new notifications.`);

        return null;
    });

// --- AI Summary ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
let GEMINI_API_KEY = "";

// Helper to update secrets with Gemini Key
async function loadAllSecrets() {
    await loadSecrets(); // Loads API_KEY, DATAMALL_API_KEY
    if (GEMINI_API_KEY) return;

    // Manual load for Gemini from Infisical if needed, or re-use existing logic
    // We can reuse the same client stored or just re-init
    let secretVal: any = {};
    if (process.env.INFISICAL) {
        try { secretVal = JSON.parse(process.env.INFISICAL); } catch (e) { }
    }
    const { client_id, client_secret, project_id, environment } = secretVal.infisical || {};
    if (client_id && client_secret && project_id) {
        try {
            const client = new InfisicalClient({ clientId: client_id, clientSecret: client_secret });
            const env = environment || 'dev';
            const geminiSecret = await client.getSecret({ secretName: "GEMINI_API", projectId: project_id, environment: env });
            if (geminiSecret) GEMINI_API_KEY = geminiSecret.secretValue;
            console.log("Gemini Key Loaded from Infisical");
        } catch (e) { console.error("Gemini Key Load Failed", e); }
    }
}

app.post('/summarize', async (req, res) => {
    // 1. Verify API Key from frontend (proxy protection)
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    // 2. Ensure Gemini Key is loaded
    await loadAllSecrets();
    if (!GEMINI_API_KEY) {
        res.status(500).json({ error: "Server missing Gemini configuration" });
        return;
    }

    const { incidents } = req.body;
    if (!incidents || !Array.isArray(incidents)) {
        res.status(400).json({ error: "Invalid incidents data" });
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        // Use gemini-1.5-flash which is widely available and fast
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Reconstruct context
        const incidentContext = incidents.map((i: any) => {
            return `- ${i.subtype || i.type} at ${i.street}, ${i.city} (Rel: ${i.reliability})`;
        }).join('\n');

        const prompt = `
        As a Traffic Operations Manager, analyze the active incidents and organize them by **Location**.

        **Instructions:**
        1. Group incidents logically by the specific road they are occurring on.
        2. Assess the criticality of the situation for each road to assign a status symbol.
        3. STRICTLY follow the output format below for each road. Do not write a general introduction or conclusion.

        **Criticality Legend:**
        🔴 (Red Circle) = Critical/High Impact (e.g., Accidents, Stoppages, Heavy Jams)
        🟡 (Yellow Circle) = Moderate/Warning (e.g., Construction, Hazards, Slow Traffic)
        🟢 (Green Circle) = Low Impact (e.g., Minor works)

        **Required Output Format:**
        **[Road Name]** [Symbol]
        [Actionable description of the situation (2-3 sentences max)]

        ---
        Example:
        **Ghim Moh Road** 🔴 
        A car stoppage is currently blocking traffic flow. Towing services should be dispatched immediately to clear the obstruction.
        
        Context Data:
        ${incidentContext}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });

    } catch (e: any) {
        console.error("AI Gen Error:", e);
        res.status(502).json({ error: "AI Generation failed", details: e.message });
    }
});
