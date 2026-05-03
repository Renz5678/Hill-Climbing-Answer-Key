import React from 'react';

/**
 * ChessBoard — renders an 8×8 board (Windows XP style) and shows
 * the sequence of moves played so far, with the current position highlighted.
 *
 * Props:
 *   moveHistory : string[]   — list of move strings played so far  e.g. ['e4','Nf3','Bc4']
 *   currentScore: number     — current score to display
 *   goalScore   : number     — goal score to display
 */

// Piece unicode map
const PIECES = {
  // White pieces (starting squares shown on board)
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  // Black pieces
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

// Initial board layout (rank 8..1, file a..h)
// Each cell: null or { piece, color }
const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = [8,7,6,5,4,3,2,1];

function initialBoard() {
  const board = {};
  // White pieces (rank 1 & 2)
  const backRank = ['wR','wN','wB','wQ','wK','wB','wN','wR'];
  FILES.forEach((f, i) => {
    board[`${f}1`] = backRank[i];
    board[`${f}2`] = 'wP';
  });
  // Black pieces (rank 7 & 8)
  const blackBack = ['bR','bN','bB','bQ','bK','bB','bN','bR'];
  FILES.forEach((f, i) => {
    board[`${f}8`] = blackBack[i];
    board[`${f}7`] = 'bP';
  });
  return board;
}

// Apply a sequence of named moves to a board clone
// Simplified: we just visually animate; we track from/to squares for known moves
const MOVE_MAP = {
  'e4':  { from: 'e2', to: 'e4', piece: 'wP' },
  'd4':  { from: 'd2', to: 'd4', piece: 'wP' },
  'Nf3': { from: 'g1', to: 'f3', piece: 'wN' },
  'Bc4': { from: 'f1', to: 'c4', piece: 'wB' },
  'O-O': { from: 'e1', to: 'g1', piece: 'wK', rook: { from: 'h1', to: 'f1' } },
  'd3':  { from: 'd2', to: 'd3', piece: 'wP' },
};

function applyMoves(moveNames) {
  const board = initialBoard();
  const highlights = [];
  for (const mv of moveNames) {
    const def = MOVE_MAP[mv];
    if (!def) continue;
    board[def.to] = board[def.from];
    delete board[def.from];
    highlights.push(def.to);
    if (def.rook) {
      board[def.rook.to] = board[def.rook.from];
      delete board[def.rook.from];
      highlights.push(def.rook.to);
    }
  }
  return { board, lastTo: highlights[highlights.length - 1] || null };
}

export default function ChessBoard({ moveHistory = [], currentScore = 0, goalScore = 15, compact = false }) {
  const { board, lastTo } = applyMoves(moveHistory);

  const CELL    = compact ? 26 : 34; // px per square
  const BORDER  = 4;
  const LABEL_W = compact ? 14 : 16;

  const progress = Math.min(currentScore / goalScore, 1);

  return (
    <div style={{
      fontFamily: 'Tahoma, Arial, sans-serif',
      userSelect: 'none',
    }}>
      {/* Windows XP title bar */}
      <div style={{
        background: 'linear-gradient(180deg, #3a6fc4 0%, #1a50a0 45%, #1a50a0 55%, #2060b8 100%)',
        borderRadius: '3px 3px 0 0',
        padding: '3px 6px',
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
          ♟ Chess Board — Position Evaluation
        </span>
      </div>

      {/* Board container with XP inset border */}
      <div style={{
        background: '#d4c5a0',
        border: '3px solid',
        borderColor: '#888 #fff #fff #888',
        padding: BORDER,
        display: 'inline-block',
      }}>
        {/* Rank labels + squares */}
        <div style={{ display: 'flex' }}>
          {/* Rank labels (left) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RANKS.map(r => (
              <div key={r} style={{
                width: LABEL_W, height: CELL,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#5c3d1e',
              }}>{r}</div>
            ))}
          </div>

          {/* Board squares */}
          <div>
            {RANKS.map((rank, ri) => (
              <div key={rank} style={{ display: 'flex' }}>
                {FILES.map((file, fi) => {
                  const sq = `${file}${rank}`;
                  const isLight = (ri + fi) % 2 === 0;
                  const piece = board[sq];
                  const isLast = sq === lastTo;
                  const isKingCastle = moveHistory.includes('O-O') && (sq === 'g1' || sq === 'f1');

                  let bg = isLight ? '#f0d9b5' : '#b58863';
                  if (isLast || isKingCastle) bg = isLight ? '#cdd16f' : '#aaa23a';

                  return (
                    <div key={sq} style={{
                      width: CELL, height: CELL,
                      background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: CELL * 0.62,
                      lineHeight: 1,
                      boxShadow: isLast ? 'inset 0 0 4px rgba(0,0,0,0.4)' : 'none',
                      position: 'relative',
                    }}>
                      {piece && (
                        <span style={{
                          color: piece.startsWith('w') ? '#fff' : '#111',
                          textShadow: piece.startsWith('w')
                            ? '0 0 2px #000, 0 0 2px #000'
                            : '0 0 2px #fff6',
                          lineHeight: 1,
                          display: 'block',
                        }}>
                          {PIECES[piece]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* File labels (bottom) */}
            <div style={{ display: 'flex' }}>
              {FILES.map(f => (
                <div key={f} style={{
                  width: CELL, height: LABEL_W,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#5c3d1e',
                }}>{f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{
        marginTop: 6,
        background: '#f0f0f0',
        border: '2px inset #a0a0a0',
        padding: '6px 10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#000080' }}>Score:</span>
          <span style={{ fontSize: 11, fontWeight: 900, color: currentScore >= goalScore ? '#16a34a' : '#111',
            fontFamily: 'Courier New, monospace' }}>
            {currentScore} / {goalScore}
          </span>
        </div>
        {/* XP-style progress bar */}
        <div style={{
          height: 14, background: '#fff',
          border: '1px solid #999', borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: currentScore >= goalScore
              ? 'linear-gradient(180deg, #5aea5a 0%, #26a826 50%, #5aea5a 100%)'
              : 'linear-gradient(180deg, #79b4f5 0%, #3a6fc4 50%, #79b4f5 100%)',
            transition: 'width 0.4s ease',
            position: 'relative',
          }}>
            {/* XP shine */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
              background: 'rgba(255,255,255,0.35)',
            }} />
          </div>
        </div>

        {/* Move history pills */}
        {moveHistory.length > 0 && (
          <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {moveHistory.map((mv, i) => (
              <span key={i} style={{
                background: '#000080', color: '#fff',
                fontSize: 11, fontWeight: 800,
                padding: '1px 7px', borderRadius: 2,
                fontFamily: 'Courier New, monospace',
                border: '1px solid #0000a0',
              }}>
                {mv}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
