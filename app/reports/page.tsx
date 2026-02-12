'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

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
    maxWidth: 1200,
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
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  backLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: 16,
    fontWeight: 500,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 40px',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    display: 'block',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    color: '#e2e8f0',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  button: {
    display: 'inline-block',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 12,
    fontWeight: 600,
    boxShadow: '0 10px 40px -10px rgba(59, 130, 246, 0.5)',
  },
  reportsGrid: {
    display: 'grid',
    gap: 24,
  },
  reportCard: {
    background: 'rgba(15, 23, 42, 0.4)',
    borderRadius: 16,
    padding: 28,
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  patientId: {
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 4px 0',
    color: '#e2e8f0',
  },
  date: {
    fontSize: 14,
    color: '#64748b',
    margin: 0,
  },
  riskBadge: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 20,
    padding: '20px',
    background: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 12,
  },
  metric: {
    textAlign: 'center',
  },
  metricValue: {
    display: 'block',
    fontSize: 24,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summary: {
    padding: '16px 20px',
    background: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryText: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: '#cbd5e1',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
  },
  videoLink: {
    color: '#60a5fa',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#94a3b8',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#60a5fa',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 16,
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

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner} />
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.bgAnimation} />
      
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>馃敩</span>
          <span style={styles.logoText}>MediVision AI</span>
        </div>
        <nav style={styles.nav}>
          <a href="/" style={styles.navLink}>Analysis</a>
          <a href="/reports" style={{...styles.navLink, color: '#60a5fa'}}>Reports</a>
        </nav>
      </header>

      <main style={styles.main}>
        <div style={{
          ...styles.card,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out'
        }}>
          
          <div style={styles.headerSection}>
            <h1 style={styles.title}>Analysis Reports</h1>
            <a href="/" style={styles.backLink}>鈫?New Analysis</a>
          </div>

          {reports.length === 0 ? (
            <div style={styles.empty}>
              <span style={styles.emptyIcon}>馃搵</span>
              <h3 style={styles.emptyTitle}>No Reports Yet</h3>
              <p style={styles.emptyText}>Start your first analysis to see results here</p>
              <a href="/" style={styles.button}>Start Analysis</a>
            </div>
          ) : (
            <div style={styles.reportsGrid}>
              {reports.map((report, index) => (
                <div 
                  key={report._id} 
                  style={{
                    ...styles.reportCard,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease-out ${index * 0.1}s`
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.patientId}>{report.patientId}</h3>
                      <p style={styles.date}>
                        {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <span style={{
                      ...styles.riskBadge,
                      background: `${getRiskColor(report.aiResult?.riskLevel)}20`,
                      color: getRiskColor(report.aiResult?.riskLevel),
                      borderColor: getRiskColor(report.aiResult?.riskLevel)
                    }}>
                      {getRiskText(report.aiResult?.riskLevel)}
                    </span>
                  </div>

                  <div style={styles.metrics}>
                    <div style={styles.metric}>
                      <span style={styles.metricValue}>{report.aiResult?.symmetry?.score || '-'}</span>
                      <span style={styles.metricLabel}>Symmetry</span>
                    </div>
                    <div style={styles.metric}>
                      <span style={{...styles.metricValue, color: report.aiResult?.redness?.detected ? '#ef4444' : '#10b981'}}>
                        {report.aiResult?.redness?.detected ? 'Yes' : 'No'}
                      </span>
                      <span style={styles.metricLabel}>Redness</span>
                    </div>
                    <div style={styles.metric}>
                      <span style={{...styles.metricValue, color: report.aiResult?.swelling?.detected ? '#ef4444' : '#10b981'}}>
                        {report.aiResult?.swelling?.detected ? 'Yes' : 'No'}
                      </span>
                      <span style={styles.metricLabel}>Swelling</span>
                    </div>
                    <div style={styles.metric}>
                      <span style={styles.metricValue}>
                        {Math.round((report.aiResult?.confidence || 0) * 100)}%
                      </span>
                      <span style={styles.metricLabel}>Confidence</span>
                    </div>
                  </div>

                  <div style={styles.summary}>
                    <p style={styles.summaryText}>{report.aiResult?.summary}</p>
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={{
                      ...styles.statusBadge,
                      background: report.doctorReview?.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' :
                                  report.doctorReview?.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: report.doctorReview?.status === 'confirmed' ? '#34d399' :
                             report.doctorReview?.status === 'rejected' ? '#f87171' : '#fbbf24'
                    }}>
                      {report.doctorReview?.status === 'confirmed' ? '鉁?Confirmed' :
                       report.doctorReview?.status === 'rejected' ? '鉁?Rejected' : '鈴?Pending Review'}
                    </span>
                    
                    <a 
                      href={report.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.videoLink}
                    >
                      View Video 鈫?                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

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
      `}</style>
    </div>
  );
}
