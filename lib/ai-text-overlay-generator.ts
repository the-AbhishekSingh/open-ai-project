/**
 * AI-Powered Text Overlay Generator
 * 
 * This module uses AI to intelligently determine appropriate text styling
 * and placement based on content analysis, image/video context, and best practices.
 */

import { 
  TextPlacement, 
  TextStyle, 
  TextPosition, 
  FontWeight, 
  PRESET_TEXT_STYLES, 
  PRESET_PLACEMENTS,
  createPlacementFromPosition,
  createTimedPlacement,
  mergeTextStyle,
  validateTextPlacement,
  validateTextStyle
} from './text-overlay-types';

// ============================================================================
// CONTENT ANALYSIS INTERFACES
// ============================================================================

/**
 * Content analysis result for text overlay generation
 */
export interface ContentAnalysis {
  /** Type of content (title, subtitle, caption, etc.) */
  contentType: ContentType;
  /** Length of text content */
  textLength: 'short' | 'medium' | 'long';
  /** Emotional tone of content */
  tone: 'formal' | 'casual' | 'urgent' | 'playful' | 'professional';
  /** Importance level */
  importance: 'low' | 'medium' | 'high' | 'critical';
  /** Target audience */
  audience: 'general' | 'professional' | 'youth' | 'elderly';
  /** Context where text will appear */
  context: 'image' | 'video' | 'social-media' | 'presentation' | 'document';
  /** Color scheme preferences */
  colorScheme: 'light' | 'dark' | 'colorful' | 'monochrome';
  /** Brand guidelines (if applicable) */
  brandGuidelines?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    logo?: string;
  };
}

/**
 * Content types for text overlay
 */
export type ContentType = 
  | 'title' | 'subtitle' | 'caption' | 'watermark' | 'callout'
  | 'quote' | 'statistic' | 'instruction' | 'disclaimer' | 'credit';

/**
 * Media context for overlay generation
 */
export interface MediaContext {
  /** Type of media */
  type: 'image' | 'video';
  /** Dimensions of media */
  dimensions: {
    width: number;
    height: number;
  };
  /** Aspect ratio */
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'ultrawide';
  /** Background complexity */
  backgroundComplexity: 'simple' | 'moderate' | 'complex';
  /** Dominant colors in background */
  dominantColors: string[];
  /** Brightness level */
  brightness: 'dark' | 'medium' | 'bright';
  /** For videos: duration in seconds */
  duration?: number;
  /** For videos: motion level */
  motionLevel?: 'static' | 'low' | 'medium' | 'high';
}

// ============================================================================
// AI ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze text content to determine appropriate styling
 */
export function analyzeTextContent(text: string): ContentAnalysis {
  const words = text.split(' ').length;
  const characters = text.length;
  
  // Determine content type based on text patterns
  const contentType = determineContentType(text);
  
  // Determine text length
  const textLength = characters < 20 ? 'short' : characters < 100 ? 'medium' : 'long';
  
  // Analyze tone based on text content
  const tone = analyzeTone(text);
  
  // Determine importance based on content type and keywords
  const importance = determineImportance(text, contentType);
  
  // Default to general audience
  const audience = 'general';
  
  // Default context
  const context = 'image';
  
  // Default color scheme
  const colorScheme = 'light';
  
  return {
    contentType,
    textLength,
    tone,
    importance,
    audience,
    context,
    colorScheme
  };
}

/**
 * Determine content type based on text patterns
 */
function determineContentType(text: string): ContentType {
  const lowerText = text.toLowerCase();
  
  // Check for title patterns
  if (text.length < 50 && /^[A-Z][^.!?]*$/.test(text)) {
    return 'title';
  }
  
  // Check for subtitle patterns
  if (text.length < 100 && /^[A-Z][^.!?]*$/.test(text)) {
    return 'subtitle';
  }
  
  // Check for watermark patterns
  if (lowerText.includes('©') || lowerText.includes('copyright') || lowerText.includes('watermark')) {
    return 'watermark';
  }
  
  // Check for callout patterns
  if (lowerText.includes('!') || lowerText.includes('urgent') || lowerText.includes('important')) {
    return 'callout';
  }
  
  // Check for quote patterns
  if (text.includes('"') || text.includes('"') || lowerText.includes('said') || lowerText.includes('quote')) {
    return 'quote';
  }
  
  // Check for statistic patterns
  if (/\d+%|\d+\.\d+%|\$\d+|\d+ million|\d+ billion/.test(text)) {
    return 'statistic';
  }
  
  // Check for instruction patterns
  if (lowerText.includes('click') || lowerText.includes('tap') || lowerText.includes('press') || lowerText.includes('enter')) {
    return 'instruction';
  }
  
  // Check for disclaimer patterns
  if (lowerText.includes('disclaimer') || lowerText.includes('terms') || lowerText.includes('conditions')) {
    return 'disclaimer';
  }
  
  // Check for credit patterns
  if (lowerText.includes('photo by') || lowerText.includes('credit') || lowerText.includes('courtesy')) {
    return 'credit';
  }
  
  // Default to caption for longer text
  return 'caption';
}

