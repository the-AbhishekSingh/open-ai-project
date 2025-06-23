import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image, subtitles, text, video } from '@cloudinary/url-gen/qualifiers/source';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';
import { Position } from '@cloudinary/url-gen/qualifiers/position';
import { compass } from '@cloudinary/url-gen/qualifiers/gravity';

// Initialize Cloudinary
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});

// Text placement options for videos
export interface VideoTextPlacement {
  x?: number; // X coordinate (0-100 for percentage, or absolute pixels)
  y?: number; // Y coordinate (0-100 for percentage, or absolute pixels)
  position?: 'top-left' | 'top-center' | 'top-right' | 
            'center-left' | 'center' | 'center-right' | 
            'bottom-left' | 'bottom-center' | 'bottom-right';
  gravity?: 'north_west' | 'north' | 'north_east' | 
           'west' | 'center' | 'east' | 
           'south_west' | 'south' | 'south_east';
  offset?: {
    x?: number;
    y?: number;
  };
  startTime?: number; // Start time in seconds
  endTime?: number; // End time in seconds
}

// Enhanced text styling options for videos
export interface VideoTextStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
  stroke?: {
    color: string;
    width: number;
  };
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  animation?: {
    type: 'fade' | 'slide' | 'bounce' | 'zoom';
    duration: number;
    delay?: number;
  };
}

// Video overlay types
export interface VideoOverlayOptions {
  text?: string;
  textStyle?: VideoTextStyle;
  textPlacement?: VideoTextPlacement;
  image?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'mp4' | 'webm' | 'avi' | 'mov';
  fps?: number;
  bitrate?: number;
}

// Enhanced video text overlay with advanced placement
export const createVideoWithTextOverlay = (
  videoPublicId: string,
  overlayText: string,
  options: VideoOverlayOptions = {}
) => {
  const {
    textStyle = {},
    textPlacement = {},
    width = 700,
    quality = 80,
  } = options;

  let videoTransform = cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .quality(quality);

  // Create text overlay with advanced styling
  const textStyleObj = new TextStyle(textStyle.fontFamily || 'Arial', textStyle.fontSize || 20);
  
  // Apply text styling - note: color is set in the text overlay, not TextStyle
  if (textStyle.fontWeight) {
    textStyleObj.fontWeight(textStyle.fontWeight);
  }
  
  if (textStyle.fontStyle) {
    textStyleObj.fontStyle(textStyle.fontStyle);
  }

  if (textStyle.backgroundColor) {
    textStyleObj.backgroundColor(textStyle.backgroundColor);
  }

  if (textStyle.opacity) {
    textStyleObj.opacity(textStyle.opacity);
  }

  // Create text overlay with color applied directly
  let textOverlay = source(text(overlayText, textStyleObj));
  
  // Apply color using the color parameter in text overlay
  if (textStyle.color) {
    textOverlay = source(text(overlayText, textStyleObj).color(textStyle.color));
  }

  // Apply advanced text positioning
  if (textPlacement.gravity) {
    textOverlay = textOverlay.position(new Position().gravity(compass(textPlacement.gravity)));
  } else if (textPlacement.position) {
    const gravityMap: Record<string, string> = {
      'top-left': 'north_west',
      'top-center': 'north',
      'top-right': 'north_east',
      'center-left': 'west',
      'center': 'center',
      'center-right': 'east',
      'bottom-left': 'south_west',
      'bottom-center': 'south',
      'bottom-right': 'south_east'
    };
    textOverlay = textOverlay.position(new Position().gravity(compass(gravityMap[textPlacement.position])));
  }

  // Apply offsets if specified
  if (textPlacement.offset) {
    const position = new Position();
    if (textPlacement.offset.x !== undefined) {
      position.offsetX(textPlacement.offset.x);
    }
    if (textPlacement.offset.y !== undefined) {
      position.offsetY(textPlacement.offset.y);
    }
    textOverlay = textOverlay.position(position);
  }

  // Apply timing if specified
  if (textPlacement.startTime !== undefined || textPlacement.endTime !== undefined) {
    if (textPlacement.startTime !== undefined) {
      textOverlay = textOverlay.startOffset(textPlacement.startTime);
    }
    if (textPlacement.endTime !== undefined) {
      textOverlay = textOverlay.endOffset(textPlacement.endTime);
    }
  }

  return videoTransform.overlay(textOverlay);
};

