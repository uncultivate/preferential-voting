import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  buildStackedBarData,
  getPreferenceLabels,
} from '../lib/ballotParser.js';
import {
  getFinalTwoCandidates,
  computeTwoPartyPreferred,
  buildTwoPartyChartData,
} from '../lib/twoPartyPreferred.js';

const CHART_COLORS = [
  '#1b6b3a',
  '#c9a227',
  '#2d6a8f',
  '#8b3a62',
  '#5c4d7a',
  '#b85c38',
  '#3d7a6b',
  '#7a5c3d',
];

function colorFor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function RoundVoteChart({ activeCandidates, currentCounts }) {
  const barData = activeCandidates
    .map((name, index) => ({
      name,
      votes: currentCounts[name] ?? 0,
      fill: colorFor(index),
    }))
    .filter((d) => d.votes > 0)
    .sort((a, b) => b.votes - a.votes);

  const pieData = barData.map(({ name, votes, fill }) => ({
    name,
    value: votes,
    fill,
  }));
  const totalVotes = pieData.reduce((sum, d) => sum + d.value, 0);

  if (barData.length === 0) {
    return <p className="chart-empty">No votes to chart this round.</p>;
  }

  return (
    <div className="round-charts">
      <div className="round-chart round-chart--donut">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={2}
              animationDuration={600}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} votes`, 'Count']}
            />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="donut-center-label"
            >
              {totalVotes}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="donut-center-sublabel"
            >
              votes
            </text>
          </PieChart>
        </ResponsiveContainer>
        <ul className="donut-legend">
          {pieData.map((entry) => (
            <li key={entry.name}>
              <span
                className="donut-legend-swatch"
                style={{ background: entry.fill }}
              />
              {entry.name}
              <span className="donut-legend-value">{entry.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="round-chart round-chart--bars">
        <ResponsiveContainer width="100%" height={Math.max(220, barData.length * 44)}>
          <BarChart
            data={barData}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.06)"
              horizontal={false}
            />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={96}
              tick={{ fontSize: 12, fill: '#5c5348' }}
            />
            <Tooltip
              formatter={(value) => [`${value} votes`, 'This round']}
              cursor={{ fill: 'rgba(27, 107, 58, 0.06)' }}
            />
            <Bar dataKey="votes" radius={[0, 6, 6, 0]} animationDuration={600}>
              {barData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function PreferenceCharts({ election, parseResult }) {
  if (!election || !parseResult || election.step === 'ready') return null;

  const { activeCandidates, currentCounts, step, winner, ballots } = election;
  const { candidates, preferenceStats } = parseResult;
  const isComplete = step === 'complete';

  const finalTwo = isComplete && winner ? getFinalTwoCandidates(election) : null;
  const twoParty =
    finalTwo && ballots
      ? computeTwoPartyPreferred(ballots, finalTwo[0], finalTwo[1])
      : null;
  const twoPartyData = twoParty ? buildTwoPartyChartData(twoParty) : [];

  const stackedData = buildStackedBarData(candidates, preferenceStats);
  const prefLabels = getPreferenceLabels(preferenceStats, candidates);

  return (
    <div className="charts-panel">
      {isComplete && twoParty ? (
        <section className="chart-card card chart-card--highlight">
          <h3>Two-party preferred</h3>
          <p className="chart-subtitle">
            Final head-to-head between {twoParty.partyA} and {twoParty.partyB}
          </p>
          <div className="tpp-bar-wrap">
            <div className="tpp-bar">
              <div
                className="tpp-bar-segment tpp-bar-segment--a"
                style={{ width: `${twoParty.percentages[twoParty.partyA]}%` }}
              />
              <div
                className="tpp-bar-segment tpp-bar-segment--b"
                style={{ width: `${twoParty.percentages[twoParty.partyB]}%` }}
              />
            </div>
            <div className="tpp-labels">
              <span className="tpp-label tpp-label--a">
                {twoParty.partyA}{' '}
                <strong>{twoParty.percentages[twoParty.partyA].toFixed(1)}%</strong>
                <span className="tpp-votes">
                  ({twoParty.counts[twoParty.partyA]} votes)
                </span>
              </span>
              <span className="tpp-label tpp-label--b">
                {twoParty.partyB}{' '}
                <strong>{twoParty.percentages[twoParty.partyB].toFixed(1)}%</strong>
                <span className="tpp-votes">
                  ({twoParty.counts[twoParty.partyB]} votes)
                </span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={twoPartyData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, _name, props) => [
                  `${value} votes (${props.payload.pct.toFixed(1)}%)`,
                  'Two-party preferred',
                ]}
              />
              <Bar dataKey="votes" radius={[0, 6, 6, 0]} animationDuration={800}>
                {twoPartyData.map((entry, index) => (
                  <Cell key={entry.name} fill={colorFor(index)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {twoParty.exhausted > 0 && (
            <p className="chart-footnote">
              {twoParty.exhausted} ballot
              {twoParty.exhausted !== 1 ? 's' : ''} ranked neither finalist.
            </p>
          )}
        </section>
      ) : (
        <section className="chart-card card">
          <h3>Current round</h3>
          <p className="chart-subtitle">
            Vote distribution among active candidates
          </p>
          <RoundVoteChart
            activeCandidates={activeCandidates}
            currentCounts={currentCounts}
          />
        </section>
      )}

      <section className="chart-card card">
        <h3>Preference distribution</h3>
        <p className="chart-subtitle">
          How voters ranked each candidate on original ballots
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={stackedData}
            margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            {prefLabels.map((pref, index) => (
              <Bar
                key={pref.key}
                dataKey={pref.key}
                name={pref.label}
                stackId="prefs"
                fill={colorFor(index)}
                animationDuration={600}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
