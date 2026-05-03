import React, { useState, useEffect } from 'react';
import SimulationPanel from './components/SimulationPanel';
import GraphPanel from './components/GraphPanel';
import ChessBoard from './components/ChessBoard';
import { exercises } from './data/exercises';

function useWindowWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

const infoSlides = [
  {
    phase: 'info',
    title: 'Heuristic Algorithm',
    subtitle: 'What Is a Heuristic Algorithm?',
    tag: 'Background Concept',
    body: 'An algorithm that uses practical strategies or rules of thumb to find a good or acceptable solution quickly, trading off guaranteed optimality for speed and reduced computation time.',
    citation: 'Hawaou et al., 2023',
    keyPoints: [
      { label: 'Speed', text: 'Finds acceptable solutions much faster than exhaustive search methods.' },
      { label: 'Trade-off', text: 'Sacrifices the guarantee of finding the perfect optimal solution.' },
      { label: 'Rule of Thumb', text: 'Uses practical, intuitive strategies rather than mathematically exhaustive proofs.' },
      { label: 'Scalability', text: 'Handles large, complex problems where exact algorithms are computationally infeasible.' },
    ],
  },
  {
    phase: 'info',
    title: 'Hill Climbing as a Heuristic',
    subtitle: 'Why Hill Climbing Is a Heuristic Algorithm',
    tag: 'Core Concept',
    body: 'Hill climbing qualifies as a heuristic algorithm because it uses a simple rule of thumb — always move to a better neighboring solution — to find an acceptable answer quickly without exhaustively searching the entire solution space, and does not guarantee the optimal solution as it can get trapped at local optima.',
    keyPoints: [
      { label: 'Rule of Thumb', text: 'Always move to a strictly better neighboring solution — no complex analysis required.' },
      { label: 'No Exhaustive Search', text: 'Ignores the full solution space and only looks at immediate neighbors.' },
      { label: 'Local Optima Risk', text: 'Can get stuck at a local maximum/minimum, unable to see a better global solution.' },
      { label: 'Acceptable Answer', text: 'Quickly reaches a good-enough solution, making it practical for real-world use.' },
    ],
  },
];

const slides = [...infoSlides];
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
        const isInfo    = s.phase === 'info';
        const isProblem = s.phase === 'problem';
        const bg = isActive ? '#000080' : isInfo ? '#7c3aed' : isProblem ? '#8ab4e0' : '#507090';
        return (
          <button key={i} onClick={() => onChange(i)}
            title={isInfo ? s.subtitle : `Ex ${s.exIndex + 1} — ${s.phase}`}
            style={{
              width: isActive ? 28 : 10, height: 10,
              borderRadius: isInfo ? 5 : isProblem ? 2 : 5,
              background: bg,
              border: isActive ? '2px solid #000080' : '1px solid #aaa',
              cursor: 'pointer', padding: 0, transition: 'all 0.15s', outline: 'none',
            }} />
        );
      })}
    </div>
  );
}

