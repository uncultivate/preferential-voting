export default function BallotSummary({ parseResult }) {
  if (!parseResult) return null;

  const { candidates, stats } = parseResult;

  return (
    <section className="ballot-summary card">
      <h2>Ballot box report</h2>
      <div className="summary-grid">
        <div className="stat">
          <span className="stat-value">{stats.validBallots}</span>
          <span className="stat-label">Formal ballots</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.informalBallots}</span>
          <span className="stat-label">Informal ballots</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.skippedCells}</span>
          <span className="stat-label">Irregular cells skipped</span>
        </div>
        <div className="stat">
          <span className="stat-value">{candidates.length}</span>
          <span className="stat-label">Candidates</span>
        </div>
      </div>
      <div className="candidate-chips">
        {candidates.map((c) => (
          <span key={c} className="chip">
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}
