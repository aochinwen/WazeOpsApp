
import { FilterCategory, CCTVCamera } from './types';
import { TriangleAlert, Car, Construction, Ban, AlertCircle, Zap } from 'lucide-react';

export const WAZE_FEED_URL = "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/b9eb1444-6cef-4cbd-b681-2937ad70dc9c?format=1";

// Polling and timing constants
export const FEED_POLL_INTERVAL_MS = 300000; // 5 minutes
export const CAMERA_REFRESH_COOLDOWN_SEC = 60; // 1 minute
export const TOAST_AUTO_CLOSE_MS = 4000; // 4 seconds
export const MAP_MODAL_INIT_DELAY_MS = 300; // 300ms for modal animation

export const FEED_SOURCES = [
  {
    id: 'custom',
    name: 'Custom URL',
    url: '',
    tvtUrl: ''
  },
  {
    id: 'N105',
    name: 'N105',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1764829291980'
  },
  {
    id: 'N113',
    name: 'N113',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/a2141ab7-ad83-4456-a614-54c572a780d4?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1770889148579'
  },
  {
    id: 'NSC-N101',
    name: 'NSC-N101',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/838924d4-1642-4419-9e9f-3d17ffe11fcf?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773024620752'
  },
  {
    id: 'NSC-N102',
    name: 'NSC - N102',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/3ad950b5-f813-4fe7-a944-bf6ab2b3449c?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773641540527'
  },
  {
    id: 'NSC-N103',
    name: 'NSC-N103',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/2ae59ac0-2054-4681-9af0-e41a67da94d8?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772781535086'
  },
  {
    id: 'NSC-N105',
    name: 'NSC - N105',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ee935c52-98cd-4aa0-bac4-6f918a60b948?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1767929979171'
  },
  {
    id: 'NSC-N106',
    name: 'NSC - N106',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/a40b3615-d37b-4bb1-8770-b93292b59ccb?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773725614739'
  },
  {
    id: 'NSC-N107',
    name: 'NSC - N107',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/3e748db2-ce25-4ce7-a7eb-e80b8958bf3d?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773208206676'
  },
  {
    id: 'NSC-N109',
    name: 'NSC-N109',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/9340dec6-7bb3-4747-8118-74e9e33c1217?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772695909582'
  },
  {
    id: 'NSC-N110',
    name: 'NSC-N110',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ef55d393-77d4-4c5b-b0a5-9e232d306a99?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772689317571'
  },
  {
    id: 'NSC-N111',
    name: 'NSC - N111',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/6df32654-29e2-41d6-9df2-f287efc799bd?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772593588862'
  },
  {
    id: 'NSC-N112',
    name: 'NSC-N112',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ac49baf5-cbe1-44ea-8ee3-7c9bdbd82ff0?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772609893494'
  },
  {
    id: 'NSC-N115',
    name: 'NSC - N115',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/cb390849-f2ef-459f-b136-c28cd473bc24?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773640703358'
  },
  {
    id: 'LTA_Traffic',
    name: 'Singapore LTA',
    url: '/feed/lta',
    tvtUrl: ''
  },
];

export const JAM_LEVEL_COLORS: Record<number, string> = {
  0: '#22c55e', // Green/Free
  1: '#84cc16', // Lime
  2: '#eab308', // Yellow
  3: '#f97316', // Orange
  4: '#ef4444', // Red
  5: '#7f1d1d', // Dark Red/Blocked
};

export const JAM_DESCRIPTIONS: Record<number, string> = {
  0: 'No Delays',
  1: 'Light Traffic',
  2: 'Moderate Traffic',
  3: 'Heavy Traffic',
  4: 'Standstill Traffic',
  5: 'Road Closed'
};

