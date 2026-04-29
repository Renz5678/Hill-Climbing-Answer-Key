import React, { useState } from 'react';
import WindowBar from './components/WindowBar';
import SimulationPanel from './components/SimulationPanel';
import { exercises } from './data/exercises';

const MENUS = ['File', 'Edit', 'View', 'Help'];

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
              width: isActive ? 28 : 12, height: 12,
              borderRadius: isProblem ? 2 : 6,
              background: isActive ? '#fff' : (isProblem ? '#8ab4e0' : '#507090'),
              border: isActive ? '2px solid #fff' : '1px solid #506080',
              cursor: 'pointer', padding: 0, transition: 'all 0.15s', outline: 'none',
            }} />
        );
      })}
    </div>
  );
}

// ─── Problem Slide — NO SCROLLING ─────────────────────────────────────────────
function ProblemSlide({ ex }) {
  const p = ex.problem;

  // responsive font sizes via clamp() — tuned for 1536×730 viewport
  const F = {
    desc:       'clamp(15px, 1.55vw, 22px)',
    fn:         'clamp(24px, 2.8vw, 48px)',
    factLabel:  'clamp(10px, 0.95vw, 13px)',
    factValue:  'clamp(14px, 1.6vw, 22px)',
    note:       'clamp(14px, 1.45vw, 20px)',
    followUp:   'clamp(13px, 1.35vw, 19px)',
    tableLabel: 'clamp(12px, 1.2vw, 17px)',
    tableValue: 'clamp(13px, 1.3vw, 18px)',
  };

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
      padding: '10px 48px 8px',
      gap: 8,
      background: '#fff',
    }}>

      {/* ① Description paragraph */}
      {p.desc && (
        <div style={{
          fontSize: F.desc, fontWeight: 700, lineHeight: 1.45,
          color: '#111', fontFamily: 'Tahoma, Arial, sans-serif', flexShrink: 0,
        }}>
          {p.desc}
        </div>
      )}

      {p.fn && (
        <div style={{
          background: 'linear-gradient(135deg, #000080 0%, #1084d0 60%, #0050a0 100%)',
          color: '#fff', padding: '8px 28px', textAlign: 'center',
          fontFamily: '"EB Garamond", serif', fontSize: F.fn, fontWeight: 800,
          letterSpacing: '0.4px', boxShadow: '0 3px 12px rgba(0,0,128,0.25)', flexShrink: 0,
        }}>
          {p.fn}
        </div>
      )}

      {/* ③ Key facts — single horizontal row of 4 boxes */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {facts.map(({ label, value }) => (
          <div key={label} className="panel-inset"
            style={{ flex: 1, background: '#f4f6fb', padding: '8px 14px', minWidth: 0 }}>
            <div style={{
              fontSize: F.factLabel, fontWeight: 800, color: '#6b7280',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 5,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: 'Courier New, monospace', fontSize: F.factValue,
              fontWeight: 800, color: '#000080', wordBreak: 'break-word',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ④ Moves table (Exercise 2 only) */}
      {p.movesTable && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {p.movesTable.map(({ step, from, moves }) => (
            <div key={step} className="panel-inset"
              style={{ flex: 1, background: '#fafafa', padding: '8px 14px' }}>
              <div style={{ fontSize: F.tableLabel, fontWeight: 800, color: '#000080', marginBottom: 4 }}>
                Step {step}&nbsp;
                <span style={{ color: '#6b7280', fontWeight: 700 }}>({from})</span>
              </div>
              <div style={{
                fontFamily: 'Courier New, monospace', fontSize: F.tableValue,
                fontWeight: 700, color: '#1a1a1a', lineHeight: 1.6,
              }}>
                {moves}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⑤ Note */}
      {p.note && (
        <div style={{
          background: '#fffbeb', border: '1px solid #d97706', borderLeft: '6px solid #d97706',
          padding: '7px 16px', fontSize: F.note, fontWeight: 700, lineHeight: 1.45,
          fontFamily: 'Tahoma, Arial, sans-serif', color: '#333', flexShrink: 0,
        }}>
          <span style={{ color: '#92400e', fontWeight: 800 }}>Note: </span>{p.note}
        </div>
      )}

      {/* ⑥ Follow-Up */}
      {ex.followUp && (
        <div style={{
          background: '#f0f4ff', border: '1px solid #4f46e5', borderLeft: '6px solid #4f46e5',
          padding: '7px 16px', fontSize: F.followUp, fontWeight: 700, lineHeight: 1.45,
          fontFamily: 'Tahoma, Arial, sans-serif', color: '#1e1b4b', flexShrink: 0,
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
      <div style={{
        display: 'flex', borderBottom: '2px solid #808080', flexShrink: 0,
        background: '#d4d0c8', padding: '4px 6px 0', gap: 3,
      }}>
        {variants.map((vt, i) => (
          <button key={i} onClick={() => setTab(i)} className="btn-win" style={{
            fontSize: 'clamp(12px, 1.3vw, 18px)', fontWeight: tab === i ? 800 : 700,
            padding: '6px 22px', background: tab === i ? '#fff' : '#c0c0c0',
            color: tab === i ? '#000080' : '#333',
            borderBottom: tab === i ? '2px solid #fff' : undefined,
          }}>
            V{i + 1} — {['Simple', 'Steepest Ascent', 'Stochastic'][i]}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: 10 }}>
        <SimulationPanel key={tab} steps={v.steps} result={v.result} rule={v.rule} />
      </div>
    </div>
  );
}

function SimulationSlide({ ex }) {
  const p = ex.problem;
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* recap bar */}
      <div style={{
        background: '#eef2ff', borderBottom: '2px solid #c7d2fe', flexShrink: 0,
        padding: 'clamp(7px, 1vh, 12px) clamp(16px, 2.5vw, 32px)',
        display: 'flex', flexWrap: 'wrap', gap: '6px 28px', alignItems: 'center',
      }}>
        {p.fn && (
          <span style={{
            fontFamily: '"EB Garamond", serif',
            fontSize: 'clamp(20px, 2.2vw, 34px)', fontWeight: 800, color: '#000080',
          }}>
            {p.fn}
          </span>
        )}
        <span style={{
          fontSize: 'clamp(14px, 1.5vw, 22px)', fontWeight: 700,
          color: '#3730a3', fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          Goal: {p.goal} &nbsp;|&nbsp; Start: {p.start}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: 'clamp(8px, 1.2vh, 14px) clamp(10px, 1.5vw, 20px)' }}>
        {ex.hasVariants
          ? <VariantTabs variants={ex.variants} />
          : <SimulationPanel steps={ex.steps} result={ex.result} />
        }
      </div>
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

  const isProb   = phase === 'problem';
  const phaseLbl = isProb ? '📋 Problem Statement' : '▶ Step-by-Step Simulation';
  const hdrBg    = isProb
    ? 'linear-gradient(135deg, #000080 0%, #1084d0 60%, #0050a0 100%)'
    : 'linear-gradient(135deg, #14532d 0%, #16a34a 70%, #15803d 100%)';

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#c0c0c0', overflow: 'hidden', margin: 0, padding: 0,
    }}>
      <WindowBar
        title={`Hill Climbing — ${ex.icon} ${ex.title}: ${ex.subtitle}  [${phaseLbl}]`}
        menus={MENUS}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '7px 8px 0' }}>
        <div className="panel-raised" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* slide header */}
          <div style={{
            background: hdrBg,
            padding: 'clamp(9px, 1.3vh, 16px) clamp(18px, 2.5vw, 36px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <div>
              <div style={{
                fontSize: 'clamp(20px, 2.4vw, 38px)', fontWeight: 800,
                fontFamily: '"EB Garamond", serif', color: '#fff', letterSpacing: '0.3px',
              }}>
                {ex.icon}&nbsp; {ex.title}: {ex.subtitle}
              </div>
              <div style={{
                fontSize: 'clamp(13px, 1.3vw, 19px)', fontWeight: 700,
                color: 'rgba(255,255,255,0.85)', marginTop: 3,
                fontFamily: 'Tahoma, Arial, sans-serif',
              }}>
                {phaseLbl} &nbsp;·&nbsp; {ex.tag}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff', fontSize: 'clamp(13px, 1.4vw, 20px)', fontWeight: 800,
              padding: '5px 16px', fontFamily: 'Tahoma, Arial, sans-serif', whiteSpace: 'nowrap',
            }}>
              {idx + 1} / {TOTAL}
            </div>
          </div>

          {/* slide body */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {isProb
              ? <ProblemSlide ex={ex} />
              : <SimulationSlide key={ex.id} ex={ex} />
            }
          </div>
        </div>

        {/* nav bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 4px', flexShrink: 0,
        }}>
          <button className="btn-win" onClick={prev} disabled={idx === 0}
            style={{ fontSize: 'clamp(13px, 1.4vw, 20px)', fontWeight: 800, padding: '5px 22px' }}>
            ◀ Previous
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <SlideDots current={idx} onChange={setIdx} />
            <span style={{ fontSize: 'clamp(10px, 0.95vw, 13px)', fontWeight: 700, color: '#555' }}>
              □ = Problem &nbsp;·&nbsp; ● = Simulation
            </span>
          </div>

          <button className="btn-win" onClick={next} disabled={idx === TOTAL - 1}
            style={{ fontSize: 'clamp(13px, 1.4vw, 20px)', fontWeight: 800, padding: '5px 22px' }}>
            Next ▶
          </button>
        </div>
      </div>

      {/* status bar */}
      <div style={{
        display: 'flex', borderTop: '1px solid #808080', padding: '2px',
        background: '#c0c0c0', flexShrink: 0,
      }}>
        <div className="status-field" style={{ flex: 1, fontWeight: 700, fontSize: 'clamp(11px, 1.1vw, 15px)' }}>
          {ex.icon} {ex.title} — {ex.subtitle}
        </div>
        <div className="status-field" style={{ width: 210, fontWeight: 700, fontSize: 'clamp(11px, 1.1vw, 15px)' }}>
          {ex.tag}
        </div>
        <div className="status-field" style={{ width: 130, fontWeight: 700, fontSize: 'clamp(11px, 1.1vw, 15px)' }}>
          {isProb ? 'Problem' : 'Simulation'} — Ex {ex.id}/5
        </div>
        <div className="status-field" style={{ width: 200, fontWeight: 700, fontSize: 'clamp(11px, 1.1vw, 15px)' }}>
          ← → or PageUp/Down to navigate
        </div>
      </div>
    </div>
  );
}
