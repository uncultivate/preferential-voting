export function parseRank(raw, candidateCount) {
  if (raw === null || raw === undefined) return null;
  const trimmed = String(raw).trim();
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || !Number.isInteger(num)) return null;
  if (num < 1 || num > candidateCount) return null;
  return num;
}

export function parseBallotRow(candidates, row) {
  const entries = [];
  const seenRanks = new Set();

  for (const candidate of candidates) {
    const raw = row[candidate];
    const rank = parseRank(raw, candidates.length);
    if (rank === null) continue;
    if (seenRanks.has(rank)) continue;
    seenRanks.add(rank);
    entries.push({ candidate, rank });
  }

  entries.sort((a, b) => a.rank - b.rank);
  return entries.map((e) => e.candidate);
}

export function buildPreferenceStats(candidates, ballots) {
  const stats = {};
  for (const candidate of candidates) {
    stats[candidate] = {};
  }

  for (const ballot of ballots) {
    ballot.forEach((candidate, index) => {
      const pref = index + 1;
      if (!stats[candidate][pref]) stats[candidate][pref] = 0;
      stats[candidate][pref]++;
    });
  }

  return stats;
}

export function getTotalPreferenceCount(ballots, candidate) {
  return ballots.filter((ballot) => ballot.includes(candidate)).length;
}

export function buildStackedBarData(candidates, preferenceStats) {
  const maxPref = Math.max(
    1,
    ...candidates.flatMap((c) => Object.keys(preferenceStats[c] || {}).map(Number)),
  );

  return candidates.map((candidate) => {
    const row = { name: candidate };
    for (let pref = 1; pref <= maxPref; pref++) {
      row[`pref${pref}`] = preferenceStats[candidate]?.[pref] || 0;
    }
    return row;
  });
}

export function getPreferenceLabels(preferenceStats, candidates) {
  const maxPref = Math.max(
    1,
    ...candidates.flatMap((c) => Object.keys(preferenceStats[c] || {}).map(Number)),
  );
  return Array.from({ length: maxPref }, (_, i) => ({
    key: `pref${i + 1}`,
    label: ordinal(i + 1),
  }));
}

function ordinal(n) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${n}${suffix} pref`;
}
