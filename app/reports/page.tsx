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
      case 'high': return '#d32f2f';
      case 'medium': return '#ed6c02';
      case 'low': return '#2e7d32';
      default: return '#666';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'high': return '🔴 高风险';
      case 'medium': return '🟡 中风险';
      case 'low': return '🟢 低风险';
      default: return '⚪ 未知';
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 40, textAlign: 'center' }}>
        加载中...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 40 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>
        📊 分析报告列表
      </h1>
      
      <a 
        href="/"
        style={{
          display: 'inline-block',
          marginBottom: 20,
          color: '#4a9eff',
          textDecoration: 'none',
        }}
      >
        ← 返回分析页面
      </a>

      {reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          暂无报告，请先进行分析
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {reports.map((report) => (
            <div 
              key={report._id}
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: 12,
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 16,
                borderBottom: '1px solid #eee',
                paddingBottom: 16,
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18 }}>
                    患者: {report.patientId}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
                    {format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm')}
                  </p>
                </div>
                <div style={{
                  padding: '8px 16px',
                  background: getRiskColor(report.aiResult?.riskLevel) + '20',
                  color: getRiskColor(report.aiResult?.riskLevel),
                  borderRadius: 20,
                  fontWeight: 'bold',
                }}>
                  {getRiskText(report.aiResult?.riskLevel)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ margin: '0 0 8px', color: '#666' }}>
                    <strong>AI摘要:</strong>
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    {report.aiResult?.summary || '暂无'}
                  </p>
                </div>

                <div>
                  <p style={{ margin: '0 0 8px', color: '#666' }}>
                    <strong>详细指标:</strong>
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>对称性评分:</span>
                      <span style={{ fontWeight: 600 }}>
                        {report.aiResult?.symmetry?.score || '-'}/100
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>红肿检测:</span>
                      <span style={{ 
                        color: report.aiResult?.redness?.detected ? '#d32f2f' : '#2e7d32',
                        fontWeight: 600 
                      }}>
                        {report.aiResult?.redness?.detected ? '检测到' : '无'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>肿胀检测:</span>
                      <span style={{ 
                        color: report.aiResult?.swelling?.detected ? '#d32f2f' : '#2e7d32',
                        fontWeight: 600 
                      }}>
                        {report.aiResult?.swelling?.detected ? '检测到' : '无'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>置信度:</span>
                      <span style={{ fontWeight: 600 }}>
                        {Math.round((report.aiResult?.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ 
                marginTop: 16, 
                paddingTop: 16, 
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ color: '#666' }}>医生复核: </span>
                  <span style={{
                    color: report.doctorReview?.status === 'confirmed' ? '#2e7d32' :
                           report.doctorReview?.status === 'rejected' ? '#d32f2f' : '#ed6c02',
                    fontWeight: 600,
                  }}>
                    {report.doctorReview?.status === 'confirmed' ? '✅ 已确认' :
                     report.doctorReview?.status === 'rejected' ? '❌ 已驳回' : '⏳ 待复核'}
                  </span>
                  {report.doctorReview?.comment && (
                    <p style={{ margin: '4px 0 0', fontSize: 14, color: '#666' }}>
                      备注: {report.doctorReview.comment}
                    </p>
                  )}
                </div>
                <a 
                  href={report.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    color: '#333',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  查看视频 →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
