"use client";
import { useState } from "react";
import StarField from "@/components/StarField";
import SearchBar from "@/components/SearchBar";
import StatusCard from "@/components/StatusCard";
import { fetchServerStatus } from "@/lib/api";
import type { JavaResponse } from "@/types/api";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<JavaResponse | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const handleSearch = async (host: string, port: number) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await fetchServerStatus(host, port);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StarField />
      <main className={styles.main}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.blockWrap} aria-hidden>
            {[0, 1, 2].map(i => (
              <div key={i} className={styles.grassBlock}>
                <div className={styles.blockTop} />
                <div className={styles.blockBottom} />
              </div>
            ))}
          </div>
          <h1 className={styles.title}>
            MC SERVER<br />
            <span className={styles.accent}>STATUS</span>
          </h1>
          <p className={styles.subtitle}>// Java Edition Monitor</p>
        </header>

        {/* ── Search ── */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* ── Loading ── */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.creeper}>
              <div className={styles.creeperFace} />
            </div>
            <div className={styles.loadingText}>
              PINGING
              <span className={styles.loadingDots}>
                <span>.</span><span>.</span><span>.</span>
              </span>
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {result && !loading && <StatusCard data={result} />}

        {/* ── Error ── */}
        {error && !loading && (
          <div className={`mc-panel ${styles.errorCard}`}>
            <div className={styles.errorIcon}>☠</div>
            <p className={styles.errorTitle}>✕ CONNECTION FAILED</p>
            <p className={styles.errorMsg}>{error}</p>
          </div>
        )}

        {/* ── Terrain divider ── */}
        <div className={styles.terrain} aria-hidden>
          <div className={styles.terrainGrass} />
          <div className={styles.terrainDirt} />
          <div className={styles.terrainStone} />
        </div>

        <footer className={styles.footer}>
          MC SERVER STATUS MONITOR · JAVA EDITION<br />
          POWERED BY CLOUDFLARE WORKERS · mcix.jp
        </footer>
      </main>
    </>
  );
}
