import React, { useState, useEffect, useRef } from 'react';

const TYPE_CONFIG = {
  move:   { accent: '#166534', bg: '#dcfce7', border: '#16a34a', badge: '✓ MOVE' },
  reject: { accent: '#92400e', bg: '#fef9c3', border: '#ca8a04', badge: '✗ STAY' },
  stop:   { accent: '#991b1b', bg: '#fee2e2', border: '#dc2626', badge: '■ STOP' },
  goal:   { accent: '#1e40af', bg: '#dbeafe', border: '#2563eb', badge: '★ GOAL' },
};

// Build a flat cursor map:
//   stateAt    = cursor value that reveals the state header
//   checksAt[] = cursor value that reveals each individual check line
//   decisionAt = cursor value that reveals the decision
function buildMap(steps) {
  const map = [];
  let c = 0;
  for (const s of steps) {
    const stateAt    = ++c;
    const checksAt   = s.checks.map(() => ++c);
    const decisionAt = ++c;
    map.push({ stateAt, checksAt, decisionAt });
  }
  return { map, total: c };
}

// What phase is the CURRENT cursor displaying?
function currentPhase(cursor, map) {
  for (let i = map.length - 1; i >= 0; i--) {
    const { stateAt, checksAt, decisionAt } = map[i];
    if (cursor < stateAt) continue;
    if (cursor >= decisionAt) return { stepIdx: i, type: 'decision' };
    for (let k = checksAt.length - 1; k >= 0; k--) {
      if (cursor >= checksAt[k])
        return { stepIdx: i, type: 'check', checkIdx: k, total: checksAt.length };
    }
    return { stepIdx: i, type: 'state' };
  }
  return null;
}

// Label for the primary button = what will cursor+1 reveal?
function nextLabel(nextCursor, map, atEnd) {
  if (atEnd) return '▶ Show State';
  for (const { stateAt, checksAt, decisionAt } of map) {
    if (nextCursor === stateAt)    return '▶ Show State';
    if (nextCursor === decisionAt) return '▶ Evaluate';
    for (let k = 0; k < checksAt.length; k++) {
      if (nextCursor === checksAt[k])
        return k === 0
          ? '▶ Apply Operator'
          : `▶ Next Check (${k + 1}/${checksAt.length})`;
    }
  }
  return '▶ Next';
}

