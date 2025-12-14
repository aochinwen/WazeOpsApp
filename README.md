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

    **Optional:**
    *   `FRONTEND_URL`: URL of the deployed frontend (e.g., your GitHub Pages URL). Used by the backend to generate details links. Defaults to `http://localhost:3000`.
    *   `VITE_BACKEND_URL`: URL of the backend service. Defaults to `http://localhost:3001`.
    *   `NOTIFY_URL`: URL of the downstream notification service. Note that the notification service is sent separately to another service. Defaults to `http://localhost:3002/api/notify`.
    *   `INFISICAL_CLIENT_ID`, `INFISICAL_CLIENT_SECRET`: Infisical credentials for secret management (Optional, will fallback to local env).
    *   `INFISICAL_PROJECT_ID`: Infisical Project ID.
    *   `INFISICAL_ENVIRONMENT`: Infisical Environment (e.g. `dev`).

### Frontend Application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Ensure you have set up your `.env.local` as described above.
3. Run the app:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

### Backend Notification Service

The backend worker runs separately to check for Waze incidents and send notifications.

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the worker:
   ```bash
   npm run dev
   ```

## Deployment

### GitHub Pages (Frontend Only)
The frontend can be hosted on GitHub Pages, but it requires a public backend URL (e.g., via Tunnel).

1.  **Start Backend Tunnel**:
    ```bash
    npx localtunnel --port 3001
    ```
    Note the URL (e.g., `https://your-tunnel.loca.lt`) and the password.


2.  **Deploy**:
    Run the following command (replace the URL with your actual backend URL, e.g., tunnel or Lambda):
    ```bash
    # If using Tunnel:
    export VITE_BACKEND_URL="https://your-tunnel.loca.lt"
    export FRONTEND_URL="https://your-username.github.io/WazeOpsApp"
    
    # If using Lambda Function URL:
    export VITE_BACKEND_URL="https://your-lambda-url.lambda-url.region.on.aws"
    export FRONTEND_URL="https://your-username.github.io/WazeOpsApp"
    
    npm run deploy
    ```
3.  **Access**: Visit `https://your-username.github.io/WazeOpsApp/`.

*Note: You may need to visit the tunnel URL once in your browser to enter the tunnel password before the app can connect.*
