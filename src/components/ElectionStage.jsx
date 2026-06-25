import { getEliminationQuip, getVictoryQuip } from '../lib/quips.js';

export default function ElectionStage({ election }) {
  if (!election || election.step === 'ready') return null;

  const { round, step, winner, lastEliminated, activeCandidates, eliminated } =
    election;
  const isComplete = step === 'complete';

  return (
    <section className={`election-stage card ${isComplete ? 'election-stage--victory' : ''}`}>
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
        <>
          <p className="stage-eyebrow">Round {round}</p>
          <h2 className="stage-title">The count is in</h2>
          {lastEliminated && (
            <p className="elimination-quip">
              {getEliminationQuip(lastEliminated, round)}
            </p>
          )}
        </>
      )}

      <div className="counts-table-wrap">
        <table className="counts-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Votes this round</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {election.candidates.map((candidate) => {
              const isActive = activeCandidates.includes(candidate);
              const count = election.currentCounts[candidate] ?? 0;
              const wasEliminated = eliminated.includes(candidate);

              return (
                <tr
                  key={candidate}
                  className={[
                    !isActive && wasEliminated ? 'row-eliminated' : '',
                    winner === candidate ? 'row-winner' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td>{candidate}</td>
                  <td>
                    <span className="vote-bar-wrap">
                      <span
                        className="vote-bar"
                        style={{
                          width: `${election.totalBallots ? (count / election.totalBallots) * 100 : 0}%`,
                        }}
                      />
                      <span className="vote-count">{count}</span>
                    </span>
                  </td>
                  <td>
                    {winner === candidate && (
                      <span className="badge badge-gold">Elected</span>
                    )}
                    {wasEliminated && !winner && (
                      <span className="badge badge-muted">Eliminated</span>
                    )}
                    {isActive && winner !== candidate && (
                      <span className="badge badge-green">In contention</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