export default function SimulationPanel({ steps, result, rule }) {
  const [cursor, setCursor] = useState(0);
  const endRef = useRef(null);

  const { map, total: maxCursor } = React.useMemo(() => buildMap(steps), [steps]);

  useEffect(() => { setCursor(0); }, [steps]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [cursor]);

  const atEnd   = cursor >= maxCursor;
  const phase   = currentPhase(cursor, map);
  const activeIdx = phase?.stepIdx ?? -1;
  const btnLabel  = nextLabel(cursor + 1, map, atEnd);

  // Phase pill label
  const phasePill = !phase ? null
    : phase.type === 'state'    ? '📍 State'
    : phase.type === 'decision' ? '✅ Decision'
    : `⚙️ Check ${phase.checkIdx + 1} / ${phase.total}`;

  const btn = (label, onClick, disabled, primary = false) => (
    <button key={label} onClick={onClick} disabled={disabled} style={{
      fontSize: 'clamp(12px, 1.2vw, 16px)', fontWeight: 800,
      padding: '5px 14px', cursor: disabled ? 'default' : 'pointer',
      background: disabled ? '#e0e0e0' : primary ? '#000080' : '#fff',
      color: disabled ? '#999' : primary ? '#fff' : '#222',
      border: `1px solid ${disabled ? '#ccc' : primary ? '#000080' : '#bbb'}`,
      fontFamily: 'Tahoma, Arial, sans-serif', borderRadius: 3,
    }}>{label}</button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Rule */}
      {rule && (
        <div style={{
          background: '#fffbeb', borderBottom: '2px solid #d97706',
          padding: '7px 16px', fontSize: 'clamp(12px, 1.25vw, 17px)',
          fontWeight: 700, flexShrink: 0, fontFamily: 'Tahoma, Arial, sans-serif', color: '#78350f',
        }}>
          <span style={{ color: '#b45309', fontWeight: 800 }}>Rule: </span>{rule}
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px', background: '#f4f4f4', borderBottom: '1px solid #ddd',
        flexShrink: 0, gap: 12,
      }}>
        {/* Counter + phase pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 'clamp(13px, 1.35vw, 18px)', fontWeight: 700,
            color: '#333', fontFamily: 'Tahoma, Arial, sans-serif', whiteSpace: 'nowrap',
          }}>
            {activeIdx < 0 ? `— / ${steps.length}` : `Step ${activeIdx + 1} / ${steps.length}`}
          </span>
          {phasePill && (
            <span style={{
              fontSize: 'clamp(10px, 1vw, 13px)', fontWeight: 700,
              padding: '2px 10px', borderRadius: 20,
              background: '#000080', color: '#fff',
              fontFamily: 'Tahoma, Arial, sans-serif',
            }}>
              {phasePill}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {btn('↺ Reset',    () => setCursor(0),                         cursor === 0)}
          {btn('◀',          () => setCursor(c => Math.max(0, c - 1)),   cursor === 0)}
          {btn(btnLabel,     () => setCursor(c => Math.min(maxCursor, c + 1)), atEnd, true)}
          {btn('▶▶ All',    () => setCursor(maxCursor),                  atEnd)}
        </div>
      </div>

      {/* Log */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 14px',
        background: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: 10,
      }}>

        {cursor === 0 && (
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#888', fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 600,
            fontFamily: 'Tahoma, Arial, sans-serif',
          }}>
            Press <strong style={{ margin: '0 6px', color: '#000080' }}>▶ Show State</strong> to begin…
          </div>
        )}

        {steps.map((s, i) => {
          const { stateAt, checksAt, decisionAt } = map[i];
          if (cursor < stateAt) return null;

          const isActive       = i === activeIdx;
          const decisionShown  = cursor >= decisionAt;
          const c              = TYPE_CONFIG[s.type] || TYPE_CONFIG.stop;
          const checksShown    = checksAt.filter(at => cursor >= at).length;
          const allChecksShown = checksShown === checksAt.length;

          return (
            <div key={i} style={{
              border: `2px solid ${isActive ? c.border : '#d5d5d5'}`,
              borderRadius: 6, overflow: 'hidden',
              opacity: isActive ? 1 : 0.5, flexShrink: 0,
              transition: 'opacity 0.2s',
              boxShadow: isActive ? `0 2px 14px ${c.border}44` : 'none',
            }}>

              {/* State header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: isActive ? c.accent : '#e0e0e0', padding: '8px 16px',
              }}>
                <span style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: 'clamp(15px, 1.6vw, 22px)', fontWeight: 900,
                  color: isActive ? '#fff' : '#555',
                }}>
                  STEP {i + 1} &nbsp;|&nbsp; {s.state}
                </span>
                {decisionShown && (
                  <span style={{
                    background: 'rgba(255,255,255,0.20)', color: '#fff',
                    padding: '3px 14px', fontSize: 'clamp(11px, 1.1vw, 15px)',
                    fontWeight: 800, border: '1px solid rgba(255,255,255,0.35)', borderRadius: 4,
                  }}>
                    {c.badge}
                  </span>
                )}
              </div>

              {/* Check lines — each revealed individually */}
              {checksShown > 0 && (
                <div style={{
                  padding: '10px 18px',
                  fontFamily: 'Courier New, monospace',
                  fontSize: 'clamp(14px, 1.5vw, 21px)', fontWeight: 700, lineHeight: 1.9,
                  background: isActive ? c.bg : '#f5f5f5',
                  color: isActive ? '#1a1a1a' : '#666',
                }}>
                  {s.checks.slice(0, checksShown).map((line, li) => (
                    <div key={li}>{line}</div>
                  ))}
                  {/* "more..." hint when not all checks shown yet */}
                  {isActive && !allChecksShown && (
                    <div style={{ color: '#aaa', fontSize: '0.85em', fontStyle: 'italic', marginTop: 4 }}>
                      {checksAt.length - checksShown} more check{checksAt.length - checksShown > 1 ? 's' : ''} remaining…
                    </div>
                  )}
                </div>
              )}

              {/* Placeholder: no checks shown yet */}
              {checksShown === 0 && isActive && (
                <div style={{
                  padding: '10px 18px', background: '#fafafa',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  fontSize: 'clamp(12px, 1.2vw, 16px)', fontWeight: 600,
                  color: '#aaa', fontStyle: 'italic',
                }}>
                  Click <strong style={{ color: '#000080' }}>▶ Apply Operator</strong> to check neighbors…
                </div>
              )}

              {/* Decision */}
              {decisionShown ? (
                <div style={{
                  padding: '8px 18px',
                  borderTop: `2px solid ${isActive ? c.border : '#e0e0e0'}`,
                  fontFamily: 'Courier New, monospace', fontWeight: 900,
                  fontSize: 'clamp(14px, 1.55vw, 22px)',
                  background: isActive ? c.bg : '#ebebeb',
                  color: isActive ? c.accent : '#777',
                }}>
                  {s.decision}
                </div>
              ) : allChecksShown && isActive ? (
                <div style={{
                  padding: '8px 18px', borderTop: '1px dashed #ccc',
                  fontFamily: 'Tahoma, Arial, sans-serif',
                  fontSize: 'clamp(12px, 1.2vw, 16px)', fontWeight: 600,
                  color: '#aaa', fontStyle: 'italic', background: '#fafafa',
                }}>
                  Click <strong style={{ color: '#000080' }}>▶ Evaluate</strong> to see the decision…
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Result */}
        {atEnd && result && (
          <div style={{
            border: `3px solid ${result.reached ? '#1d4ed8' : '#dc2626'}`,
            background: result.reached ? '#dbeafe' : '#fee2e2',
            borderRadius: 6, padding: '16px 20px', flexShrink: 0,
          }}>
            <div style={{
              fontWeight: 900, fontSize: 'clamp(15px, 1.6vw, 22px)',
              color: result.reached ? '#1d4ed8' : '#dc2626', marginBottom: 6,
              fontFamily: 'Tahoma, Arial, sans-serif',
            }}>
              {result.reached ? '★  GOAL REACHED' : '■  ALGORITHM TERMINATED'}
            </div>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 'clamp(16px, 1.8vw, 28px)', fontWeight: 900,
              color: '#111', marginBottom: 6,
            }}>
              {result.text}
            </div>
            <div style={{
              fontSize: 'clamp(13px, 1.3vw, 18px)', fontWeight: 700,
              color: '#333', fontFamily: 'Tahoma, Arial, sans-serif',
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
