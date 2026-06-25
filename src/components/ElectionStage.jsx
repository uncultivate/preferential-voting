import { getEliminationQuip, getVictoryQuip } from '../lib/quips.js';

function tallyRows(election) {
  const { candidates, activeCandidates, currentCounts, eliminated, winner } =
    election;

  return [...candidates]
    .map((candidate) => ({
      candidate,
      count: currentCounts[candidate] ?? 0,
      isActive: activeCandidates.includes(candidate),
      wasEliminated: eliminated.includes(candidate),
      isWinner: winner === candidate,
    }))
    .sort((a, b) => {
      if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return b.count - a.count;
    });
}

export default function ElectionStage({ election }) {
  if (!election || election.step === 'ready') return null;

  const { round, step, winner, lastEliminated, activeCandidates } = election;
  const isComplete = step === 'complete';
  const rows = tallyRows(election);
  const maxCount = Math.max(...rows.map((r) => r.count), 1);

  return (
    <section
      className={`election-stage card ${isComplete ? 'election-stage--victory' : ''}`}
    >
      {isComplete && winner && (
        <div className="victory-banner">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="confetti-piece" style={{ '--i': i }} />
            ))}
          </div>
          <p className="stage-eyebrow">We have a winner</p>
          <h2 className="winner-name">{winner}</h2>
          <p className="stage-quip">{getVictoryQuip(winner)}</p>
        </div>
      )}

      {isComplete && !winner && (
        <div className="no-winner">
          <h2>No winner declared</h2>
          <p>Every ballot exhausted its preferences. Democracy shrugs.</p>
        </div>
      )}

      {!isComplete && (
        <header className="stage-header">
          <div>
            <p className="stage-eyebrow">Round {round}</p>
            <h2 className="stage-title">Live tally</h2>
          </div>
          <div className="stage-meta">
            <span className="meta-pill">
              {activeCandidates.length} in contention
            </span>
            <span className="meta-pill meta-pill--muted">
              {election.totalBallots} ballots
            </span>
          </div>
        </header>
      )}

      {!isComplete && lastEliminated && (
        <p className="elimination-quip">
          {getEliminationQuip(lastEliminated, round)}
        </p>
      )}

      <ul className="tally-list" aria-label="Candidate vote tally">
        {rows.map(
          ({ candidate, count, isActive, wasEliminated, isWinner }) => {
            const pct = election.totalBallots
              ? (count / election.totalBallots) * 100
              : 0;

            return (
              <li
                key={candidate}
                className={[
                  'tally-row',
                  wasEliminated && !isWinner ? 'tally-row--eliminated' : '',
                  isWinner ? 'tally-row--winner' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className="tally-row-top">
                  <span className="tally-name">{candidate}</span>
                  <span className="tally-votes">
                    <strong>{count}</strong>
                    <span className="tally-pct">{pct.toFixed(0)}%</span>
                  </span>
                </div>
                <div className="tally-bar-track" aria-hidden="true">
                  <span
                    className="tally-bar-fill"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <div className="tally-status">
                  {isWinner && (
                    <span className="badge badge-gold">Elected</span>
                  )}
                  {wasEliminated && !isWinner && (
                    <span className="badge badge-muted">Eliminated</span>
                  )}
                  {isActive && !isWinner && (
                    <span className="badge badge-green">In contention</span>
                  )}
                </div>
              </li>
            );
          },
        )}
      </ul>

      {election.exhaustedCount > 0 && (
        <p className="exhausted-note">
          {election.exhaustedCount} ballot
          {election.exhaustedCount !== 1 ? 's' : ''} exhausted (no remaining
          preferences among active candidates).
        </p>
      )}
    </section>
  );
}
