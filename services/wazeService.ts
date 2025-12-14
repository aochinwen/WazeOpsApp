
import { WazeFeedResponse, ManagedIncident, IncidentStatus, WazeRawAlert, WazeTrafficJam, TrafficViewResponse } from '../types';

const PROXY_URL = 'https://corsproxy.io/?';

const fetchWithProxy = async (targetUrl: string) => {
  // Append timestamp to prevent caching
  const separator = targetUrl.includes('?') ? '&' : '?';
  const urlWithTime = `${targetUrl}${separator}t=${new Date().getTime()}`;

  // If URL is relative (our own backend) or local, skip the proxy
  if (targetUrl.startsWith('/') || targetUrl.includes('localhost')) {
    const response = await fetch(urlWithTime, { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }

  const proxyUrl = `${PROXY_URL}${encodeURIComponent(urlWithTime)}`;

  const response = await fetch(proxyUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchWazeIncidents = async (feedUrl: string): Promise<ManagedIncident[]> => {
  const data: WazeFeedResponse = await fetchWithProxy(feedUrl);

  if (!data.alerts) return [];

  return data.alerts.map((alert: WazeRawAlert) => ({
    uuid: alert.uuid,
    type: alert.type,
    subtype: alert.subtype,
    street: alert.street,
    city: alert.city,
    country: alert.country,
    location: alert.location,
    reportRating: alert.reportRating || 0,
    reliability: alert.reliability || 5, // Default mid reliability if missing
    nThumbsUp: alert.nThumbsUp || 0,
    confidence: alert.confidence || 0,
    reportDescription: alert.reportDescription,
    pubMillis: alert.pubMillis,
    status: IncidentStatus.NEW, // Initial status for management app
  }));
};

export const fetchTrafficView = async (tvtUrl: string): Promise<WazeTrafficJam[]> => {
  const data: TrafficViewResponse = await fetchWithProxy(tvtUrl);

  // Support both 'routes' (Traffic View Tool format) and 'jams' (Partner Feed format)
  const rawItems = data.routes || data.jams || [];

  return rawItems.map((item: any) => ({
    id: item.id,
    uuid: item.uuid || item.id,
    // Map 'jamLevel' (TVT) or 'level' (Partner) to 'level'
    level: item.jamLevel !== undefined ? item.jamLevel : (item.level || 0),
    line: item.line || [],
    speedKMH: item.speedKMH || 0,
    length: item.length || 0,
    delay: item.delay || 0,
    street: item.street || item.name || 'Unknown Route',
    city: item.city,
    country: item.country,
    roadType: item.roadType,
    pubMillis: item.pubMillis || Date.now(),
  }));
};
