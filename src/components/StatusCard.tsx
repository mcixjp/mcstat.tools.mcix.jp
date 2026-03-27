"use client";
import { useState, useMemo } from "react";
import type { JavaResponse, JavaStatusResponse } from "@/types/api";
import styles from "./StatusCard.module.css";

// ── §-color code map (Minecraft) ──────────────────────────────
const MC_COLORS: Record<string, string> = {
  "0": "#000000", "1": "#0000aa", "2": "#00aa00", "3": "#00aaaa",
  "4": "#aa0000", "5": "#aa00aa", "6": "#ffaa00", "7": "#aaaaaa",
  "8": "#555555", "9": "#5555ff", "a": "#55ff55", "b": "#55ffff",
  "c": "#ff5555", "d": "#ff55ff", "e": "#ffff55", "f": "#ffffff",
};

interface Span { text: string; color?: string; bold?: boolean; italic?: boolean; }

/** Parse Minecraft §-code string into styled spans */
function parseMotd(input: unknown): Span[] {
  let raw = "";
  if (typeof input === "string") {
    raw = input;
  } else if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    raw = flattenChat(obj);
  }

  const spans: Span[] = [];
  let current: Span = { text: "" };
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === "§" && i + 1 < raw.length) {
      if (current.text) { spans.push(current); current = { ...current, text: "" }; }
      const code = raw[i + 1].toLowerCase();
      if (MC_COLORS[code]) {
        current = { text: "", color: MC_COLORS[code] };
      } else if (code === "l") {
        current = { ...current, text: "", bold: true };
      } else if (code === "o") {
        current = { ...current, text: "", italic: true };
      } else if (code === "r") {
        current = { text: "" };
      }
      i += 2;
    } else {
      current.text += raw[i++];
    }
  }
  if (current.text) spans.push(current);
  return spans;
}

function flattenChat(obj: Record<string, unknown>): string {
  let t = typeof obj.text === "string" ? obj.text : "";
  if (Array.isArray(obj.extra)) {
    for (const part of obj.extra) {
      if (typeof part === "string") t += part;
      else if (part && typeof part === "object") t += flattenChat(part as Record<string, unknown>);
    }
  }
  return t;
}

// ── Main Component ──────────────────────────────────────────────

export default function StatusCard({ data }: { data: JavaResponse }) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const motdSpans = useMemo(() => parseMotd(data.online ? data.motd.raw : ""), [data]);

  const ts = new Date(data.queried_at).toLocaleTimeString("ja-JP");

  return (
    <div className={`mc-panel ${styles.card}`}>

      {/* ── Status bar ── */}
      <div className={`${styles.statusBar} ${data.online ? styles.online : styles.offline}`}>
        <div className={styles.dot}>
          <div className={styles.dotInner} />
        </div>
        <span className={styles.statusLabel}>
          {data.online ? "ONLINE" : "OFFLINE"}
        </span>
        <span className={styles.statusAddr}>{data.host}:{data.port}</span>
        <span className={styles.statusTime}>{ts}</span>
      </div>

      {data.online
        ? <OnlineBody data={data} motdSpans={motdSpans} jsonOpen={jsonOpen} setJsonOpen={setJsonOpen} />
        : <OfflineBody data={data} jsonOpen={jsonOpen} setJsonOpen={setJsonOpen} />
      }
    </div>
  );
}

// ── Online body ─────────────────────────────────────────────────

