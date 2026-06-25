export function getFinalTwoCandidates(election) {
  const { winner, candidates, currentCounts } = election;
  if (!winner) return null;

  const runnerUp = candidates
    .filter((c) => c !== winner)
    .sort((a, b) => (currentCounts[b] ?? 0) - (currentCounts[a] ?? 0))[0];

  if (!runnerUp) return null;

  return [winner, runnerUp];
}

export function computeTwoPartyPreferred(ballots, partyA, partyB) {
  const counts = { [partyA]: 0, [partyB]: 0 };
  let exhausted = 0;

  for (const ballot of ballots) {
    const choice = ballot.find((c) => c === partyA || c === partyB);
    if (choice) {
      counts[choice]++;
    } else {
      exhausted++;
    }
  }

  const total = ballots.length;
  const paired = counts[partyA] + counts[partyB];

  return {
    partyA,
    partyB,
    counts,
    exhausted,
    total,
    percentages: {
      [partyA]: paired ? (counts[partyA] / paired) * 100 : 0,
      [partyB]: paired ? (counts[partyB] / paired) * 100 : 0,
    },
  };
}

export function buildTwoPartyChartData(twoParty) {
  return [
    {
      name: twoParty.partyA,
      votes: twoParty.counts[twoParty.partyA],
      pct: twoParty.percentages[twoParty.partyA],
    },
    {
      name: twoParty.partyB,
      votes: twoParty.counts[twoParty.partyB],
      pct: twoParty.percentages[twoParty.partyB],
    },
  ];
}