export const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string; hex: string }> = {
  ACCIDENT: { label: 'Accident', color: 'text-red-600', icon: TriangleAlert, bg: 'bg-red-50', hex: '#dc2626' },
  WEATHERHAZARD: { label: 'Hazard', color: 'text-yellow-600', icon: Zap, bg: 'bg-yellow-50', hex: '#ca8a04' },
  HAZARD: { label: 'Hazard', color: 'text-yellow-600', icon: AlertCircle, bg: 'bg-yellow-50', hex: '#ca8a04' },
  CONSTRUCTION: { label: 'Construction', color: 'text-blue-600', icon: Construction, bg: 'bg-blue-50', hex: '#2563eb' },
  ROAD_CLOSED: { label: 'Road Closed', color: 'text-slate-700', icon: Ban, bg: 'bg-slate-100', hex: '#334155' },
  default: { label: 'Other', color: 'text-gray-500', icon: AlertCircle, bg: 'bg-gray-50', hex: '#64748b' },
};

// Based on Waze CIFS specification and provided sample data
export const SUBTYPE_MAPPING: Record<string, string> = {
  'ACCIDENT_MINOR': 'Minor Accident',
  'ACCIDENT_MAJOR': 'Major Accident',
  'HAZARD_ON_ROAD': 'Object on Road',
  'HAZARD_ON_ROAD_CONSTRUCTION': 'Construction Hazard',
  'HAZARD_ON_SHOULDER': 'Vehicle on Shoulder',
  'HAZARD_WEATHER': 'Weather Hazard',
  'HAZARD_ON_ROAD_POT_HOLE': 'Pothole',
  'HAZARD_ON_ROAD_ROAD_KILL': 'Roadkill',
  'HAZARD_ON_SHOULDER_CAR_STOPPED': 'Car Stopped',
  'HAZARD_ON_SHOULDER_ANIMALS': 'Animals on Shoulder',
  'HAZARD_WEATHER_FOG': 'Fog',
  'HAZARD_WEATHER_HAIL': 'Hail',
  'HAZARD_WEATHER_HEAVY_RAIN': 'Heavy Rain',
  'HAZARD_WEATHER_HEAVY_SNOW': 'Heavy Snow',
  'HAZARD_WEATHER_FLOOD': 'Flood',
  'HAZARD_WEATHER_MONSOON': 'Monsoon',
  'HAZARD_WEATHER_TORNADO': 'Tornado',
  'HAZARD_WEATHER_HEAT_WAVE': 'Heat Wave',
  'HAZARD_WEATHER_HURRICANE': 'Hurricane',
  'HAZARD_WEATHER_FREEZING_RAIN': 'Freezing Rain',
  'ROAD_CLOSED_HAZARD': 'Closed due to Hazard',
  'ROAD_CLOSED_CONSTRUCTION': 'Closed due to Construction',
  'ROAD_CLOSED_EVENT': 'Closed due to Event',
};

export const FILTERS: { id: FilterCategory; label: string }[] = [
  { id: 'ALL', label: 'All Incidents' },
  { id: 'ACCIDENT', label: 'Accidents' },
  { id: 'HAZARD', label: 'Hazards' },
  { id: 'CONSTRUCTION', label: 'Roadworks' },
  { id: 'ROAD_CLOSED', label: 'Closures' },
];

