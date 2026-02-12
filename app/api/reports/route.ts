import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Analysis from '@/lib/models/Analysis';

export async function GET() {
  try {
    await connectDB();
    
    const reports = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, comment } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const analysis = await Analysis.findByIdAndUpdate(
      id,
      {
        'doctorReview.status': status,
        'doctorReview.comment': comment,
        'doctorReview.reviewedAt': new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!analysis) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
