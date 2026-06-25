import Papa from 'papaparse';
import { parseBallotRow, buildPreferenceStats } from './ballotParser.js';

export function parseCsvText(text) {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        try {
          resolve(processParseResults(results));
        } catch (err) {
          reject(err);
        }
      },
      error: reject,
    });
  });
}

function processParseResults(results) {
  if (!results.data?.length) {
    throw new Error('CSV is empty. Add a header row and at least one ballot.');
  }

  const candidates = results.meta.fields?.filter((f) => f && f.trim() !== '') ?? [];
  if (candidates.length < 2) {
    throw new Error('Need at least two candidates in the header row.');
  }

  const ballots = [];
  let informalCount = 0;
  let skippedCells = 0;

  for (const row of results.data) {
    let rowSkipped = 0;
    for (const candidate of candidates) {
      const raw = row[candidate];
      if (raw === null || raw === undefined || String(raw).trim() === '') {
        rowSkipped++;
      } else {
        const num = Number(String(raw).trim());
        if (!Number.isFinite(num) || !Number.isInteger(num)) {
          rowSkipped++;
        }
      }
    }
    skippedCells += rowSkipped;

    const preferences = parseBallotRow(candidates, row);
    if (preferences.length === 0) {
      informalCount++;
    } else {
      ballots.push(preferences);
    }
  }

  const preferenceStats = buildPreferenceStats(candidates, ballots);

  return {
    candidates,
    ballots,
    preferenceStats,
    stats: {
      totalRows: results.data.length,
      validBallots: ballots.length,
      informalBallots: informalCount,
      skippedCells,
    },
    errors: results.errors,
  };
}
