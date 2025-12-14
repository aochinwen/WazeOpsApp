"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const sdk_1 = require("@infisical/sdk");
const crypto_1 = __importDefault(require("crypto"));
admin.initializeApp();
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
    if (secretsLoaded)
        return;
    // Access secret value via process.env (String binding workaround)
    let secretVal = {};
    if (process.env.INFISICAL) {
        try {
            secretVal = JSON.parse(process.env.INFISICAL);
        }
        catch (e) {
            console.error("Failed to parse INFISICAL env var", e);
        }
    }
    const { client_id, client_secret, project_id, environment } = secretVal.infisical || {};
    if (client_id && client_secret && project_id) {
        try {
            console.log("Initializing Infisical SDK...");
            const client = new sdk_1.InfisicalClient({ clientId: client_id, clientSecret: client_secret });
            const env = environment || 'dev';
            const apiKeySecret = await client.getSecret({ secretName: "API_KEY", projectId: project_id, environment: env });
            if (apiKeySecret)
                API_KEY = apiKeySecret.secretValue;
            // const notifyUrlSecret = await client.getSecret({ secretName: "NOTIFY_URL", projectId: project_id, environment: env });
            // if (notifyUrlSecret) NOTIFY_URL = notifyUrlSecret.secretValue;
            const ltaKeySecret = await client.getSecret({ secretName: "DATAMALL_API_KEY", projectId: project_id, environment: env });
            if (ltaKeySecret)
                DATAMALL_API_KEY = ltaKeySecret.secretValue;
            secretsLoaded = true;
            console.log("Secrets loaded from Infisical.");
        }
        catch (e) {
            console.error("Infisical Load Error:", e.message);
        }
    }
    else {
        console.error("Infisical credentials missing in secret payload.");
    }
}
// --- Helpers ---
const mapLtaTypeToWaze = (ltaType) => {
    const t = ltaType.toLowerCase();
    if (t.includes('accident'))
        return { type: 'ACCIDENT', subtype: 'ACCIDENT_Major' };
    if (t.includes('roadwork'))
        return { type: 'CONSTRUCTION', subtype: 'CONSTRUCTION' };
    if (t.includes('breakdown'))
        return { type: 'HAZARD', subtype: 'HAZARD_ON_SHOULDER_CAR_STOPPED' };
    if (t.includes('weather'))
        return { type: 'WEATHERHAZARD', subtype: 'HAZARD_WEATHER' };
    if (t.includes('heavy traffic'))
        return { type: 'JAM', subtype: 'JAM_HEAVY_TRAFFIC' };
    return { type: 'HAZARD', subtype: 'HAZARD_ON_ROAD' };
};
const fetchLtaData = async () => {
    if (!DATAMALL_API_KEY)
        return [];
    try {
        const response = await axios_1.default.get('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
            headers: { 'AccountKey': DATAMALL_API_KEY }
        });
        const ltaItems = response.data.value || [];
        return ltaItems.map(item => {
            const { type, subtype } = mapLtaTypeToWaze(item.Type);
            const uuid = crypto_1.default.createHash('md5').update(item.Message).digest('hex');
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
    }
    catch (e) {
        console.error("LTA Fetch Error:", e.message);
        return [];
    }
};
const fetchWazeFeed = async (url) => {
    try {
        const response = await axios_1.default.get(url);
        const alerts = response.data.alerts || [];
        // Map jams to alerts if needed for notification?
        // Typically notifications are for Incidents/Alerts, not just flow (Jams). 
        // We'll stick to alerts for notifications to avoid spamming "Heavy Traffic".
        return alerts;
    }
    catch (e) {
        console.error(`Waze Fetch Error (${url}):`, e.message);
        return [];
    }
};
const sendNotification = async (alert, sourceName, sourceId) => {
    const subtype = alert.subtype || alert.type;
    const street = alert.street || "Unknown Street";
    const city = alert.city || "Unknown City";
    // NOTE: Hardcoded frontend URL pattern. Can be moved to env.
    const detailsUrl = `https://aochinwen.github.io/WazeOpsApp/#/detail/${alert.uuid}?source=${sourceId}`;
    const message = `⚠️ <b>${subtype}</b>\n\nDetected on ${street}, ${city}.\nSource: ${sourceName}\n<a href="${detailsUrl}">View Details</a>`;
    let slug = 'road_incident';
    if (sourceId === 'thomson')
        slug = 'Thompson_Road';
    if (sourceId === 'west')
        slug = 'West_Region';
    if (sourceId === 'LTA_Traffic')
        slug = 'LTA_Traffic';
    try {
        await axios_1.default.post(NOTIFY_URL, {
            alertSlug: slug,
            message: message,
            parseMode: 'HTML'
        }, {
            headers: { 'x-api-key': API_KEY }
        });
        console.log(`Notification sent for ${alert.uuid}`);
    }
    catch (error) {
        console.error(`Notification failed for ${alert.uuid}:`, error.message);
    }
};
// --- API App ---
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
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
        const response = await axios_1.default.get('https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2', {
            headers: { 'AccountKey': DATAMALL_API_KEY }
        });
        res.json(response.data.value || []);
    }
    catch (e) {
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
        await axios_1.default.post(NOTIFY_URL, req.body, { headers: { 'x-api-key': API_KEY } });
        res.json({ success: true, forwardedTo: NOTIFY_URL });
    }
    catch (e) {
        res.status(502).json({ error: "Forward failed", details: e.message });
    }
});
// Proxy for verifying alerts list
app.get('/alerts', async (req, res) => {
    try {
        const response = await axios_1.default.get(ALERTS_URL, { headers: { 'x-api-key': API_KEY } });
        res.json(response.data);
    }
    catch (e) {
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
    const ltaAlerts = await fetchLtaData();
    // Since LTA doesn't give us a 'pubMillis' that persists, we rely on the fact that 
    // fetchLtaData returns the current snapshot.
    // To avoid spam, we would ideally need a cache of recently sent UUIDs.
    // For now, we will just log or assume the user accepts some duplication or add a robust dedupe later.
    // However, to fulfill the request, we enable sending:
    // Limit to 5 per run to avoid massive bursts
    console.log(`[LTA] Found ${ltaAlerts.length} alerts.`);
    for (const alert of ltaAlerts.slice(0, 5)) {
        await sendNotification(alert, "Singapore LTA", "LTA_Traffic");
    }
    return null;
});
//# sourceMappingURL=index.js.map