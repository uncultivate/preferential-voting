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

const PIE_COLORS = [
  '#1b6b3a',
  '#c9a227',
  '#2d6a8f',
  '#8b3a62',
  '#5c4d7a',
  '#b85c38',
  '#3d7a6b',
  '#7a5c3d',
];

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

  const pieData = activeCandidates
    .map((name) => ({
      name,
      value: currentCounts[name] ?? 0,
    }))
    .filter((d) => d.value > 0);

  const stackedData = buildStackedBarData(candidates, preferenceStats);
  const prefLabels = getPreferenceLabels(preferenceStats, candidates);

  return (
    <section className="charts-section">
      {isComplete && twoParty ? (
        <div className="chart-card card chart-card--2pp">
          <h3>Two-party preferred</h3>
          <p className="chart-subtitle">
            Final head-to-head after preferences between {twoParty.partyA} and{' '}
            {twoParty.partyB}
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
          <ResponsiveContainer width="100%" height={200}>
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
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
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
        </div>
      ) : (
        <div className="chart-card card">
          <h3>Current round votes</h3>
          <p className="chart-subtitle">Live distribution among active candidates</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  animationDuration={600}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="chart-empty">No votes to chart this round.</p>
          )}
        </div>
      )}

      <div className="chart-card card">
        <h3>Preference distribution</h3>
        <p className="chart-subtitle">
          How voters ranked each candidate (original ballots)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stackedData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {prefLabels.map((pref, index) => (
              <Bar
                key={pref.key}
                dataKey={pref.key}
                name={pref.label}
                stackId="prefs"
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                animationDuration={600}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
