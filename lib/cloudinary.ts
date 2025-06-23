import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { source } from '@cloudinary/url-gen/actions/overlay';
import { image, subtitles, text, video } from '@cloudinary/url-gen/qualifiers/source';
import { TextStyle } from '@cloudinary/url-gen/qualifiers/textStyle';

// Initialize Cloudinary
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});

// Video overlay types
export interface VideoOverlayOptions {
  text?: string;
  textStyle?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    position?: 'top' | 'bottom' | 'center';
  };
  image?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

// Create video with text overlay
export const createVideoWithTextOverlay = (
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
    width = 700,
  } = options;

  return cld
    .video(videoPublicId)
    .resize(fill().width(width))
    .overlay(
      source(
        text(overlayText, new TextStyle(textStyle.fontFamily, textStyle.fontSize))
          .textColor(textStyle.color)
      )
    );
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