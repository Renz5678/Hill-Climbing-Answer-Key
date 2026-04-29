// ─────────────────────────────────────────────────────────────────────────────
// Utility: evaluate the named function at x
// ─────────────────────────────────────────────────────────────────────────────
export function evalFn(fnId, x) {
  switch (fnId) {
    case 'parabola':     return x * x + 2 * x;                       // x² + 2x
    case 'multimodal':   return -(x) * (x - 3) * (x - 4) * (x - 8); // -x(x-3)(x-4)(x-8)
    case 'stochastic2':  return -(x * x) + 6 * x;                    // -x² + 6x
    case 'plateau':      return Math.round(-(x * x - 8 * x) / 5);    // plateau near x=3,4,5
    default: return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate a dense curve array for Recharts
// ─────────────────────────────────────────────────────────────────────────────
export function buildCurve(fnId, xMin, xMax, steps = 300) {
  const points = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    points.push({ x: parseFloat(x.toFixed(3)), y: parseFloat(evalFn(fnId, x).toFixed(4)) });
  }
  return points;
}

// ─────────────────────────────────────────────────────────────────────────────
// SIMPLE HILL CLIMBING — step generator
// Tries operators one at a time; moves immediately on improvement.
// ─────────────────────────────────────────────────────────────────────────────
export function buildSimpleHCSteps({ fnId, startX, goalValue, operators }) {
  const steps = [];
  let x = startX;
  let fx = evalFn(fnId, x);

  steps.push({
    x, fx,
    phase: 'init',
    neighbors: [],
    log: `Evaluate initial state: f(${x}) = ${fx}\nCurrent state ≠ goal state (${fx} ≠ ${goalValue})`,
  });

  let maxIter = 30;
  while (maxIter-- > 0) {
    let moved = false;
    let triedAll = true;

    for (const op of operators) {
      const nx = x + op.delta;
      const nfx = evalFn(fnId, nx);

      steps.push({
        x, fx,
        phase: 'evaluating',
        neighbors: [{ x: nx, fx: nfx }],
        log: `Apply operator (${op.label})\nNew state: x ${op.delta >= 0 ? '+' : ''}${op.delta} = ${nx}\nEvaluate: f(${nx}) = ${nfx}`,
      });

      if (nfx === goalValue) {
        steps.push({
          x: nx, fx: nfx,
          phase: 'goal',
          neighbors: [],
          log: `f(${nx}) = ${nfx} == goal state ✓\nReturn x = ${nx}\nAlgorithm terminates — goal reached.`,
        });
        return steps;
      }

      if (nfx > fx) {
        steps.push({
          x: nx, fx: nfx,
          phase: 'moving',
          neighbors: [],
          log: `f(${nx}) = ${nfx} > f(${x}) = ${fx}\nMove to new state x = ${nx}`,
        });
        x = nx; fx = nfx;
        moved = true;
        break; // simple HC moves immediately
      } else {
        steps.push({
          x, fx,
          phase: 'no-move',
          neighbors: [],
          log: `f(${x}) = ${fx} > f(${nx}) = ${nfx}\nDo not move.`,
        });
      }
    }

    if (!moved) {
      steps.push({
        x, fx,
        phase: 'stuck',
        neighbors: [],
        log: `No operators improve the current state.\nLocal maximum at x = ${x}, f(${x}) = ${fx}\nAlgorithm is STUCK — terminating.`,
      });
      return steps;
    }
  }
  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEEPEST-ASCENT HILL CLIMBING — step generator
// Evaluates ALL operators first, then moves to the best one.
// ─────────────────────────────────────────────────────────────────────────────
export function buildSteepestHCSteps({ fnId, startX, goalValue, operators }) {
  const steps = [];
  let x = startX;
  let fx = evalFn(fnId, x);

  steps.push({
    x, fx,
    phase: 'init',
    neighbors: [],
    log: `Evaluate initial state: f(${x}) = ${fx}\nCurrent state ≠ goal state (${fx} ≠ ${goalValue})\nSet target = NULL`,
  });

  let maxIter = 30;
  while (maxIter-- > 0) {
    let target = null;
    let targetFx = -Infinity;
    const allNeighbors = [];

    for (const op of operators) {
      const nx = x + op.delta;
      const nfx = evalFn(fnId, nx);
      allNeighbors.push({ x: nx, fx: nfx });

      if (nfx === goalValue) {
        steps.push({
          x, fx,
          phase: 'evaluating',
          neighbors: allNeighbors,
          log: `Apply operator (${op.label})\nNew state: x = ${nx}, f(${nx}) = ${nfx}\nGoal state found!`,
        });
        steps.push({
          x: nx, fx: nfx,
          phase: 'goal',
          neighbors: [],
          log: `f(${nx}) = ${nfx} == goal state ✓\nReturn x = ${nx}. Algorithm terminates.`,
        });
        return steps;
      }

      if (nfx > targetFx) {
        target = nx; targetFx = nfx;
        steps.push({
          x, fx,
          phase: 'evaluating',
          neighbors: allNeighbors.slice(),
          log: `Apply operator (${op.label})\nNew state: x = ${nx}, f(${nx}) = ${nfx}\nSet target = x = ${nx}`,
        });
      } else {
        steps.push({
          x, fx,
          phase: 'evaluating',
          neighbors: allNeighbors.slice(),
          log: `Apply operator (${op.label})\nNew state: x = ${nx}, f(${nx}) = ${nfx}\ntarget f = ${targetFx} > f(${nx}) = ${nfx}, target stays.`,
        });
      }
    }

    // All operators applied
    if (target !== null && targetFx > fx) {
      steps.push({
        x: target, fx: targetFx,
        phase: 'moving',
        neighbors: [],
        log: `All operators applied.\nf(target) = ${targetFx} > f(current) = ${fx}\nMove to x = ${target}`,
      });
      x = target; fx = targetFx;
    } else {
      steps.push({
        x, fx,
        phase: 'stuck',
        neighbors: [],
        log: `All operators applied.\nf(target) = ${targetFx} ≤ f(current) = ${fx}\nNo improvement possible.\nReturn FAILURE — local maximum at x = ${x}, f(${x}) = ${fx}`,
      });
      return steps;
    }
  }
  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCHASTIC HILL CLIMBING — step generator
// Picks a random uphill neighbor; stops when no improvement found.
// Uses the PDF's exact random sequence when provided.
// ─────────────────────────────────────────────────────────────────────────────
export function buildStochasticHCSteps({ fnId, startX, goalValue, randomSequence }) {
  const steps = [];
  let x = startX;
  let fx = evalFn(fnId, x);

  steps.push({
    x, fx,
    phase: 'init',
    neighbors: [],
    log: `Evaluate initial solution: f(${x}) = ${fx}\nInitial solution ≠ goal state (${fx} ≠ ${goalValue})`,
  });

  let noImproveCount = 0;
  for (const nx of randomSequence) {
    const nfx = evalFn(fnId, nx);

    steps.push({
      x, fx,
      phase: 'evaluating',
      neighbors: [{ x: nx, fx: nfx }],
      log: `Generate random neighbor: x = ${nx}\nEvaluate neighbor: f(${nx}) = ${nfx}`,
    });

    if (nfx === goalValue) {
      steps.push({
        x: nx, fx: nfx,
        phase: 'goal',
        neighbors: [],
        log: `Neighbor == goal state (${nfx} == ${goalValue}) ✓\nReturn x = ${nx}`,
      });
      return steps;
    }

    if (nfx > fx) {
      steps.push({
        x: nx, fx: nfx,
        phase: 'moving',
        neighbors: [],
        log: `f(${nx}) = ${nfx} > f(${x}) = ${fx}\nMove to neighbor x = ${nx}`,
      });
      x = nx; fx = nfx;
      noImproveCount = 0;
    } else {
      steps.push({
        x, fx,
        phase: 'no-move',
        neighbors: [],
        log: `f(${nx}) = ${nfx} < f(${x}) = ${fx}\nDo not move.`,
      });
      noImproveCount++;
      if (noImproveCount >= 2) {
        steps.push({
          x, fx,
          phase: 'stuck',
          neighbors: [],
          log: `Termination condition met (no improvement found).\nReturn current solution x = ${x}, f(${x}) = ${fx}\n(Local maximum — goal not reached)`,
        });
        return steps;
      }
    }
  }

  steps.push({
    x, fx,
    phase: 'stuck',
    neighbors: [],
    log: `Termination condition met.\nReturn x = ${x}, f(${x}) = ${fx}`,
  });
  return steps;
}

// ─────────────────────────────────────────────────────────────────────────────
// PLATEAU HILL CLIMBING — illustrates getting stuck on flat regions
// ─────────────────────────────────────────────────────────────────────────────
export function buildPlateauHCSteps({ fnId, startX, goalValue, operators }) {
  const steps = [];
  let x = startX;
  let fx = evalFn(fnId, x);

  steps.push({
    x, fx,
    phase: 'init',
    neighbors: [],
    log: `Evaluate initial state: f(${x}) = ${fx}\nCurrent state ≠ goal state (${fx} ≠ ${goalValue})\nSearching for improvement...`,
  });

  let plateauCount = 0;
  let maxIter = 20;
  while (maxIter-- > 0) {
    let moved = false;
    let hitPlateau = false;

    for (const op of operators) {
      const nx = x + op.delta;
      const nfx = evalFn(fnId, nx);

      steps.push({
        x, fx,
        phase: 'evaluating',
        neighbors: [{ x: nx, fx: nfx }],
        log: `Apply operator (${op.label})\nNew state: x = ${nx}, f(${nx}) = ${nfx}`,
      });

      if (nfx > fx) {
        steps.push({
          x: nx, fx: nfx,
          phase: 'moving',
          neighbors: [],
          log: `f(${nx}) = ${nfx} > f(${x}) = ${fx}\nMove to x = ${nx}`,
        });
        x = nx; fx = nfx;
        moved = true;
        plateauCount = 0;
        break;
      } else if (nfx === fx) {
        steps.push({
          x, fx,
          phase: 'plateau',
          neighbors: [{ x: nx, fx: nfx }],
          log: `[PLATEAU DETECTED]\nf(${nx}) = ${nfx} = f(${x}) = ${fx}\nNeighbor has equal value — no strict improvement.\nAlgorithm cannot distinguish between states!`,
        });
        hitPlateau = true;
        plateauCount++;
      } else {
        steps.push({
          x, fx,
          phase: 'no-move',
          neighbors: [],
          log: `f(${x}) = ${fx} > f(${nx}) = ${nfx}\nDo not move.`,
        });
      }
    }

    if (!moved) {
      const reason = hitPlateau
        ? `All neighboring states have equal value (plateau).\nAlgorithm is STUCK on the plateau!\nf(${x}) = ${fx} — cannot improve.`
        : `No operators improve the current state.\nLocal maximum at x = ${x}, f(${x}) = ${fx}`;
      steps.push({
        x, fx,
        phase: 'stuck',
        neighbors: [],
        log: reason,
      });
      return steps;
    }
  }
  return steps;
}
