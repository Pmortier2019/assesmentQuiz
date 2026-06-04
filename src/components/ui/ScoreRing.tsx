"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  trackColor?: string;
  animate?: boolean;
}

export function ScoreRing({
  score,
  size = 96,
  strokeWidth = 8,
  label,
  sublabel,
  color = "#4f46e5",
  trackColor = "#e2e8f0",
  animate = true,
}: ScoreRingProps) {
  const ref = useRef<SVGCircleElement>(null);
  const [displayed, setDisplayed] = useState(animate ? 0 : score);
  const [started, setStarted] = useState(!animate);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  // IntersectionObserver to start animation when visible
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!animate) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  // Count-up animation
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const duration = 1200;

    function tick(now: number) {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [started, score]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            ref={ref}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-xl text-default leading-none">
            {displayed}%
          </span>
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-body text-center">{label}</p>}
      {sublabel && <p className="text-[10px] text-subtle text-center">{sublabel}</p>}
    </div>
  );
}
