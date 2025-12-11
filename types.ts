
export interface WazeLocation {
  x: number; // Longitude
  y: number; // Latitude
}

export interface WazeAlert {
  uuid: string;
  type: string;
  subtype?: string;
  street?: string;
  city?: string;
  country?: string;
  location: WazeLocation;
  reportRating?: number; // 0-5
  reliability?: number; // 0-10
  confidence?: number;
  nThumbsUp?: number;
  reportDescription?: string;
  pubMillis: number;
}

// Updated to match the specific JSON sample provided (camelCase)
export interface WazeRawAlert {
  uuid: string;
  type: string;
  subtype?: string;
  street?: string;
  city?: string;
  country?: string;
  location: WazeLocation;
  reportRating?: number;
  reliability?: number;
  confidence?: number;
  nThumbsUp?: number;
  reportDescription?: string;
  reportByMunicipalityUser?: string;
  pubMillis: number;
  roadType?: number;
  magvar?: number;
}

export interface WazeTrafficJam {
  id: number | string;
  uuid: number | string;
  level: number; // 0 (Free) to 5 (Blocked/Standstill)
  line: WazeLocation[];
  speedKMH: number;
  length: number;
  delay: number;
  street?: string;
  city?: string;
  country?: string;
  roadType?: number;
  startNode?: string;
  endNode?: string;
  pubMillis: number;
}

export interface WazeFeedResponse {
  alerts: WazeRawAlert[];
  jams?: WazeTrafficJam[];
  routes?: any[]; // Support new format
  endTimeMillis: number;
  startTimeMillis: number;
}

export interface TrafficViewResponse {
  routes?: any[];
  jams?: any[];
  usersOnJams?: any[];
}

export interface TrafficRoute {
  line: {x: number, y: number}[];
  jamLevel: number;
}

export enum IncidentStatus {
  NEW = 'NEW',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export interface ManagedIncident extends WazeAlert {
  status: IncidentStatus;
  assignee?: string;
}

export type FilterCategory = 'ALL' | 'ACCIDENT' | 'JAM' | 'HAZARD' | 'CONSTRUCTION' | 'ROAD_CLOSED';
