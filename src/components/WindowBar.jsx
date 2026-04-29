import React from 'react';

export default function WindowBar({ title, menus = [] }) {
  return (
    <div style={{ background: '#c0c0c0' }}>
      {/* Title bar */}
      <div className="titlebar">
        {/* Win98 app icon (grid of squares) */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" fill="#ff0000"/>
          <rect x="9" y="1" width="6" height="6" fill="#00ff00"/>
          <rect x="1" y="9" width="6" height="6" fill="#0000ff"/>
          <rect x="9" y="9" width="6" height="6" fill="#ffff00"/>
        </svg>
        <span style={{ flex: 1 }}>{title}</span>
        {/* Window controls */}
        <button className="btn-win" style={{ padding: '0 6px', minWidth: 18, minHeight: 14, fontSize: 10, lineHeight: 1 }}>─</button>
        <button className="btn-win" style={{ padding: '0 6px', minWidth: 18, minHeight: 14, fontSize: 10, lineHeight: 1 }}>▣</button>
        <button className="btn-win" style={{ padding: '0 6px', minWidth: 18, minHeight: 14, fontSize: 10, lineHeight: 1, color: '#800000', fontWeight: 'bold' }}>✕</button>
      </div>
      {/* Menu bar */}
      <div style={{ display: 'flex', gap: 0, background: '#c0c0c0', padding: '1px 4px', borderBottom: '1px solid #808080' }}>
        {menus.map((m, i) => (
          <span key={i} style={{
            padding: '2px 8px',
            fontSize: 11,
            cursor: 'default',
            userSelect: 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#000080'}
          onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; }}
          >
            <u>{m[0]}</u>{m.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
}
