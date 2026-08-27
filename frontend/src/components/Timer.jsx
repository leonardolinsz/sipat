import React, { useEffect, useRef, useState } from 'react';

export default function Timer({ duration = 30, onExpire, running }) {
  const [seconds, setSeconds] = useState(duration);
  const intervalRef = useRef(null);
  const startedRef = useRef(Date.now());
  useEffect(() => { setSeconds(duration); startedRef.current = Date.now(); }, [duration]);
  useEffect(() => {
    if (!running) return () => clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, duration - Math.floor((Date.now() - startedRef.current) / 1000));
      setSeconds(remaining);
      if (!remaining) { clearInterval(intervalRef.current); onExpire(); }
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [duration, onExpire, running]);
  const color = seconds > 10 ? '#169b62' : seconds > 5 ? '#d58a00' : '#d14343';
  const radius = 28, circumference = 2 * Math.PI * radius;
  return <div className="timer" style={{ color }} aria-label={`${seconds} segundos restantes`}>
    <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden="true">
      <circle cx="34" cy="34" r={radius} fill="none" stroke="#dbe7d5" strokeWidth="5" />
      <circle cx="34" cy="34" r={radius} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - seconds / duration)} transform="rotate(-90 34 34)" />
      <text x="34" y="34" textAnchor="middle" dominantBaseline="central" fill="currentColor">{seconds}</text>
    </svg><span>SEGUNDOS</span>
  </div>;
}
