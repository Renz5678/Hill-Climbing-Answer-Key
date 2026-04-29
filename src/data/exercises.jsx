import React from 'react';

const step = (state, checks, decision, type) => ({ state, checks, decision, type });

// ══════════════════════════════════════════════════════════════════════════════
// EXERCISE 1  f(x) = −x⁴ + 8x³ − 18x² + 12x  |  Goal = 20  |  Start x = 0
// Verified:
//   f(0)  =  0                              ✓
//   f(1)  = −1 + 8 − 18 + 12 = 1           ✓
//   f(2)  = −16 + 64 − 72 + 24 = 0         ✓
//   f(−1) = −1 − 8 − 18 − 12 = −39         ✓
//   f(3)  = −81 + 216 − 162 + 36 = 9       ✓
//   f(4)  = −256 + 512 − 288 + 48 = 16     ✓
//   f(5)  = −625 + 1000 − 450 + 60 = −15   ✓
// ══════════════════════════════════════════════════════════════════════════════
// Graph walk points for Exercise 1
const ex1GraphPoints = [
  { x: 0, label: 'x=0' },
  { x: 1, label: 'x=1' },
];

const ex1V1 = {
  name: 'Variant 1 — Simple Hill Climbing',
  rule: 'Accept the first neighbor that is strictly better. Check x + 1 first, then x − 1.',
  graphPoints: ex1GraphPoints,
  steps: [
    step('x = 0  |  f(0) = 0',
      ['Check x + 1 = 1:  f(1) = −1 + 8 − 18 + 12 = 1',
       '1 > 0 ✓  →  first improving neighbor found, accept immediately'],
      'MOVE  x : 0 → 1', 'move'),
    step('x = 1  |  f(1) = 1',
      ['Check x + 1 = 2:  f(2) = −16 + 64 − 72 + 24 = 0',
       '0 < 1  ✗  →  not better',
       'Check x − 1 = 0:  f(0) = 0',
       '0 < 1  ✗  →  not better',
       'No improving neighbor exists in either direction'],
      'STOP  (local maximum  —  goal f = 20 NOT reached)', 'stop'),
  ],
  result: { text: 'x = 1,  f(x) = 1', reached: false, note: 'Trapped at local maximum — cannot see past the valley at f(2) = 0' },
};

const ex1V2 = {
  name: 'Variant 2 — Steepest Ascent Hill Climbing',
  rule: 'Evaluate ALL neighbors first, then move to the single best one.',
  graphPoints: ex1GraphPoints,
  steps: [
    step('x = 0  |  f(0) = 0',
      ['Evaluate ALL neighbors:',
       '  x + 1 = 1 :  f(1) = −1 + 8 − 18 + 12 = 1',
       '  x − 1 = −1 :  f(−1) = −1 − 8 − 18 − 12 = −39',
       'Best neighbor: x = 1  with f = 1',
       '1 > 0 ✓  →  best neighbor is better than current'],
      'MOVE  x : 0 → 1', 'move'),
    step('x = 1  |  f(1) = 1',
      ['Evaluate ALL neighbors:',
       '  x + 1 = 2 :  f(2) = −16 + 64 − 72 + 24 = 0',
       '  x − 1 = 0 :  f(0) = 0',
       'Best neighbor value = 0',
       '0 < 1  ✗  →  no neighbor improves on current'],
      'STOP  (local maximum  —  goal f = 20 NOT reached)', 'stop'),
  ],
  result: { text: 'x = 1,  f(x) = 1', reached: false, note: 'Same local maximum as Simple HC — both are defeated by the valley at f(2) = 0' },
};