function OnlineBody({
  data,
  motdSpans,
  jsonOpen,
  setJsonOpen,
}: {
  data: JavaStatusResponse;
  motdSpans: Span[];
  jsonOpen: boolean;
  setJsonOpen: (v: boolean) => void;
}) {
  const pct = data.players.max > 0
    ? Math.min(1, data.players.online / data.players.max)
    : 0;

  const latClass =
    data.latency_ms < 80  ? styles.green :
    data.latency_ms < 200 ? styles.yellow : styles.red;

  const latLabel =
    data.latency_ms < 80  ? "EXCELLENT" :
    data.latency_ms < 200 ? "GOOD" : "POOR";

  return (
    <>
      {/* ── Main info area ── */}
      <div className={styles.infoArea}>

        {/* Favicon */}
        <div className={styles.faviconCol}>
          {data.favicon
            ? <img src={data.favicon} alt="Server icon" className={styles.favicon} />
            : (
              <div className={styles.faviconPlaceholder}>
                <div className={styles.placeholderBlock} />
                <span className={styles.placeholderText}>NO ICON</span>
              </div>
            )
          }
          <div className={`${styles.latBadge} ${latClass}`}>
            {data.latency_ms}ms
          </div>
          <div className={`${styles.latBadge} ${latClass}`} style={{ fontSize: 10 }}>
            {latLabel}
          </div>
        </div>

        {/* Info */}
        <div className={styles.infoCol}>
          {/* MOTD */}
          <div className={`mc-inset ${styles.motdWrap}`}>
            {motdSpans.length > 0
              ? motdSpans.map((s, i) => (
                  <span
                    key={i}
                    className={styles.motdLine}
                    style={{
                      color: s.color ?? "var(--white)",
                      fontWeight: s.bold ? "bold" : undefined,
                      fontStyle: s.italic ? "italic" : undefined,
                    }}
                  >
                    {s.text}
                  </span>
                ))
              : <span className={styles.motdLine} style={{ color: "var(--dim)" }}>
                  A Minecraft Server
                </span>
            }
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <StatBlock label="VERSION" value={data.version || "?"} className={styles.blue} />
            <StatBlock
              label="PLAYERS"
              value={`${data.players.online} / ${data.players.max}`}
              className={data.players.online > 0 ? styles.green : styles.dim}
            />
            <StatBlock label="LATENCY" value={`${data.latency_ms}ms`} className={latClass} />
          </div>
        </div>
      </div>

      {/* ── Block gauge ── */}
      <BlockGauge online={data.players.online} max={data.players.max} pct={pct} />

      {/* ── Player list ── */}
      <PlayerSection players={data.players.sample} online={data.players.online} />

      {/* ── JSON ── */}
      <JsonSection data={data} open={jsonOpen} setOpen={setJsonOpen} />
    </>
  );
}

// ── Offline body ────────────────────────────────────────────────

function OfflineBody({
  data,
  jsonOpen,
  setJsonOpen,
}: {
  data: JavaResponse & { online: false };
  jsonOpen: boolean;
  setJsonOpen: (v: boolean) => void;
}) {
  return (
    <>
      <div className={styles.offlineBody}>
        <div className={styles.faviconPlaceholder}>
          <div className={styles.placeholderBlock} style={{ background: "var(--red)", boxShadow: "inset -2px -2px 0 #880000" }} />
          <span className={styles.placeholderText}>OFFLINE</span>
        </div>
        <div className={styles.offlineText}>
          <p className={styles.offlineMsg}>Server is offline or unreachable</p>
          <p className={styles.offlineErr}>{data.error}</p>
        </div>
      </div>
      <JsonSection data={data} open={jsonOpen} setOpen={setJsonOpen} />
    </>
  );
}

// ── Block Gauge ─────────────────────────────────────────────────

function BlockGauge({ online, max, pct }: { online: number; max: number; pct: number }) {
  const TOTAL = 10;
  const filled = Math.round(pct * TOTAL);

  const blockClass = (i: number) => {
    if (i >= filled) return "";
    if (pct >= 0.9) return styles.filledHigh;
    if (pct >= 0.6) return styles.filledMed;
    return styles.filled;
  };

  return (
    <div className={styles.gaugeSection}>
      <div className={styles.gaugeHeader}>
        <span className="mc-label" style={{ margin: 0 }}>PLAYER CAPACITY</span>
        <span className={styles.gaugeCount}>
          {online} / {max} ({Math.round(pct * 100)}%)
        </span>
      </div>
      <div className={styles.gauge}>
        {Array.from({ length: TOTAL }, (_, i) => (
          <div
            key={i}
            className={`${styles.gaugeBlock} ${blockClass(i)}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Player section ──────────────────────────────────────────────

function PlayerSection({
  players,
  online,
}: {
  players: Array<{ id: string; name: string }>;
  online: number;
}) {
  return (
    <div className={styles.playerSection}>
      <span className="mc-label">▶ ONLINE PLAYERS</span>
      {players.length > 0 ? (
        <div className={styles.playerList}>
          {players.map(p => (
            <div key={p.id} className={styles.chip}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc-heads.net/avatar/${encodeURIComponent(p.name)}/20`}
                alt={p.name}
                width={20}
                height={20}
                className={styles.head}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              {p.name}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noPlayers}>
          {online > 0
            ? `${online} players online — sample hidden by server`
            : "No players currently online"}
        </p>
      )}
    </div>
  );
}

// ── Stat block ──────────────────────────────────────────────────

function StatBlock({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={styles.statBlock}>
      <span className="mc-label" style={{ marginBottom: 3 }}>{label}</span>
      <span className={`${styles.statVal} ${className ?? ""}`}>{value}</span>
    </div>
  );
}

// ── JSON toggle ─────────────────────────────────────────────────

function JsonSection({
  data,
  open,
  setOpen,
}: {
  data: JavaResponse;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className={styles.jsonSection}>
      <button className={styles.jsonToggle} onClick={() => setOpen(!open)}>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}>▶</span>
        RAW API RESPONSE
      </button>
      {open && (
        <div className={styles.jsonBody}>
          <pre className={styles.jsonPre}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
