'use client';

// Build: v4 - Chinese UI
import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(
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
        setError(data.error || '分析失败');
      }
    } catch (err) {
      setError('网络错误');
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
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return '未知';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>🔬 医美AI分析系统</div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>开始分析</a>
          <a href="/reports" style={{ color: '#94a3b8', textDecoration: 'none' }}>查看报告</a>
        </nav>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
          
          <h1 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '10px' }}>
            AI <span style={{ color: '#60a5fa' }}>医美术后分析</span>
          </h1>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>
            智能面部术后恢复评估系统
          </p>

          <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>患者编号</label>
              <input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>视频地址</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#cbd5e1' }}>临床备注（选填）</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
              />
            </div>
          </div>

          {videoUrl && (
            <div style={{ marginBottom: '30px' }}>
              <video src={videoUrl} controls style={{ width: '100%', borderRadius: '12px' }} />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '16px', 
              fontSize: '18px', 
              background: loading ? '#64748b' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '分析中...' : '开始AI分析'}
          </button>

          {error && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#f87171' }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ marginTop: '30px', padding: '24px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#34d399' }}>分析完成</h3>
                <span style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  background: `${getRiskColor(result.aiResult?.riskLevel)}20`,
                  color: getRiskColor(result.aiResult?.riskLevel)
                }}>
                  {getRiskText(result.aiResult?.riskLevel)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{result.aiResult?.symmetry?.score}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>面部对称性</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{Math.round(result.aiResult?.confidence * 100)}%</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI置信度</div>
                </div>
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: result.aiResult?.redness?.detected ? '#ef4444' : '#10b981' }}>
                    {result.aiResult?.redness?.detected ? '有' : '无'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>红肿检测</div>
                </div>
              </div>

              <p style={{ color: '#e2e8f0', marginBottom: '16px' }}>{result.aiResult?.summary}</p>
              
              <a href="/reports" style={{ color: '#60a5fa', textDecoration: 'none' }}>查看完整报告 →</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
