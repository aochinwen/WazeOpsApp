
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
    tvtUrl: '',
    group: 'Other'
  },
  {
    id: 'NSC-Smart-VMS',
    name: 'NSC-Smart VMS',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1764829291980',
    group: 'NSC (Smart VMS)'
  },
  {
    id: 'NSC-N101',
    name: 'NSC-N101',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/838924d4-1642-4419-9e9f-3d17ffe11fcf?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773024620752',
    group: 'NSC (C1)'
  },
  {
    id: 'NSC-N102',
    name: 'NSC - N102',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/3ad950b5-f813-4fe7-a944-bf6ab2b3449c?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773641540527',
    group: 'NSC (C3)'
  },
  {
    id: 'NSC-N103',
    name: 'NSC-N103',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/2ae59ac0-2054-4681-9af0-e41a67da94d8?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772781535086',
    group: 'NSC (C1)'
  },
  {
    id: 'NSC-N105',
    name: 'NSC - N105',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ee935c52-98cd-4aa0-bac4-6f918a60b948?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1767929979171',
    group: 'NSC (C1)'
  },
  {
    id: 'NSC-N106',
    name: 'NSC - N106',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/a40b3615-d37b-4bb1-8770-b93292b59ccb?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773725614739',
    group: 'NSC (C2)'
  },
  {
    id: 'NSC-N107',
    name: 'NSC - N107',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/3e748db2-ce25-4ce7-a7eb-e80b8958bf3d?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773208206676',
    group: 'NSC (C2)'
  },
  {
    id: 'NSC-N108',
    name: 'NSC-N108',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/9bedc7dd-f6d8-4379-97da-79ff4dee72fa?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/9bedc7dd-f6d8-4379-97da-79ff4dee72fa?id=1773656084339',
    group: 'NSC (C3)'
  },
  {
    id: 'NSC-N109',
    name: 'NSC-N109',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/9340dec6-7bb3-4747-8118-74e9e33c1217?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772695909582',
    group: 'NSC (C2)'
  },
  {
    id: 'NSC-N110',
    name: 'NSC-N110',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ef55d393-77d4-4c5b-b0a5-9e232d306a99?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772689317571',
    group: 'NSC (C3)'
  },
  {
    id: 'NSC-N111',
    name: 'NSC - N111',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/6df32654-29e2-41d6-9df2-f287efc799bd?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772593588862',
    group: 'NSC (C4)'
  },
  {
    id: 'NSC-N112',
    name: 'NSC-N112',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/ac49baf5-cbe1-44ea-8ee3-7c9bdbd82ff0?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1772609893494',
    group: 'NSC (C4)'
  },
  {
    id: 'NSC-N115',
    name: 'NSC - N115',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/cb390849-f2ef-459f-b136-c28cd473bc24?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1773640703358',
    group: 'NSC (C4)'
  },
  {
    id: 'NSC-N113',
    name: 'NSC-113',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/a2141ab7-ad83-4456-a614-54c572a780d4?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1770889148579',
    group: 'NSC (C4)'
  },
  {
    id: 'LTA_Traffic',
    name: 'Singapore LTA',
    url: '/feed/lta',
    tvtUrl: '',
    group: 'Other'
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

export const NSC_SMART_VMS_CCTV_CAMERAS: CCTVCamera[] = [
  { id: 'NSC_SMART_VMS_01', name: 'Thomson Rd Bef Essex Rd SB SJIJ', latitude: 1.317134, longitude: 103.8446, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/101', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_01' },
  { id: 'NSC_SMART_VMS_02', name: 'Thomson Rd SB Birmingham Man', latitude: 1.317974, longitude: 103.8441, rtspUrl: 'rtsp://LTA operator:LTAN105*5@128.106.192.66:554/streaming/channels/201', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_02' },
  { id: 'NSC_SMART_VMS_03', name: 'NT & TM NB', latitude: 1.319287, longitude: 103.8432, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/301', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_03' },
  { id: 'NSC_SMART_VMS_04', name: 'Moulmein Rd Thomson Euro Asia', latitude: 1.318333, longitude: 103.846, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/401', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_04' },
  { id: 'NSC_SMART_VMS_05', name: 'Launching Shaft', latitude: 1.319858, longitude: 103.8427, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/501', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_05' },
  { id: 'NSC_SMART_VMS_06', name: 'POB4 Moulmein Thomson Rd SB', latitude: 1.318932, longitude: 103.8436, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/601', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_06' },
  { id: 'NSC_SMART_VMS_07', name: 'Irrawady Thomson Rd Junction', latitude: 1.320951, longitude: 103.8427, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/701', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_07' },
  { id: 'NSC_SMART_VMS_08', name: 'Thomson Rd NB United Sq', latitude: 1.316702, longitude: 103.8444, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/801', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_08' },
  { id: 'NSC_SMART_VMS_09', name: 'Thomson Rd Bef Essex Rd Bus Stop', latitude: 1.316684, longitude: 103.8447, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/901', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_09' },
  { id: 'NSC_SMART_VMS_10', name: 'Thomson Rd NB Royal Sq', latitude: 1.319598, longitude: 103.8432, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1001', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_10' },
  { id: 'NSC_SMART_VMS_11', name: 'Thomson Rd NB Shell Stn', latitude: 1.324053, longitude: 103.842, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1101', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_11' },
  { id: 'NSC_SMART_VMS_12', name: 'Newton Rd IFO IRAS', latitude: 1.318528, longitude: 103.842, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1201', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_12' },
  { id: 'NSC_SMART_VMS_13', name: 'POB4 S Newton Rd Junct', latitude: 1.319145, longitude: 103.8438, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1301', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_13' },
  { id: 'NSC_SMART_VMS_14', name: 'Thomson Rd IFO IRAS', latitude: 1.319764, longitude: 103.843, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1401', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_14' },
  { id: 'NSC_SMART_VMS_15', name: 'Thomson Rd Chancery Lane Junct', latitude: 1.322422, longitude: 103.8416, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1501', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_15' },
  { id: 'NSC_SMART_VMS_16', name: 'Thomson Rd Jalan Merlimau Junct', latitude: 1.323146, longitude: 103.8415, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1601', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_16' },
  { id: 'NSC_SMART_VMS_17', name: 'Thomson Rd SB Novena Court', latitude: 1.322705, longitude: 103.8418, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1701', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_17' },
  { id: 'NSC_SMART_VMS_18', name: 'Rooftop Double T Junction', latitude: 1.317845, longitude: 103.8445, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1801', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_18' },
  { id: 'NSC_SMART_VMS_19', name: 'POB 1 Thomson Rd SB Velocity SB', latitude: 1.320495, longitude: 103.8426, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1901', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_19' },
  { id: 'NSC_SMART_VMS_20', name: 'POB 1 Thomson Rd NB Irrawaddy', latitude: 1.32054, longitude: 103.8425, rtspUrl: 'rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/2001', area: 'NSC-Smart VMS', device: 'NSC_SMART_VMS_20' },
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

export const NSC_CCTV_CAMERAS: CCTVCamera[] = [
  {
    "id": "N101_01",
    "name": "C1 Victoria St Silo",
    "latitude": 1.302341,
    "longitude": 103.857077,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/101",
    "area": "NSC-N101",
    "device": "N101_01"
  },
  {
    "id": "N101_02",
    "name": "C2 Ophir Road DUO Residence",
    "latitude": 1.301014,
    "longitude": 103.858053,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/201",
    "area": "NSC-N101",
    "device": "N101_02"
  },
  {
    "id": "N101_03",
    "name": "C3 Ophir Road Plaza",
    "latitude": 1.299354,
    "longitude": 103.859638,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/301",
    "area": "NSC-N101",
    "device": "N101_03"
  },
  {
    "id": "N101_06",
    "name": "C6 Beach Road Ophir Road Junction",
    "latitude": 1.299526,
    "longitude": 103.8594,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/601",
    "area": "NSC-N101",
    "device": "N101_06"
  },
  {
    "id": "N101_07",
    "name": "C7 Nicoll Highway Opposite Plaza",
    "latitude": 1.298711,
    "longitude": 103.860886,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/701",
    "area": "NSC-N101",
    "device": "N101_07"
  },
  {
    "id": "N101_08",
    "name": "C8 Ophir Road Kg Glam",
    "latitude": 1.301272,
    "longitude": 103.858056,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/801",
    "area": "NSC-N101",
    "device": "N101_08"
  },
  {
    "id": "N101_09",
    "name": "C9 Nicoll Highway NCH FB",
    "latitude": 1.297767,
    "longitude": 103.85955,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/901",
    "area": "NSC-N101",
    "device": "N101_09"
  },
  {
    "id": "N101_10",
    "name": "C10 Victoria St Bugis",
    "latitude": 1.301363,
    "longitude": 103.85627,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1001",
    "area": "NSC-N101",
    "device": "N101_10"
  },
  {
    "id": "N101_11",
    "name": "C11 Nicoll Highway Middle Road Junction",
    "latitude": 1.295306,
    "longitude": 103.857246,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1101",
    "area": "NSC-N101",
    "device": "N101_11"
  },
  {
    "id": "N101_12",
    "name": "C12 North Bridge Road DUO Residence",
    "latitude": 1.301011,
    "longitude": 103.857827,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1201",
    "area": "NSC-N101",
    "device": "N101_12"
  },
  {
    "id": "N101_13",
    "name": "C13 Nicoll Highway Suntec City",
    "latitude": 1.295291,
    "longitude": 103.857234,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1301",
    "area": "NSC-N101",
    "device": "N101_13"
  },
  {
    "id": "N101_14",
    "name": "C14 Ophir Road Republic Avenue Junction",
    "latitude": 1.296198,
    "longitude": 103.86068,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1401",
    "area": "NSC-N101",
    "device": "N101_14"
  },
  {
    "id": "N101_16",
    "name": "C16 North Bridge Road Park View",
    "latitude": 1.299835,
    "longitude": 103.85678,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1601",
    "area": "NSC-N101",
    "device": "N101_16"
  },
  {
    "id": "N101_18",
    "name": "C18 Beach Road Rochor Road Junction",
    "latitude": 1.298291,
    "longitude": 103.858186,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1801",
    "area": "NSC-N101",
    "device": "N101_18"
  },
  {
    "id": "N101_19",
    "name": "C19 Beach Road  Tan Quee Lan Junction",
    "latitude": 1.297771,
    "longitude": 103.857419,
    "rtspUrl": "rtsp://admin:rest^1ct@119.73.153.38:554/streaming/channels/1901",
    "area": "NSC-N101",
    "device": "N101_19"
  },
  {
    "id": "N102_02",
    "name": "Ophir Rd",
    "latitude": 1.303146,
    "longitude": 103.854667,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/201",
    "area": "NSC-N102",
    "device": "N102_02"
  },
  {
    "id": "N102_03",
    "name": "Serangoon Rd Junction",
    "latitude": 1.304752,
    "longitude": 103.850875,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/301",
    "area": "NSC-N102",
    "device": "N102_03"
  },
  {
    "id": "N102_06",
    "name": "Boon Siew Building",
    "latitude": 1.307318,
    "longitude": 103.847543,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/601",
    "area": "NSC-N102",
    "device": "N102_06"
  },
  {
    "id": "N102_08",
    "name": "Plant 3 HSO",
    "latitude": 1.308251,
    "longitude": 103.847591,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/801",
    "area": "NSC-N102",
    "device": "N102_08"
  },
  {
    "id": "N102_09",
    "name": "Kg Java Road Junction",
    "latitude": 1.309069,
    "longitude": 103.847008,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/901",
    "area": "NSC-N102",
    "device": "N102_09"
  },
  {
    "id": "N102_10",
    "name": "ES07 KKH",
    "latitude": 1.309546,
    "longitude": 103.846472,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/1001",
    "area": "NSC-N102",
    "device": "N102_10"
  },
  {
    "id": "N102_12",
    "name": "Fu Lu Shou",
    "latitude": 1.301938,
    "longitude": 103.854442,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/1201",
    "area": "NSC-N102",
    "device": "N102_12"
  },
  {
    "id": "N102_13",
    "name": "Sim Lim Square",
    "latitude": 1.303236,
    "longitude": 103.852856,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/1301",
    "area": "NSC-N102",
    "device": "N102_13"
  },
  {
    "id": "N102_15",
    "name": "Cavenagh Rd Junction",
    "latitude": 1.3104501,
    "longitude": 103.844205,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/1501",
    "area": "NSC-N102",
    "device": "N102_15"
  },
  {
    "id": "N102_16",
    "name": "PUB BTWW",
    "latitude": 1.309579,
    "longitude": 103.846086,
    "rtspUrl": "rtsp://admin:$ecret123@203.126.119.211:554/Streaming/Channels/1601",
    "area": "NSC-N102",
    "device": "N102_16"
  },
  {
    "id": "N103_01",
    "name": "Kampong Java Rd HSO",
    "latitude": 1.308896,
    "longitude": 103.847274,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/Streaming/Channels/101",
    "area": "NSC-N103",
    "device": "N103_01"
  },
  {
    "id": "N103_06",
    "name": "Kampong Java Rd & Norfolk Rd Junction 2",
    "latitude": 1.313835,
    "longitude": 103.845571,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/602",
    "area": "NSC-N103",
    "device": "N103_06"
  },
  {
    "id": "N103_07",
    "name": "Thomson Rd City bound",
    "latitude": 1.315741,
    "longitude": 103.845065,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/702",
    "area": "NSC-N103",
    "device": "N103_07"
  },
  {
    "id": "N103_08",
    "name": "Suffolk Rd & Thomson Rd Junction",
    "latitude": 1.314537,
    "longitude": 103.845114,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/802",
    "area": "NSC-N103",
    "device": "N103_08"
  },
  {
    "id": "N103_09",
    "name": "Minor Keng Lee Rd",
    "latitude": 1.314124,
    "longitude": 103.845104,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/902",
    "area": "NSC-N103",
    "device": "N103_09"
  },
  {
    "id": "N103_11",
    "name": "CTE slip road 2",
    "latitude": 1.311723,
    "longitude": 103.844279,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/1102",
    "area": "NSC-N103",
    "device": "N103_11"
  },
  {
    "id": "N103_12",
    "name": "Bukit Timah Rd & CTE slip Rd Junction",
    "latitude": 1.310825,
    "longitude": 103.844117,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/1202",
    "area": "NSC-N103",
    "device": "N103_12"
  },
  {
    "id": "N103_13",
    "name": "Bukit Timah Rd & Cavenagh Rd Junction",
    "latitude": 1.310779,
    "longitude": 103.84494,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/1301",
    "area": "NSC-N103",
    "device": "N103_13"
  },
  {
    "id": "N103_16",
    "name": "Cavenagh Rd 1",
    "latitude": 1.31243,
    "longitude": 103.845275,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/1602",
    "area": "NSC-N103",
    "device": "N103_16"
  },
  {
    "id": "N103_17",
    "name": "Cavenagh Rd 2",
    "latitude": 1.312589,
    "longitude": 103.845306,
    "rtspUrl": "rtsp://admin:NSC103@lta@203.127.62.122:554/streaming/channels/1702",
    "area": "NSC-N103",
    "device": "N103_17"
  },
  {
    "id": "N105_01",
    "name": "Thomson Rd Bef Essex Rd SB SJIJ",
    "latitude": 1.317134,
    "longitude": 103.844622,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/101",
    "area": "NSC-N105",
    "device": "N105_01"
  },
  {
    "id": "N105_02",
    "name": "Thomson Rd SB Birmingham Man",
    "latitude": 1.317974,
    "longitude": 103.844102,
    "rtspUrl": "rtsp://LTA operator:LTAN105*5@128.106.192.66:554/streaming/channels/201",
    "area": "NSC-N105",
    "device": "N105_02"
  },
  {
    "id": "N105_04",
    "name": "Moulmein Rd Thomson Euro Asia",
    "latitude": 1.318333,
    "longitude": 103.845951,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/401",
    "area": "NSC-N105",
    "device": "N105_04"
  },
  {
    "id": "N105_06",
    "name": "POB4 Moulmein Thomson Rd SB",
    "latitude": 1.318932,
    "longitude": 103.843565,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/601",
    "area": "NSC-N105",
    "device": "N105_06"
  },
  {
    "id": "N105_07",
    "name": "Irrawady Thomson Rd Junction",
    "latitude": 1.320951,
    "longitude": 103.842714,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/701",
    "area": "NSC-N105",
    "device": "N105_07"
  },
  {
    "id": "N105_08",
    "name": "Thomson Rd NB United Sq",
    "latitude": 1.316702,
    "longitude": 103.844379,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/801",
    "area": "NSC-N105",
    "device": "N105_08"
  },
  {
    "id": "N105_09",
    "name": "Thomson Rd Bef Essex Rd Bus Stop",
    "latitude": 1.316684,
    "longitude": 103.844659,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/901",
    "area": "NSC-N105",
    "device": "N105_09"
  },
  {
    "id": "N105_10",
    "name": "Thomson Rd NB Royal Sq",
    "latitude": 1.319598,
    "longitude": 103.843204,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1001",
    "area": "NSC-N105",
    "device": "N105_10"
  },
  {
    "id": "N105_11",
    "name": "Thomson Rd NB Shell Stn",
    "latitude": 1.324053,
    "longitude": 103.842018,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1101",
    "area": "NSC-N105",
    "device": "N105_11"
  },
  {
    "id": "N105_12",
    "name": "Newton Rd IFO IRAS",
    "latitude": 1.318528,
    "longitude": 103.841985,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1201",
    "area": "NSC-N105",
    "device": "N105_12"
  },
  {
    "id": "N105_13",
    "name": "POB4 S Newton Rd Junct",
    "latitude": 1.319145,
    "longitude": 103.843755,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1301",
    "area": "NSC-N105",
    "device": "N105_13"
  },
  {
    "id": "N105_14",
    "name": "Thomson Rd IFO IRAS",
    "latitude": 1.319764,
    "longitude": 103.843041,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1401",
    "area": "NSC-N105",
    "device": "N105_14"
  },
  {
    "id": "N105_15",
    "name": "Thomson Rd Chancery Lane Junct",
    "latitude": 1.322422,
    "longitude": 103.841565,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1501",
    "area": "NSC-N105",
    "device": "N105_15"
  },
  {
    "id": "N105_16",
    "name": "Thomson Rd Jalan Merlimau Junct",
    "latitude": 1.323146,
    "longitude": 103.841483,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1601",
    "area": "NSC-N105",
    "device": "N105_16"
  },
  {
    "id": "N105_17",
    "name": "Thomson Rd SB Novena Court",
    "latitude": 1.322705,
    "longitude": 103.841814,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1701",
    "area": "NSC-N105",
    "device": "N105_17"
  },
  {
    "id": "N105_18",
    "name": "Rooftop Double T Junction",
    "latitude": 1.317845,
    "longitude": 103.844473,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1801",
    "area": "NSC-N105",
    "device": "N105_18"
  },
  {
    "id": "N105_19",
    "name": "POB 1 Thomson Rd SB Velocity SB",
    "latitude": 1.320495,
    "longitude": 103.842561,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/1901",
    "area": "NSC-N105",
    "device": "N105_19"
  },
  {
    "id": "N105_20",
    "name": "POB 1 Thomson Rd NB Irrawaddy",
    "latitude": 1.32054,
    "longitude": 103.842549,
    "rtspUrl": "rtsp://LTA operator:LTAN105*@128.106.192.66:554/streaming/channels/2001",
    "area": "NSC-N105",
    "device": "N105_20"
  },
  {
    "id": "N106_01",
    "name": "BHSC",
    "latitude": 1.325125807,
    "longitude": 103.8417053,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/101",
    "area": "NSC-N106",
    "device": "N106_01"
  },
  {
    "id": "N106_02",
    "name": "TTMT",
    "latitude": 1.327694171,
    "longitude": 103.841555,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/201",
    "area": "NSC-N106",
    "device": "N106_02"
  },
  {
    "id": "N106_03",
    "name": "Eton house",
    "latitude": 1.32985012,
    "longitude": 103.8402458,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/301",
    "area": "NSC-N106",
    "device": "N106_03"
  },
  {
    "id": "N106_05",
    "name": "Mt. Plesant Junc-SJII",
    "latitude": 1.331034895,
    "longitude": 103.8393676,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/501",
    "area": "NSC-N106",
    "device": "N106_05"
  },
  {
    "id": "N106_07",
    "name": "Whitley Rd",
    "latitude": 1.327311922,
    "longitude": 103.8391606,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/701",
    "area": "NSC-N106",
    "device": "N106_07"
  },
  {
    "id": "N106_08",
    "name": "HVCP",
    "latitude": 1.327311922,
    "longitude": 103.8391829,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/801",
    "area": "NSC-N106",
    "device": "N106_08"
  },
  {
    "id": "N106_09",
    "name": "PIE Whitley",
    "latitude": 1.327247761,
    "longitude": 103.8377259,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/901",
    "area": "NSC-N106",
    "device": "N106_09"
  },
  {
    "id": "N106_10",
    "name": "ER-15",
    "latitude": 1.32894441,
    "longitude": 103.8390813,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1001",
    "area": "NSC-N106",
    "device": "N106_10"
  },
  {
    "id": "N106_11",
    "name": "LAMH",
    "latitude": 1.330409114,
    "longitude": 103.839821,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1101",
    "area": "NSC-N106",
    "device": "N106_11"
  },
  {
    "id": "N106_12",
    "name": "ER-17",
    "latitude": 1.335667716,
    "longitude": 103.8374069,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1201",
    "area": "NSC-N106",
    "device": "N106_12"
  },
  {
    "id": "N106_13",
    "name": "POB 14 N107",
    "latitude": 1.335721174,
    "longitude": 103.8374133,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1301",
    "area": "NSC-N106",
    "device": "N106_13"
  },
  {
    "id": "N106_14",
    "name": "TPOB_SJII",
    "latitude": 1.331283701,
    "longitude": 103.8392558,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1401",
    "area": "NSC-N106",
    "device": "N106_14"
  },
  {
    "id": "N106_15",
    "name": "Thomson Balestier Ju",
    "latitude": 1.325640653,
    "longitude": 103.8417026,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1501",
    "area": "NSC-N106",
    "device": "N106_15"
  },
  {
    "id": "N106_16",
    "name": "TPOB_CCL",
    "latitude": 1.333425332,
    "longitude": 103.8378764,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1601",
    "area": "NSC-N106",
    "device": "N106_16"
  },
  {
    "id": "N106_17",
    "name": "Balestier ZhongShan",
    "latitude": 1.326682328,
    "longitude": 103.8474359,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1701",
    "area": "NSC-N106",
    "device": "N106_17"
  },
  {
    "id": "N106_18",
    "name": "PIE Jalan Datoh",
    "latitude": 1.32936258,
    "longitude": 103.843373,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1801",
    "area": "NSC-N106",
    "device": "N106_18"
  },
  {
    "id": "N106_19",
    "name": "Denham road",
    "latitude": 1.327940692,
    "longitude": 103.8382356,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/1901",
    "area": "NSC-N106",
    "device": "N106_19"
  },
  {
    "id": "N106_20",
    "name": "MPleasnt road juncti",
    "latitude": 1.330938998,
    "longitude": 103.8385097,
    "rtspUrl": "rtsp://admin:echol123@@203.126.235.202:554/streaming/channels/2001",
    "area": "NSC-N106",
    "device": "N106_20"
  },
  {
    "id": "N107_01",
    "name": "Thomson 800 Marymount Convent School Aerial",
    "latitude": 1.342196428,
    "longitude": 103.8395233,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/101",
    "area": "NSC-N107",
    "device": "N107_01"
  },
  {
    "id": "N107_02",
    "name": "Raffles Institution Aerial",
    "latitude": 1.342473452,
    "longitude": 103.8394672,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/201",
    "area": "NSC-N107",
    "device": "N107_02"
  },
  {
    "id": "N107_03",
    "name": "Marymount Braddell At grade Junc",
    "latitude": 1.344529837,
    "longitude": 103.8404899,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1801",
    "area": "NSC-N107",
    "device": "N107_03"
  },
  {
    "id": "N107_04",
    "name": "Assisi Hospice",
    "latitude": 1.342777236,
    "longitude": 103.8391843,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/701",
    "area": "NSC-N107",
    "device": "N107_04"
  },
  {
    "id": "N107_07",
    "name": "Marymount Convent School Access",
    "latitude": 1.337800833,
    "longitude": 103.8384972,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/301",
    "area": "NSC-N107",
    "device": "N107_07"
  },
  {
    "id": "N107_12",
    "name": "Near Bishan Fire Station ES28N",
    "latitude": 1.346330432,
    "longitude": 103.838803,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1201",
    "area": "NSC-N107",
    "device": "N107_12"
  },
  {
    "id": "N107_14",
    "name": "Marymount Thomson Junc",
    "latitude": 1.338964963,
    "longitude": 103.837715,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1401",
    "area": "NSC-N107",
    "device": "N107_14"
  },
  {
    "id": "N107_15",
    "name": "Toa Payoh Rise Thomson Junc",
    "latitude": 1.337812645,
    "longitude": 103.8377333,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1501",
    "area": "NSC-N107",
    "device": "N107_15"
  },
  {
    "id": "N107_16",
    "name": "Braddell Thomson Junc",
    "latitude": 1.343606419,
    "longitude": 103.8381705,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1601",
    "area": "NSC-N107",
    "device": "N107_16"
  },
  {
    "id": "N107_17",
    "name": "Opp Thomson 800",
    "latitude": 1.340092833,
    "longitude": 103.8388503,
    "rtspUrl": "rtsp://admin:echol123@@115.42.205.14:554/streaming/channels/1701",
    "area": "NSC-N107",
    "device": "N107_17"
  },
  {
    "id": "N108_03",
    "name": "Marymount Road TOLQ",
    "latitude": 1.347616335,
    "longitude": 103.8397397,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/301",
    "area": "NSC-N108",
    "device": "N108_03"
  },
  {
    "id": "N108_06",
    "name": "Bishan Street 21 Beside Site Office",
    "latitude": 1.348428136,
    "longitude": 103.8400087,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/601",
    "area": "NSC-N108",
    "device": "N108_06"
  },
  {
    "id": "N108_08",
    "name": "Marymount Road Jadescape Blk 8",
    "latitude": 1.352549147,
    "longitude": 103.8400649,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/801",
    "area": "NSC-N108",
    "device": "N108_08"
  },
  {
    "id": "N108_09",
    "name": "Junction of Jalan Pemimpin Opposite Mapex Building",
    "latitude": 1.348397574,
    "longitude": 103.8404644,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/901",
    "area": "NSC-N108",
    "device": "N108_09"
  },
  {
    "id": "N108_11",
    "name": "Tresalveo Condo On Noise Barrier",
    "latitude": 1.350698451,
    "longitude": 103.8402995,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/1101",
    "area": "NSC-N108",
    "device": "N108_11"
  },
  {
    "id": "N108_12",
    "name": "Marymount Road Shunfu Junction",
    "latitude": 1.351443264,
    "longitude": 103.8396891,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/1201",
    "area": "NSC-N108",
    "device": "N108_12"
  },
  {
    "id": "N108_13",
    "name": "Marymount Road Jadescape Blk 4",
    "latitude": 1.351574006,
    "longitude": 103.8397242,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/1301",
    "area": "NSC-N108",
    "device": "N108_13"
  },
  {
    "id": "N108_15",
    "name": "Marymount Road Near Pintau Park",
    "latitude": 1.353368044,
    "longitude": 103.8403105,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/1501",
    "area": "NSC-N108",
    "device": "N108_15"
  },
  {
    "id": "N108_17",
    "name": "62 Pemimpin Drive Along Marymount Road",
    "latitude": 1.353521821,
    "longitude": 103.8408596,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/1701",
    "area": "NSC-N108",
    "device": "N108_17"
  },
  {
    "id": "N108_20",
    "name": "Whitley Secondary School Opposite of School",
    "latitude": 1.355773161,
    "longitude": 103.8414456,
    "rtspUrl": "rtsp://echol:N1082005@crfgn108.dyndns.org:554/streaming/channels/2001",
    "area": "NSC-N108",
    "device": "N108_20"
  },
  {
    "id": "N109_02",
    "name": "D2 Marymount Rd In front of N109 Site Office",
    "latitude": 1.360051,
    "longitude": 103.841131,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/201",
    "area": "NSC-N109",
    "device": "N109_02"
  },
  {
    "id": "N109_03",
    "name": "D3 Marymount Rd In front of Extraspace",
    "latitude": 1.357412,
    "longitude": 103.841409,
    "rtspUrl": "rtsp://LTA2:Ltan109@1@165.21.73.228:554/streaming/channels/301",
    "area": "NSC-N109",
    "device": "N109_03"
  },
  {
    "id": "N109_10",
    "name": "D10 Marymount Rd and Sin Ming Ave Junction",
    "latitude": 1.360193,
    "longitude": 103.841197,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1001",
    "area": "NSC-N109",
    "device": "N109_10"
  },
  {
    "id": "N109_11",
    "name": "D11 Marymount Rd Between Citycab and ExtraSpace",
    "latitude": 1.360126,
    "longitude": 103.841162,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1101",
    "area": "NSC-N109",
    "device": "N109_11"
  },
  {
    "id": "N109_12",
    "name": "D12 Sin Ming Ave Aft Citycab Entrance",
    "latitude": 1.361026,
    "longitude": 103.841195,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1201",
    "area": "NSC-N109",
    "device": "N109_12"
  },
  {
    "id": "N109_13",
    "name": "D13 Marymount Rd SB In front of Blk 255",
    "latitude": 1.361881,
    "longitude": 103.842316,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1301",
    "area": "NSC-N109",
    "device": "N109_13"
  },
  {
    "id": "N109_14",
    "name": "D14 Marymount Rd SB In front of TSA",
    "latitude": 1.361812,
    "longitude": 103.842288,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1401",
    "area": "NSC-N109",
    "device": "N109_14"
  },
  {
    "id": "N109_15",
    "name": "D15 Marymount Rd In front of N109 Site Office",
    "latitude": 1.357448,
    "longitude": 103.841402,
    "rtspUrl": "rtsp://QPS:Qps@1234@165.21.73.228:554/streaming/channels/1501",
    "area": "NSC-N109",
    "device": "N109_15"
  },
  {
    "id": "N110_01",
    "name": "AMK Ave 6 AMK Ave 3 junction Blk 201 HDB",
    "latitude": 1.368916686,
    "longitude": 103.8445425,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/101",
    "area": "NSC-N110",
    "device": "N110_01"
  },
  {
    "id": "N110_02",
    "name": "AMK Ave 6 AMK Ave 3 junction Blk 119 HDB",
    "latitude": 1.37172134,
    "longitude": 103.8450258,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/201",
    "area": "NSC-N110",
    "device": "N110_02"
  },
  {
    "id": "N110_04",
    "name": "AMK Ave 6 SB Masjid AlMuttaqin",
    "latitude": 1.370627312,
    "longitude": 103.8459378,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/401",
    "area": "NSC-N110",
    "device": "N110_04"
  },
  {
    "id": "N110_05",
    "name": "AMK Ave 6 NB Blk 125 HDB SB facing",
    "latitude": 1.369761788,
    "longitude": 103.8447681,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/501",
    "area": "NSC-N110",
    "device": "N110_05"
  },
  {
    "id": "N110_06",
    "name": "AMK Ave 6 NB Blk 125 HDB NB facing",
    "latitude": 1.371646259,
    "longitude": 103.845058,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/601",
    "area": "NSC-N110",
    "device": "N110_06"
  },
  {
    "id": "N110_07",
    "name": "AMK Ave 6 SB Blk 730 HDB",
    "latitude": 1.374176907,
    "longitude": 103.8452602,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/701",
    "area": "NSC-N110",
    "device": "N110_07"
  },
  {
    "id": "N110_08",
    "name": "AMK Ave 6 SB AMK Polyclinic",
    "latitude": 1.374448636,
    "longitude": 103.8457722,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/801",
    "area": "NSC-N110",
    "device": "N110_08"
  },
  {
    "id": "N110_09",
    "name": "AMK Ave 6 AMK Ave 5 junction Facing Blk 649 HDB",
    "latitude": 1.376758019,
    "longitude": 103.8448167,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/901",
    "area": "NSC-N110",
    "device": "N110_09"
  },
  {
    "id": "N110_10",
    "name": "AMK Ave 6 AMK Ave 5 junction Facing AMK Ave 5 EB",
    "latitude": 1.377294354,
    "longitude": 103.8444756,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1001",
    "area": "NSC-N110",
    "device": "N110_10"
  },
  {
    "id": "N110_11",
    "name": "AMK Ave 6 AMK Ave 5 junction Blk 649 HDB",
    "latitude": 1.378051188,
    "longitude": 103.8437621,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1101",
    "area": "NSC-N110",
    "device": "N110_11"
  },
  {
    "id": "N110_12",
    "name": "AMK Ave 5 WB LTA site office",
    "latitude": 1.377044074,
    "longitude": 103.8456762,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1201",
    "area": "NSC-N110",
    "device": "N110_12"
  },
  {
    "id": "N110_13",
    "name": "AMK Ave 6 NB Blk 640 HDB",
    "latitude": 1.380278365,
    "longitude": 103.8436918,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1301",
    "area": "NSC-N110",
    "device": "N110_13"
  },
  {
    "id": "N110_14",
    "name": "AMK Ave 6 NB Blk 646 HDB",
    "latitude": 1.379479989,
    "longitude": 103.8438393,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1401",
    "area": "NSC-N110",
    "device": "N110_14"
  },
  {
    "id": "N110_15",
    "name": "AMK Ave 6 NB Blk 634 HDB",
    "latitude": 1.381722554,
    "longitude": 103.8433401,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1501",
    "area": "NSC-N110",
    "device": "N110_15"
  },
  {
    "id": "N110_16",
    "name": "AMK Ave 6 NB Presbyterian High School",
    "latitude": 1.381722554,
    "longitude": 103.8433401,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1601",
    "area": "NSC-N110",
    "device": "N110_16"
  },
  {
    "id": "N110_17",
    "name": "AMK Ave 6 AMK Ave 9 junction along AMK Ave 6 SB",
    "latitude": 1.382219897,
    "longitude": 103.8430015,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1701",
    "area": "NSC-N110",
    "device": "N110_17"
  },
  {
    "id": "N110_18",
    "name": "AMK Ave 6 NB In front of Nuovo Condo",
    "latitude": 1.385148587,
    "longitude": 103.8429183,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1801",
    "area": "NSC-N110",
    "device": "N110_18"
  },
  {
    "id": "N110_19",
    "name": "AMK Ave 6 NB In front of Nuovo Condo 2",
    "latitude": 1.385639288,
    "longitude": 103.8427468,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/1901",
    "area": "NSC-N110",
    "device": "N110_19"
  },
  {
    "id": "N110_20",
    "name": "AMK Ave 9 WB after AMK Ave 6 AMK Ave 9 junction",
    "latitude": 1.383856799,
    "longitude": 103.8429541,
    "rtspUrl": "rtsp://N110_user:Secure888@118.201.249.158:554/streaming/channels/2001",
    "area": "NSC-N110",
    "device": "N110_20"
  },
  {
    "id": "N111_01",
    "name": "YCK Road Junction No1",
    "latitude": 1.387029,
    "longitude": 103.8415,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/101",
    "area": "NSC-N111",
    "device": "N111_01"
  },
  {
    "id": "N111_02",
    "name": "AMK Ave 6 Slip Road No2",
    "latitude": 1.387364,
    "longitude": 103.842321,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/201",
    "area": "NSC-N111",
    "device": "N111_02"
  },
  {
    "id": "N111_03",
    "name": "Lentor Avenue beside Zone B3 No3",
    "latitude": 1.388603,
    "longitude": 103.841773,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/301",
    "area": "NSC-N111",
    "device": "N111_03"
  },
  {
    "id": "N111_04",
    "name": "AMK Ave 6 along Zone A No4",
    "latitude": 1.386842,
    "longitude": 103.841889,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/401",
    "area": "NSC-N111",
    "device": "N111_04"
  },
  {
    "id": "N111_05",
    "name": "Lentor Avenue along Zone B1 No5",
    "latitude": 1.389349,
    "longitude": 103.840467,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/501",
    "area": "NSC-N111",
    "device": "N111_05"
  },
  {
    "id": "N111_06",
    "name": "Countryside Footpath behind Zone B3 No6",
    "latitude": 1.391336,
    "longitude": 103.838319,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/601",
    "area": "NSC-N111",
    "device": "N111_06"
  },
  {
    "id": "N111_07",
    "name": "Lentor Avenue along Zone B2 No7",
    "latitude": 1.39098,
    "longitude": 103.839172,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/701",
    "area": "NSC-N111",
    "device": "N111_07"
  },
  {
    "id": "N111_08",
    "name": "Lower Seletar Close No8",
    "latitude": 1.39197,
    "longitude": 103.837857,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/801",
    "area": "NSC-N111",
    "device": "N111_08"
  },
  {
    "id": "N111_09",
    "name": "Countryside Footpath behind Zone B2 No9",
    "latitude": 1.390339,
    "longitude": 103.839611,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/901",
    "area": "NSC-N111",
    "device": "N111_09"
  },
  {
    "id": "N111_10",
    "name": "Lentor Avenue beside Zone C2 No10",
    "latitude": 1.392434,
    "longitude": 103.836371,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1001",
    "area": "NSC-N111",
    "device": "N111_10"
  },
  {
    "id": "N111_11",
    "name": "SLE Slip Road Entry No11",
    "latitude": 1.393587,
    "longitude": 103.833558,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1101",
    "area": "NSC-N111",
    "device": "N111_11"
  },
  {
    "id": "N111_12",
    "name": "Zone 2 1 SLE Slip Road Exit No12",
    "latitude": 1.394335,
    "longitude": 103.833045,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1201",
    "area": "NSC-N111",
    "device": "N111_12"
  },
  {
    "id": "N111_13",
    "name": "Ramp A above Zone 2 1 No13",
    "latitude": 1.394909,
    "longitude": 103.831592,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1301",
    "area": "NSC-N111",
    "device": "N111_13"
  },
  {
    "id": "N111_14",
    "name": "AMK Ave 6 along Zone A No14",
    "latitude": 1.387261,
    "longitude": 103.842613,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1401",
    "area": "NSC-N111",
    "device": "N111_14"
  },
  {
    "id": "N111_15",
    "name": "Ramp A above Zone 2 2 along No15",
    "latitude": 1.395705,
    "longitude": 103.830441,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1501",
    "area": "NSC-N111",
    "device": "N111_15"
  },
  {
    "id": "N111_16",
    "name": "Lentor Avenue along Zone 3 1 No16",
    "latitude": 1.396316,
    "longitude": 103.829829,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1601",
    "area": "NSC-N111",
    "device": "N111_16"
  },
  {
    "id": "N111_17",
    "name": "Lentor Avenue along Zone 2 2 No17",
    "latitude": 1.395614,
    "longitude": 103.831498,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1701",
    "area": "NSC-N111",
    "device": "N111_17"
  },
  {
    "id": "N111_18",
    "name": "Lentor Avenue along Zone 3 1 No18",
    "latitude": 1.396992,
    "longitude": 103.829379,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1801",
    "area": "NSC-N111",
    "device": "N111_18"
  },
  {
    "id": "N111_19",
    "name": "Lentor Avenue along Zone 3 2 No19",
    "latitude": 1.401501,
    "longitude": 103.827375,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/1901",
    "area": "NSC-N111",
    "device": "N111_19"
  },
  {
    "id": "N111_20",
    "name": "Lentor Avenue along Zone 3 3 No20",
    "latitude": 1.403726,
    "longitude": 103.827249,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2001",
    "area": "NSC-N111",
    "device": "N111_20"
  },
  {
    "id": "N111_21",
    "name": "YCK Road beside Zone A1 No21",
    "latitude": 1.387499,
    "longitude": 103.841357,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2101",
    "area": "NSC-N111",
    "device": "N111_21"
  },
  {
    "id": "N111_22",
    "name": "Lentor Avenue along Zone C3 and C5 No22",
    "latitude": 1.391714,
    "longitude": 103.836841,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2201",
    "area": "NSC-N111",
    "device": "N111_22"
  },
  {
    "id": "N111_23",
    "name": "Ramp A above Zone 2 1 Viaduct No23",
    "latitude": 1.393325,
    "longitude": 103.833981,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2301",
    "area": "NSC-N111",
    "device": "N111_23"
  },
  {
    "id": "N111_24",
    "name": "Ramp A above Zone 2 1 Viaduct No24",
    "latitude": 1.393781,
    "longitude": 103.832369,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2301",
    "area": "NSC-N111",
    "device": "N111_24"
  },
  {
    "id": "N111_25",
    "name": "Lentor Avenue along Zone B2 No25",
    "latitude": 1.390853,
    "longitude": 103.838917,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2501",
    "area": "NSC-N111",
    "device": "N111_25"
  },
  {
    "id": "N111_26",
    "name": "Lentor Avenue along Zone 5 2 and 3 2 No26",
    "latitude": 1.402732,
    "longitude": 103.827544,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2601",
    "area": "NSC-N111",
    "device": "N111_26"
  },
  {
    "id": "N111_27",
    "name": "Lentor Avenue along Zone 3 1 No27",
    "latitude": 1.400806,
    "longitude": 103.827515,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2701",
    "area": "NSC-N111",
    "device": "N111_27"
  },
  {
    "id": "N111_28",
    "name": "Lentor Avenue along Zone 5 2 and 3 2 No28",
    "latitude": 1.402423,
    "longitude": 103.827584,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/2801",
    "area": "NSC-N111",
    "device": "N111_28"
  },
  {
    "id": "N111_30",
    "name": "Lentor Avenue beside Zone C3 No30",
    "latitude": 1.393956,
    "longitude": 103.835504,
    "rtspUrl": "rtsp://admin:Secure369@165.21.14.98:554/Streaming/Channels/3001",
    "area": "NSC-N111",
    "device": "N111_30"
  },
  {
    "id": "N112_04",
    "name": "Sembawang rd SB Opposite NLT bldg D9",
    "latitude": 1.41087778,
    "longitude": 103.82233,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/901",
    "area": "NSC-N112",
    "device": "N112_04"
  },
  {
    "id": "N112_05",
    "name": "Sembawang rd SB after Mandai junction D15",
    "latitude": 1.41273888,
    "longitude": 103.8230083,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1501",
    "area": "NSC-N112",
    "device": "N112_05"
  },
  {
    "id": "N112_06",
    "name": "Sembawang rd SB Mandai Junction D4",
    "latitude": 1.41385278,
    "longitude": 103.822858,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/401",
    "area": "NSC-N112",
    "device": "N112_06"
  },
  {
    "id": "N112_07",
    "name": "Sembawang rd NB SBAB bus stop D5",
    "latitude": 1.415719,
    "longitude": 103.823517,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/501",
    "area": "NSC-N112",
    "device": "N112_07"
  },
  {
    "id": "N112_08",
    "name": "Sembawang rd Chencharu junction D8",
    "latitude": 1.41657,
    "longitude": 103.823848,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/801",
    "area": "NSC-N112",
    "device": "N112_08"
  },
  {
    "id": "N112_09",
    "name": "Sembawang rd NB SBAB golf course D16",
    "latitude": 1.417525,
    "longitude": 103.823958,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1601",
    "area": "NSC-N112",
    "device": "N112_09"
  },
  {
    "id": "N112_10",
    "name": "Sembawang rd SB BTO Chencharu Hill D11",
    "latitude": 1.418661,
    "longitude": 103.824564,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1101",
    "area": "NSC-N112",
    "device": "N112_10"
  },
  {
    "id": "N112_11",
    "name": "Sembawang rd NB SPC at LP 112 D17",
    "latitude": 1.419614,
    "longitude": 103.8244139,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1701",
    "area": "NSC-N112",
    "device": "N112_11"
  },
  {
    "id": "N112_12",
    "name": "Sembawang rd SB after Khatib camp D14",
    "latitude": 1.42116388,
    "longitude": 103.82513,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1401",
    "area": "NSC-N112",
    "device": "N112_12"
  },
  {
    "id": "N112_13",
    "name": "Sembawang rd SB Khatib camp D20",
    "latitude": 1.42186667,
    "longitude": 103.82526,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/2001",
    "area": "NSC-N112",
    "device": "N112_13"
  },
  {
    "id": "N112_14",
    "name": "Sembawang rd NB Opposite Khatib camp D6",
    "latitude": 1.421983,
    "longitude": 103.824859,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/601",
    "area": "NSC-N112",
    "device": "N112_14"
  },
  {
    "id": "N112_15",
    "name": "Sembawang rd SB Opposite Euphony Garden D10",
    "latitude": 1.423908,
    "longitude": 103.82555,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1001",
    "area": "NSC-N112",
    "device": "N112_15"
  },
  {
    "id": "N112_16",
    "name": "Sembawang rd NB Before Euphony Garden bustop D18",
    "latitude": 1.42403,
    "longitude": 103.825258,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1801",
    "area": "NSC-N112",
    "device": "N112_16"
  },
  {
    "id": "N112_17",
    "name": "Sembawang rd NB Jln Mata Ayer junction D7",
    "latitude": 1.425436,
    "longitude": 103.825618,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/701",
    "area": "NSC-N112",
    "device": "N112_17"
  },
  {
    "id": "N112_18",
    "name": "Sembawang rd SB After Yishun Ave 3 D13",
    "latitude": 1.426122,
    "longitude": 103.826372,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1301",
    "area": "NSC-N112",
    "device": "N112_18"
  },
  {
    "id": "N112_19",
    "name": "Sembawang rd SB HDB blk 711 D12",
    "latitude": 1.428113,
    "longitude": 103.827005,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1201",
    "area": "NSC-N112",
    "device": "N112_19"
  },
  {
    "id": "N112_20",
    "name": "Sembawang rd SB HDB blk 708 D19",
    "latitude": 1.4289888,
    "longitude": 103.8270583,
    "rtspUrl": "rtsp://admin:Echol123@124.66.155.50:555/streaming/channels/1901",
    "area": "NSC-N112",
    "device": "N112_20"
  },
  {
    "id": "N113_01",
    "name": "Yishun Ave 5 Junction",
    "latitude": 1.42991762,
    "longitude": 103.8270097,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/101",
    "area": "NSC-N113",
    "device": "N113_01"
  },
  {
    "id": "N113_02",
    "name": "Sembawang Rd Yishun Ave 5 Junction",
    "latitude": 1.4307654,
    "longitude": 103.8265613,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/201",
    "area": "NSC-N113",
    "device": "N113_02"
  },
  {
    "id": "N113_03",
    "name": "Sembawang Rd Opp Blk 101 Bus Stop",
    "latitude": 1.43197373,
    "longitude": 103.8264974,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/301",
    "area": "NSC-N113",
    "device": "N113_03"
  },
  {
    "id": "N113_04",
    "name": "Sembawang Rd Blk 107",
    "latitude": 1.43184146,
    "longitude": 103.8267219,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/401",
    "area": "NSC-N113",
    "device": "N113_04"
  },
  {
    "id": "N113_05",
    "name": "Sembawang Rd Chong Pang Camp",
    "latitude": 1.43199886,
    "longitude": 103.8265051,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/501",
    "area": "NSC-N113",
    "device": "N113_05"
  },
  {
    "id": "N113_06",
    "name": "Sembawang Rd Blk 114 Bus Stop",
    "latitude": 1.43406448,
    "longitude": 103.8261841,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/601",
    "area": "NSC-N113",
    "device": "N113_06"
  },
  {
    "id": "N113_07",
    "name": "Sembawang Rd Blk 101 Bus Stop",
    "latitude": 1.4419786,
    "longitude": 103.8160951,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/701",
    "area": "NSC-N113",
    "device": "N113_07"
  },
  {
    "id": "N113_08",
    "name": "Gambas Ave Sembawang Hot Spring Park",
    "latitude": 1.43101597,
    "longitude": 103.8269065,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/801",
    "area": "NSC-N113",
    "device": "N113_08"
  },
  {
    "id": "N113_09",
    "name": "Gambas Ave Seletaris Condo",
    "latitude": 1.43498466,
    "longitude": 103.8246168,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/901",
    "area": "NSC-N113",
    "device": "N113_09"
  },
  {
    "id": "N113_11",
    "name": "Gambas Ave JTC Development Area 1",
    "latitude": 1.4358504,
    "longitude": 103.8229151,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1101",
    "area": "NSC-N113",
    "device": "N113_11"
  },
  {
    "id": "N113_12",
    "name": "Gambas Ave JTC Development Area 2",
    "latitude": 1.4367298,
    "longitude": 103.8225256,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1201",
    "area": "NSC-N113",
    "device": "N113_12"
  },
  {
    "id": "N113_13",
    "name": "Sembawang Ave Junction",
    "latitude": 1.4387248,
    "longitude": 103.8210096,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1301",
    "area": "NSC-N113",
    "device": "N113_13"
  },
  {
    "id": "N113_14",
    "name": "Gambas Ave Proxima",
    "latitude": 1.44193904,
    "longitude": 103.8168383,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1401",
    "area": "NSC-N113",
    "device": "N113_14"
  },
  {
    "id": "N113_15",
    "name": "Gambas Ave Uturn",
    "latitude": 1.44116418,
    "longitude": 103.8174092,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1501",
    "area": "NSC-N113",
    "device": "N113_15"
  },
  {
    "id": "N113_16",
    "name": "Gambas Ave B09 Bus Stop",
    "latitude": 1.44310292,
    "longitude": 103.8148348,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1601",
    "area": "NSC-N113",
    "device": "N113_16"
  },
  {
    "id": "N113_17",
    "name": "Gambas Ave Nordcom II",
    "latitude": 1.44317917,
    "longitude": 103.8138528,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1701",
    "area": "NSC-N113",
    "device": "N113_17"
  },
  {
    "id": "N113_18",
    "name": "Gambas Ave Nordcom I",
    "latitude": 1.44148206,
    "longitude": 103.8174731,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1801",
    "area": "NSC-N113",
    "device": "N113_18"
  },
  {
    "id": "N113_19",
    "name": "Woodlands Ave 12 Junction",
    "latitude": 1.44395291,
    "longitude": 103.8113415,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/1901",
    "area": "NSC-N113",
    "device": "N113_19"
  },
  {
    "id": "N113_20",
    "name": "Woodlands Ave 12 Junction",
    "latitude": 1.44436134,
    "longitude": 103.8120632,
    "rtspUrl": "rtsp://admin:echol123@tomatosg.com:65111/streaming/channels/2001",
    "area": "NSC-N113",
    "device": "N113_20"
  },
  {
    "id": "N115_03",
    "name": "C3 Gambas Ave SB Seagate",
    "latitude": 1.446122499,
    "longitude": 103.8077453,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/301",
    "area": "NSC-N115",
    "device": "N115_03"
  },
  {
    "id": "N115_04",
    "name": "C4 Gambas Ave SB Seagate Bus Stop",
    "latitude": 1.446467713,
    "longitude": 103.8070152,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/401",
    "area": "NSC-N115",
    "device": "N115_04"
  },
  {
    "id": "N115_05",
    "name": "C5 Gambas Ave CM Woodlands Rise",
    "latitude": 1.44734447,
    "longitude": 103.8053698,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/501",
    "area": "NSC-N115",
    "device": "N115_05"
  },
  {
    "id": "N115_06",
    "name": "C6 Gambas Ave NB Block 783A",
    "latitude": 1.448020798,
    "longitude": 103.8044963,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/601",
    "area": "NSC-N115",
    "device": "N115_06"
  },
  {
    "id": "N115_07",
    "name": "C7 Gamba Ave & Woodlands Ave 9 Junc NB SPPG Tunnel",
    "latitude": 1.449765363,
    "longitude": 103.8030191,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/701",
    "area": "NSC-N115",
    "device": "N115_07"
  },
  {
    "id": "N115_08",
    "name": "C8 Woodlands Ave 9 & Woodlands Ave 8 Junc SB Auto Propel",
    "latitude": 1.456171636,
    "longitude": 103.800474,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/801",
    "area": "NSC-N115",
    "device": "N115_08"
  },
  {
    "id": "N115_09",
    "name": "C9 Woodlands Ave 8 NB Building Under Construction",
    "latitude": 1.452643334,
    "longitude": 103.8016754,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/901",
    "area": "NSC-N115",
    "device": "N115_09"
  },
  {
    "id": "N115_10",
    "name": "C10 Woodlands Ave 8 SB Tong Seng Product",
    "latitude": 1.453914273,
    "longitude": 103.8014473,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1001",
    "area": "NSC-N115",
    "device": "N115_10"
  },
  {
    "id": "N115_11",
    "name": "C11 Woodlands Ave 8 SB Northtech",
    "latitude": 1.456495783,
    "longitude": 103.8003769,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1101",
    "area": "NSC-N115",
    "device": "N115_11"
  },
  {
    "id": "N115_12",
    "name": "C12 Admiralty Road West EB AMB Packaging",
    "latitude": 1.457045414,
    "longitude": 103.8009877,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1201",
    "area": "NSC-N115",
    "device": "N115_12"
  },
  {
    "id": "N115_13",
    "name": "C13 Woodlands Ave 8 & Admiralty Road West NB Northtech",
    "latitude": 1.450921617,
    "longitude": 103.8028266,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1301",
    "area": "NSC-N115",
    "device": "N115_13"
  },
  {
    "id": "N115_14",
    "name": "C14 Admiralty Road West CM Northtech",
    "latitude": 1.455864421,
    "longitude": 103.7982709,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1401",
    "area": "NSC-N115",
    "device": "N115_14"
  },
  {
    "id": "N115_15",
    "name": "C15 Admiralty Road West WB Vestal Technology",
    "latitude": 1.454268869,
    "longitude": 103.7958661,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1501",
    "area": "NSC-N115",
    "device": "N115_15"
  },
  {
    "id": "N115_16",
    "name": "C16 Admiralty Road West WB Northland Industrial Building 2",
    "latitude": 1.453291326,
    "longitude": 103.7943147,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1601",
    "area": "NSC-N115",
    "device": "N115_16"
  },
  {
    "id": "N115_17",
    "name": "C17 Admiralty Road West & North Coast Ave Junc CM",
    "latitude": 1.451948755,
    "longitude": 103.7897426,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1701",
    "area": "NSC-N115",
    "device": "N115_17"
  },
  {
    "id": "N115_18",
    "name": "C18 Admiralty Road West EB AMB Packaging Bus Stop",
    "latitude": 1.457594906,
    "longitude": 103.8020064,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1801",
    "area": "NSC-N115",
    "device": "N115_18"
  },
  {
    "id": "N115_19",
    "name": "C19 Admiralty Road West EB AMB Packaging",
    "latitude": 1.458484915,
    "longitude": 103.803509,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/1901",
    "area": "NSC-N115",
    "device": "N115_19"
  },
  {
    "id": "N115_20",
    "name": "C20 Admiralty Road West WB Toh Li Food",
    "latitude": 1.460258169,
    "longitude": 103.8055607,
    "rtspUrl": "rtsp://admin:echol123@51.79.165.171:7027/streaming/channels/2001",
    "area": "NSC-N115",
    "device": "N115_20"
  }
];