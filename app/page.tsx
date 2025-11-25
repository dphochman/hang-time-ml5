'use client';

import { useState, useCallback } from 'react';
import UploadPlayer from '/components/UploadPlayer';
import ML5Viewer from '/components/ML5Viewer';
import AnalysisPanel, { AnalysisComment } from '/components/AnalysisPanel';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisComment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAnalyze = useCallback(async (meta: { duration?: number }) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const payload = {
        filename: file.name,
        size: file.size,
        type: file.type,
        duration: meta.duration ?? duration,
        lastModified: file.lastModified
      };
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setAnalysis(data.comments);
    } catch (e: any) {
      setError(e.message || 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  }, [file, duration]);

  return (
    <main>
      <header className="hero">
        <div className="hero-overlay">
          <h1>Learn To Jump Higher</h1>
          <p>Upload A Video Of Your Jump, And We Will Do The Rest</p>
        </div>
        <video className="hero-bg" muted autoPlay loop playsInline aria-hidden="true">
          <source src="/placeholder.mov" type="video/mov" />
        </video>
      </header>

      <section className="three-col">
        <div className="col col-left">
          <h2>1) Upload & Preview</h2>
          <UploadPlayer onFile={setFile} onDuration={(d: number)=>setDuration(d)} />
          <button
            className="primary"
            onClick={() => onAnalyze({ duration: duration ?? undefined })}
            disabled={!file || loading}
            aria-disabled={!file || loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Jump'}
          </button>
          {error && <p className="error" role="alert">{error}</p>}
        </div>

        <div className="col col-middle">
          <h2>2) Pose (ml5.js)</h2>
          <ML5Viewer file={file} />
        </div>

        <div className="col col-right">
          <h2>3) Insights</h2>
          <AnalysisPanel comments={analysis} />
        </div>
      </section>

      <section className="accordion">
        <details>
          <summary>Hang Time Technology</summary>
          <div className="accordion-content">
            <p>
              Using ML5.js to recognize joints and limbs in video files.
            </p>
          </div>
        </details>
        <details>
          <summary>Hang Time Team</summary>
          <div className="accordion-content">
              <h3>Adam Daniel</h3>
              <h3>Yoav Hochman</h3>
          </div>
        </details>
        <details>
          <summary>Hang Time Tips</summary>
          <div className="accordion-content">
              <h3>To take a better video</h3>
              <ul>
                <li>Ideally, someone else should shoot the video, so that you can focus on your jump and not the phone or camera.</li>
                <li>Place the camera about 20-25 feet from the basket.</li>
                <li>Do not use a ball ... focus on the jump and not the dunk</li>
              </ul>
              <h3> To improve your jump </h3>
          </div>
        </details>
      </section>
    </main>
  );
}
