export interface JavaStatusResponse {
  online: true;
  host: string;
  port: number;
  version: string;
  players: {
    online: number;
    max: number;
    sample: Array<{ id: string; name: string }>;
  };
  motd: {
    raw: unknown;
    clean: string;
  };
  favicon: string | null;
  latency_ms: number;
  queried_at: string;
}

export interface JavaOfflineResponse {
  online: false;
  host: string;
  port: number;
  error: string;
  queried_at: string;
}

export type JavaResponse = JavaStatusResponse | JavaOfflineResponse;
