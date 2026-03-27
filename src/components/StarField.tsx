"use client";
import styles from "./StarField.module.css";

const STARS = [
  { x: 5,  y: 8,  w: 2, h: 2, dur: 2.1, lo: 0.3, hi: 1.0 },
  { x: 15, y: 22, w: 1, h: 1, dur: 3.4, lo: 0.1, hi: 0.8 },
  { x: 24, y: 5,  w: 2, h: 2, dur: 2.7, lo: 0.2, hi: 0.9 },
  { x: 33, y: 38, w: 1, h: 1, dur: 4.1, lo: 0.2, hi: 0.7 },
  { x: 41, y: 14, w: 2, h: 2, dur: 2.3, lo: 0.3, hi: 1.0 },
  { x: 52, y: 28, w: 1, h: 1, dur: 3.8, lo: 0.1, hi: 0.6 },
  { x: 61, y: 9,  w: 2, h: 2, dur: 2.9, lo: 0.2, hi: 0.9 },
  { x: 70, y: 44, w: 1, h: 1, dur: 3.2, lo: 0.1, hi: 0.7 },
  { x: 78, y: 18, w: 2, h: 2, dur: 2.5, lo: 0.3, hi: 1.0 },
  { x: 88, y: 33, w: 1, h: 1, dur: 4.4, lo: 0.2, hi: 0.6 },
  { x: 93, y: 7,  w: 2, h: 2, dur: 2.2, lo: 0.2, hi: 0.9 },
  { x: 8,  y: 55, w: 1, h: 1, dur: 3.6, lo: 0.1, hi: 0.7 },
  { x: 19, y: 67, w: 2, h: 2, dur: 2.8, lo: 0.3, hi: 0.8 },
  { x: 30, y: 48, w: 1, h: 1, dur: 4.0, lo: 0.1, hi: 0.6 },
  { x: 45, y: 61, w: 2, h: 2, dur: 2.4, lo: 0.2, hi: 1.0 },
  { x: 57, y: 75, w: 1, h: 1, dur: 3.3, lo: 0.1, hi: 0.7 },
  { x: 66, y: 52, w: 2, h: 2, dur: 2.6, lo: 0.3, hi: 0.9 },
  { x: 75, y: 68, w: 1, h: 1, dur: 4.2, lo: 0.2, hi: 0.5 },
  { x: 84, y: 80, w: 2, h: 2, dur: 2.0, lo: 0.2, hi: 0.8 },
  { x: 96, y: 60, w: 1, h: 1, dur: 3.7, lo: 0.1, hi: 0.7 },
  { x: 12, y: 82, w: 2, h: 2, dur: 2.9, lo: 0.3, hi: 1.0 },
  { x: 38, y: 88, w: 1, h: 1, dur: 3.5, lo: 0.1, hi: 0.6 },
  { x: 62, y: 91, w: 2, h: 2, dur: 2.3, lo: 0.2, hi: 0.9 },
  { x: 82, y: 15, w: 1, h: 1, dur: 4.3, lo: 0.1, hi: 0.5 },
];

// Blocky clouds: [top%, duration(s), delay(s), widthPx, heightPx]
const CLOUDS = [
  { top: 8,  dur: 90,  delay: 0,   w: 96,  h: 24 },
  { top: 15, dur: 130, delay: 20,  w: 144, h: 16 },
  { top: 22, dur: 110, delay: 45,  w: 80,  h: 24 },
  { top: 30, dur: 150, delay: 70,  w: 112, h: 16 },
];

export default function StarField() {
  return (
    <div className={styles.sky} aria-hidden>
      <div className={styles.pixelGrid} />

      {/* Moon */}
      <div className={styles.moon} />

      {/* Stars */}
      <div className={styles.stars}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className={styles.star}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.w,
              height: s.h,
              "--dur": `${s.dur}s`,
              "--lo": s.lo,
              "--hi": s.hi,
              animationDelay: `${(i * 0.41) % s.dur}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Clouds */}
      <div className={styles.clouds}>
        {CLOUDS.map((c, i) => (
          <div
            key={i}
            className={styles.cloud}
            style={{
              top: `${c.top}%`,
              width: c.w,
              height: c.h,
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.fog} />
    </div>
  );
}
