import type { JavaResponse } from "@/types/api";

const API_BASE = "https://api.mcstat.tools.mcix.jp";

export async function fetchServerStatus(
  host: string,
  port: number
): Promise<JavaResponse> {
  const url = `${API_BASE}/api/java/${encodeURIComponent(host)}/${port}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<JavaResponse>;
}
