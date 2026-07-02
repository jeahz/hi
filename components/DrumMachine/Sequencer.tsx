'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { getAudioContext, playDrum, TRACKS } from "./drumSynth";
import "./Sequencer.scss";

const STEPS = 16;

const emptyGrid = (): boolean[][] =>
  TRACKS.map(() => Array<boolean>(STEPS).fill(false));

type MagentaStatus = "idle" | "loading" | "ready" | "thinking";

export default function Sequencer({ volume }: { volume: number }) {
  const [grid, setGrid] = useState<boolean[][]>(emptyGrid);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [step, setStep] = useState(-1);          // current playhead column
  const [ai, setAi] = useState<MagentaStatus>("idle");

  // Refs so the scheduler reads live values without re-subscribing.
  const gridRef = useRef(grid); gridRef.current = grid;
  const bpmRef = useRef(bpm); bpmRef.current = bpm;
  const volRef = useRef(volume); volRef.current = volume;
  const rnnRef = useRef<unknown>(null);          // lazily-loaded Magenta model

  const toggle = (t: number, s: number) =>
    setGrid((g) => g.map((row, ti) => (ti === t ? row.map((v, si) => (si === s ? !v : v)) : row)));

  const clear = () => setGrid(emptyGrid());

  // --- Transport: lookahead scheduler (schedules ahead of the audio clock) ---
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextStepRef = useRef(0);
  const nextTimeRef = useRef(0);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
    setStep(-1);
  }, []);

  const start = useCallback(() => {
    const ctx = getAudioContext();
    nextStepRef.current = 0;
    nextTimeRef.current = ctx.currentTime + 0.06;
    setPlaying(true);

    // Every 25ms, schedule any steps falling within the next 100ms window.
    timerRef.current = setInterval(() => {
      const c = getAudioContext();
      const secPerStep = 60 / bpmRef.current / 4; // 16th notes
      while (nextTimeRef.current < c.currentTime + 0.1) {
        const s = nextStepRef.current;
        const when = nextTimeRef.current;
        gridRef.current.forEach((row, ti) => {
          if (row[s]) playDrum(TRACKS[ti].type, volRef.current / 100, when);
        });
        // Reflect the playhead in the UI at the scheduled time.
        const uiStep = s;
        const delayMs = Math.max(0, (when - c.currentTime) * 1000);
        setTimeout(() => setStep(uiStep), delayMs);

        nextStepRef.current = (s + 1) % STEPS;
        nextTimeRef.current += secPerStep;
      }
    }, 25);
  }, []);

  const togglePlay = () => (playing ? stop() : start());

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // --- Magenta: load model once, generate / continue a groove ---
  const ensureModel = async () => {
    if (rnnRef.current) return rnnRef.current;
    setAi("loading");
    const { MusicRNN } = await import("@magenta/music/esm/music_rnn/model");
    const rnn = new MusicRNN(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn"
    );
    await rnn.initialize();
    rnnRef.current = rnn;
    setAi("ready");
    return rnn;
  };

  type SeqNote = { pitch: number; quantizedStartStep: number; quantizedEndStep: number; isDrum: boolean };

  // Build an already-quantized NoteSequence from a list of notes. `totalSteps`
  // sets where the seed ends — the model then generates AFTER that point.
  const buildSequence = (notes: SeqNote[], totalSteps: number) => ({
    notes,
    quantizationInfo: { stepsPerQuarter: 4 },
    totalQuantizedSteps: totalSteps,
  });

  // Notes for the current grid (empty if nothing is toggled). Uses each
  // track's canonical (first) pitch when sending back to the model.
  const gridNotes = (): SeqNote[] => {
    const notes: SeqNote[] = [];
    gridRef.current.forEach((row, ti) => {
      row.forEach((on, s) => {
        if (on) notes.push({ pitch: TRACKS[ti].pitches[0], quantizedStartStep: s, quantizedEndStep: s + 1, isDrum: true });
      });
    });
    return notes;
  };

  // Find which track a model pitch belongs to (−1 if none).
  const trackForPitch = (pitch: number) => TRACKS.findIndex((t) => t.pitches.includes(pitch));

  // Map a NoteSequence's notes onto our grid, offsetting steps by `shift`.
  const applyNotes = (notes: { pitch: number; quantizedStartStep?: number }[], base?: boolean[][], shift = 0) => {
    const next = base ? base.map((r) => [...r]) : emptyGrid();
    notes.forEach((n) => {
      const ti = trackForPitch(n.pitch);
      const s = (n.quantizedStartStep ?? 0) + shift;
      if (ti >= 0 && s >= 0 && s < STEPS) next[ti][s] = true;
    });
    setGrid(next);
  };

  const generate = async (continueFromGrid: boolean) => {
    try {
      const rnn = (await ensureModel()) as {
        continueSequence: (seq: unknown, steps: number, temp: number) => Promise<{ notes?: { pitch: number; quantizedStartStep?: number }[] }>;
      };
      setAi("thinking");

      // Seed: current grid when continuing; a single kick for a fresh groove.
      // The model generates AFTER the seed's end, so we seed with a short
      // 1-step primer and then shift the continuation back to fill steps 0-15.
      const existing = gridNotes();
      const continuing = continueFromGrid && existing.length > 0;
      const seedSteps = continuing ? STEPS : 1;
      const seedNotes: SeqNote[] = continuing
        ? existing
        : [{ pitch: 36, quantizedStartStep: 0, quantizedEndStep: 1, isDrum: true }];

      const seed = buildSequence(seedNotes, seedSteps);
      const out = await rnn.continueSequence(seed, STEPS, 1.25);
      const outNotes = out.notes || [];

      // continueSequence returns the continuation with steps starting at 0
      // (not offset by the seed length), so no shift is needed.
      if (continuing) {
        // Overlay the AI continuation on top of the current bar.
        applyNotes(outNotes, gridRef.current, 0);
      } else {
        applyNotes(outNotes, undefined, 0);
      }
      setAi("ready");
    } catch (err) {
      console.error(err);
      setAi("idle");
    }
  };

  const aiLabel =
    ai === "loading" ? "Loading AI…" : ai === "thinking" ? "Thinking…" : "✨ Generate";
  const busy = ai === "loading" || ai === "thinking";

  return (
    <section className="seq">
      <div className="seq__head">
        <h2 className="seq__title">AI Step Sequencer</h2>
        <span className="seq__sub">Magenta drum model — runs in your browser</span>
      </div>

      <div className="seq__transport">
        <button className="seq__btn seq__btn--play" onClick={togglePlay}>
          {playing ? "■ Stop" : "▶ Play"}
        </button>
        <label className="seq__bpm">
          BPM
          <input
            type="range" min={60} max={180} value={bpm}
            onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          />
          <span>{bpm}</span>
        </label>
        <button className="seq__btn" onClick={() => generate(false)} disabled={busy}>{aiLabel}</button>
        <button className="seq__btn" onClick={() => generate(true)} disabled={busy}>↳ Continue</button>
        <button className="seq__btn" onClick={clear} disabled={busy}>Clear</button>
      </div>

      <div className="seq__grid">
        {TRACKS.map((track, ti) => (
          <div className="seq__row" key={track.name}>
            <span className="seq__label">{track.name}</span>
            <div className="seq__cells">
              {grid[ti].map((on, s) => (
                <button
                  key={s}
                  className={
                    "seq__cell" +
                    (on ? " is-on" : "") +
                    (step === s ? " is-head" : "") +
                    (s % 4 === 0 ? " is-beat" : "")
                  }
                  onClick={() => toggle(ti, s)}
                  aria-label={`${track.name} step ${s + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