export const N105_CCTV_CAMERAS: CCTVCamera[] = [
  { id: 'N105_01', name: 'Thomson Rd Bef Essex Rd SB SJIJ', latitude: 1.317134, longitude: 103.8446, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/101', area: 'N105', device: 'N105_01' },
  { id: 'N105_02', name: 'Thomson Rd SB Birmingham Man', latitude: 1.317974, longitude: 103.8441, rtspUrl: 'rtsp://LTA operator:LTAN105*5@128.106.192.66:554/streaming/channels/201', area: 'N105', device: 'N105_02' },
  { id: 'N105_03', name: 'NT & TM NB', latitude: 1.319287, longitude: 103.8432, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/301', area: 'N105', device: 'N105_03' },
  { id: 'N105_04', name: 'Moulmein Rd Thomson Euro Asia', latitude: 1.318333, longitude: 103.846, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/401', area: 'N105', device: 'N105_04' },
  { id: 'N105_05', name: 'Launching Shaft', latitude: 1.319858, longitude: 103.8427, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/501', area: 'N105', device: 'N105_05' },
  { id: 'N105_06', name: 'POB4 Moulmein Thomson Rd SB', latitude: 1.318932, longitude: 103.8436, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/601', area: 'N105', device: 'N105_06' },
  { id: 'N105_07', name: 'Irrawady Thomson Rd Junction', latitude: 1.320951, longitude: 103.8427, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/701', area: 'N105', device: 'N105_07' },
  { id: 'N105_08', name: 'Thomson Rd NB United Sq', latitude: 1.316702, longitude: 103.8444, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/801', area: 'N105', device: 'N105_08' },
  { id: 'N105_09', name: 'Thomson Rd Bef Essex Rd Bus Stop', latitude: 1.316684, longitude: 103.8447, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/901', area: 'N105', device: 'N105_09' },
  { id: 'N105_10', name: 'Thomson Rd NB Royal Sq', latitude: 1.319598, longitude: 103.8432, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1001', area: 'N105', device: 'N105_10' },
  { id: 'N105_11', name: 'Thomson Rd NB Shell Stn', latitude: 1.324053, longitude: 103.842, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1101', area: 'N105', device: 'N105_11' },
  { id: 'N105_12', name: 'Newton Rd IFO IRAS', latitude: 1.318528, longitude: 103.842, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1201', area: 'N105', device: 'N105_12' },
  { id: 'N105_13', name: 'POB4 S Newton Rd Junct', latitude: 1.319145, longitude: 103.8438, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1301', area: 'N105', device: 'N105_13' },
  { id: 'N105_14', name: 'Thomson Rd IFO IRAS', latitude: 1.319764, longitude: 103.843, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1401', area: 'N105', device: 'N105_14' },
  { id: 'N105_15', name: 'Thomson Rd Chancery Lane Junct', latitude: 1.322422, longitude: 103.8416, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1501', area: 'N105', device: 'N105_15' },
  { id: 'N105_16', name: 'Thomson Rd Jalan Merlimau Junct', latitude: 1.323146, longitude: 103.8415, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1601', area: 'N105', device: 'N105_16' },
  { id: 'N105_17', name: 'Thomson Rd SB Novena Court', latitude: 1.322705, longitude: 103.8418, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1701', area: 'N105', device: 'N105_17' },
  { id: 'N105_18', name: 'Rooftop Double T Junction', latitude: 1.317845, longitude: 103.8445, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1801', area: 'N105', device: 'N105_18' },
  { id: 'N105_19', name: 'POB 1 Thomson Rd SB Velocity SB', latitude: 1.320495, longitude: 103.8426, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1901', area: 'N105', device: 'N105_19' },
  { id: 'N105_20', name: 'POB 1 Thomson Rd NB Irrawaddy', latitude: 1.32054, longitude: 103.8425, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/2001', area: 'N105', device: 'N105_20' },
];

export const DEMO_ALERTS = [
  {
    uuid: "demo-1",
    type: "ACCIDENT",
    subtype: "ACCIDENT_MAJOR",
    street: "I-280 N",
    city: "San Francisco",
    country: "US",
    location: { x: -122.399, y: 37.7749 },
    reportRating: 4,
    reliability: 8,
    nThumbsUp: 5,
    pubMillis: Date.now() - 1000 * 60 * 15
  },
  {
    uuid: "demo-3",
    type: "ROAD_CLOSED",
    subtype: "ROAD_CLOSED_EVENT",
    street: "Market St",
    city: "San Francisco",
    country: "US",
    location: { x: -122.41, y: 37.77 },
    reportRating: 5,
    reliability: 10,
    nThumbsUp: 12,
    pubMillis: Date.now() - 1000 * 60 * 120
  }
];
