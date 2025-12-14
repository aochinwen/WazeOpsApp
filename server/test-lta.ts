import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Load Environment Variables
if (fs.existsSync(envPath)) {
    console.log(`Loading configuration from: ${envPath}`);
    dotenv.config({ path: envPath });
}

// API Key Check
const LTA_KEY = process.env.DATAMALL_API_KEY;
if (!LTA_KEY) {
    console.error("❌ DATAMALL_API_KEY is missing in .env.local");
    // process.exit(1);
} else {
    console.log(`✅ LTA Key found: ${LTA_KEY.substring(0, 4)}...`);
}

// Test Logic
async function testLtaFeed() {
    console.log("\n--- Testing LTA DataMall API (Direct) ---");
    try {
        if (!LTA_KEY) {
            console.log("Skipping direct fetch due to missing key.");
        } else {
            const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents', {
                headers: { 'AccountKey': LTA_KEY }
            });
            console.log(`LTA Raw Response Status: ${response.status}`);
            console.log(`Items found: ${response.data.value ? response.data.value.length : 0}`);
            if (response.data.value && response.data.value.length > 0) {
                console.log("Sample Item:", JSON.stringify(response.data.value[0], null, 2));
            }
        }
    } catch (e: any) {
        console.error("❌ Direct LTA Fetch Failed:", e.message);
    }

    console.log("\n--- Testing Server Proxy Endpoint (/api/feed/lta) ---");
    // Note: Server must be running for this to work. We assume port 3001 based on worker.ts
    const LOCAL_URL = 'http://localhost:3001/api/feed/lta';
    try {
        const res = await axios.get(LOCAL_URL);
        console.log(`Proxy Response Status: ${res.status}`);
        if (res.data.alerts) {
            console.log(`Transformed Alerts: ${res.data.alerts.length}`);
            if (res.data.alerts.length > 0) {
                console.log("Sample Transformed Alert:", JSON.stringify(res.data.alerts[0], null, 2));
            }
        } else {
            console.log("Response format unexpected:", Object.keys(res.data));
        }
    } catch (e: any) {
        console.error(`❌ Proxy Fetch Failed (is server running?): ${e.message}`);
    }
}

testLtaFeed();
