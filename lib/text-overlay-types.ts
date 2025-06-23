/**
 * Comprehensive Text Overlay Type Definitions
 * 
 * This file provides standardized interfaces for text styling and placement
 * across both image and video processing APIs. It includes detailed documentation,
 * examples, and validation utilities.
 */

// ============================================================================
// TEXT PLACEMENT INTERFACES
// ============================================================================

/**
 * Standard text placement options for both images and videos
 */
export interface TextPlacement {
  /** X coordinate (0-100 for percentage, or absolute pixels) */
  x?: number;
  /** Y coordinate (0-100 for percentage, or absolute pixels) */
  y?: number;
  
  /** Preset position options */
  position?: TextPosition;
  
  /** Cloudinary gravity options (alternative to position) */
  gravity?: CloudinaryGravity;
  
  /** Fine-tune positioning with pixel offsets */
  offset?: {
    x?: number;
    y?: number;
  };
  
  /** Video-specific timing controls (in seconds) */
  startTime?: number;
  endTime?: number;
}

/**
 * Preset position options for text placement
 */
export type TextPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

/**
 * Cloudinary gravity options for advanced positioning
 */
export type CloudinaryGravity = 
  | 'north_west' | 'north' | 'north_east'
  | 'west' | 'center' | 'east'
  | 'south_west' | 'south' | 'south_east';

/**
 * Mapping from position to Cloudinary gravity
 */
