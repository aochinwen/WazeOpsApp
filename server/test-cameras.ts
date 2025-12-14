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

// Test Logic
async function testCameras() {
    console.log("\n--- Testing LTA Traffic Cameras API (Direct) ---");
    try {
        if (!LTA_KEY) {
            console.log("Skipping direct fetch due to missing key.");
        } else {
            const response = await axios.get('https://datamall2.mytransport.sg/ltaodataservice/Traffic-Imagesv2', {
                headers: { 'AccountKey': LTA_KEY }
            });
            console.log(`LTA Raw Response Status: ${response.status}`);
            const cameras = response.data.value || [];
            console.log(`Cameras found: ${cameras.length}`);
            if (cameras.length > 0) {
                console.log("Sample Camera:", JSON.stringify(cameras[0], null, 2));
            }
        }
    } catch (e: any) {
        console.error("❌ Direct LTA Fetch Failed:", e.message);
    }

    console.log("\n--- Testing Server Proxy Endpoint (/api/cameras) ---");
    // Note: Server must be running for this to work.
    const LOCAL_URL = 'http://localhost:3001/api/cameras';
    try {
        const res = await axios.get(LOCAL_URL);
        console.log(`Proxy Response Status: ${res.status}`);
        const cameras = res.data;
        if (Array.isArray(cameras)) {
            console.log(`Proxy Cameras: ${cameras.length}`);
        } else {
            console.log("Response format unexpected:", Object.keys(res.data));
        }
    } catch (e: any) {
        console.error(`❌ Proxy Fetch Failed (is server running?): ${e.message}`);
    }
}

testCameras();
