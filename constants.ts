
import { FilterCategory } from './types';
import { TriangleAlert, Car, Construction, Ban, AlertCircle, Zap } from 'lucide-react';

export const WAZE_FEED_URL = "https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/b9eb1444-6cef-4cbd-b681-2937ad70dc9c?format=1";

export const FEED_SOURCES = [
  {
    id: 'west',
    name: 'West Area',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/b9eb1444-6cef-4cbd-b681-2937ad70dc9c?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=18552697387'
  },
  {
    id: 'thomson',
    name: 'Thomson Road',
    url: 'https://www.waze.com/row-partnerhub-api/partners/18727209890/waze-feeds/e0c6ef0a-aae0-4e8f-986b-65fb02a5e5a9?format=1',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1764829291980'
  },
  {
    id: 'custom',
    name: 'Custom URL',
    url: '',
    tvtUrl: 'https://www.waze.com/row-partnerhub-api/feeds-tvt/?id=1724377558927'
  },
  {
    id: 'lta',
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
  JAM: { label: 'Traffic Jam', color: 'text-orange-500', icon: Car, bg: 'bg-orange-50', hex: '#f97316' },
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
  'JAM_MODERATE_TRAFFIC': 'Moderate Traffic',
  'JAM_HEAVY_TRAFFIC': 'Heavy Traffic',
  'JAM_STAND_STILL_TRAFFIC': 'Standstill Traffic',
  'JAM_LIGHT_TRAFFIC': 'Light Traffic',
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
  { id: 'JAM', label: 'Jams' },
  { id: 'HAZARD', label: 'Hazards' },
  { id: 'CONSTRUCTION', label: 'Roadworks' },
  { id: 'ROAD_CLOSED', label: 'Closures' },
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
    uuid: "demo-2",
    type: "JAM",
    subtype: "JAM_HEAVY_TRAFFIC",
    street: "101 S",
    city: "San Jose",
    country: "US",
    location: { x: -121.88, y: 37.33 },
    reportRating: 3,
    reliability: 6,
    nThumbsUp: 1,
    pubMillis: Date.now() - 1000 * 60 * 45
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
