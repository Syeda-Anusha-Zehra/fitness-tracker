import React from "react";

/**
 * Circular progress ring, e.g. "357 / 2000 kcal".
 * value/max determine the fill; the ring itself uses a purple->pink gradient stroke.
 */
export default function ProgressRing({
  id,
  value,
  max,
  size = 100,
  strokeWidth = 9,
  label,
  sublabel,
  centerText,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const offset = circumference * (1 - pct);
  const gradientId = `ring-gradient-${id}`;

  return (
    <div className="progress-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c6f135" />
            <stop offset="100%" stopColor="#8fd12a" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontFamily="Anton, sans-serif"
          fontWeight="400"
          fontSize={size * 0.17}
          fill="#f2f2ec"
        >
          {centerText ?? value}
        </text>
        {sublabel && (
          <text
            x="50%"
            y="64%"
            textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontSize={size * 0.1}
            fill="#9a9a92"
          >
            {sublabel}
          </text>
        )}
      </svg>
      {label && <span className="progress-ring-label">{label}</span>}
    </div>
  );
}
