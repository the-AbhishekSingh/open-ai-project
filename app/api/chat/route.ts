import { NextRequest, NextResponse } from 'next/server';
import { queryRAG } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Log the request for debugging
    console.log('Chat API called');
    
    const body = await request.json();
    const { question } = body;

    if (!question) {
      console.log('No question provided');
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    console.log('Processing question:', question);

    // Query RAG system without user authentication
    const result = await queryRAG(question);

    console.log('RAG result:', result);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      sources: result.sources,
      context: result.context,
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Return a more detailed error response
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: error.stack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 