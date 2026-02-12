'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import styles from './page.module.css';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgAnimation} />
      
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>馃敩</span>
          <span className={styles.logoText}>MediVision AI</span>
        </div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navLink}>Analysis</a>
          <a href="/reports" className={styles.navLink} style={{color: '#60a5fa'}}>Reports</a>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={`${styles.card} ${styles.fadeIn}`}>
          
          <div className={styles.headerSection}>
            <h1 className={styles.title}>Analysis Reports</h1>
            <a href="/" className={styles.backLink}>鈫?New Analysis</a>
          </div>

          {reports.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>馃搵</span>
              <h3 className={styles.emptyTitle}>No Reports Yet</h3>
              <p className={styles.emptyText}>Start your first analysis to see results here</p>
              <a href="/" className={styles.button}>Start Analysis</a>
            </div>
          ) : (
            <div className={styles.reportsGrid}>
              {reports.map((report) => (
                <div 
                  key={report._id} 
                  className={styles.reportCard}
                >
                  <div className={styles.cardHeader}>
                    <div>
                      <h3 className={styles.patientId}>{report.patientId}</h3>
                      <p className={styles.date}>
                        {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <span 
                      className={styles.riskBadge}
                      style={{
                        background: `${getRiskColor(report.aiResult?.riskLevel)}20`,
                        color: getRiskColor(report.aiResult?.riskLevel),
                        borderColor: getRiskColor(report.aiResult?.riskLevel)
                      }}
                    >
                      {getRiskText(report.aiResult?.riskLevel)}
                    </span>
                  </div>

                  <div className={styles.metrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>{report.aiResult?.symmetry?.score || '-'}</span>
                      <span className={styles.metricLabel}>Symmetry</span>
                    </div>
                    <div className={styles.metric}>
                      <span 
                        className={styles.metricValue}
                        style={{color: report.aiResult?.redness?.detected ? '#ef4444' : '#10b981'}}
                      >
                        {report.aiResult?.redness?.detected ? 'Yes' : 'No'}
                      </span>
                      <span className={styles.metricLabel}>Redness</span>
                    </div>
                    <div className={styles.metric}>
                      <span 
                        className={styles.metricValue}
                        style={{color: report.aiResult?.swelling?.detected ? '#ef4444' : '#10b981'}}
                      >
                        {report.aiResult?.swelling?.detected ? 'Yes' : 'No'}
                      </span>
                      <span className={styles.metricLabel}>Swelling</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricValue}>
                        {Math.round((report.aiResult?.confidence || 0) * 100)}%
                      </span>
                      <span className={styles.metricLabel}>Confidence</span>
                    </div>
                  </div>

                  <div className={styles.summary}>
                    <p className={styles.summaryText}>{report.aiResult?.summary}</p>
                  </div>

                  <div className={styles.cardFooter}>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        background: report.doctorReview?.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' :
                                    report.doctorReview?.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: report.doctorReview?.status === 'confirmed' ? '#34d399' :
                               report.doctorReview?.status === 'rejected' ? '#f87171' : '#fbbf24'
                      }}
                    >
                      {report.doctorReview?.status === 'confirmed' ? '鉁?Confirmed' :
                       report.doctorReview?.status === 'rejected' ? '鉁?Rejected' : '鈴?Pending Review'}
                    </span>
                    
                    <a 
                      href={report.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoLink}
                    >
                      View Video 鈫?                    </a>
                  </div>
                </div>
              ))}
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
