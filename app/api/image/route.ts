import { NextRequest, NextResponse } from 'next/server';
import { 
  uploadImage, 
  createImageWithTextOverlay, 
  createImageWithMultipleTextOverlays,
  extractTextFromImage,
  TextOverlayOptions,
  TextPlacement,
  TextStyle
} from '@/lib/image-processing';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const action = formData.get('action') as string;
    const imageFile = formData.get('image') as File;
    const overlayText = formData.get('text') as string;
    const textPlacement = formData.get('textPlacement') as string;
    const textStyle = formData.get('textStyle') as string;
    const multipleTexts = formData.get('multipleTexts') as string;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Upload the main image
    const imagePublicId = await uploadImage(imageFile);

    let processedImageUrl: string;
    let extractedText: string = '';

    switch (action) {
      case 'text-overlay':
        if (!overlayText) {
          return NextResponse.json(
            { error: 'Text is required for text overlay' },
            { status: 400 }
          );
        }

        // Parse text placement and style options
        const placement: TextPlacement = textPlacement ? JSON.parse(textPlacement) : { position: 'bottom-center' };
        const style: TextStyle = textStyle ? JSON.parse(textStyle) : {
          fontFamily: 'Arial',
          fontSize: 24,
          color: '#ffffff',
          fontWeight: 'bold'
        };

        const textOverlayOptions: TextOverlayOptions = {
          text: overlayText,
          placement,
          style
        };

        const textOverlayImage = createImageWithTextOverlay(imagePublicId, textOverlayOptions);
        processedImageUrl = textOverlayImage.toURL();
        break;

      case 'multiple-text-overlays':
        if (!multipleTexts) {
          return NextResponse.json(
            { error: 'Multiple texts configuration is required' },
            { status: 400 }
          );
        }

        const textOverlays: TextOverlayOptions[] = JSON.parse(multipleTexts);
        const multipleTextOverlayImage = createImageWithMultipleTextOverlays(imagePublicId, textOverlays);
        processedImageUrl = multipleTextOverlayImage.toURL();
        break;

      case 'extract-text':
        extractedText = await extractTextFromImage(imagePublicId);
        processedImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${imagePublicId}`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      imagePublicId,
      processedImageUrl,
      extractedText,
      message: `Image processed successfully with ${action}`
    });

  } catch (error: any) {
    console.error('Image API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 