import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test if the documents table exists
    const { data: tableData, error: tableError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);

    if (tableError) {
      return NextResponse.json({
        error: 'Documents table not found',
        details: tableError
      }, { status: 500 });
    }

    // Get document count
    const { count, error: countError } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json({
        error: 'Could not count documents',
        details: countError
      }, { status: 500 });
    }

    // Test if the match_documents function exists
    const { data: functionData, error: functionError } = await supabase.rpc('match_documents', {
      query_embedding: new Array(1536).fill(0), // Test with zero vector
      match_threshold: 0.1,
      match_count: 1
    });

    if (functionError) {
      return NextResponse.json({
        error: 'match_documents function not found or has wrong signature',
        details: functionError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Database is properly configured',
      tableExists: true,
      functionExists: true,
      documentCount: count || 0
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Database test failed',
      details: error.message
    }, { status: 500 });
  }
} 