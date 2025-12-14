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

// --- Secrets Management ---
let API_KEY = "default_key";
let NOTIFY_URL = "http://localhost:3002/api/notify";
let DATAMALL_API_KEY = "";
let secretsLoaded = false;

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

            const notifyUrlSecret = await client.getSecret({ secretName: "NOTIFY_URL", projectId: project_id, environment: env });
            if (notifyUrlSecret) NOTIFY_URL = notifyUrlSecret.secretValue;

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
                pubMillis: Date.now(),
                reportDescription: item.Message
            };
        });
    } catch (e: any) {
        console.error("LTA Fetch Error:", e.message);
        return [];
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

// Bind secret to functions
exports.api = functions
    .runWith({ secrets: ["INFISICAL"] })
    .https.onRequest(app);

exports.monitor = functions
    .runWith({ secrets: ["INFISICAL"] })
    .pubsub.schedule('every 5 minutes')
    .onRun(async (context) => {
        await loadSecrets();
        console.log("Running scheduled monitor...");

        // Simulating monitor logic
        const ltaAlerts = await fetchLtaData();
        console.log(`Monitor: Fetched ${ltaAlerts.length} LTA alerts`);
        return null;
    });
