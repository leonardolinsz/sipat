import React, { useEffect, useState, useRef } from 'react';

export default function Timer({ duration = 30, onExpire, running }) {
  const [seconds, setSeconds] = useState(duration);
  const intervalRef = useRef(null);
  const startedRef = useRef(Date.now());

  useEffect(() => {
    setSeconds(duration);
    startedRef.current = Date.now();
  }, [duration]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedRef.current) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setSeconds(remaining);
      if (remaining === 0) {
        clearInterval(intervalRef.current);
        onExpire();
      }
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [running, duration, onExpire]);

  const pct = seconds / duration;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (1 - pct);

  const color = seconds > 10 ? '#16A34A' : seconds > 5 ? '#EAB308' : '#EF4444';
  const urgent = seconds <= 5 && running;

  return (
    <div style={{ ...styles.wrap, animation: urgent ? 'timerPulse 0.6s ease infinite' : 'none' }}>
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={5} />
        <circle
          cx={36} cy={36} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.2s linear, stroke 0.3s' }}
        />
        <text x={36} y={36} textAnchor="middle" dominantBaseline="central"
          style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Inter, sans-serif', fill: color }}>
          {seconds}
        </text>
      </svg>
      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textAlign: 'center' }}>
        ⏱️ SEG
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }
};
