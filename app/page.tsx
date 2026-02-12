'use client';

// Force rebuild: CSS Modules version
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(
    process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || 
    'https://videos.pexels.com/video-files/10677463/10677463-hd_1920_1080_30fps.mp4'
  );
  const [patientId, setPatientId] = useState('P001');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, patientId, description }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Unknown';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgAnimation} />
      
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>馃敩</span>
          <span className={styles.logoText}>MediVision AI</span>
        </div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink} style={{color: '#60a5fa'}}>Analysis</a>
          <a href="/reports" className={styles.navLink}>Reports</a>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={`${styles.card} ${styles.fadeIn}`}>
          
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              AI-Powered
              <span className={styles.titleGradient}> Medical Analysis</span>
            </h1>
            <p className={styles.subtitle}>
              Advanced facial analysis for post-operative recovery assessment
            </p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className={styles.input}
                placeholder="Enter patient identifier"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.inputGroupFull}`}>
              <label className={styles.label}>Video Source URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className={styles.input}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.inputGroupFull}`}>
              <label className={styles.label}>Clinical Notes (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Post-operative day 3, patient reports mild discomfort..."
              />
            </div>
          </div>

          {videoUrl && (
            <div className={styles.videoContainer}>
              <video
                src={videoUrl}
                controls
                className={styles.video}
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Analyzing...
              </>
            ) : (
              <>
                <span className={styles.buttonIcon}>鉁?/span>
                Start AI Analysis
              </>
            )}
          </button>

          {error && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>鈿?/span>
              {error}
            </div>
          )}

          {result && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h3 className={styles.resultTitle}>Analysis Complete</h3>
                <span 
                  className={styles.badge}
                  style={{
                    background: `${getRiskColor(result.aiResult?.riskLevel)}20`,
                    color: getRiskColor(result.aiResult?.riskLevel),
                    borderColor: getRiskColor(result.aiResult?.riskLevel)
                  }}
                >
                  {getRiskText(result.aiResult?.riskLevel)}
                </span>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>{result.aiResult?.symmetry?.score}</span>
                  <span className={styles.metricLabel}>Symmetry Score</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricValue}>
                    {Math.round(result.aiResult?.confidence * 100)}%
                  </span>
                  <span className={styles.metricLabel}>AI Confidence</span>
                </div>
                <div className={styles.metric}>
                  <span 
                    className={styles.metricValue}
                    style={{color: result.aiResult?.redness?.detected ? '#ef4444' : '#10b981'}}
                  >
                    {result.aiResult?.redness?.detected ? 'Yes' : 'No'}
                  </span>
                  <span className={styles.metricLabel}>Redness</span>
                </div>
              </div>

              <div className={styles.summary}>
                <p className={styles.summaryText}>{result.aiResult?.summary}</p>
              </div>

              <a href="/reports" className={styles.link}>
                View Full Report 鈫?              </a>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          Powered by Advanced AI 鈥?Secure & HIPAA Compliant
        </p>
      </footer>
    </div>
  );
}
