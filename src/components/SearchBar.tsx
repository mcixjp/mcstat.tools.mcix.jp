"use client";
import { useState } from "react";
import styles from "./SearchBar.module.css";

interface Props {
  onSearch: (host: string, port: number) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: Props) {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("25565");

  const submit = () => {
    const h = host.trim();
    const p = parseInt(port) || 25565;
    if (!h) return;
    onSearch(h, p);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <div className={`mc-panel ${styles.card}`}>
      {/* Header strip */}
      <div className={styles.header}>
        <div className={styles.headerIcon} />
        <span className="mc-label" style={{ margin: 0 }}>SERVER ADDRESS</span>
      </div>

      {/* Hotbar row */}
      <div className={styles.row}>
        {/* Host slot */}
        <div className={styles.slot}>
          <span className={styles.slotLabel}>HOST / IP</span>
          <input
            className={`mc-input mc-inset ${styles.slotInput}`}
            type="text"
            placeholder="mc.example.com"
            value={host}
            onChange={e => setHost(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
          />
        </div>

        {/* Port slot */}
        <div className={`${styles.slot} ${styles.portSlot}`}>
          <span className={styles.slotLabel}>PORT</span>
          <input
            className={`mc-input mc-inset ${styles.slotInput}`}
            type="number"
            placeholder="25565"
            min={1}
            max={65535}
            value={port}
            onChange={e => setPort(e.target.value)}
            onKeyDown={onKey}
            disabled={loading}
          />
        </div>

        {/* Check button */}
        <button
          className={`mc-btn ${styles.btn} ${loading ? styles.btnLoading : ""}`}
          onClick={submit}
          disabled={loading || !host.trim()}
        >
          {loading ? "..." : "CHECK"}
        </button>
      </div>
    </div>
  );
}