const ex1V3 = {
  name: 'Variant 3 — Stochastic Hill Climbing',
  rule: 'Accept a randomly chosen neighbor only if strictly better. Sequence: 1, 2, 1, 3, 4, 5, 4.',
  graphPoints: [
    { x: 0, label: 'x=0' },
    { x: 1, label: 'x=1' },
    { x: 1, label: 'x=1' },
    { x: 1, label: 'x=1' },
    { x: 3, label: 'x=3' },
    { x: 4, label: 'x=4' },
    { x: 4, label: 'x=4' },
    { x: 4, label: 'x=4' },
  ],
  steps: [
    step('x = 0  |  f(0) = 0',
      ['Random draw: try x = 1',
       'f(1) = −1 + 8 − 18 + 12 = 1',
       '1 > 0 ✓  →  strictly better'],
      'MOVE  x : 0 → 1', 'move'),
    step('x = 1  |  f(1) = 1',
      ['Random draw: try x = 2',
       'f(2) = −16 + 64 − 72 + 24 = 0',
       '0 < 1  ✗  →  not strictly better'],
      'STAY at x = 1', 'reject'),
    step('x = 1  |  f(1) = 1',
      ['Random draw: try x = 1',
       'f(1) = 1  →  equal, not strictly better'],
      'STAY at x = 1', 'reject'),
    step('x = 1  |  f(1) = 1',
      ['Random draw: try x = 3',
       'f(3) = −81 + 216 − 162 + 36 = 9',
       '9 > 1 ✓  →  strictly better  (bypasses the valley at x = 2!)'],
      'MOVE  x : 1 → 3', 'move'),
    step('x = 3  |  f(3) = 9',
      ['Random draw: try x = 4',
       'f(4) = −256 + 512 − 288 + 48 = 16',
       '16 > 9 ✓  →  strictly better'],
      'MOVE  x : 3 → 4', 'move'),
    step('x = 4  |  f(4) = 16',
      ['Random draw: try x = 5',
       'f(5) = −625 + 1000 − 450 + 60 = −15',
       '−15 < 16  ✗  →  not strictly better'],
      'STAY at x = 4', 'reject'),
    step('x = 4  |  f(4) = 16',
      ['Random draw: try x = 4',
       'f(4) = 16  →  equal, not strictly better',
       'Random sequence exhausted'],
      'STOP  (sequence exhausted  —  goal f = 20 NOT reached)', 'stop'),
  ],
  result: { text: 'x = 4,  f(x) = 16', reached: false, note: 'Best result among all three — escaped the valley by randomly jumping to x = 3' },
};

// ══════════════════════════════════════════════════════════════════════════════
// EXERCISE 2  Chess  |  Goal = 15  |  Start = 0
// ══════════════════════════════════════════════════════════════════════════════
// Chess move applied AFTER each step decision
// chessMove[i] = move played at end of step i
const ex2ChessMoves = ['e4', 'Nf3', 'Bc4'];
const ex2Scores     = [0, 5, 10, 15];

const ex2Steps = [
  step('Score = 0',
    ['Available moves: e4 → 5  |  d4 → 3  |  Nf3 → 7',
     'Check first move — e4 → 5',
     '5 > 0 ✓  →  first improving move found, accept immediately'],
    'ACCEPT  e4  (score: 0 → 5)', 'move'),
  step('Score = 5  (after e4)',
    ['Available moves: Nf3 → 10  |  Bc4 → 8  |  d3 → 6',
     'Check first move — Nf3 → 10',
     '10 > 5 ✓  →  first improving move found, accept immediately'],
    'ACCEPT  Nf3  (score: 5 → 10)', 'move'),
  step('Score = 10  (after Nf3)',
    ['Available moves: Bc4 → 15  |  O-O → 12  |  d3 → 9',
     'Check first move — Bc4 → 15',
     '15 > 10 ✓  →  first improving move found',
     '15 = Goal ✓  →  GOAL REACHED'],
    'ACCEPT  Bc4  (score: 10 → 15)  —  GOAL REACHED', 'goal'),
];

// ══════════════════════════════════════════════════════════════════════════════
// EXERCISE 3  f(x) = x² − 6x + 10  |  Goal = 0  |  60 ms limit
// Verified:
//   f(0) = 10,  f(1) = 5,  f(2) = 2,  f(3) = 1,  f(4) = 2  ✓
//   discriminant = 36 − 40 = −4 < 0  →  no real root  ✓
// ══════════════════════════════════════════════════════════════════════════════
const ex3Steps = [
  step('x = 0  |  f(0) = 10  |  t = 0 ms',
    ['Check x + 1 = 1:  f(1) = 1 − 6 + 10 = 5',
     '5 < 10 ✓  →  strictly lower (minimising)'],
    'MOVE  x : 0 → 1  (t = 10 ms)', 'move'),
  step('x = 1  |  f(1) = 5  |  t = 10 ms',
    ['Check x + 1 = 2:  f(2) = 4 − 12 + 10 = 2',
     '2 < 5 ✓  →  strictly lower'],
    'MOVE  x : 1 → 2  (t = 20 ms)', 'move'),
  step('x = 2  |  f(2) = 2  |  t = 20 ms',
    ['Check x + 1 = 3:  f(3) = 9 − 18 + 10 = 1',
     '1 < 2 ✓  →  strictly lower'],
    'MOVE  x : 2 → 3  (t = 30 ms)', 'move'),
  step('x = 3  |  f(3) = 1  |  t = 30 ms',
    ['Check x + 1 = 4:  f(4) = 16 − 24 + 10 = 2',
     '2 > 1  ✗  →  not lower',
     'Check x − 1 = 2:  f(2) = 4 − 12 + 10 = 2',
     '2 > 1  ✗  →  not lower',
     'No improving neighbor  |  Time used: 30 ms of 60 ms  (time was NOT the factor)'],
    'STOP  (local minimum  —  goal f = 0 has no real solution)', 'stop'),
];

