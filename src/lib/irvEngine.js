import { getTotalPreferenceCount } from './ballotParser.js';

export function createElection({ candidates, ballots, preferenceStats }) {
  return {
    candidates,
    ballots,
    preferenceStats,
    activeCandidates: [...candidates],
    eliminated: [],
    round: 0,
    step: 'ready',
    currentCounts: {},
    exhaustedCount: 0,
    history: [],
    winner: null,
    lastEliminated: null,
    totalBallots: ballots.length,
  };
}

function countCurrentVotes(election) {
  const counts = {};
  for (const c of election.activeCandidates) {
    counts[c] = 0;
  }

  let exhausted = 0;
  for (const ballot of election.ballots) {
    const vote = ballot.find((c) => election.activeCandidates.includes(c));
    if (vote) {
      counts[vote]++;
    } else {
      exhausted++;
    }
  }

  return { counts, exhausted };
}

function majorityThreshold(totalBallots) {
  return Math.floor(totalBallots / 2) + 1;
}

function findMajorityWinner(counts, threshold) {
  for (const [candidate, count] of Object.entries(counts)) {
    if (count >= threshold) return candidate;
  }
  return null;
}

function pickEliminationCandidate(tiedCandidates, ballots) {
  return [...tiedCandidates].sort((a, b) => {
    const countA = getTotalPreferenceCount(ballots, a);
    const countB = getTotalPreferenceCount(ballots, b);
    if (countA !== countB) return countA - countB;
    return a.localeCompare(b);
  })[0];
}

function completeElection(election, counts, exhausted, winner) {
  return {
    ...election,
    step: 'complete',
    currentCounts: counts,
    exhaustedCount: exhausted,
    winner,
    lastEliminated: null,
  };
}

export function beginProceedings(election) {
  if (election.totalBallots === 0) {
    return { ...election, step: 'complete', winner: null };
  }

  const { counts, exhausted } = countCurrentVotes(election);
  const threshold = majorityThreshold(election.totalBallots);
  const winner = findMajorityWinner(counts, threshold);

  const base = {
    ...election,
    round: 1,
    currentCounts: counts,
    exhaustedCount: exhausted,
    lastEliminated: null,
    history: [
      {
        round: 1,
        counts: { ...counts },
        eliminated: null,
        exhausted,
      },
    ],
  };

  if (winner) {
    return completeElection(base, counts, exhausted, winner);
  }

  return { ...base, step: 'round' };
}

export function advanceRound(election) {
  if (election.step === 'complete' || election.step === 'ready') {
    return election;
  }

  const threshold = majorityThreshold(election.totalBallots);

  if (election.activeCandidates.length <= 1) {
    const { counts, exhausted } = countCurrentVotes(election);
    const winner = election.activeCandidates[0] ?? null;
    return completeElection(election, counts, exhausted, winner);
  }

  const { counts } = countCurrentVotes(election);
  const minCount = Math.min(
    ...election.activeCandidates.map((c) => counts[c] || 0),
  );
  const tied = election.activeCandidates.filter(
    (c) => (counts[c] || 0) === minCount,
  );
  const eliminated = pickEliminationCandidate(tied, election.ballots);

  const newActive = election.activeCandidates.filter((c) => c !== eliminated);
  const afterElimination = {
    ...election,
    activeCandidates: newActive,
    eliminated: [...election.eliminated, eliminated],
    lastEliminated: eliminated,
  };

  const { counts: newCounts, exhausted } = countCurrentVotes(afterElimination);
  const nextRound = election.round + 1;

  const historyEntry = {
    round: nextRound,
    counts: { ...newCounts },
    eliminated,
    exhausted,
  };

  const updated = {
    ...afterElimination,
    round: nextRound,
    currentCounts: newCounts,
    exhaustedCount: exhausted,
    history: [...election.history, historyEntry],
  };

  const winner = findMajorityWinner(newCounts, threshold);
  if (winner) {
    return completeElection(updated, newCounts, exhausted, winner);
  }

  if (newActive.length === 1) {
    return completeElection(updated, newCounts, exhausted, newActive[0]);
  }

  if (newActive.length === 0) {
    return completeElection(updated, newCounts, exhausted, null);
  }

  return { ...updated, step: 'round' };
}
