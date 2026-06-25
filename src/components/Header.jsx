import CsvUpload from './CsvUpload.jsx';

export default function Header({ onParsed, onError, uploadDisabled }) {
  return (
    <header className="header">
      <p className="header-eyebrow">The Jono Electoral Commission presents...</p>
      <div className="header-title-row">
        <h1 className="header-title">Standup Democracy Manifest</h1>
        <CsvUpload
          onParsed={onParsed}
          onError={onError}
          disabled={uploadDisabled}
        />
      </div>
      <p className="header-tagline">
        Who will be elected Member for ANDII Standup? Eliminated? It's your turn for an update!
      </p>
    </header>
  );
}