/**
 * Analyze tone of text content
 */
function analyzeTone(text: string): ContentAnalysis['tone'] {
  const lowerText = text.toLowerCase();
  
  // Check for urgent/emergency tone
  if (lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('alert')) {
    return 'urgent';
  }
  
  // Check for playful tone
  if (lowerText.includes('fun') || lowerText.includes('awesome') || lowerText.includes('amazing') || lowerText.includes('wow')) {
    return 'playful';
  }
  
  // Check for professional tone
  if (lowerText.includes('professional') || lowerText.includes('business') || lowerText.includes('corporate')) {
    return 'professional';
  }
  
  // Check for casual tone
  if (lowerText.includes('hey') || lowerText.includes('cool') || lowerText.includes('nice')) {
    return 'casual';
  }
  
  // Default to formal
  return 'formal';
}

/**
 * Determine importance level
 */
function determineImportance(text: string, contentType: ContentType): ContentAnalysis['importance'] {
  const lowerText = text.toLowerCase();
  
  // Critical importance indicators
  if (lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('critical')) {
    return 'critical';
  }
  
  // High importance indicators
  if (lowerText.includes('important') || lowerText.includes('warning') || lowerText.includes('alert')) {
    return 'high';
  }
  
  // Content type based importance
  switch (contentType) {
    case 'title':
    case 'callout':
      return 'high';
    case 'watermark':
    case 'disclaimer':
      return 'low';
    default:
      return 'medium';
  }
}

/**
 * Analyze media context for optimal placement
 */
export function analyzeMediaContext(
  dimensions: { width: number; height: number },
  type: 'image' | 'video' = 'image',
  duration?: number
): MediaContext {
  const aspectRatio = dimensions.width / dimensions.height;
  
  let aspectRatioType: MediaContext['aspectRatio'];
  if (aspectRatio > 2) {
    aspectRatioType = 'ultrawide';
  } else if (aspectRatio > 1.2) {
    aspectRatioType = 'landscape';
  } else if (aspectRatio < 0.8) {
    aspectRatioType = 'portrait';
  } else {
    aspectRatioType = 'square';
  }
  
  return {
    type,
    dimensions,
    aspectRatio: aspectRatioType,
    backgroundComplexity: 'moderate', // Would be determined by image analysis
    dominantColors: ['#ffffff'], // Would be determined by image analysis
    brightness: 'medium', // Would be determined by image analysis
    duration,
    motionLevel: type === 'video' ? 'medium' : undefined
  };
}

// ============================================================================
// AI-POWERED OVERLAY GENERATION
// ============================================================================

/**
 * Generate optimal text placement based on content and media analysis
 */
export function generateOptimalPlacement(
  contentAnalysis: ContentAnalysis,
  mediaContext: MediaContext
): TextPlacement {
  const { contentType, importance, context } = contentAnalysis;
  const { aspectRatio, type } = mediaContext;
  
  // Determine base position based on content type
  let basePosition: TextPosition;
  
  switch (contentType) {
    case 'title':
      basePosition = 'top-center';
      break;
    case 'subtitle':
      basePosition = aspectRatio === 'portrait' ? 'center' : 'top-center';
      break;
    case 'caption':
      basePosition = 'bottom-center';
      break;
    case 'watermark':
      basePosition = 'bottom-right';
      break;
    case 'callout':
      basePosition = 'center';
      break;
    case 'quote':
      basePosition = 'center';
      break;
    case 'statistic':
      basePosition = 'center';
      break;
    case 'instruction':
      basePosition = 'bottom-center';
      break;
    case 'disclaimer':
      basePosition = 'bottom-left';
      break;
    case 'credit':
      basePosition = 'bottom-right';
      break;
    default:
      basePosition = 'bottom-center';
  }
  
  // Adjust for importance
  if (importance === 'critical') {
    basePosition = 'center';
  }
  
  // Adjust for aspect ratio
  if (aspectRatio === 'ultrawide' && basePosition === 'top-center') {
    basePosition = 'top-left';
  }
  
  // Create placement with appropriate offset
  const placement = createPlacementFromPosition(basePosition);
  
  // Add timing for videos
  if (type === 'video' && mediaContext.duration) {
    return createTimedPlacement(
      basePosition,
      0,
      Math.min(mediaContext.duration, 5) // Show for first 5 seconds or full duration
    );
  }
  
  return placement;
}

