import { useMemo, useEffect, useState } from 'react';

/**
 * BackgroundLayer — Deep Ocean ambient background.
 *
 * Renders once behind the entire app (position:fixed, z-index:-1).
 * Layers (back → front):
 *   1. Deep vertical gradient base
 *   2. Slowly drifting radial-gradient mesh blobs
 *   3. Faint diagonal caustic light ray
 *   4. Pure-CSS rising bubbles
 *   5. Subtle edge vignette
 *
 * Props:
 *   variant = "default" | "hero" | "calm"
 *     - "hero":  more bubbles, bigger blobs (for Landing page)
 *     - "calm":  fewer & dimmer bubbles (for immersive interview sessions)
 *     - "default": standard (dashboard pages)
 */

/* ── Seeded pseudo-random for deterministic bubble positions ── */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function BackgroundLayer({ variant = 'default' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLowEnd, setIsLowEnd] = useState(false);

  /* ── Pause animations when tab is hidden ── */
  useEffect(() => {
    const handler = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  /* ── Detect low-end device ── */
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4) {
      const mq = window.matchMedia('(max-width: 768px)');
      if (mq.matches) setIsLowEnd(true);
    }
  }, []);

  /* ── Determine bubble count by variant and screen ── */
  const bubbleConfig = useMemo(() => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    const counts = { hero: isDesktop ? 18 : 9, calm: isDesktop ? 6 : 3, default: isDesktop ? 14 : 7 };
    return counts[variant] || counts.default;
  }, [variant]);

  /* ── Generate deterministic bubble data ── */
  const bubbles = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: bubbleConfig }, (_, i) => {
      const size = 8 + rand() * 82;        // 8–90px
      const left = rand() * 100;            // 0–100%
      const duration = 14 + rand() * 24;    // 14–38s
      const delay = -(rand() * duration);   // negative = mid-flight on load
      const opacity = 0.15 + rand() * 0.30; // 0.15–0.45
      const swayDur = 6 + rand() * 8;       // 6–14s sway cycle
      return { size, left, duration, delay, opacity, swayDur, id: i };
    });
  }, [bubbleConfig]);

  const playState = isVisible ? 'running' : 'paused';

  /* ── Low-end devices: static gradient only ── */
  if (isLowEnd) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, #030912 0%, #071626 100%)',
        }}
      />
    );
  }

  const meshOpacity = variant === 'hero' ? 0.20 : variant === 'calm' ? 0.10 : 0.15;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Layer 1: Base gradient ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #030912 0%, #040B16 40%, #071626 100%)',
      }} />

      {/* ── Layer 2: Mesh blobs ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          animationPlayState: playState,
        }}
      >
        {/* Blob 1 — aqua, top-right */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '60vw', height: '60vw', maxWidth: '700px', maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          opacity: meshOpacity,
          animation: `mesh-drift-1 55s ease-in-out infinite`,
          animationPlayState: playState,
          willChange: 'transform',
        }} />
        {/* Blob 2 — blue, center-left */}
        <div style={{
          position: 'absolute', top: '30%', left: '-10%',
          width: '50vw', height: '50vw', maxWidth: '600px', maxHeight: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          opacity: meshOpacity,
          animation: `mesh-drift-2 65s ease-in-out infinite`,
          animationPlayState: playState,
          willChange: 'transform',
        }} />
        {/* Blob 3 — emerald, bottom-right */}
        <div style={{
          position: 'absolute', bottom: '-15%', right: '10%',
          width: '45vw', height: '45vw', maxWidth: '550px', maxHeight: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          opacity: meshOpacity,
          animation: `mesh-drift-3 48s ease-in-out infinite`,
          animationPlayState: playState,
          willChange: 'transform',
        }} />
        {variant === 'hero' && (
          /* Blob 4 — extra aqua for hero, top-left */
          <div style={{
            position: 'absolute', top: '5%', left: '15%',
            width: '40vw', height: '40vw', maxWidth: '500px', maxHeight: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)',
            opacity: meshOpacity,
            animation: `mesh-drift-1 70s ease-in-out infinite reverse`,
            animationPlayState: playState,
            willChange: 'transform',
          }} />
        )}
      </div>

      {/* ── Layer 3: Caustic light ray ── */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '120%', height: '60%',
        background: 'linear-gradient(135deg, rgba(103,232,249,0.06) 0%, transparent 40%, transparent 100%)',
        opacity: 0.07,
        animation: `caustic-drift 40s ease-in-out infinite`,
        animationPlayState: playState,
        willChange: 'transform',
      }} />

      {/* ── Layer 4: Bubbles ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {bubbles.map(b => (
          <span
            key={b.id}
            style={{
              position: 'absolute',
              bottom: '-10%',
              left: `${b.left}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 70%, rgba(103,232,249,0.15) 100%)`,
              border: '1px solid rgba(103,232,249,0.12)',
              boxShadow: `inset 0 0 ${b.size * 0.2}px rgba(103,232,249,0.08)`,
              opacity: 0,
              animation: `bubble-rise ${b.duration}s linear infinite, bubble-sway ${b.swayDur}s ease-in-out infinite`,
              animationDelay: `${b.delay}s, ${b.delay * 0.7}s`,
              animationPlayState: playState,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ── Layer 5: Vignette ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(3,9,18,0.5) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
