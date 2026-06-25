export default function CsvUpload({ onParsed, onError, disabled }) {
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      onParsed(text);
    } catch {
      onError('Could not read that file. Try another CSV.');
    }
  };

  const loadSample = async () => {
    try {
      const res = await fetch('/sample-ballots.csv');
      if (!res.ok) throw new Error('Sample not found');
      const text = await res.text();
      onParsed(text);
    } catch {
      onError('Could not load the sample ballots.');
    }
  };

  return (
    <section className="upload-panel card">
      
      <div className="upload-actions">
        <label className={`btn btn-primary ${disabled ? 'btn-disabled' : ''}`}>
          Choose CSV
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFile}
            disabled={disabled}
            hidden
          />
        </label>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={loadSample}
          disabled={disabled}
        >
          Try sample ballots
        </button>
      </div>
    </section>
  );
}
