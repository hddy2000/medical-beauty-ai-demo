const KIMI_API_KEY = process.env.KIMI_API_KEY;
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export interface AnalysisResult {
  summary: string;
  symmetry: {
    score: number;
    status: 'normal' | 'abnormal';
    description: string;
  };
  redness: {
    detected: boolean;
    areas: string[];
    severity: 'none' | 'mild' | 'moderate' | 'severe';
  };
  swelling: {
    detected: boolean;
    confidence: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  needReview: boolean;
}

function generateMockResult(patientDesc: string): AnalysisResult {
  const baseScore = 70 + Math.floor(Math.random() * 25); // 70-95
  const hasRedness = Math.random() > 0.7;
  const hasSwelling = Math.random() > 0.8;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let needReview = false;
  
  if (baseScore < 75 || hasRedness || hasSwelling) {
    riskLevel = 'medium';
    needReview = true;
  }
  if (baseScore < 60) {
    riskLevel = 'high';
    needReview = true;
  }
  
  return {
    summary: `Overall assessment: ${baseScore >= 80 ? 'Good recovery' : baseScore >= 75 ? 'Normal recovery' : 'Requires attention'}. ${patientDesc ? `(${patientDesc})` : ''}`,
    symmetry: {
      score: baseScore,
      status: baseScore >= 80 ? 'normal' : 'normal',
      description: baseScore >= 80 ? 'Good facial symmetry' : 'Slight asymmetry detected'
    },
    redness: {
      detected: hasRedness,
      areas: hasRedness ? ['left_cheek'] : [],
      severity: hasRedness ? 'mild' : 'none'
    },
    swelling: {
      detected: hasSwelling,
      confidence: hasSwelling ? 0.85 : 0.92
    },
    riskLevel,
    confidence: 0.85 + Math.random() * 0.1,
    needReview
  };
}

export async function analyzeWithKimi(videoUrl: string, patientDesc: string): Promise<AnalysisResult> {
  console.log('Demo mode: Using mock data');
  
  // In demo mode, always use mock data for instant response
  // Try real API only if explicitly enabled
  const useRealAPI = process.env.USE_REAL_KIMI === 'true';
  
  if (!useRealAPI) {
    console.log('Returning mock analysis result');
    // Simulate network delay (500ms)
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockResult(patientDesc);
  }
  
  // Real API call (only if USE_REAL_KIMI=true)
  if (!KIMI_API_KEY) {
    throw new Error('KIMI_API_KEY not set');
  }
  
  const prompt = `You are a professional medical beauty post-operative recovery assessment AI assistant...
  
[Video Information]
- Video URL: ${videoUrl}
- Patient Description: ${patientDesc || 'None'}

Please provide analysis results in JSON format...`;

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2.5',
      messages: [
        { role: 'system', content: 'You are a professional medical beauty assessment AI.' },
        { role: 'user', content: prompt }
      ],
      temperature: 1,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Kimi API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  throw new Error('Invalid response format');
}
