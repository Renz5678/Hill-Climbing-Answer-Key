import React, { useState, useEffect, useRef } from 'react';

const COLORS = {
  move:   { accent: '#1a7f37', bg: '#dafbe1', badge: '✓ MOVE',   badgeBg: '#1a7f37' },
  reject: { accent: '#9a6700', bg: '#fff8c5', badge: '✗ STAY',   badgeBg: '#9a6700' },
  stop:   { accent: '#b91c1c', bg: '#fee2e2', badge: '■ STOP',   badgeBg: '#b91c1c' },
  goal:   { accent: '#1d4ed8', bg: '#dbeafe', badge: '★ GOAL',   badgeBg: '#1d4ed8' },
};

export default function SimulationPanel({ steps, result, rule }) {
  const [revealed, setRevealed] = useState(0);
  const endRef = useRef(null);

  useEffect(() => { setRevealed(0); }, [steps]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [revealed]);

  const atEnd = revealed === steps.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>

      {/* rule */}
      {rule && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #d97706',
          borderLeft: '5px solid #d97706',
          padding: '8px 14px',
          fontSize: 'clamp(13px, 1.35vw, 20px)',
          fontWeight: 700,
          lineHeight: 1.5,
          flexShrink: 0,
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          <span style={{ color: '#92400e' }}>Rule: </span>{rule}
        </div>
      )}

      {/* controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        padding: '2px 0',
      }}>
        <span style={{
          fontSize: 'clamp(13px, 1.4vw, 20px)',
          fontWeight: 700,
          color: '#333',
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          Step {Math.min(revealed, steps.length)} / {steps.length}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: '↺ Reset',      fn: () => setRevealed(0),              dis: revealed === 0 },
            { label: '◀',            fn: () => setRevealed(r => r - 1),     dis: revealed === 0 },
            { label: '▶ Next Step',  fn: () => setRevealed(r => r + 1),     dis: atEnd },
            { label: '▶▶ All',       fn: () => setRevealed(steps.length),   dis: atEnd },
          ].map(({ label, fn, dis }) => (
            <button key={label} className="btn-win"
              onClick={fn} disabled={dis}
              style={{
                fontSize: 'clamp(12px, 1.3vw, 18px)',
                fontWeight: 700,
                padding: '5px 16px',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* log */}
      <div className="panel-inset" style={{
        flex: 1,
        overflowY: 'auto',
        padding: 10,
        background: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {revealed === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.5vw, 22px)',
            fontWeight: 600,
            fontFamily: 'Tahoma, Arial, sans-serif',
          }}>
            Press <strong style={{ margin: '0 6px' }}>▶ Next Step</strong> to begin the simulation…
          </div>
        )}

        {steps.slice(0, revealed).map((s, i) => {
          const active = i === revealed - 1;
          const c = COLORS[s.type] || COLORS.stop;
          return (
            <div key={i} style={{
              border: `2px solid ${active ? c.accent : '#d0d0d0'}`,
              borderRadius: 3,
              overflow: 'hidden',
              opacity: active ? 1 : 0.58,
              flexShrink: 0,
              transition: 'opacity 0.15s',
            }}>
              {/* header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: active ? c.accent : '#d4d0c8',
                padding: '6px 12px',
              }}>
                <span style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: 'clamp(13px, 1.4vw, 20px)',
                  fontWeight: 800,
                  color: active ? '#fff' : '#333',
                }}>
                  STEP {i + 1}  |  {s.state}
                </span>
                {active && (
                  <span style={{
                    background: c.badgeBg,
                    color: '#fff',
                    padding: '3px 12px',
                    fontSize: 'clamp(12px, 1.3vw, 18px)',
                    fontWeight: 800,
                    border: '1px solid rgba(0,0,0,0.2)',
                    borderRadius: 2,
                    letterSpacing: '0.5px',
                  }}>
                    {c.badge}
                  </span>
                )}
              </div>

              {/* checks */}
              <div style={{
                padding: '8px 14px',
                fontFamily: 'Courier New, monospace',
                fontSize: 'clamp(12px, 1.3vw, 19px)',
                fontWeight: 700,
                lineHeight: 2.0,
                background: active ? c.bg : '#f5f5f5',
                color: active ? '#1a1a1a' : '#666',
              }}>
                {s.checks.map((line, li) => <div key={li}>{line}</div>)}
              </div>

              {/* decision */}
              <div style={{
                padding: '6px 14px',
                borderTop: `1px solid ${active ? c.accent : '#ccc'}`,
                fontFamily: 'Courier New, monospace',
                fontWeight: 800,
                fontSize: 'clamp(13px, 1.4vw, 20px)',
                background: active ? c.bg : '#ebebeb',
                color: active ? c.accent : '#666',
              }}>
                {s.decision}
              </div>
            </div>
          );
        })}

        {/* result */}
        {atEnd && result && (
          <div style={{
            border: `2px solid ${result.reached ? '#1d4ed8' : '#b91c1c'}`,
            background: result.reached ? '#dbeafe' : '#fee2e2',
            borderRadius: 3,
            padding: '14px 18px',
            flexShrink: 0,
          }}>
            <div style={{
              fontWeight: 800,
              fontSize: 'clamp(14px, 1.5vw, 22px)',
              color: result.reached ? '#1d4ed8' : '#b91c1c',
              marginBottom: 5,
              letterSpacing: '0.3px',
            }}>
              {result.reached ? '★  GOAL REACHED' : '■  ALGORITHM TERMINATED'}
            </div>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 'clamp(15px, 1.7vw, 26px)',
              fontWeight: 800,
              color: '#111',
              marginBottom: 4,
            }}>
              {result.text}
            </div>
            <div style={{
              fontSize: 'clamp(13px, 1.35vw, 20px)',
              fontWeight: 700,
              color: '#333',
            }}>
              {result.note}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