// Create video with multiple text overlays
export const createVideoWithMultipleTextOverlays = (
  videoPublicId: string,
  textOverlays: Array<{
    text: string;
    style?: VideoTextStyle;
    placement?: VideoTextPlacement;
  }>,
  options: VideoOverlayOptions = {}
) => {
  const {
    width = 700,
    quality = 80,
  } = options;

  let videoTransform = cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .quality(quality);

  textOverlays.forEach((overlay) => {
    const textStyle = new TextStyle(
      overlay.style?.fontFamily || 'Arial', 
      overlay.style?.fontSize || 20
    );
    
    // Apply text styling
    if (overlay.style?.fontWeight) {
      textStyle.fontWeight(overlay.style.fontWeight);
    }
    
    if (overlay.style?.fontStyle) {
      textStyle.fontStyle(overlay.style.fontStyle);
    }

    if (overlay.style?.backgroundColor) {
      textStyle.backgroundColor(overlay.style.backgroundColor);
    }

    if (overlay.style?.opacity) {
      textStyle.opacity(overlay.style.opacity);
    }

    // Create text overlay with color applied directly
    let textOverlay = source(text(overlay.text, textStyle));
    
    if (overlay.style?.color) {
      textOverlay = source(text(overlay.text, textStyle).color(overlay.style.color));
    }

    // Apply positioning for each overlay
    if (overlay.placement?.gravity) {
      textOverlay = textOverlay.position(new Position().gravity(compass(overlay.placement.gravity)));
    } else if (overlay.placement?.position) {
      const gravityMap: Record<string, string> = {
        'top-left': 'north_west',
        'top-center': 'north',
        'top-right': 'north_east',
        'center-left': 'west',
        'center': 'center',
        'center-right': 'east',
        'bottom-left': 'south_west',
        'bottom-center': 'south',
        'bottom-right': 'south_east'
      };
      textOverlay = textOverlay.position(new Position().gravity(compass(gravityMap[overlay.placement.position])));
    }

    // Apply offsets if specified
    if (overlay.placement?.offset) {
      const position = new Position();
      if (overlay.placement.offset.x !== undefined) {
        position.offsetX(overlay.placement.offset.x);
      }
      if (overlay.placement.offset.y !== undefined) {
        position.offsetY(overlay.placement.offset.y);
      }
      textOverlay = textOverlay.position(position);
    }

    // Apply timing if specified
    if (overlay.placement?.startTime !== undefined || overlay.placement?.endTime !== undefined) {
      if (overlay.placement.startTime !== undefined) {
        textOverlay = textOverlay.startOffset(overlay.placement.startTime);
      }
      if (overlay.placement.endTime !== undefined) {
        textOverlay = textOverlay.endOffset(overlay.placement.endTime);
      }
    }

    videoTransform = videoTransform.overlay(textOverlay);
  });

  return videoTransform;
};

// Create video with image overlay
export const createVideoWithImageOverlay = (
  videoPublicId: string,
  imagePublicId: string,
  options: VideoOverlayOptions = {}
) => {
  const { width = 700 } = options;

  return cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .overlay(source(image(imagePublicId)));
};

// Create video with subtitle overlay
export const createVideoWithSubtitleOverlay = (
  videoPublicId: string,
  subtitlePublicId: string,
  options: VideoOverlayOptions = {}
) => {
  const { width = 700 } = options;

  return cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .overlay(source(subtitles(subtitlePublicId)));
};

// Create video with video overlay
export const createVideoWithVideoOverlay = (
  videoPublicId: string,
  overlayVideoPublicId: string,
  options: VideoOverlayOptions = {}
) => {
  const { width = 700 } = options;

  return cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .overlay(source(video(overlayVideoPublicId)));
};

// Upload video to Cloudinary
export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // You can create a custom upload preset
  formData.append('resource_type', 'video');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.public_id;
};

// Generate video URL with transformations
export const getVideoUrl = (publicId: string, transformations: any = {}) => {
  return cld.video(publicId).toURL();
};

// Extract text from video using AI (placeholder for future implementation)
export const extractTextFromVideo = async (videoPublicId: string) => {
  // This would integrate with Cloudinary's AI features or external AI services
  // For now, return a placeholder
  return `Text extracted from video: ${videoPublicId}`;
};

// Create video with animated text overlay
export const createVideoWithAnimatedTextOverlay = (
  videoPublicId: string,
  overlayText: string,
  options: VideoOverlayOptions = {}
) => {
  const {
    textStyle = {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff',
    },
    textPlacement = {
      position: 'bottom-center'
    },
    width = 700,
    quality = 80,
  } = options;

  let videoTransform = cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .quality(quality);

  // Create text overlay with animation
  const textStyleObj = new TextStyle(textStyle.fontFamily || 'Arial', textStyle.fontSize || 20);
  
  // Apply text styling
  if (textStyle.fontWeight) {
    textStyleObj.fontWeight(textStyle.fontWeight);
  }
  
  if (textStyle.fontStyle) {
    textStyleObj.fontStyle(textStyle.fontStyle);
  }

  // Create text overlay with color applied directly
  let textOverlay = source(text(overlayText, textStyleObj));
  
  // Apply color using the color parameter in text overlay
  if (textStyle.color) {
    textOverlay = source(text(overlayText, textStyleObj).color(textStyle.color));
  }

  // Apply positioning
  if (textPlacement.position) {
    const gravityMap: Record<string, string> = {
      'top-left': 'north_west',
      'top-center': 'north',
      'top-right': 'north_east',
      'center-left': 'west',
      'center': 'center',
      'center-right': 'east',
      'bottom-left': 'south_west',
      'bottom-center': 'south',
      'bottom-right': 'south_east'
    };
    textOverlay = textOverlay.position(new Position().gravity(compass(gravityMap[textPlacement.position])));
  }

  // Apply animation if specified
  if (textStyle.animation) {
    // This would integrate with Cloudinary's animation features
    // For now, we'll use basic timing
    if (textStyle.animation.delay) {
      textOverlay = textOverlay.startOffset(textStyle.animation.delay);
    }
  }

  return videoTransform.overlay(textOverlay);
}; 