// ─── Info Slide ───────────────────────────────────────────────────────────────
function InfoSlide({ slide }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 32px) 14px',
      gap: 12,
      background: '#fff',
    }}>

      {/* Main definition block */}
      <div style={{
        background: 'linear-gradient(135deg, #000080 0%, #1084d0 60%, #0050a0 100%)',
        borderRadius: 6,
        padding: '16px 24px',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700,
          color: 'rgba(255,255,255,0.75)', fontFamily: 'Tahoma, Arial, sans-serif',
          textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8,
        }}>
          Definition
        </div>
        <div style={{
          fontSize: 'clamp(16px, 1.8vw, 26px)', fontWeight: 700, lineHeight: 1.5,
          color: '#fff', fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          {slide.body}
        </div>
        {slide.citation && (
          <div style={{
            marginTop: 10,
            fontSize: 'clamp(12px, 1.1vw, 16px)', fontWeight: 600,
            color: 'rgba(255,255,255,0.65)', fontFamily: 'Tahoma, Arial, sans-serif',
            fontStyle: 'italic',
          }}>
            ({slide.citation})
          </div>
        )}
      </div>

      {/* Key points grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 10,
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {slide.keyPoints.map(({ label, text }) => (
          <div key={label} style={{
            background: '#f4f6fb',
            border: '1px solid #d1d9f0',
            borderLeft: '5px solid #000080',
            borderRadius: 4,
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 'clamp(13px, 1.3vw, 19px)', fontWeight: 800,
                color: '#000080', fontFamily: 'Tahoma, Arial, sans-serif',
                textTransform: 'uppercase', letterSpacing: '1px',
              }}>
                {label}
              </span>
            </div>
            <div style={{
              fontSize: 'clamp(13px, 1.35vw, 20px)', fontWeight: 600, lineHeight: 1.5,
              color: '#222', fontFamily: 'Tahoma, Arial, sans-serif',
            }}>
              {text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Problem Slide ─────────────────────────────────────────────────────────────
function ProblemSlide({ ex }) {
  const p = ex.problem;

  const facts = [
    { label: 'Goal',      value: p.goal  },
    { label: 'Start',     value: p.start },
    { label: 'Operators', value: p.ops   },
  ];
  if (p.rule) facts.push({ label: 'Rule',      value: p.rule });
  else        facts.push({ label: 'Algorithm', value: ex.tag });

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: 'clamp(10px, 2vw, 16px) clamp(12px, 3vw, 32px) 12px',
      gap: 10,
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
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
        {facts.map(({ label, value }) => (
          <div key={label} style={{
            flex: '1 1 120px', background: '#f4f6fb', padding: '8px 14px',
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
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
          {p.movesTable.map(({ step, from, moves }) => (
            <div key={step} style={{
              flex: '1 1 140px', background: '#fafafa', padding: '8px 12px',
              border: '1px solid #ddd', borderRadius: 4, minWidth: 0,
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
/**
 * Wrapper that lays out [visual panel | step log] side by side.
 * graphConfig  - ex.graph (for graph exercises)
 * chessConfig  - ex.chess (for chess exercise)
 * graphPoints  - per-variant override (variants only)
 * steps / result / rule - forwarded to SimulationPanel
 */
function VisualSimulation({ steps, result, rule, graphConfig, chessConfig, graphPoints }) {
  const windowWidth = useWindowWidth();
  const isNarrow = windowWidth < 640;

  // SimulationPanel exposes activeIdx via a callback
  const [activeIdx, setActiveIdx] = useState(-1);
  const [decisionsCompleted, setDecisionsCompleted] = useState(0);

  const handleChange = ({ activeIdx: ai, decisionsCompleted: dc }) => {
    setActiveIdx(ai);
    setDecisionsCompleted(dc);
  };

  // For chess: derive moves and score from decisionsCompleted
  let chessPanel = null;
  if (chessConfig) {
    const movesSoFar = chessConfig.moves.slice(0, decisionsCompleted);
    const currentScore = chessConfig.scores[decisionsCompleted] ?? chessConfig.scores[chessConfig.scores.length - 1];
    chessPanel = (
      <ChessBoard
        moveHistory={movesSoFar}
        currentScore={currentScore}
        goalScore={chessConfig.goalScore}
        compact={isNarrow}
      />
    );
  }

  // For graph exercises: dot follows activeIdx (current step being examined)
  let graphPanel = null;
  if (graphConfig) {
    const pts = graphPoints ?? graphConfig.points ?? [];
    graphPanel = (
      <GraphPanel
        fn={graphConfig.fn}
        xMin={graphConfig.xMin}
        xMax={graphConfig.xMax}
        yMin={graphConfig.yMin}
        yMax={graphConfig.yMax}
        goalY={graphConfig.goalY}
        label={graphConfig.label}
        points={pts}
        activeIdx={activeIdx}
        compact={isNarrow}
      />
    );
  }

  const visualPanel = chessPanel || graphPanel;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isNarrow ? 'column' : 'row',
      height: '100%',
      overflow: 'hidden',
      gap: 0,
    }}>
      {/* Visual panel — top on mobile, left on desktop */}
      {visualPanel && (
        <div style={{
          flexShrink: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: isNarrow ? '8px' : '10px 8px 10px 10px',
          background: '#ececec',
          borderBottom: isNarrow ? '2px solid #b0b0b0' : 'none',
          borderRight: isNarrow ? 'none' : '2px solid #b0b0b0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: isNarrow ? 'center' : 'flex-start',
          maxHeight: isNarrow ? '45%' : 'none',
        }}>
          {visualPanel}
        </div>
      )}

      {/* Step log */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <SimulationPanel
          steps={steps}
          result={result}
          rule={rule}
          onActiveIdxChange={handleChange}
        />
      </div>
    </div>
  );
}

function VariantTabs({ variants, graphConfig }) {
  const [tab, setTab] = useState(0);
  const windowWidth = useWindowWidth();
  const v = variants[tab];
  const tabLabels = ['Simple', 'Steepest Ascent', 'Stochastic'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '2px solid #c0c0c0', flexShrink: 0,
        background: '#f0f0f0', padding: '4px 6px 0', gap: 3, overflowX: 'auto',
      }}>
        {variants.map((vt, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            fontSize: 'clamp(11px, 1.2vw, 15px)', fontWeight: tab === i ? 800 : 600,
            padding: windowWidth < 480 ? '5px 10px' : '6px 18px',
            background: tab === i ? '#fff' : 'transparent',
            color: tab === i ? '#000080' : '#555',
            border: tab === i ? '1px solid #c0c0c0' : '1px solid transparent',
            borderBottom: tab === i ? '2px solid #fff' : 'none',
            cursor: 'pointer', whiteSpace: 'nowrap',
            fontFamily: 'Tahoma, Arial, sans-serif',
            marginBottom: tab === i ? -2 : 0,
            transition: 'all 0.1s',
          }}>
            {windowWidth < 480 ? `V${i + 1}` : `V${i + 1} — ${tabLabels[i]}`}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <VisualSimulation
          key={tab}
          steps={v.steps}
          result={v.result}
          rule={v.rule}
          graphConfig={graphConfig}
          graphPoints={v.graphPoints}
        />
      </div>
    </div>
  );
}

