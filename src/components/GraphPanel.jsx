import React, { useEffect, useRef } from 'react';

/**
 * GraphPanel — renders f(x) as a smooth SVG polyline with
 * a highlighted "current position" dot that moves as stepIdx advances.
 *
 * Props:
 *   fn        : (x) => number   — the function to plot
 *   xMin/xMax : number          — domain
 *   yMin/yMax : number          — range (auto if omitted)
 *   goalY     : number | null   — draws a dashed horizontal goal line
 *   points    : { x, label }[]  — ordered walk points (one per sim step)
 *   activeIdx : number          — which point is currently highlighted (−1 = none)
 *   label     : string          — axis label, e.g. "f(x)"
 */
export default function GraphPanel({
  fn, xMin = -1, xMax = 6, yMin, yMax,
  goalY = null, points = [], activeIdx = -1, label = 'f(x)',
  compact = false,
}) {
  const svgRef = useRef(null);

  // ── layout constants ───────────────────────────────────────────────────────
  const PAD   = { top: 22, right: 18, bottom: 36, left: 46 };
  const W     = compact ? 240 : 340;
  const H     = compact ? 180 : 240;
  const IW    = W - PAD.left - PAD.right;
  const IH    = H - PAD.top  - PAD.bottom;

  // ── sample the curve ───────────────────────────────────────────────────────
  const SAMPLES = 220;
  const xs = Array.from({ length: SAMPLES }, (_, i) => xMin + (i / (SAMPLES - 1)) * (xMax - xMin));
  const ys = xs.map(fn);

  const autoYMin = Math.min(...ys) * 1.1;
  const autoYMax = Math.max(...ys) * 1.1 + 1;
  const domainYMin = yMin ?? autoYMin;
  const domainYMax = yMax ?? autoYMax;

  // ── coordinate helpers ─────────────────────────────────────────────────────
  const cx = (x) => PAD.left + ((x - xMin) / (xMax - xMin)) * IW;
  const cy = (y) => PAD.top  + (1 - (y - domainYMin) / (domainYMax - domainYMin)) * IH;

  // ── polyline path ──────────────────────────────────────────────────────────
  const pathData = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${cx(x).toFixed(1)},${cy(ys[i]).toFixed(1)}`).join(' ');

  // ── axis ticks ─────────────────────────────────────────────────────────────
  const xTicks = [];
  for (let x = Math.ceil(xMin); x <= xMax; x++) {
    xTicks.push(x);
  }
  const ySpan = domainYMax - domainYMin;
  const rawStep = ySpan / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(rawStep))));
  const niceStep = Math.ceil(rawStep / magnitude) * magnitude;
  const yStart = Math.ceil(domainYMin / niceStep) * niceStep;
  const yTicks = [];
  for (let y = yStart; y <= domainYMax + 0.01; y += niceStep) {
    yTicks.push(Math.round(y * 100) / 100);
  }

  // ── active point ───────────────────────────────────────────────────────────
  const activePt = activeIdx >= 0 && activeIdx < points.length ? points[activeIdx] : null;

  return (
    <div style={{
      background: '#f3f2ee',
      border: '2px solid',
      borderColor: '#aca899 #fff #fff #aca899',
      borderRadius: 0,
      padding: '6px 6px 2px',
      userSelect: 'none',
      fontFamily: 'Tahoma, Arial, sans-serif',
      boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.9)',
    }}>
      {/* Title bar */}
      <div style={{
        background: 'linear-gradient(180deg, #1a6bd8 0%, #0050c0 45%, #0050c0 55%, #1462cc 100%)',
        color: '#fff',
        fontSize: 11, fontWeight: 700,
        padding: '2px 6px', marginBottom: 6,
        letterSpacing: 0.5,
        textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}>
        Graph — {label}
      </div>

      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ display: 'block', maxWidth: '100%' }}>

        {/* Background */}
        <rect x={PAD.left} y={PAD.top} width={IW} height={IH}
          fill="#fff" stroke="#ccc" strokeWidth={1} />

        {/* Goal line */}
        {goalY !== null && goalY >= domainYMin && goalY <= domainYMax && (
          <>
            <line
              x1={PAD.left} y1={cy(goalY)}
              x2={PAD.left + IW} y2={cy(goalY)}
              stroke="#16a34a" strokeWidth={1.5} strokeDasharray="5,3" />
            <text x={PAD.left + IW + 2} y={cy(goalY) + 4}
              fontSize={9} fill="#16a34a" fontWeight={700}>goal</text>
          </>
        )}

        {/* Grid lines */}
        {yTicks.map(y => (
          <line key={`yg${y}`}
            x1={PAD.left} y1={cy(y)}
            x2={PAD.left + IW} y2={cy(y)}
            stroke="#e5e7eb" strokeWidth={0.8} />
        ))}
        {xTicks.map(x => (
          <line key={`xg${x}`}
            x1={cx(x)} y1={PAD.top}
            x2={cx(x)} y2={PAD.top + IH}
            stroke="#e5e7eb" strokeWidth={0.8} />
        ))}

        {/* Y axis */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + IH}
          stroke="#555" strokeWidth={1.5} />
        {/* X axis at y=0 if in range, else at bottom */}
        {(() => {
          const y0 = 0 >= domainYMin && 0 <= domainYMax ? cy(0) : PAD.top + IH;
          return <line x1={PAD.left} y1={y0} x2={PAD.left + IW} y2={y0}
            stroke="#555" strokeWidth={1.5} />;
        })()}

        {/* Y ticks + labels */}
        {yTicks.map(y => (
          <g key={`yt${y}`}>
            <line x1={PAD.left - 4} y1={cy(y)} x2={PAD.left} y2={cy(y)}
              stroke="#555" strokeWidth={1} />
            <text x={PAD.left - 6} y={cy(y) + 4}
              fontSize={9} fill="#333" textAnchor="end">{y}</text>
          </g>
        ))}

        {/* X ticks + labels */}
        {xTicks.map(x => {
          const y0 = 0 >= domainYMin && 0 <= domainYMax ? cy(0) : PAD.top + IH;
          return (
            <g key={`xt${x}`}>
              <line x1={cx(x)} y1={y0} x2={cx(x)} y2={y0 + 4}
                stroke="#555" strokeWidth={1} />
              <text x={cx(x)} y={y0 + 14}
                fontSize={9} fill="#333" textAnchor="middle">{x}</text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={PAD.left + IW / 2} y={H - 2}
          fontSize={10} fill="#555" textAnchor="middle" fontWeight={700}>x</text>
        <text x={10} y={PAD.top + IH / 2}
          fontSize={10} fill="#555" textAnchor="middle" fontWeight={700}
          transform={`rotate(-90, 10, ${PAD.top + IH / 2})`}>{label}</text>

        {/* Function curve */}
        <path d={pathData} fill="none" stroke="#1d4ed8" strokeWidth={2.5}
          strokeLinejoin="round" strokeLinecap="round" />

        {/* Previous step dots (trail) */}
        {points.slice(0, activeIdx).map((pt, i) => (
          <circle key={`trail${i}`}
            cx={cx(pt.x)} cy={cy(fn(pt.x))}
            r={4} fill="#93c5fd" stroke="#1d4ed8" strokeWidth={1}
            opacity={0.6} />
        ))}

        {/* Active dot */}
        {activePt && (
          <>
            {/* Dashed drop lines */}
            <line x1={cx(activePt.x)} y1={cy(fn(activePt.x))}
              x2={cx(activePt.x)} y2={PAD.top + IH}
              stroke="#dc2626" strokeWidth={1} strokeDasharray="3,2" />
            <line x1={PAD.left} y1={cy(fn(activePt.x))}
              x2={cx(activePt.x)} y2={cy(fn(activePt.x))}
              stroke="#dc2626" strokeWidth={1} strokeDasharray="3,2" />

            {/* Outer glow ring */}
            <circle cx={cx(activePt.x)} cy={cy(fn(activePt.x))}
              r={9} fill="none" stroke="#fbbf24" strokeWidth={2} opacity={0.6} />
            {/* Main dot */}
            <circle cx={cx(activePt.x)} cy={cy(fn(activePt.x))}
              r={6} fill="#dc2626" stroke="#7f1d1d" strokeWidth={1.5} />

            {/* Label */}
            <text x={cx(activePt.x) + 8} y={cy(fn(activePt.x)) - 8}
              fontSize={10} fill="#111" fontWeight={800}
              fontFamily="Courier New, monospace">
              {activePt.label}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
