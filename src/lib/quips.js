const ELIMINATION_QUIPS = [
  (name) => `${name} returns to the backbench.`,
  (name) => `${name} concedes with grace (and preferences).`,
  (name) => `${name} is out — the democracy giveth, the democracy taketh.`,
  (name) => `Order! ${name} has been eliminated from contention.`,
  (name) => `${name}'s campaign hits the concession speech circuit.`,
  (name) => `The people have spoken — ${name} is no longer in the running.`,
];

export function getEliminationQuip(name, round) {
  const index = (name.length + round) % ELIMINATION_QUIPS.length;
  return ELIMINATION_QUIPS[index](name);
}

export const VICTORY_QUIPS = [
  'The ayes have it!',
  'Democracy delivers a mandate!',
  'Preferences have spoken — loudly!',
  'The Teams call erupts in orderly celebration!',
];

export function getVictoryQuip(winner) {
  const index = winner.length % VICTORY_QUIPS.length;
  return VICTORY_QUIPS[index];
}
