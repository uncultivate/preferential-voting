import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import BallotSummary from './components/BallotSummary.jsx';
import ElectionStage from './components/ElectionStage.jsx';
import ElectionControls from './components/ElectionControls.jsx';
import PreferenceCharts from './components/PreferenceCharts.jsx';
import { parseCsvText } from './lib/csvParser.js';
import {
  createElection,
  beginProceedings,
  advanceRound,
} from './lib/irvEngine.js';
import './styles/app.css';

export default function App() {
  const [parseResult, setParseResult] = useState(null);
  const [election, setElection] = useState(null);
  const [error, setError] = useState(null);

  const handleParsed = useCallback(async (text) => {
    setError(null);
    try {
      const result = await parseCsvText(text);
      if (result.stats.validBallots === 0) {
        throw new Error('No formal ballots found. Check your CSV ranks.');
      }
      setParseResult(result);
      setElection(createElection(result));
    } catch (err) {
      setParseResult(null);
      setElection(null);
      setError(err.message || 'Failed to parse CSV.');
    }
  }, []);

  const handleBegin = useCallback(() => {
    if (!election) return;
    setElection(beginProceedings(election));
  }, [election]);

  const handleContinue = useCallback(() => {
    if (!election) return;
    setElection(advanceRound(election));
  }, [election]);

  const handleReset = useCallback(() => {
    if (parseResult) {
      setElection(createElection(parseResult));
    } else {
      setElection(null);
      setParseResult(null);
    }
    setError(null);
  }, [parseResult]);

  const proceedingsActive =
    election?.step === 'round' || election?.step === 'complete';

  return (
    <div className="app">
      <Header
        onParsed={handleParsed}
        onError={setError}
        uploadDisabled={proceedingsActive}
      />

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <main className="main">
        <div className="action-bar card">
          {parseResult ? (
            <>
              <BallotSummary parseResult={parseResult} />
              <ElectionControls
                election={election}
                parseResult={parseResult}
                onBegin={handleBegin}
                onContinue={handleContinue}
                onReset={handleReset}
              />
            </>
          ) : (
            <p className="action-bar-hint">
              Upload a CSV to get this democracy party started.
            </p>
          )}
        </div>

        {proceedingsActive && (
          <div className="dashboard">
            <ElectionStage election={election} />
            <PreferenceCharts election={election} parseResult={parseResult} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Should preferential voting decide ANDII standup order? You be the judge.
        </p>
      </footer>
    </div>
  );
}