// ══════════════════════════════════════════════════════════════════════════════
// EXERCISE 4  Y(i) = −5i² + 50i  |  Goal = 150  |  Start i = 0
// Verified:
//   Y(0) = 0, Y(1) = 45, Y(2) = 80, Y(3) = 105,
//   Y(4) = 120, Y(5) = 125, Y(6) = 120  ✓
// ══════════════════════════════════════════════════════════════════════════════
const ex4Steps = [
  step('i = 0  |  Y(0) = 0',
    ['Check i + 1 = 1:  Y(1) = −5(1) + 50(1) = 45',
     '45 > 0 ✓'],
    'MOVE  i : 0 → 1', 'move'),
  step('i = 1  |  Y(1) = 45',
    ['Check i + 1 = 2:  Y(2) = −5(4) + 50(2) = −20 + 100 = 80',
     '80 > 45 ✓'],
    'MOVE  i : 1 → 2', 'move'),
  step('i = 2  |  Y(2) = 80',
    ['Check i + 1 = 3:  Y(3) = −5(9) + 50(3) = −45 + 150 = 105',
     '105 > 80 ✓'],
    'MOVE  i : 2 → 3', 'move'),
  step('i = 3  |  Y(3) = 105',
    ['Check i + 1 = 4:  Y(4) = −5(16) + 50(4) = −80 + 200 = 120',
     '120 > 105 ✓'],
    'MOVE  i : 3 → 4', 'move'),
  step('i = 4  |  Y(4) = 120',
    ['Check i + 1 = 5:  Y(5) = −5(25) + 50(5) = −125 + 250 = 125',
     '125 > 120 ✓'],
    'MOVE  i : 4 → 5', 'move'),
  step('i = 5  |  Y(5) = 125',
    ['Check i + 1 = 6:  Y(6) = −5(36) + 50(6) = −180 + 300 = 120',
     '120 < 125  ✗  →  not better',
     'Check i − 1 = 4:  Y(4) = 120',
     '120 < 125  ✗  →  not better',
     'Note: true global maximum of Y(i) is 125 at i = 5 — goal Y = 150 is unreachable'],
    'STOP  (global maximum found  —  goal Y = 150 is mathematically unreachable)', 'stop'),
];

// ══════════════════════════════════════════════════════════════════════════════
// EXERCISE 5  C(n) = n(n+1)(2n+1)/6  |  Goal = 100  |  Start n = 1
// Verified:
//   C(1)=1, C(2)=5, C(3)=14, C(4)=30, C(5)=55, C(6)=91, C(7)=140  ✓
// ══════════════════════════════════════════════════════════════════════════════
const ex5Steps = [
  step('n = 1  |  C(1) = 1·2·3 / 6 = 1',
    ['Check n + 1 = 2:  C(2) = 2·3·5 / 6 = 5',
     '5 > 1, closer to 100 ✓'],
    'MOVE  n : 1 → 2', 'move'),
  step('n = 2  |  C(2) = 5',
    ['Check n + 1 = 3:  C(3) = 3·4·7 / 6 = 14',
     '14 > 5, closer to 100 ✓'],
    'MOVE  n : 2 → 3', 'move'),
  step('n = 3  |  C(3) = 14',
    ['Check n + 1 = 4:  C(4) = 4·5·9 / 6 = 30',
     '30 > 14, closer to 100 ✓'],
    'MOVE  n : 3 → 4', 'move'),
  step('n = 4  |  C(4) = 30',
    ['Check n + 1 = 5:  C(5) = 5·6·11 / 6 = 55',
     '55 > 30, closer to 100 ✓'],
    'MOVE  n : 4 → 5', 'move'),
  step('n = 5  |  C(5) = 55',
    ['Check n + 1 = 6:  C(6) = 6·7·13 / 6 = 91',
     '91 > 55, closer to 100 ✓'],
    'MOVE  n : 5 → 6', 'move'),
  step('n = 6  |  C(6) = 91',
    ['Check n + 1 = 7:  C(7) = 7·8·15 / 6 = 140',
     '140 > 100  →  overshoots exact goal  ✗',
     'Check n − 1 = 5:  C(5) = 55',
     '55 < 91  ✗  →  moving away from goal',
     'No integer n satisfies C(n) = 100 exactly'],
    'STOP  (no exact solution exists  —  closest is C(6) = 91)', 'stop'),
];