/**
 * Generate optimal text style based on content and media analysis
 */
export function generateOptimalStyle(
  contentAnalysis: ContentAnalysis,
  mediaContext: MediaContext
): TextStyle {
  const { contentType, textLength, tone, importance, colorScheme, audience } = contentAnalysis;
  const { brightness, dominantColors } = mediaContext;
  
  // Start with appropriate preset style
  let baseStyle: TextStyle;
  
  switch (contentType) {
    case 'title':
      baseStyle = PRESET_TEXT_STYLES.title;
      break;
    case 'subtitle':
      baseStyle = PRESET_TEXT_STYLES.subtitle;
      break;
    case 'watermark':
      baseStyle = PRESET_TEXT_STYLES.watermark;
      break;
    case 'callout':
      baseStyle = PRESET_TEXT_STYLES.callout;
      break;
    default:
      baseStyle = PRESET_TEXT_STYLES.body;
  }
  
  // Adjust font size based on text length
  if (textLength === 'short' && baseStyle.fontSize) {
    baseStyle.fontSize = Math.min(baseStyle.fontSize * 1.2, 72);
  } else if (textLength === 'long' && baseStyle.fontSize) {
    baseStyle.fontSize = Math.max(baseStyle.fontSize * 0.8, 16);
  }
  
  // Adjust color based on background brightness
  if (brightness === 'dark') {
    baseStyle.color = '#ffffff';
  } else if (brightness === 'bright') {
    baseStyle.color = '#000000';
  }
  
  // Adjust for importance
  if (importance === 'critical') {
    baseStyle.fontWeight = 'bold';
    baseStyle.color = '#ff0000';
    baseStyle.stroke = { color: '#ffffff', width: 3 };
  } else if (importance === 'high') {
    baseStyle.fontWeight = 'bold';
    baseStyle.stroke = { color: '#000000', width: 2 };
  }
  
  // Adjust for tone
  if (tone === 'playful') {
    baseStyle.fontFamily = 'Comic Sans MS';
    baseStyle.color = '#ff6b6b';
  } else if (tone === 'professional') {
    baseStyle.fontFamily = 'Arial';
    baseStyle.fontWeight = '600';
  }
  
  // Adjust for audience
  if (audience === 'elderly') {
    baseStyle.fontSize = Math.max(baseStyle.fontSize || 24, 32);
    baseStyle.fontWeight = 'bold';
  } else if (audience === 'youth') {
    baseStyle.fontFamily = 'Arial';
    baseStyle.color = '#4ecdc4';
  }
  
  return baseStyle;
}

/**
 * Generate complete text overlay configuration using AI analysis
 */
export function generateTextOverlay(
  text: string,
  mediaContext: MediaContext,
  customOptions?: {
    contentType?: ContentType;
    importance?: ContentAnalysis['importance'];
    tone?: ContentAnalysis['tone'];
    brandGuidelines?: ContentAnalysis['brandGuidelines'];
  }
): {
  text: string;
  placement: TextPlacement;
  style: TextStyle;
  analysis: ContentAnalysis;
} {
  // Analyze content
  const contentAnalysis = analyzeTextContent(text);
  
  // Override with custom options
  if (customOptions) {
    Object.assign(contentAnalysis, customOptions);
  }
  
  // Generate optimal placement and style
  const placement = generateOptimalPlacement(contentAnalysis, mediaContext);
  const style = generateOptimalStyle(contentAnalysis, mediaContext);
  
  // Apply brand guidelines if provided
  if (customOptions?.brandGuidelines) {
    if (customOptions.brandGuidelines.primaryColor) {
      style.color = customOptions.brandGuidelines.primaryColor;
    }
    if (customOptions.brandGuidelines.fontFamily) {
      style.fontFamily = customOptions.brandGuidelines.fontFamily;
    }
  }
  
  // Validate the generated configuration
  const placementValidation = validateTextPlacement(placement);
  const styleValidation = validateTextStyle(style);
  
  if (!placementValidation.isValid) {
    console.warn('Generated placement has issues:', placementValidation.errors);
  }
  
  if (!styleValidation.isValid) {
    console.warn('Generated style has issues:', styleValidation.errors);
  }
  
  return {
    text,
    placement,
    style,
    analysis: contentAnalysis
  };
}