export const POSITION_TO_GRAVITY_MAP: Record<TextPosition, CloudinaryGravity> = {
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

// ============================================================================
// TEXT STYLE INTERFACES
// ============================================================================

/**
 * Standard text styling options for both images and videos
 */
export interface TextStyle {
  /** Font family name */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Text color (hex, rgb, or named color) */
  color?: string;
  /** Background color for text */
  backgroundColor?: string;
  /** Opacity (0.0 to 1.0) */
  opacity?: number;
  /** Font weight */
  fontWeight?: FontWeight;
  /** Font style */
  fontStyle?: FontStyle;
  /** Text decoration */
  textDecoration?: TextDecoration;
  /** Text alignment */
  textAlign?: TextAlign;
  /** Letter spacing in pixels */
  letterSpacing?: number;
  /** Line height multiplier */
  lineHeight?: number;
  /** Text stroke/outline */
  stroke?: {
    color: string;
    width: number;
  };
  /** Text shadow */
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  /** Video-specific animation */
  animation?: {
    type: AnimationType;
    duration: number;
    delay?: number;
  };
}

/**
 * Font weight options
 */
export type FontWeight = 
  | 'normal' | 'bold' 
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Font style options
 */
export type FontStyle = 'normal' | 'italic';

/**
 * Text decoration options
 */
export type TextDecoration = 'none' | 'underline' | 'line-through';

/**
 * Text alignment options
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Animation types for video text
 */
export type AnimationType = 'fade' | 'slide' | 'bounce' | 'zoom';

// ============================================================================
// PRESET STYLES
// ============================================================================

/**
 * Predefined text styles for common use cases
 */
export const PRESET_TEXT_STYLES = {
  /** Large, bold title text */
  title: {
    fontFamily: 'Arial',
    fontSize: 48,
    color: '#ffffff',
    fontWeight: 'bold' as FontWeight,
    stroke: { color: '#000000', width: 3 },
    shadow: { color: '#000000', blur: 4, offsetX: 2, offsetY: 2 }
  },
  
  /** Medium subtitle text */
  subtitle: {
    fontFamily: 'Arial',
    fontSize: 32,
    color: '#ffffff',
    fontWeight: '600' as FontWeight,
    stroke: { color: '#000000', width: 2 }
  },
  
  /** Standard body text */
  body: {
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'normal' as FontWeight
  },
  
  /** Small caption text */
  caption: {
    fontFamily: 'Arial',
    fontSize: 18,
    color: '#cccccc',
    fontWeight: 'normal' as FontWeight
  },
  
  /** Watermark style */
  watermark: {
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'normal' as FontWeight,
    opacity: 0.5
  },
  
  /** Callout/highlight text */
  callout: {
    fontFamily: 'Arial',
    fontSize: 28,
    color: '#ff0000',
    fontWeight: 'bold' as FontWeight,
    backgroundColor: '#ffff00',
    stroke: { color: '#000000', width: 1 }
  }
} as const;

/**
 * Predefined placement presets for common positions
 */
export const PRESET_PLACEMENTS = {
  /** Top left corner */
  topLeft: { position: 'top-left' as TextPosition, offset: { x: 20, y: 20 } },
  
  /** Top center */
  topCenter: { position: 'top-center' as TextPosition, offset: { x: 0, y: 20 } },
  
  /** Top right corner */
  topRight: { position: 'top-right' as TextPosition, offset: { x: -20, y: 20 } },
  
  /** Center left */
  centerLeft: { position: 'center-left' as TextPosition, offset: { x: 20, y: 0 } },
  
  /** Dead center */
  center: { position: 'center' as TextPosition },
  
  /** Center right */
  centerRight: { position: 'center-right' as TextPosition, offset: { x: -20, y: 0 } },
  
  /** Bottom left */
  bottomLeft: { position: 'bottom-left' as TextPosition, offset: { x: 20, y: -20 } },
  
  /** Bottom center */
  bottomCenter: { position: 'bottom-center' as TextPosition, offset: { x: 0, y: -20 } },
  
  /** Bottom right */
  bottomRight: { position: 'bottom-right' as TextPosition, offset: { x: -20, y: -20 } }
} as const;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate text placement options
 */
export function validateTextPlacement(placement: TextPlacement): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for conflicting positioning methods
  if (placement.position && placement.gravity) {
    errors.push('Cannot use both position and gravity - use one or the other');
  }
  
  // Validate coordinates
  if (placement.x !== undefined && (placement.x < 0 || placement.x > 100)) {
    errors.push('X coordinate must be between 0 and 100');
  }
  
  if (placement.y !== undefined && (placement.y < 0 || placement.y > 100)) {
    errors.push('Y coordinate must be between 0 and 100');
  }
  
  // Validate timing for videos
  if (placement.startTime !== undefined && placement.startTime < 0) {
    errors.push('Start time must be non-negative');
  }
  
  if (placement.endTime !== undefined && placement.endTime < 0) {
    errors.push('End time must be non-negative');
  }
  
  if (placement.startTime !== undefined && placement.endTime !== undefined && placement.startTime >= placement.endTime) {
    errors.push('Start time must be less than end time');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate text style options
 */
export function validateTextStyle(style: TextStyle): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate font size
  if (style.fontSize !== undefined && (style.fontSize < 8 || style.fontSize > 200)) {
    errors.push('Font size must be between 8 and 200 pixels');
  }
  
  // Validate opacity
  if (style.opacity !== undefined && (style.opacity < 0 || style.opacity > 1)) {
    errors.push('Opacity must be between 0 and 1');
  }
  
  // Validate stroke width
  if (style.stroke?.width !== undefined && (style.stroke.width < 0 || style.stroke.width > 20)) {
    errors.push('Stroke width must be between 0 and 20 pixels');
  }
  
  // Validate shadow blur
  if (style.shadow?.blur !== undefined && (style.shadow.blur < 0 || style.shadow.blur > 50)) {
    errors.push('Shadow blur must be between 0 and 50 pixels');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create a text placement from position string
 */
export function createPlacementFromPosition(position: TextPosition, offset?: { x?: number; y?: number }): TextPlacement {
  return {
    position,
    offset
  };
}

/**
 * Create a text placement from coordinates
 */
export function createPlacementFromCoordinates(x: number, y: number): TextPlacement {
  return { x, y };
}

/**
 * Create a text placement with timing for videos
 */
export function createTimedPlacement(
  position: TextPosition, 
  startTime: number, 
  endTime: number,
  offset?: { x?: number; y?: number }
): TextPlacement {
  return {
    position,
    startTime,
    endTime,
    offset
  };
}

/**
 * Merge text styles with defaults
 */
export function mergeTextStyle(style: Partial<TextStyle>, defaults: TextStyle = PRESET_TEXT_STYLES.body): TextStyle {
  return {
    ...defaults,
    ...style,
    stroke: style.stroke ? { ...defaults.stroke, ...style.stroke } : defaults.stroke,
    shadow: style.shadow ? { ...defaults.shadow, ...style.shadow } : defaults.shadow,
    animation: style.animation ? { ...defaults.animation, ...style.animation } : defaults.animation
  };
}

/**
 * Convert position to Cloudinary gravity
 */
export function positionToGravity(position: TextPosition): CloudinaryGravity {
  return POSITION_TO_GRAVITY_MAP[position];
}

/**
 * Get readable position name
 */
export function getPositionName(position: TextPosition): string {
  return position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============================================================================
// EXAMPLE CONFIGURATIONS
// ============================================================================

/**
 * Example text overlay configurations for common use cases
 */
export const EXAMPLE_CONFIGURATIONS = {
  /** Title overlay for images/videos */
  title: {
    text: 'Your Title Here',
    placement: PRESET_PLACEMENTS.topCenter,
    style: PRESET_TEXT_STYLES.title
  },
  
  /** Subtitle overlay */
  subtitle: {
    text: 'Your Subtitle',
    placement: PRESET_PLACEMENTS.center,
    style: PRESET_TEXT_STYLES.subtitle
  },
  
  /** Watermark overlay */
  watermark: {
    text: '© 2024 Your Company',
    placement: PRESET_PLACEMENTS.bottomRight,
    style: PRESET_TEXT_STYLES.watermark
  },
  
  /** Timed video overlay */
  videoTitle: {
    text: 'Video Title',
    placement: createTimedPlacement('top-center', 0, 3),
    style: PRESET_TEXT_STYLES.title
  },
  
  /** Callout text */
  callout: {
    text: 'IMPORTANT!',
    placement: PRESET_PLACEMENTS.center,
    style: PRESET_TEXT_STYLES.callout
  }
} as const;

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if placement has timing (video-specific)
 */
export function hasTiming(placement: TextPlacement): placement is TextPlacement & { startTime: number; endTime: number } {
  return placement.startTime !== undefined && placement.endTime !== undefined;
}

/**
 * Check if style has animation (video-specific)
 */
export function hasAnimation(style: TextStyle): style is TextStyle & { animation: NonNullable<TextStyle['animation']> } {
  return style.animation !== undefined;
}

/**
 * Check if placement uses absolute coordinates
 */
export function usesAbsoluteCoordinates(placement: TextPlacement): placement is TextPlacement & { x: number; y: number } {
  return placement.x !== undefined && placement.y !== undefined;
}

/**
 * Check if placement uses preset position
 */
export function usesPresetPosition(placement: TextPlacement): placement is TextPlacement & { position: TextPosition } {
  return placement.position !== undefined;
} 