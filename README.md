# Standup Democracy Manifest

A theatrical React simulator of **Australian preferential voting** (instant-runoff). Upload a CSV of ranked ballots, step through each elimination round, and watch preferences redistribute until someone wins a majority.

## Quick start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## CSV format

- **Row 1:** candidate names (column headers)
- **Each following row:** one ballot
- **Cell values:** rank number for that candidate (`1` = first preference, `2` = second, etc.)

Example:

```csv
Alice,Bob,Charlie
1,2,3
2,1,
1,,3
bad,2,1
```

Irregular votes are handled gracefully:

- Blank cells are skipped
- Non-numeric strings are ignored
- Duplicate ranks on the same ballot keep only the first occurrence
- Ranks outside `1..n` are ignored
- Rows with no valid ranks count as **informal** and are excluded

A sample file is included at [`public/sample-ballots.csv`](public/sample-ballots.csv).

## How counting works

1. Click **Initiate Proceedings** to count first preferences (Round 1).
2. If no candidate has more than 50% of formal ballots, click **Continue** to eliminate the lowest-scoring candidate and redistribute their votes to each ballot's next active preference.
3. Repeat until someone wins a majority or only one candidate remains.

### Tie-breaking

When candidates tie for the lowest vote count in a round, the one with the **fewer total preference appearances** across all ballots is eliminated. If still tied, elimination is alphabetical.

## Stack

- [Vite](https://vitejs.dev/) + React
- [Papa Parse](https://www.papaparse.com/) for CSV
- [Recharts](https://recharts.org/) for pie and stacked bar charts

## Build

```bash
npm run build
npm run preview
```
