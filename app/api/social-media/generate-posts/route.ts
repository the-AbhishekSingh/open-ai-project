import { NextRequest, NextResponse } from 'next/server';
import { 
  generateSocialMediaPost, 
  generateMultiPlatformPosts,
  batchGeneratePosts,
  SocialMediaContent,
  SocialPlatform 
} from '@/lib/social-media-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platforms, batch } = body;

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

    let posts;

    if (batch && Array.isArray(content)) {
      // Batch generate posts for multiple content items
      const defaultPlatforms: SocialPlatform[] = ['tiktok', 'instagram', 'youtube'];
      const targetPlatforms = platforms || defaultPlatforms;
      
      posts = batchGeneratePosts(content as SocialMediaContent[], targetPlatforms);
    } else if (platforms && Array.isArray(platforms)) {
      // Generate posts for specific platforms
      posts = generateMultiPlatformPosts(content as SocialMediaContent, platforms);
    } else {
      // Generate single post for default platform (TikTok)
      posts = [generateSocialMediaPost(content as SocialMediaContent, 'tiktok')];
    }

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
      content: Array.isArray(content) ? content : [content]
    });

  } catch (error) {
    console.error('Error generating posts:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
} 