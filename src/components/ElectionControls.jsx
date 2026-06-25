export default function ElectionControls({
  election,
  parseResult,
  onBegin,
  onContinue,
  onReset,
}) {
  if (!parseResult) {
    return (
      <div className="controls card controls--muted">
        <p>Upload a CSV to get this democracy party started.</p>
      </div>
    );
  }

  if (!election) return null;

  const { step } = election;

  if (step === 'ready') {
    return (
      <div className="controls card">
        <button type="button" className="btn btn-hero" onClick={onBegin}>
          Initiate Proceedings
        </button>
        <p className="controls-hint">
          The Clerk will count first preferences. No eliminations yet — we save
          the drama.
        </p>
      </div>
    );
  }

  if (step === 'round') {
    return (
      <div className="controls card">
        <button type="button" className="btn btn-hero" onClick={onContinue}>
          Continue
        </button>
        <p className="controls-hint">
          Eliminate the lowest-scoring candidate and distribute their
          preferences.
        </p>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="controls card controls--complete">
      <p className="controls-done">Proceedings concluded.</p>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Run another election
      </button>
    </div>
  );
}
