import { Cloudinary } from '@cloudinary/url-gen';
import { fill, scale } from '@cloudinary/url-gen/actions/resize';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image, text } from '@cloudinary/url-gen/qualifiers/source';
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

// Text placement options
export interface TextPlacement {
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
}

// Text styling options
export interface TextStyle {
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
}

// Image processing options
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp' | 'gif';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb' | 'crop';
}

// Main interface for text overlay
export interface TextOverlayOptions {
  text: string;
  placement: TextPlacement;
  style: TextStyle;
  imageOptions?: ImageProcessingOptions;
}

// Upload image to Cloudinary
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');
  formData.append('resource_type', 'image');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.public_id;
};

// Create image with text overlay using Cloudinary
export const createImageWithTextOverlay = (
  imagePublicId: string,
  options: TextOverlayOptions
) => {
  const { text: overlayText, placement, style, imageOptions = {} } = options;
  
  let imageTransform = cld.image(imagePublicId);

  // Apply image transformations
  if (imageOptions.width || imageOptions.height) {
    if (imageOptions.crop === 'scale') {
      imageTransform = imageTransform.resize(scale().width(imageOptions.width).height(imageOptions.height));
    } else {
      imageTransform = imageTransform.resize(fill().width(imageOptions.width).height(imageOptions.height));
    }
  }

  // Create text overlay
  const textStyle = new TextStyle(style.fontFamily || 'Arial', style.fontSize || 20);
  
  if (style.color) {
    textStyle.textColor(style.color);
  }
  
  if (style.fontWeight) {
    textStyle.fontWeight(style.fontWeight);
  }
  
  if (style.fontStyle) {
    textStyle.fontStyle(style.fontStyle);
  }

  let textOverlay = source(text(overlayText, textStyle));

  // Apply text positioning
  if (placement.gravity) {
    textOverlay = textOverlay.position(new Position().gravity(compass(placement.gravity)));
  } else if (placement.position) {
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
    textOverlay = textOverlay.position(new Position().gravity(compass(gravityMap[placement.position])));
  }

  // Apply offsets if specified
  if (placement.offset) {
    const position = new Position();
    if (placement.offset.x !== undefined) {
      position.offsetX(placement.offset.x);
    }
    if (placement.offset.y !== undefined) {
      position.offsetY(placement.offset.y);
    }
    textOverlay = textOverlay.position(position);
  }

  return imageTransform.overlay(textOverlay);
};

// Create image with text overlay using Canvas API (client-side)
export const createImageWithTextOverlayCanvas = async (
  imageFile: File,
  options: TextOverlayOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Apply text styling
      const { text: overlayText, placement, style } = options;
      
      ctx.font = `${style.fontStyle || 'normal'} ${style.fontWeight || 'normal'} ${style.fontSize || 20}px ${style.fontFamily || 'Arial'}`;
      ctx.fillStyle = style.color || '#000000';
      ctx.textAlign = style.textAlign || 'left';
      ctx.globalAlpha = style.opacity || 1;

      // Calculate text position
      let x = 0;
      let y = 0;
      
      if (placement.x !== undefined && placement.y !== undefined) {
        // Use absolute coordinates
        x = placement.x;
        y = placement.y;
      } else if (placement.position) {
        // Use relative positioning
        const textMetrics = ctx.measureText(overlayText);
        const textWidth = textMetrics.width;
        const textHeight = style.fontSize || 20;
        
        switch (placement.position) {
          case 'top-left':
            x = 10;
            y = textHeight + 10;
            break;
          case 'top-center':
            x = canvas.width / 2;
            y = textHeight + 10;
            ctx.textAlign = 'center';
            break;
          case 'top-right':
            x = canvas.width - 10;
            y = textHeight + 10;
            ctx.textAlign = 'right';
            break;
          case 'center-left':
            x = 10;
            y = canvas.height / 2;
            break;
          case 'center':
            x = canvas.width / 2;
            y = canvas.height / 2;
            ctx.textAlign = 'center';
            break;
          case 'center-right':
            x = canvas.width - 10;
            y = canvas.height / 2;
            ctx.textAlign = 'right';
            break;
          case 'bottom-left':
            x = 10;
            y = canvas.height - 10;
            break;
          case 'bottom-center':
            x = canvas.width / 2;
            y = canvas.height - 10;
            ctx.textAlign = 'center';
            break;
          case 'bottom-right':
            x = canvas.width - 10;
            y = canvas.height - 10;
            ctx.textAlign = 'right';
            break;
        }
      }

      // Apply stroke if specified
      if (style.stroke) {
        ctx.strokeStyle = style.stroke.color;
        ctx.lineWidth = style.stroke.width;
        ctx.strokeText(overlayText, x, y);
      }

      // Apply shadow if specified
      if (style.shadow) {
        ctx.shadowColor = style.shadow.color;
        ctx.shadowBlur = style.shadow.blur;
        ctx.shadowOffsetX = style.shadow.offsetX;
        ctx.shadowOffsetY = style.shadow.offsetY;
      }

      // Draw the text
      ctx.fillText(overlayText, x, y);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
};

// Generate image URL with transformations
export const getImageUrl = (publicId: string, transformations: any = {}) => {
  return cld.image(publicId).toURL();
};

// Extract text from image using OCR (placeholder for future implementation)
export const extractTextFromImage = async (imagePublicId: string) => {
  // This would integrate with Cloudinary's OCR features or external OCR services
  // For now, return a placeholder
  return `Text extracted from image: ${imagePublicId}`;
};

// Batch process multiple text overlays
export const createImageWithMultipleTextOverlays = (
  imagePublicId: string,
  textOverlays: TextOverlayOptions[]
) => {
  let imageTransform = cld.image(imagePublicId);

  textOverlays.forEach((overlay, index) => {
    const textStyle = new TextStyle(overlay.style.fontFamily || 'Arial', overlay.style.fontSize || 20);
    
    if (overlay.style.color) {
      textStyle.textColor(overlay.style.color);
    }

    let textOverlay = source(text(overlay.text, textStyle));

    // Apply positioning for each overlay
    if (overlay.placement.gravity) {
      textOverlay = textOverlay.position(new Position().gravity(compass(overlay.placement.gravity)));
    } else if (overlay.placement.position) {
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

    imageTransform = imageTransform.overlay(textOverlay);
  });

  return imageTransform;
}; 