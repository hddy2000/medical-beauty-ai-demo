'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';

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
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>馃敩 MediVision AI</div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Analysis</a>
          <a href="/reports" style={{ color: '#60a5fa', textDecoration: 'none' }}>Reports</a>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', margin: 0 }}>Analysis Reports</h1>
          <a href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>鈫?New Analysis</a>
        </div>

        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>馃搵</div>
            <h3 style={{ marginBottom: '8px' }}>No Reports Yet</h3>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Start your first analysis</p>
            <a href="/" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: '8px' }}>Start Analysis</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reports.map((report) => (
              <div key={report._id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0' }}>{report.patientId}</h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                      {format(new Date(report.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontSize: '13px', 
                    fontWeight: 'bold',
                    background: `${getRiskColor(report.aiResult?.riskLevel)}20`,
                    color: getRiskColor(report.aiResult?.riskLevel)
                  }}>
                    {getRiskText(report.aiResult?.riskLevel)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{report.aiResult?.symmetry?.score || '-'}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>SYMMETRY</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: report.aiResult?.redness?.detected ? '#ef4444' : '#10b981' }}>
                      {report.aiResult?.redness?.detected ? 'Yes' : 'No'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>REDNESS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: report.aiResult?.swelling?.detected ? '#ef4444' : '#10b981' }}>
                      {report.aiResult?.swelling?.detected ? 'Yes' : 'No'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>SWELLING</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{Math.round((report.aiResult?.confidence || 0) * 100)}%</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>CONFIDENCE</div>
                  </div>
                </div>

                <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>{report.aiResult?.summary}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    fontSize: '12px',
                    background: report.doctorReview?.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' :
                                report.doctorReview?.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: report.doctorReview?.status === 'confirmed' ? '#34d399' :
                           report.doctorReview?.status === 'rejected' ? '#f87171' : '#fbbf24'
                  }}>
                    {report.doctorReview?.status === 'confirmed' ? '鉁?Confirmed' :
                     report.doctorReview?.status === 'rejected' ? '鉁?Rejected' : '鈴?Pending'}
                  </span>
                  
                  <a href={report.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '14px' }}>
                    View Video 鈫?                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
