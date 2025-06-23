import { NextRequest, NextResponse } from 'next/server';
import { analyzeContent, SocialMediaContent } from '@/lib/social-media-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate content structure
    const requiredFields = ['id', 'type', 'category', 'title', 'contentUrl', 'dimensions'];
    for (const field of requiredFields) {
      if (!content[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Analyze the content
    const analysis = analyzeContent(content as SocialMediaContent);

    return NextResponse.json({
      success: true,
      analysis,
      content: {
        ...content,
        uploadDate: content.uploadDate || new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error analyzing content:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    );
  }
} 