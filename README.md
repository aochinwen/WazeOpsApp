<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1g_bJqNSZxO_ZuhDAxtITP1NvR3aLjyF9

### Environment Setup

1.  Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
2.  Open `.env.local` and configure the following variables:

    **Required:**
    *   `GEMINI_API_KEY`: Your Google Gemini API key (get one [here](https://aistudio.google.com/)).
    *   `API_KEY`: A shared secret key for securing the notification endpoint.
    *   `VITE_BACKEND_URL`: URL of the deployed Firebase Cloud Functions (e.g., `https://us-central1-wazeops.cloudfunctions.net/api`).

    **Secret Management (Infisical):**
    We use [Infisical](https://infisical.com/) to manage sensitive keys like `DATAMALL_API_KEY` for the backend.
    *   Ideally, install the Infisical CLI and authenticate.
    *   Alternatively, set `INFISICAL_CLIENT_ID` and `INFISICAL_CLIENT_SECRET` in `.env.local` or Firebase config.

### Frontend Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the app locally:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

### Backend (Firebase Cloud Functions)

The backend has been migrated to **Firebase Cloud Functions**. It handles Waze feed polling, LTA data fetching, and notifications.

1.  **Deployment**:
    ```bash
    firebase deploy --only functions
    ```
2.  **Configuration**:
    Secrets are managed via Infisical and Firebase Secret Manager.
    To update secrets:
    ```bash
    firebase functions:secrets:set INFISICAL
    ```

### CCTV Cameras (go2rtc)

N105 CCTV cameras use RTSP streams proxied through [go2rtc](https://github.com/AlexxIT/go2rtc) for browser playback via MP4 streaming. go2rtc is bundled into the backend Docker image and runs alongside the Express server.

**Cloud Run (production):**
go2rtc is automatically downloaded and started inside the Docker container. The Express server proxies video at `/api/stream.mp4?src=<camera_id>`. No extra setup needed — just deploy the backend.

**Local development:**
1.  Download go2rtc into the server directory:
    ```bash
    # Apple Silicon Mac
    curl -L https://github.com/AlexxIT/go2rtc/releases/latest/download/go2rtc_mac_arm64.zip -o /tmp/go2rtc.zip \
      && unzip -o /tmp/go2rtc.zip -d server/ && chmod +x server/go2rtc && rm /tmp/go2rtc.zip

    # Intel Mac
    curl -L https://github.com/AlexxIT/go2rtc/releases/latest/download/go2rtc_mac_amd64.zip -o /tmp/go2rtc.zip \
      && unzip -o /tmp/go2rtc.zip -d server/ && chmod +x server/go2rtc && rm /tmp/go2rtc.zip
    ```
2.  Run it with the provided config:
    ```bash
    server/go2rtc -config server/go2rtc.yaml
    ```

**Network requirements:** The machine running go2rtc must have network access to the NVR at `128.106.192.66:554`.

CCTV cameras appear automatically on the map when the **NSC-N105** feed is selected.

### Deployment

**Frontend (GitHub Pages):**
The frontend is hosted on GitHub Pages and connects to the Firebase backend.

1.  **Build & Deploy**:
    ```bash
    npm run deploy
    ```
    This command builds the app (using the configured `VITE_BACKEND_URL`) and pushes to the `gh-pages` branch.

2.  **Access**: Visit `https://aochinwen.github.io/WazeOpsApp/`.