function SimulationSlide({ ex }) {
  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {ex.hasVariants
        ? <VariantTabs variants={ex.variants} graphConfig={ex.graph} />
        : (
          <VisualSimulation
            steps={ex.steps}
            result={ex.result}
            graphConfig={ex.graph}
            chessConfig={ex.chess}
          />
        )
      }
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  const { phase } = slide;
  const ex = slide.ex ?? null;

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

  const isInfo = phase === 'info';
  const isProb = phase === 'problem';
  const hdrBg  = '#000080';

  return (
    <div style={{
      width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column',
      background: '#e8e8e8', overflow: 'hidden', margin: 0, padding: 0,
    }}>

      {/* ── Compact header ── */}
      <div style={{
        background: hdrBg,
        padding: '5px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, flexWrap: 'wrap', gap: 4,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: 'clamp(12px, 1.5vw, 20px)', fontWeight: 800,
            fontFamily: 'Tahoma, Arial, sans-serif', color: '#fff',
            display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {isInfo ? slide.title : `${ex.title}: ${ex.subtitle}`}
          </span>
          <span style={{
            fontSize: 'clamp(10px, 1.1vw, 14px)', fontWeight: 600,
            color: 'rgba(255,255,255,0.70)',
            fontFamily: 'Tahoma, Arial, sans-serif', display: 'block',
          }}>
            {isInfo
              ? `Concept · ${slide.tag}`
              : isProb
                ? `Problem Statement · ${ex.tag}`
                : `Step-by-Step Simulation · ${ex.tag}`
            }
          </span>
        </div>
        <span style={{
          color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(11px, 1.2vw, 16px)',
          fontWeight: 800, fontFamily: 'Tahoma, Arial, sans-serif', flexShrink: 0,
          background: 'rgba(255,255,255,0.12)', padding: '2px 8px', borderRadius: 3,
        }}>
          {idx + 1} / {TOTAL}
        </span>
      </div>

      {/* ── Slide body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {isInfo
          ? <InfoSlide slide={slide} />
          : isProb
            ? <ProblemSlide ex={ex} />
            : <SimulationSlide key={ex.id} ex={ex} />
        }
      </div>

      {/* ── Navigation bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5px 8px', flexShrink: 0, background: '#d8d8d8',
        borderTop: '1px solid #b0b0b0', gap: 6,
      }}>
        <button onClick={prev} disabled={idx === 0} style={{
          fontSize: 'clamp(11px, 1.3vw, 17px)', fontWeight: 800,
          padding: '4px 12px', cursor: idx === 0 ? 'default' : 'pointer',
          background: idx === 0 ? '#c8c8c8' : '#fff', flexShrink: 0,
          border: '1px solid #999', color: idx === 0 ? '#999' : '#000080',
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          ◀ Prev
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <SlideDots current={idx} onChange={setIdx} />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#666', fontFamily: 'Tahoma, Arial, sans-serif', whiteSpace: 'nowrap' }}>
            □ = Problem &nbsp;·&nbsp; ● = Simulation
          </span>
        </div>

        <button onClick={next} disabled={idx === TOTAL - 1} style={{
          fontSize: 'clamp(11px, 1.3vw, 17px)', fontWeight: 800,
          padding: '4px 12px', cursor: idx === TOTAL - 1 ? 'default' : 'pointer',
          background: idx === TOTAL - 1 ? '#c8c8c8' : '#000080', flexShrink: 0,
          border: '1px solid #999', color: idx === TOTAL - 1 ? '#999' : '#fff',
          fontFamily: 'Tahoma, Arial, sans-serif',
        }}>
          Next ▶
        </button>
      </div>
    </div>
  );
}
