import { NextRequest, NextResponse } from 'next/server';
import { 
  uploadVideo, 
  createVideoWithTextOverlay, 
  createVideoWithImageOverlay,
  createVideoWithSubtitleOverlay,
  createVideoWithVideoOverlay,
  extractTextFromVideo
} from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const videoFile = formData.get('video') as File;
    const overlayText = formData.get('text') as string;
    const imageFile = formData.get('image') as File;
    const subtitleFile = formData.get('subtitle') as File;
    const overlayVideoFile = formData.get('overlayVideo') as File;

    if (!videoFile) {
      return NextResponse.json(
        { error: 'Video file is required' },
        { status: 400 }
      );
    }

    // Upload the main video
    const videoPublicId = await uploadVideo(videoFile);

    let processedVideoUrl: string;
    let extractedText: string = '';

    switch (action) {
      case 'text-overlay':
        if (!overlayText) {
          return NextResponse.json(
            { error: 'Text is required for text overlay' },
            { status: 400 }
          );
        }
        const textOverlayVideo = createVideoWithTextOverlay(videoPublicId, overlayText);
        processedVideoUrl = textOverlayVideo.toURL();
        break;

      case 'image-overlay':
        if (!imageFile) {
          return NextResponse.json(
            { error: 'Image file is required for image overlay' },
            { status: 400 }
          );
        }
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        imageFormData.append('upload_preset', 'ml_default');
        const imageResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: imageFormData,
          }
        );
        const imageData = await imageResponse.json();
        const imageOverlayVideo = createVideoWithImageOverlay(videoPublicId, imageData.public_id);
        processedVideoUrl = imageOverlayVideo.toURL();
        break;

      case 'subtitle-overlay':
        if (!subtitleFile) {
          return NextResponse.json(
            { error: 'Subtitle file is required for subtitle overlay' },
            { status: 400 }
          );
        }
        const subtitleFormData = new FormData();
        subtitleFormData.append('file', subtitleFile);
        subtitleFormData.append('upload_preset', 'ml_default');
        subtitleFormData.append('resource_type', 'raw');
        const subtitleResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
          {
            method: 'POST',
            body: subtitleFormData,
          }
        );
        const subtitleData = await subtitleResponse.json();
        const subtitleOverlayVideo = createVideoWithSubtitleOverlay(videoPublicId, subtitleData.public_id);
        processedVideoUrl = subtitleOverlayVideo.toURL();
        break;

      case 'video-overlay':
        if (!overlayVideoFile) {
          return NextResponse.json(
            { error: 'Overlay video file is required for video overlay' },
            { status: 400 }
          );
        }
        const overlayVideoPublicId = await uploadVideo(overlayVideoFile);
        const videoOverlayVideo = createVideoWithVideoOverlay(videoPublicId, overlayVideoPublicId);
        processedVideoUrl = videoOverlayVideo.toURL();
        break;

      case 'extract-text':
        extractedText = await extractTextFromVideo(videoPublicId);
        processedVideoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${videoPublicId}`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      videoPublicId,
      processedVideoUrl,
      extractedText,
      message: `Video processed successfully with ${action}`
    });

  } catch (error: any) {
    console.error('Video API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 