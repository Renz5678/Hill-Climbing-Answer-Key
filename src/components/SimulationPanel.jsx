import React, { useState, useEffect, useRef } from 'react';

const TYPE_CONFIG = {
  move:   { accent: '#166534', bg: '#dcfce7', border: '#16a34a', badge: '✓ MOVE',  badgeBg: '#16a34a' },
  reject: { accent: '#92400e', bg: '#fef9c3', border: '#ca8a04', badge: '✗ STAY',  badgeBg: '#ca8a04' },
  stop:   { accent: '#991b1b', bg: '#fee2e2', border: '#dc2626', badge: '■ STOP',  badgeBg: '#dc2626' },
  goal:   { accent: '#1e40af', bg: '#dbeafe', border: '#2563eb', badge: '★ GOAL',  badgeBg: '#1d4ed8' },
};

export default function SimulationPanel({ steps, result, rule }) {
  const [revealed, setRevealed] = useState(0);
  const endRef = useRef(null);

  useEffect(() => { setRevealed(0); }, [steps]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [revealed]);

  const atEnd = revealed === steps.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>

      {/* ── Rule ── */}
      {rule && (
        <div style={{
          background: '#fffbeb',
          borderBottom: '2px solid #d97706',
          padding: '7px 16px',
          fontSize: 'clamp(12px, 1.25vw, 17px)',
          fontWeight: 700,
          lineHeight: 1.45,
          flexShrink: 0,
          fontFamily: 'Tahoma, Arial, sans-serif',
          color: '#78350f',
        }}>
          <span style={{ color: '#b45309', fontWeight: 800 }}>Rule: </span>{rule}
        </div>
      )}

      {/* ── Controls row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        padding: '6px 12px',
        background: '#f4f4f4',
        borderBottom: '1px solid #ddd',
      }}>
        <span style={{
          fontSize: 'clamp(13px, 1.35vw, 18px)',
          fontWeight: 700,
          color: '#444',
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
            <button key={label} onClick={fn} disabled={dis} style={{
              fontSize: 'clamp(12px, 1.2vw, 16px)',
              fontWeight: 700,
              padding: '5px 14px',
              cursor: dis ? 'default' : 'pointer',
              background: dis ? '#e0e0e0' : (label.startsWith('▶ Next') ? '#000080' : '#fff'),
              color: dis ? '#999' : (label.startsWith('▶ Next') ? '#fff' : '#222'),
              border: '1px solid #bbb',
              fontFamily: 'Tahoma, Arial, sans-serif',
              transition: 'background 0.1s',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step log ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 14px',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>

        {/* Empty state */}
        {revealed === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#888',
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.5vw, 20px)',
            fontWeight: 600,
            fontFamily: 'Tahoma, Arial, sans-serif',
          }}>
            Press <strong style={{ margin: '0 6px', color: '#000080' }}>▶ Next Step</strong> to begin the simulation…
          </div>
        )}

        {/* Steps */}
        {steps.slice(0, revealed).map((s, i) => {
          const active = i === revealed - 1;
          const c = TYPE_CONFIG[s.type] || TYPE_CONFIG.stop;
          return (
            <div key={i} style={{
              border: `2px solid ${active ? c.border : '#d5d5d5'}`,
              borderRadius: 6,
              overflow: 'hidden',
              opacity: active ? 1 : 0.55,
              flexShrink: 0,
              transition: 'opacity 0.2s',
              boxShadow: active ? `0 2px 12px ${c.border}33` : 'none',
            }}>

              {/* Step header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: active ? c.accent : '#e0e0e0',
                padding: '8px 16px',
              }}>
                <span style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: 'clamp(15px, 1.6vw, 22px)',
                  fontWeight: 900,
                  color: active ? '#fff' : '#444',
                  letterSpacing: '0.5px',
                }}>
                  STEP {i + 1} &nbsp;|&nbsp; {s.state}
                </span>
                {active && (
                  <span style={{
                    background: 'rgba(255,255,255,0.20)',
                    color: '#fff',
                    padding: '3px 14px',
                    fontSize: 'clamp(12px, 1.2vw, 16px)',
                    fontWeight: 800,
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: 4,
                    letterSpacing: '0.8px',
                  }}>
                    {c.badge}
                  </span>
                )}
              </div>

              {/* Checks */}
              <div style={{
                padding: '10px 18px',
                fontFamily: 'Courier New, monospace',
                fontSize: 'clamp(14px, 1.5vw, 21px)',
                fontWeight: 700,
                lineHeight: 1.9,
                background: active ? c.bg : '#f5f5f5',
                color: active ? '#1a1a1a' : '#666',
              }}>
                {s.checks.map((line, li) => <div key={li}>{line}</div>)}
              </div>

              {/* Decision */}
              <div style={{
                padding: '8px 18px',
                borderTop: `2px solid ${active ? c.border : '#e0e0e0'}`,
                fontFamily: 'Courier New, monospace',
                fontWeight: 900,
                fontSize: 'clamp(14px, 1.55vw, 22px)',
                background: active ? c.bg : '#ebebeb',
                color: active ? c.accent : '#777',
              }}>
                {s.decision}
              </div>
            </div>
          );
        })}

        {/* Result */}
        {atEnd && result && (
          <div style={{
            border: `3px solid ${result.reached ? '#1d4ed8' : '#dc2626'}`,
            background: result.reached ? '#dbeafe' : '#fee2e2',
            borderRadius: 6,
            padding: '16px 20px',
            flexShrink: 0,
          }}>
            <div style={{
              fontWeight: 900,
              fontSize: 'clamp(15px, 1.6vw, 22px)',
              color: result.reached ? '#1d4ed8' : '#dc2626',
              marginBottom: 6,
              letterSpacing: '0.5px',
              fontFamily: 'Tahoma, Arial, sans-serif',
            }}>
              {result.reached ? '★  GOAL REACHED' : '■  ALGORITHM TERMINATED'}
            </div>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 'clamp(16px, 1.8vw, 28px)',
              fontWeight: 900,
              color: '#111',
              marginBottom: 6,
            }}>
              {result.text}
            </div>
            <div style={{
              fontSize: 'clamp(13px, 1.3vw, 18px)',
              fontWeight: 700,
              color: '#333',
              fontFamily: 'Tahoma, Arial, sans-serif',
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
