import { NextRequest, NextResponse } from 'next/server';
import { uploadDocument } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { content, filename } = await request.json();

    if (!content || !filename) {
      return NextResponse.json(
        { error: 'Content and filename are required' },
        { status: 400 }
      );
    }

    // Upload and process document without user authentication
    const result = await uploadDocument(content, filename);

    return NextResponse.json({
      success: true,
      ...result,
    });

  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 