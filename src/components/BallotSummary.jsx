export default function BallotSummary({ parseResult }) {
  if (!parseResult) return null;

  const { candidates, stats } = parseResult;

  return (
    <div className="ballot-summary">
      <span className="ballot-summary-label">Ballot box report</span>
      <div className="summary-inline">
        <div className="stat stat--inline">
          <span className="stat-value">{stats.validBallots}</span>
          <span className="stat-label">formal</span>
        </div>
        <div className="stat stat--inline">
          <span className="stat-value">{stats.informalBallots}</span>
          <span className="stat-label">informal</span>
        </div>
        <div className="stat stat--inline">
          <span className="stat-value">{stats.skippedCells}</span>
          <span className="stat-label">skipped</span>
        </div>
        <div className="stat stat--inline">
          <span className="stat-value">{candidates.length}</span>
          <span className="stat-label">candidates</span>
        </div>
      </div>
      <div className="candidate-chips">
        {candidates.map((c) => (
          <span key={c} className="chip chip--sm">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
