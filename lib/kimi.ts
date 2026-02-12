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

  const prompt = `浣犳槸涓€浣嶄笓涓氱殑鍖荤編鏈悗鎭㈠璇勪及AI鍔╂墜銆傝鍩轰簬浠ヤ笅淇℃伅杩涜鍒嗘瀽锛?
銆愯棰戜俊鎭€?- 瑙嗛URL: ${videoUrl}
- 鎮ｈ€呮弿杩? ${patientDesc || '鏃?}

璇锋彁渚涗互涓婮SON鏍煎紡鐨勫垎鏋愮粨鏋滐紙鍙繑鍥濲SON锛屼笉瑕佹湁鍏朵粬鏂囧瓧锛夛細
{
  "summary": "鎬讳綋璇勪及鎽樿锛?0瀛椾互鍐咃級",
  "symmetry": {
    "score": 85,
    "status": "normal",
    "description": "闈㈤儴瀵圭О鎬ц瘎浼?
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

娉ㄦ剰锛?1. riskLevel 鍙兘鏄?low銆乵edium銆乭igh 涔嬩竴
2. severity 鍙兘鏄?none銆乵ild銆乵oderate銆乻evere 涔嬩竴
3. confidence 鏄?0-1 涔嬮棿鐨勬暟瀛?4. needReview 琛ㄧず鏄惁闇€瑕佷汉宸ュ鏍竊;

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
          content: '浣犳槸涓€浣嶄笓涓氱殑鍖荤編鏈悗鎭㈠璇勪及AI鍔╂墜锛屾搮闀垮垎鏋愰潰閮ㄥ绉版€с€佺孩鑲裤€佽偪鑳€绛夋寚鏍囥€?
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 1,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Kimi API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  // 鎻愬彇 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Invalid response format from Kimi');
}