/**
 * Generate multiple text overlays for complex content
 */
export function generateMultipleTextOverlays(
  textSegments: Array<{
    text: string;
    type?: ContentType;
    importance?: ContentAnalysis['importance'];
  }>,
  mediaContext: MediaContext
): Array<{
  text: string;
  placement: TextPlacement;
  style: TextStyle;
  analysis: ContentAnalysis;
}> {
  return textSegments.map((segment, index) => {
    const customOptions = {
      contentType: segment.type,
      importance: segment.importance
    };
    
    const overlay = generateTextOverlay(segment.text, mediaContext, customOptions);
    
    // Adjust placement to avoid overlap for multiple overlays
    if (textSegments.length > 1) {
      overlay.placement = adjustPlacementForMultipleOverlays(overlay.placement, index, textSegments.length);
    }
    
    return overlay;
  });
}

/**
 * Adjust placement to avoid overlap when multiple overlays are present
 */
function adjustPlacementForMultipleOverlays(
  placement: TextPlacement,
  index: number,
  totalCount: number
): TextPlacement {
  if (!placement.position) return placement;
  
  // Create offset based on index to stagger overlays
  const offset = {
    x: (index % 3 - 1) * 20, // -20, 0, 20
    y: Math.floor(index / 3) * 30 // 0, 30, 60, etc.
  };
  
  return {
    ...placement,
    offset: {
      x: (placement.offset?.x || 0) + offset.x,
      y: (placement.offset?.y || 0) + offset.y
    }
  };
}

// ============================================================================
// SMART RECOMMENDATIONS
// ============================================================================

/**
 * Get smart recommendations for text overlay based on content
 */
export function getSmartRecommendations(
  text: string,
  mediaContext: MediaContext
): {
  recommendedStyles: Array<{ name: string; style: TextStyle; description: string }>;
  recommendedPlacements: Array<{ name: string; placement: TextPlacement; description: string }>;
  bestPractices: string[];
} {
  const contentAnalysis = analyzeTextContent(text);
  
  // Generate recommendations based on content type
  const recommendations = {
    recommendedStyles: [] as Array<{ name: string; style: TextStyle; description: string }>,
    recommendedPlacements: [] as Array<{ name: string; placement: TextPlacement; description: string }>,
    bestPractices: [] as string[]
  };
  
  // Style recommendations
  switch (contentAnalysis.contentType) {
    case 'title':
      recommendations.recommendedStyles.push(
        { name: 'Bold Title', style: PRESET_TEXT_STYLES.title, description: 'Large, bold text with stroke for maximum visibility' },
        { name: 'Elegant Title', style: { ...PRESET_TEXT_STYLES.title, fontFamily: 'Georgia', stroke: undefined }, description: 'Elegant serif font for sophisticated look' }
      );
      break;
    case 'callout':
      recommendations.recommendedStyles.push(
        { name: 'Attention Grabber', style: PRESET_TEXT_STYLES.callout, description: 'High contrast colors to draw attention' },
        { name: 'Subtle Highlight', style: { ...PRESET_TEXT_STYLES.callout, opacity: 0.8 }, description: 'Less aggressive but still noticeable' }
      );
      break;
  }
  
  // Placement recommendations
  switch (contentAnalysis.contentType) {
    case 'title':
      recommendations.recommendedPlacements.push(
        { name: 'Top Center', placement: PRESET_PLACEMENTS.topCenter, description: 'Traditional title placement' },
        { name: 'Center', placement: PRESET_PLACEMENTS.center, description: 'Centered for maximum impact' }
      );
      break;
    case 'watermark':
      recommendations.recommendedPlacements.push(
        { name: 'Bottom Right', placement: PRESET_PLACEMENTS.bottomRight, description: 'Standard watermark position' },
        { name: 'Top Right', placement: PRESET_PLACEMENTS.topRight, description: 'Alternative watermark position' }
      );
      break;
  }
  
  // Best practices
  if (contentAnalysis.textLength === 'long') {
    recommendations.bestPractices.push('Consider breaking long text into multiple overlays');
  }
  
  if (contentAnalysis.importance === 'critical') {
    recommendations.bestPractices.push('Use high contrast colors and bold fonts for critical information');
  }
  
  if (mediaContext.type === 'video') {
    recommendations.bestPractices.push('Consider timing for video overlays - don\'t show text for too long');
  }
  
  return recommendations;
} 