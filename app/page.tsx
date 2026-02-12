'use client';

import { useState } from 'react';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState(
    process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || 
    'https://videos.pexels.com/video-files/10677463/10677463-hd_1920_1080_30fps.mp4'
  );
  const [patientId, setPatientId] = useState('P001');
  const [description, setDescription] = useState('术后第3天复查');
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

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        🏥 医美视频AI分析系统
      </h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: 30, 
        borderRadius: 12,
        marginTop: 30 
      }}>
        <h2>📹 视频分析</h2>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            患者ID
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            视频URL (支持Pexels等外链)
          </label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            描述 (可选)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 6,
              fontSize: 16,
              resize: 'vertical',
            }}
          />
        </div>

        {videoUrl && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
              预览
            </label>
            <video
              src={videoUrl}
              controls
              style={{ width: '100%', borderRadius: 8, maxHeight: 300 }}
            />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: '100%',
            padding: 16,
            background: loading ? '#999' : '#4a9eff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '🤖 AI分析中...' : '开始AI分析'}
        </button>

        {error && (
          <div style={{ 
            marginTop: 20, 
            padding: 16, 
            background: '#fee',
            color: '#c33',
            borderRadius: 8 
          }}>
            ❌ {error}
          </div>
        )}

        {result && (
          <div style={{ 
            marginTop: 20, 
            padding: 20, 
            background: '#e8f5e9',
            borderRadius: 8,
            border: '2px solid #4caf50'
          }}>
            <h3 style={{ marginTop: 0, color: '#2e7d32' }}>
              ✅ 分析完成
            </h3>
            <p><strong>报告ID:</strong> {result._id}</p>
            <p><strong>风险等级:</strong> 
              <span style={{
                color: result.aiResult?.riskLevel === 'high' ? '#d32f2f' :
                       result.aiResult?.riskLevel === 'medium' ? '#ed6c02' : '#2e7d32',
                fontWeight: 'bold',
                marginLeft: 8
              }}>
                {result.aiResult?.riskLevel === 'high' ? '🔴 高风险' :
                 result.aiResult?.riskLevel === 'medium' ? '🟡 中风险' : '🟢 低风险'}
              </span>
            </p>
            <p><strong>AI摘要:</strong> {result.aiResult?.summary}</p>
            <a 
              href={`/reports`}
              style={{
                display: 'inline-block',
                marginTop: 12,
                color: '#4a9eff',
                textDecoration: 'none',
              }}
            >
              查看所有报告 →
            </a>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
        <p>💡 提示：使用Pexels免费视频URL即可测试，无需上传文件</p>
      </div>
    </div>
  );
}
