// Marketing hero artefact: a search field types a query, then the result card builds up in four steps
// (Discoverable, Credible, Right audience, Growth). One pass, then it rests; any interaction stops it.
// Pure on purpose: the component only schedules timers and renders this state.
//
// The initial state is the finished one (all typed, all four steps built, 'ready'): that is what server HTML shows
// and what reduced-motion visitors keep. Only beginRun() moves it back to an empty field.

export const MK_STEPS = 4;

export type MkPhase = 'ready' | 'running' | 'rested' | 'stopped';
/** typed: characters shown in the search field. step: how many of the four steps are built (0-4). */
export type MkState = { typed: number; step: number; phase: MkPhase };

export const TYPE_MS = 55;
export const TYPE_START_MS = 450;
export const STEP_MS = 1100;

export function finalSequence(length: number): MkState {
  return { typed: length, step: MK_STEPS, phase: 'ready' };
}

/** Start the single run. Only possible from 'ready', so it can never restart after a run or an interaction. */
export function beginRun(state: MkState): MkState {
  return state.phase === 'ready' ? { typed: 0, step: 0, phase: 'running' } : state;
}

/** One timer tick: type a character, then build the next step, then rest. */
export function tickSequence(state: MkState, length: number): MkState {
  if (state.phase !== 'running') return state;
  if (state.typed < length) return { ...state, typed: state.typed + 1 };
  if (state.step < MK_STEPS) return { ...state, step: state.step + 1 };
  return { ...state, phase: 'rested' };
}

/** Visitor jumps to a stage (1-4): the field is complete and the card shows that stage. Stops the run for good. */
export function jumpTo(state: MkState, length: number, step?: number): MkState {
  const target = step === undefined ? state.step : Math.min(MK_STEPS, Math.max(0, Math.round(step)));
  return { typed: length, step: target, phase: 'stopped' };
}

/** Any other interaction (hover, focus, key): stop where it is and finish the field so the text is readable. */
export function stopSequence(state: MkState, length: number): MkState {
  return { typed: length, step: state.step, phase: 'stopped' };
}

/** Delay before the next tick, or null when nothing should be scheduled. */
export function sequenceDelay(state: MkState, length: number): number | null {
  if (state.phase !== 'running') return null;
  if (state.typed === 0) return TYPE_START_MS;
  return state.typed < length ? TYPE_MS : STEP_MS;
}

/** Which of the card's items are built. `steps[i]` is the step (1-4) item i belongs to. */
export function builtItems(steps: number[], step: number): boolean[] {
  return steps.map((s) => s <= step);
}
