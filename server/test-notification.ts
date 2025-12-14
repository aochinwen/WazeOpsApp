import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve .env.local from project root (one level up from server/)
const envPath = path.resolve(__dirname, '../.env.local');

// Load Environment Variables
if (fs.existsSync(envPath)) {
    console.log(`Loading configuration from: ${envPath}`);
    dotenv.config({ path: envPath });
} else {
    console.warn(`Warning: .env.local not found at ${envPath}`);
}

const API_KEY = process.env.API_KEY;
// Default to Worker URL (3001) but allow override or fallback
const TARGET_URL = process.env.TEST_TARGET_URL || 'http://localhost:3002/api/notify';

// --- Verification ---
if (!API_KEY) {
    console.error("Error: API_KEY is missing from environment variables.");
    console.error("Please ensure .env.local exists and contains API_KEY.");
    process.exit(1);
}

// --- Test Logic ---
async function sendTestNotification() {
    console.log(`\n--- Sending Test Notification ---`);
    console.log(`Target: ${TARGET_URL}`);
    console.log(`API Key: ${API_KEY.slice(0, 4)}...${API_KEY.slice(-4)}`);

    try {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const payload = {
            alertSlug: 'manual-test-alert-link',
            message: `Test notification with link: <a href="${frontendUrl}">View Details</a>`,
            parseMode: 'HTML'
        };

        const response = await axios.post(TARGET_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            }
        });

        console.log(`\n✅ Success!`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Response:`, response.data);

    } catch (error: any) {
        console.log(`\n❌ Failed.`);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(`Status: ${error.response.status} ${error.response.statusText}`);
            console.error(`Response:`, error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error(`No response received. Is the server running at ${TARGET_URL}?`);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error(`Error: ${error.message}`);
        }
    }
    console.log(`---------------------------------\n`);
}

// Run
sendTestNotification();