// ══════════════════════════════════════════════════════════════════════════════
export { ex2ChessMoves, ex2Scores };

export const exercises = [
  {
    id: 1,
    title: 'Exercise 1',
    subtitle: 'Simple Function Optimization',
    tag: 'Hill Climbing — 3 Variants',
    icon: '📐',
    graph: {
      fn: x => -(x**4) + 8*(x**3) - 18*(x**2) + 12*x,
      xMin: -0.5, xMax: 5.5,
      yMin: -25,  yMax: 22,
      goalY: 20,
      label: 'f(x)',
    },
    problem: {
      desc:  'Given the function f(x) = −x⁴ + 8x³ − 18x² + 12x, where x is a real-valued input, find the maximum value of f(x) starting from x = 0.',
      fn:    'f(x) = −x⁴ + 8x³ − 18x² + 12x',
      goal:  'f(x) = 20',
      start: 'x = 0',
      ops:   'x + 1  (move right),  x − 1  (move left)',
      note:  'Apply all three variants — Simple, Steepest Ascent, and Stochastic — starting from x = 0. For Stochastic Hill Climbing, the random neighbors generated in order are: x = 1, 2, 1, 3, 4, 5, 4.',
    },
    hasVariants: true,
    variants: [ex1V1, ex1V2, ex1V3],
    followUp: 'Compare the results of all three variants. Which produced the best result, and why?',
  },
  {
    id: 2,
    title: 'Exercise 2',
    subtitle: 'Chess Position Evaluation',
    tag: 'Simple Hill Climbing',
    icon: '♟',
    chess: { moves: ex2ChessMoves, scores: ex2Scores, goalScore: 15 },
    problem: {
      desc:  'A chess engine evaluates board positions using a numerical score — the higher the score, the better the position is for White. At each step, only the first move that strictly improves the current score is accepted.',
      fn:    null,
      goal:  'Score = 15',
      start: 'Score = 0',
      ops:   'Choose any available move from the current position',
      rule:  'Only move to a position with a score strictly higher than the current one',
      movesTable: [
        { step: 1, from: 'score = 0',  moves: 'e4 → 5,  d4 → 3,  Nf3 → 7' },
        { step: 2, from: 'score = 5',  moves: 'Nf3 → 10,  Bc4 → 8,  d3 → 6' },
        { step: 3, from: 'score = 10', moves: 'Bc4 → 15,  O-O → 12,  d3 → 9' },
      ],
    },
    hasVariants: false,
    steps: ex2Steps,
    result: { text: 'Score = 15  via  e4 → Nf3 → Bc4', reached: true, note: 'Goal reached in exactly 3 steps' },
  },
  {
    id: 3,
    title: 'Exercise 3',
    subtitle: 'Minimization Under Time Constraint',
    tag: 'Simple Hill Climbing (minimisation)',
    icon: '⏱',
    graph: {
      fn: x => x**2 - 6*x + 10,
      xMin: -0.5, xMax: 5.5,
      yMin: -0.5,  yMax: 12,
      goalY: 0,
      label: 'f(x)',
      points: [
        { x: 0, label: 'x=0' },
        { x: 1, label: 'x=1' },
        { x: 2, label: 'x=2' },
        { x: 3, label: 'x=3' },
      ],
    },
    problem: {
      desc:  'Given the function f(x) = x² − 6x + 10, where x is a real-valued input, find the minimum value of f(x) starting from x = 0. Each operator application costs 10ms, and the algorithm must stop immediately once elapsed time reaches 60ms.',
      fn:    'f(x) = x² − 6x + 10',
      goal:  'f(x) = 0',
      start: 'x = 0,  elapsed time = 0 ms',
      ops:   'x + 1 (move right, +10 ms),  x − 1 (move left, +10 ms)',
      note:  'This is a minimisation problem — only move to a neighbor with a strictly lower value. Apply Simple Hill Climbing starting from x = 0 within the 60 ms time limit.',
    },
    hasVariants: false,
    steps: ex3Steps,
    result: { text: 'x = 3,  f(x) = 1,  t = 30 ms', reached: false, note: 'Stopped at local minimum — goal f = 0 has no real solution (discriminant < 0). Time was NOT the limiting factor.' },
    followUp: 'Did the algorithm find the minimum within the time limit? If not, at what point did it terminate, and how much time would full convergence require?',
  },
  {
    id: 4,
    title: 'Exercise 4',
    subtitle: 'Optimal Irrigation Schedule',
    tag: 'Simple Hill Climbing',
    icon: '🌾',
    graph: {
      fn: i => (-5)*(i**2) + 50*i,
      xMin: -0.5, xMax: 7,
      yMin: -10,   yMax: 140,
      goalY: 150,
      label: 'Y(i)',
      points: [
        { x: 0, label: 'i=0' },
        { x: 1, label: 'i=1' },
        { x: 2, label: 'i=2' },
        { x: 3, label: 'i=3' },
        { x: 4, label: 'i=4' },
        { x: 5, label: 'i=5' },
      ],
    },
    problem: {
      desc:  'A farmer wants to maximize weekly crop yield by adjusting irrigation frequency. The yield is modeled by Y(i) = −5i² + 50i, where i is the number of irrigations per week and Y(i) is the weekly yield in kg.',
      fn:    'Y(i) = −5i² + 50i',
      goal:  'Y(i) = 150',
      start: 'i = 0',
      ops:   'i + 1 (irrigate one more time per week),  i − 1 (irrigate one less time per week)',
      note:  'Apply Simple Hill Climbing starting from i = 0.',
    },
    hasVariants: false,
    steps: ex4Steps,
    result: { text: 'i = 5,  Y(i) = 125', reached: false, note: 'Global maximum is Y = 125 at i = 5. Goal Y = 150 is mathematically unreachable for this function.' },
  },
  {
    id: 5,
    title: 'Exercise 5',
    subtitle: 'Minimizing Cumulative Algorithm Cost',
    tag: 'Simple Hill Climbing',
    icon: '⚙',
    graph: {
      fn: n => n*(n+1)*(2*n+1)/6,
      xMin: 0.5, xMax: 7.5,
      yMin: -5,   yMax: 160,
      goalY: 100,
      label: 'C(n)',
      points: [
        { x: 1, label: 'n=1' },
        { x: 2, label: 'n=2' },
        { x: 3, label: 'n=3' },
        { x: 4, label: 'n=4' },
        { x: 5, label: 'n=5' },
        { x: 6, label: 'n=6' },
      ],
    },
    problem: {
      desc:  'A computer science student is benchmarking cumulative computational cost as more algorithms are added to a pipeline. The total cost at pipeline length n is defined by C(n) = n(n+1)(2n+1)/6, where n is the number of algorithms in the pipeline and C(n) is the total number of operations. The student wants to find the pipeline length where cumulative cost first meets or exceeds a budget of 100 operations.',
      fn:    'C(n) = n(n + 1)(2n + 1) / 6',
      goal:  'C(n) = 100',
      start: 'n = 1',
      ops:   'n + 1 (add one algorithm),  n − 1 (remove one algorithm)',
      rule:  'Only move to a neighbor with a higher value, closer to the goal of 100.',
      note:  'Apply Simple Hill Climbing starting from n = 1.',
    },
    hasVariants: false,
    steps: ex5Steps,
    result: { text: 'n = 6,  C(n) = 91', reached: false, note: 'No integer n satisfies C(n) = 100 exactly. Algorithm stops just below target.' },
    followUp: 'Since no pipeline length gives exactly C(n) = 100, the algorithm cannot reach the goal precisely. At what value of n does it stop, and what does this reveal about using exact target values in discrete search spaces?',
  },
];
