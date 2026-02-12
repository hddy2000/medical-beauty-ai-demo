'use client';

import { useState, useEffect } from 'react';

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div style={styles.container}>
      {/* Animated background */}
      <div style={styles.bgAnimation} />
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>馃敩</span>
          <span style={styles.logoText}>MediVision AI</span>
        </div>
        <nav style={styles.nav}>
          <a href="/" style={{...styles.navLink, color: '#60a5fa'}}>Analysis</a>
          <a href="/reports" style={styles.navLink}>Reports</a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out'
        }}>
          
          {/* Title Section */}
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              AI-Powered
              <span style={styles.titleGradient}> Medical Analysis</span>
            </h1>
            <p style={styles.subtitle}>
              Advanced facial analysis for post-operative recovery assessment
            </p>
          </div>

          {/* Input Section */}
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Patient ID</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={styles.input}
                placeholder="Enter patient identifier"
              />
            </div>

            <div style={{...styles.inputGroup, gridColumn: 'span 2'}}>
              <label style={styles.label}>Video Source URL</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={styles.input}
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div style={{...styles.inputGroup, gridColumn: 'span 2'}}>
              <label style={styles.label}>Clinical Notes (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{...styles.input, minHeight: 80, resize: 'vertical'}}
                placeholder="Post-operative day 3, patient reports mild discomfort..."
              />
            </div>
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div style={{
              ...styles.videoContainer,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s ease-out 0.2s'
            }}>
              <video
                src={videoUrl}
                controls
                style={styles.video}
              />
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                Analyzing...
              </>
            ) : (
              <>
                <span style={styles.buttonIcon}>鉁?/span>
                Start AI Analysis
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div style={styles.errorBox}>
              <span style={styles.errorIcon}>鈿?/span>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{
              ...styles.resultCard,
              animation: 'slideIn 0.5s ease-out'
            }}>
              <div style={styles.resultHeader}>
                <h3 style={styles.resultTitle}>Analysis Complete</h3>
                <span style={{
                  ...styles.badge,
                  background: `${getRiskColor(result.aiResult?.riskLevel)}20`,
                  color: getRiskColor(result.aiResult?.riskLevel),
                  borderColor: getRiskColor(result.aiResult?.riskLevel)
                }}>
                  {getRiskText(result.aiResult?.riskLevel)}
                </span>
              </div>

              <div style={styles.metrics}>
                <div style={styles.metric}>
                  <span style={styles.metricValue}>{result.aiResult?.symmetry?.score}</span>
                  <span style={styles.metricLabel}>Symmetry Score</span>
                </div>
                <div style={styles.metric}>
                  <span style={styles.metricValue}>
                    {Math.round(result.aiResult?.confidence * 100)}%
                  </span>
                  <span style={styles.metricLabel}>AI Confidence</span>
                </div>
                <div style={styles.metric}>
                  <span style={{...styles.metricValue, color: result.aiResult?.redness?.detected ? '#ef4444' : '#10b981'}}>
                    {result.aiResult?.redness?.detected ? 'Yes' : 'No'}
                  </span>
                  <span style={styles.metricLabel}>Redness</span>
                </div>
              </div>

              <div style={styles.summary}>
                <p style={styles.summaryText}>{result.aiResult?.summary}</p>
              </div>

              <a href="/reports" style={styles.link}>
                View Full Report 鈫?              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Powered by Advanced AI 鈥?Secure & HIPAA Compliant
        </p>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    color: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  bgAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    background: 'rgba(15, 23, 42, 0.8)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    fontSize: 28,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    display: 'flex',
    gap: 32,
  },
  navLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    fontSize: 16,
    fontWeight: 500,
    transition: 'color 0.3s',
  },
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '48px 24px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: 48,
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    marginBottom: 16,
    letterSpacing: '-0.02em',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: 400,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: 24,
    marginBottom: 32,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 14,
    fontWeight: 500,
    color: '#cbd5e1',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '14px 18px',
    fontSize: 16,
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#fff',
    outline: 'none',
    transition: 'all 0.3s',
  },
  videoContainer: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  video: {
    width: '100%',
    display: 'block',
  },
  button: {
    width: '100%',
    padding: '18px 32px',
    fontSize: 18,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    transition: 'all 0.3s',
    boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)',
  },
  buttonIcon: {
    fontSize: 20,
  },
  spinner: {
    width: 20,
    height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorBox: {
    marginTop: 24,
    padding: '16px 20px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    color: '#f87171',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  errorIcon: {
    fontSize: 20,
  },
  resultCard: {
    marginTop: 32,
    padding: 32,
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#34d399',
    margin: 0,
  },
  badge: {
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    border: '1px solid',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    marginBottom: 24,
  },
  metric: {
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 12,
  },
  metricValue: {
    display: 'block',
    fontSize: 32,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summary: {
    padding: 20,
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryText: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.6,
    color: '#e2e8f0',
  },
  link: {
    display: 'inline-block',
    color: '#60a5fa',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
    transition: 'color 0.3s',
  },
  footer: {
    textAlign: 'center',
    padding: '32px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
  },
};
