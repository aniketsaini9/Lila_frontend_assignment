import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const BASE_URL =
  configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : "https://python-backend-lila.onrender.com/lila-black";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});

export interface MapApiItem {
  map_id: string;
  dates: string[];
  total_matches: number;
  minimap_url: string;
}

export interface MatchApiItem {
  match_id: string;
  map_id: string;
  date: string;
  human_count: number;
  bot_count: number;
  total_events: number;
  duration_ms: number;
}

export type BackendEventName =
  | "Position"
  | "Kill"
  | "Loot"
  | "Killed"
  | "BotKill"
  | "BotPosition"
  | "KilledByStorm";

export interface BackendEvent {
  user_id: string;
  match_id: string;
  map_id: string;
  event: BackendEventName | string;
  is_bot: boolean;
  pixel_x: number;
  pixel_y: number;
  ts_ms: number;
  date: string;
}

export interface SummaryResponse {
  total_players?: number;
  event_distribution?: Record<string, number>;
  insights?: string[];
  [key: string]: unknown;
}

export const wakeUpServer = async (): Promise<void> => {
  const maxAttempts = 10;
  const retryDelay  = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await api.get("/", { timeout: 5000 });
      return;
    } catch {
      if (attempt === maxAttempts) throw new Error("Server did not wake up in time");
      await new Promise((r) => setTimeout(r, retryDelay));
    }
  }
};

export const getEvents = async (params: {
  map_id?: string;
  date?: string;
  match_id?: string;
  event_type?: string;
  limit?: number;
} = {}): Promise<BackendEvent[]> => {
  const res = await api.get("/api/events", { params });
  return Array.isArray(res.data) ? res.data : [];
};

export const getMaps = async (): Promise<MapApiItem[]> => {
  const res = await api.get("/api/maps");
  return Array.isArray(res.data) ? res.data : [];
};

export const getMatches = async (params: {
  map_id?: string;
  date?: string;
} = {}): Promise<MatchApiItem[]> => {
  const res = await api.get("/api/matches", { params });
  return Array.isArray(res.data) ? res.data : [];
};

export const getSummary = async (): Promise<SummaryResponse> => {
  const res = await api.get("/api/summary");
  return res.data ?? {};
};

export const getHeatmap = async (params: {
  map_id?: string;
  event_type?: string;
} = {}): Promise<BackendEvent[]> => {
  const res = await api.get("/api/heatmap", { params });
  return Array.isArray(res.data) ? res.data : [];
};

export default api;
