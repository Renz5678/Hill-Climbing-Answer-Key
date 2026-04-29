import React, { useState } from 'react';
import SimulationPanel from './components/SimulationPanel';
import { exercises } from './data/exercises';

const slides = [];
exercises.forEach((ex, i) => {
  slides.push({ phase: 'problem',    ex, exIndex: i });
  slides.push({ phase: 'simulation', ex, exIndex: i });
});
const TOTAL = slides.length;

// ─── Dot navigator ────────────────────────────────────────────────────────────
function SlideDots({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {slides.map((s, i) => {
        const isActive  = i === current;
        const isProblem = s.phase === 'problem';
        return (
          <button key={i} onClick={() => onChange(i)}
            title={`Ex ${s.exIndex + 1} — ${s.phase}`}
            style={{
              width: isActive ? 28 : 10, height: 10,
              borderRadius: isProblem ? 2 : 5,
              background: isActive ? '#000080' : (isProblem ? '#8ab4e0' : '#507090'),
              border: isActive ? '2px solid #000080' : '1px solid #aaa',
              cursor: 'pointer', padding: 0, transition: 'all 0.15s', outline: 'none',
            }} />
        );
      })}
    </div>
  );
}

// ─── Problem Slide ─────────────────────────────────────────────────────────────
function ProblemSlide({ ex }) {
  const p = ex.problem;

  const facts = [
    { label: '🎯  Goal',      value: p.goal  },
    { label: '🔰  Start',     value: p.start },
    { label: '⚙️  Operators', value: p.ops   },
  ];
  if (p.rule) facts.push({ label: '📏  Rule', value: p.rule });
  else        facts.push({ label: '📋  Algorithm', value: ex.tag });

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '16px 32px 12px',
      gap: 12,
      background: '#fff',
    }}>

      {/* Description */}
      {p.desc && (
        <div style={{
          fontSize: 'clamp(15px, 1.55vw, 21px)', fontWeight: 600, lineHeight: 1.5,
          color: '#222', fontFamily: 'Tahoma, Arial, sans-serif', flexShrink: 0,
        }}>
          {p.desc}
        </div>
      )}

      {/* Function banner */}
      {p.fn && (
        <div style={{
          background: 'linear-gradient(135deg, #000080 0%, #1084d0 60%, #0050a0 100%)',
          color: '#fff', padding: '10px 28px', textAlign: 'center',
          fontFamily: '"EB Garamond", serif', fontSize: 'clamp(26px, 3vw, 52px)', fontWeight: 800,
          letterSpacing: '0.4px', flexShrink: 0,
        }}>
          {p.fn}
        </div>
      )}

      {/* Key facts */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        {facts.map(({ label, value }) => (
          <div key={label} style={{
            flex: 1, background: '#f4f6fb', padding: '10px 16px',
            border: '1px solid #d1d9f0', borderRadius: 4, minWidth: 0,
          }}>
            <div style={{
              fontSize: 'clamp(10px, 0.9vw, 12px)', fontWeight: 800, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: 'Courier New, monospace', fontSize: 'clamp(14px, 1.6vw, 22px)',
              fontWeight: 800, color: '#000080', wordBreak: 'break-word',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Moves table (Exercise 2 only) */}
      {p.movesTable && (
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {p.movesTable.map(({ step, from, moves }) => (
            <div key={step} style={{
              flex: 1, background: '#fafafa', padding: '10px 14px',
              border: '1px solid #ddd', borderRadius: 4,
            }}>
              <div style={{ fontSize: 'clamp(12px, 1.1vw, 16px)', fontWeight: 800, color: '#000080', marginBottom: 4 }}>
                Step {step}&nbsp;
                <span style={{ color: '#6b7280', fontWeight: 700 }}>({from})</span>
              </div>
              <div style={{
                fontFamily: 'Courier New, monospace', fontSize: 'clamp(13px, 1.3vw, 18px)',
                fontWeight: 700, color: '#1a1a1a', lineHeight: 1.6,
              }}>
                {moves}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      {p.note && (
        <div style={{
          background: '#fffbeb', border: '1px solid #d97706', borderLeft: '5px solid #d97706',
          padding: '8px 16px', fontSize: 'clamp(13px, 1.35vw, 19px)', fontWeight: 600,
          lineHeight: 1.45, fontFamily: 'Tahoma, Arial, sans-serif', color: '#333', flexShrink: 0,
          borderRadius: 4,
        }}>
          <span style={{ color: '#92400e', fontWeight: 800 }}>Note: </span>{p.note}
        </div>
      )}

      {/* Follow-Up */}
      {ex.followUp && (
        <div style={{
          background: '#f0f4ff', border: '1px solid #4f46e5', borderLeft: '5px solid #4f46e5',
          padding: '8px 16px', fontSize: 'clamp(13px, 1.35vw, 19px)', fontWeight: 600,
          lineHeight: 1.45, fontFamily: 'Tahoma, Arial, sans-serif', color: '#1e1b4b', flexShrink: 0,
          borderRadius: 4,
        }}>
          <span style={{ fontWeight: 800 }}>Follow-Up: </span>{ex.followUp}
        </div>
      )}
    </div>
  );
}

// ─── Simulation Slide ─────────────────────────────────────────────────────────
function VariantTabs({ variants }) {
  const [tab, setTab] = useState(0);
  const v = variants[tab];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '2px solid #c0c0c0', flexShrink: 0,
        background: '#f0f0f0', padding: '4px 8px 0', gap: 4,
      }}>
        {variants.map((vt, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            fontSize: 'clamp(12px, 1.2vw, 16px)', fontWeight: tab === i ? 800 : 600,
            padding: '6px 20px',
            background: tab === i ? '#fff' : 'transparent',
            color: tab === i ? '#000080' : '#555',
            border: tab === i ? '1px solid #c0c0c0' : '1px solid transparent',
            borderBottom: tab === i ? '2px solid #fff' : 'none',
            cursor: 'pointer',
            fontFamily: 'Tahoma, Arial, sans-serif',
            marginBottom: tab === i ? -2 : 0,
            transition: 'all 0.1s',
          }}>
            V{i + 1} — {['Simple', 'Steepest Ascent', 'Stochastic'][i]}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '10px 12px' }}>
        <SimulationPanel key={tab} steps={v.steps} result={v.result} rule={v.rule} />
      </div>
    </div>
  );
}

function SimulationSlide({ ex }) {
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {ex.hasVariants
        ? <VariantTabs variants={ex.variants} />
        : (
          <div style={{ flex: 1, overflow: 'hidden', padding: '10px 12px' }}>
            <SimulationPanel steps={ex.steps} result={ex.result} />
          </div>
        )
      }
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const { ex, phase } = slide;

  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(TOTAL - 1, i + 1));

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isProb = phase === 'problem';
  const hdrBg  = isProb
    ? '#000080'
    : '#14532d';

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#e8e8e8', overflow: 'hidden', margin: 0, padding: 0,
    }}>

      {/* ── Compact header ── */}
      <div style={{
        background: hdrBg,
        padding: '6px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
      }}>
        <div>
          <span style={{
            fontSize: 'clamp(13px, 1.5vw, 20px)', fontWeight: 800,
            fontFamily: 'Tahoma, Arial, sans-serif', color: '#fff',
          }}>
            {ex.icon} {ex.title}: {ex.subtitle}
          </span>
          <span style={{
            fontSize: 'clamp(11px, 1.1vw, 14px)', fontWeight: 600,
            color: 'rgba(255,255,255,0.70)', marginLeft: 14,
            fontFamily: 'Tahoma, Arial, sans-serif',
          }}>
            {isProb ? '📋 Problem Statement' : '▶ Step-by-Step Simulation'} · {ex.tag}
          </span>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(12px, 1.2vw, 16px)',
          fontWeight: 800, fontFamily: 'Tahoma, Arial, sans-serif',
          background: 'rgba(255,255,255,0.12)', padding: '2px 10px', borderRadius: 3,
        }}>
          {idx + 1} / {TOTAL}
        </span>
      </div>

      {/* ── Slide body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {isProb
          ? <ProblemSlide ex={ex} />
          : <SimulationSlide key={ex.id} ex={ex} />
        }
      </div>

      {/* ── Navigation bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 12px', flexShrink: 0, background: '#d8d8d8',
        borderTop: '1px solid #b0b0b0',
      }}>
        <button onClick={prev} disabled={idx === 0} style={{
          fontSize: 'clamp(12px, 1.3vw, 17px)', fontWeight: 800,
          padding: '5px 20px', cursor: idx === 0 ? 'default' : 'pointer',
          background: idx === 0 ? '#c8c8c8' : '#fff',
          border: '1px solid #999', color: idx === 0 ? '#999' : '#000080',
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          ◀ Previous
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <SlideDots current={idx} onChange={setIdx} />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#666', fontFamily: 'Tahoma, Arial, sans-serif' }}>
            □ = Problem &nbsp;·&nbsp; ● = Simulation
          </span>
        </div>

        <button onClick={next} disabled={idx === TOTAL - 1} style={{
          fontSize: 'clamp(12px, 1.3vw, 17px)', fontWeight: 800,
          padding: '5px 20px', cursor: idx === TOTAL - 1 ? 'default' : 'pointer',
          background: idx === TOTAL - 1 ? '#c8c8c8' : '#000080',
          border: '1px solid #999', color: idx === TOTAL - 1 ? '#999' : '#fff',
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
