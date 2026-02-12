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

export async function analyzeWithKimi(videoUrl: string, patientDesc: string): Promise<AnalysisResult> {
  console.log('Kimi function called with:', { videoUrl: videoUrl.substring(0, 50), patientDesc });
  
  if (!KIMI_API_KEY) {
    console.error('KIMI_API_KEY is not set');
    throw new Error('KIMI_API_KEY not set');
  }
  
  console.log('KIMI_API_KEY exists, length:', KIMI_API_KEY.length);

  const prompt = `You are a professional medical beauty post-operative recovery assessment AI assistant. Please analyze based on the following information:

[Video Information]
- Video URL: ${videoUrl}
- Patient Description: ${patientDesc || 'None'}

Please provide analysis results in the following JSON format (return JSON only, no other text):
{
  "summary": "Overall assessment summary (within 50 characters)",
  "symmetry": {
    "score": 85,
    "status": "normal",
    "description": "Facial symmetry assessment"
  },
  "redness": {
    "detected": false,
    "areas": [],
    "severity": "none"
  },
  "swelling": {
    "detected": false,
    "confidence": 0.92
  },
  "riskLevel": "low",
  "confidence": 0.87,
  "needReview": false
}

Notes:
1. riskLevel can only be low, medium, or high
2. severity can only be none, mild, moderate, or severe
3. confidence is a number between 0-1
4. needReview indicates whether manual review is required`;

  const requestBody = {
    model: 'kimi-k2.5',
    messages: [
      {
        role: 'system',
        content: 'You are a professional medical beauty post-operative recovery assessment AI assistant, specializing in analyzing facial symmetry, redness, swelling and other indicators.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 1,
    max_tokens: 1000,
  };
  
  console.log('Preparing Kimi API request...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    console.log('Sending request to Kimi API...');
    
    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('Kimi API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kimi API error response:', errorText);
      throw new Error(`Kimi API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Kimi API response parsed');
    
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response:', data);
      throw new Error('No content in Kimi response');
    }
    
    console.log('Response content:', content.substring(0, 200));

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('JSON extracted successfully');
      return JSON.parse(jsonMatch[0]);
    }
    
    console.error('No JSON found in content');
    throw new Error('Invalid response format from Kimi');
    
  } catch (error: any) {
    console.error('Kimi API call failed:', error.name, error.message);
    if (error.name === 'AbortError') {
      throw new Error('Kimi API timeout (30s)');
    }
    throw error;
  }
}
