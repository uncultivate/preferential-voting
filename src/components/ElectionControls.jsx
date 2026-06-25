export default function ElectionControls({
  election,
  parseResult,
  onBegin,
  onContinue,
  onReset,
}) {
  if (!parseResult || !election) return null;

  const { step } = election;

  if (step === 'ready') {
    return (
      <div className="controls controls--inline">
        <button type="button" className="btn btn-primary" onClick={onBegin}>
          Initiate Proceedings
        </button>
      </div>
    );
  }

  if (step === 'round') {
    return (
      <div className="controls controls--inline">
        <button type="button" className="btn btn-primary" onClick={onContinue}>
          Continue
        </button>
        <button type="button" className="btn btn-ghost btn-ghost--inline" onClick={onReset}>
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="controls controls--inline">
      <span className="controls-done controls-done--inline">Proceedings concluded</span>
      <button type="button" className="btn btn-secondary" onClick={onReset}>
        Run again
      </button>
    </div>
  );
}
