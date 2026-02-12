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
  if (!KIMI_API_KEY) {
    throw new Error('KIMI_API_KEY not set');
  }

  const prompt = `你是一位专业的医美术后恢复评估AI助手。请基于以下信息进行分析：

【视频信息】
- 视频URL: ${videoUrl}
- 患者描述: ${patientDesc || '无'}

请提供以下JSON格式的分析结果（只返回JSON，不要有其他文字）：
{
  "summary": "总体评估摘要（50字以内）",
  "symmetry": {
    "score": 85,
    "status": "normal",
    "description": "面部对称性评估"
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

注意：
1. riskLevel 只能是 low、medium、high 之一
2. severity 只能是 none、mild、moderate、severe 之一
3. confidence 是 0-1 之间的数字
4. needReview 表示是否需要人工复核`;

  const response = await fetch(KIMI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KIMI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2.5',
      messages: [
        {
          role: 'system',
          content: '你是一位专业的医美术后恢复评估AI助手，擅长分析面部对称性、红肿、肿胀等指标。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kimi API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  // 提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Invalid response format from Kimi');
}
