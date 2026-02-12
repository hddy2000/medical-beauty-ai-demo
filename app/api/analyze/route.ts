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

    await connectDB();

    // Create analysis record
    const analysis = await Analysis.create({
      patientId,
      videoUrl,
      description,
      status: 'analyzing',
    });

    try {
      // Call Kimi AI
      const aiResult = await analyzeWithKimi(videoUrl, description);

      // Update record with AI result
      analysis.aiResult = aiResult;
      analysis.status = 'completed';
      analysis.doctorReview.status = aiResult.needReview ? 'pending' : 'confirmed';
      await analysis.save();

      return NextResponse.json({
        success: true,
        data: analysis,
      });
    } catch (aiError) {
      // Mark as failed but return the record
      analysis.status = 'failed';
      await analysis.save();

      return NextResponse.json(
        { 
          error: 'AI analysis failed',
          details: (aiError as Error).message,
          data: analysis,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
