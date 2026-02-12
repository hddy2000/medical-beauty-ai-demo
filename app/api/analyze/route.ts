import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Analysis from '@/lib/models/Analysis';
import { analyzeWithKimi } from '@/lib/kimi';

export async function POST(request: Request) {
  try {
    const { videoUrl, patientId, description } = await request.json();

    if (!videoUrl || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields: videoUrl, patientId' },
        { status: 400 }
      );
    }

    // Check env vars
    const hasKimiKey = !!process.env.KIMI_API_KEY;
    const hasMongoUri = !!process.env.MONGODB_URI;
    
    if (!hasKimiKey) {
      return NextResponse.json(
        { error: 'Server config error: KIMI_API_KEY not set' },
        { status: 500 }
      );
    }

    if (!hasMongoUri) {
      return NextResponse.json(
        { error: 'Server config error: MONGODB_URI not set' },
        { status: 500 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected');

    // Create analysis record
    const analysis = await Analysis.create({
      patientId,
      videoUrl,
      description,
      status: 'analyzing',
    });

    try {
      console.log('Calling Kimi AI...');
      // Call Kimi AI
      const aiResult = await analyzeWithKimi(videoUrl, description);
      console.log('Kimi AI response received');

      // Update record with AI result
      analysis.aiResult = aiResult;
      analysis.status = 'completed';
      analysis.doctorReview.status = aiResult.needReview ? 'pending' : 'confirmed';
      await analysis.save();

      return NextResponse.json({
        success: true,
        data: analysis,
      });
    } catch (aiError: any) {
      console.error('Kimi AI Error:', aiError);
      
      // Mark as failed but return the record
      analysis.status = 'failed';
      await analysis.save();

      return NextResponse.json(
        { 
          error: 'AI analysis failed',
          details: aiError.message || 'Unknown error',
          stack: aiError.stack || '',
          data: analysis,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
