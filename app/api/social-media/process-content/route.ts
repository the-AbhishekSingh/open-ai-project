import { NextRequest, NextResponse } from 'next/server';
import { 
  analyzeContent, 
  generateSocialMediaPost,
  generateMultiPlatformPosts,
  SocialMediaContent,
  SocialPlatform 
} from '@/lib/social-media-agent';
import { processImageWithTextOverlay } from '@/lib/image-processing';
import { processVideoWithTextOverlay } from '@/lib/video-processing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, platforms, generateMedia } = body;

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

    const socialContent = content as SocialMediaContent;

    // Step 1: Analyze content
    const analysis = analyzeContent(socialContent);

    // Step 2: Generate posts for specified platforms or best platforms
    const targetPlatforms = platforms || analysis.bestPlatforms;
    const posts = generateMultiPlatformPosts(socialContent, targetPlatforms);

    // Step 3: Process media with text overlays if requested
    let processedMedia = [];
    
    if (generateMedia) {
      for (const post of posts) {
        try {
          let processedUrl;
          
          if (socialContent.type === 'video') {
            // Process video with text overlays
            const result = await processVideoWithTextOverlay({
              videoUrl: socialContent.contentUrl,
              textOverlays: post.textOverlays,
              outputFormat: 'mp4',
              quality: 'high'
            });
            processedUrl = result.outputUrl;
          } else {
            // Process image with text overlays
            const result = await processImageWithTextOverlay({
              imageUrl: socialContent.contentUrl,
              textOverlays: post.textOverlays,
              outputFormat: 'png',
              quality: 'high'
            });
            processedUrl = result.outputUrl;
          }

          processedMedia.push({
            postId: post.id,
            platform: post.platform,
            originalUrl: socialContent.contentUrl,
            processedUrl,
            textOverlays: post.textOverlays
          });
        } catch (error) {
          console.error(`Error processing media for post ${post.id}:`, error);
          processedMedia.push({
            postId: post.id,
            platform: post.platform,
            originalUrl: socialContent.contentUrl,
            processedUrl: null,
            error: 'Failed to process media',
            textOverlays: post.textOverlays
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      posts,
      processedMedia,
      content: socialContent,
      summary: {
        totalPosts: posts.length,
        platforms: targetPlatforms,
        processedCount: processedMedia.filter(m => m.processedUrl).length,
        failedCount: processedMedia.filter(m => !m.processedUrl).length
      }
    });

  } catch (error) {
    console.error('Error processing social media content:', error);
    return NextResponse.json(
      { error: 'Failed to process social media content' },
      { status: 500 }
    );
  }
} 