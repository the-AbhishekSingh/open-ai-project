# AI-Powered Text Overlay Guide

This guide explains how to use the comprehensive text overlay system for adding text to images and videos with intelligent styling and placement.

## 🎯 Overview

The text overlay system provides:
- **AI-powered content analysis** to automatically determine optimal styling
- **Precise placement controls** with 9 preset positions and custom coordinates
- **Advanced typography options** including fonts, colors, effects, and animations
- **Smart recommendations** based on content type and media context
- **Validation and error handling** to ensure proper configurations

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Text Placement Options](#text-placement-options)
3. [Text Style Options](#text-style-options)
4. [AI-Powered Generation](#ai-powered-generation)
5. [Preset Styles and Placements](#preset-styles-and-placements)
6. [API Usage Examples](#api-usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Basic Text Overlay

```javascript
import { generateTextOverlay, analyzeMediaContext } from '@/lib/ai-text-overlay-generator';

// Generate AI-powered text overlay
const mediaContext = analyzeMediaContext({ width: 1920, height: 1080 }, 'image');
const overlay = generateTextOverlay('Hello World', mediaContext);

console.log(overlay);
// Output:
// {
//   text: 'Hello World',
//   placement: { position: 'bottom-center' },
//   style: { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', ... },
//   analysis: { contentType: 'caption', textLength: 'short', ... }
// }
```

### Using Preset Styles

```javascript
import { PRESET_TEXT_STYLES, PRESET_PLACEMENTS } from '@/lib/text-overlay-types';

const titleOverlay = {
  text: 'My Title',
  placement: PRESET_PLACEMENTS.topCenter,
  style: PRESET_TEXT_STYLES.title
};
```

## 📍 Text Placement Options

### Position Types

The system supports three types of positioning:

1. **Preset Positions** (Recommended)
2. **Custom Coordinates** (X/Y values)
3. **Cloudinary Gravity** (Advanced)

### Preset Positions

```typescript
type TextPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';
```

### Placement Interface

```typescript
interface TextPlacement {
  // Custom coordinates (0-100 for percentage, or absolute pixels)
  x?: number;
  y?: number;
  
  // Preset position (recommended)
  position?: TextPosition;
  
  // Cloudinary gravity (alternative to position)
  gravity?: CloudinaryGravity;
  
  // Fine-tune positioning
  offset?: {
    x?: number;
    y?: number;
  };
  
  // Video-specific timing (in seconds)
  startTime?: number;
  endTime?: number;
}
```

### Placement Examples

```javascript
// Simple preset position
const simplePlacement = {
  position: 'top-center'
};

// Position with offset
const offsetPlacement = {
  position: 'bottom-right',
  offset: { x: -20, y: -20 }
};

// Custom coordinates
const customPlacement = {
  x: 50,  // 50% from left
  y: 25   // 25% from top
};

// Video with timing
const timedPlacement = {
  position: 'center',
  startTime: 2.0,  // Start at 2 seconds
  endTime: 8.0     // End at 8 seconds
};
```

## 🎨 Text Style Options

### Style Interface

```typescript
interface TextStyle {
  // Basic typography
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  
  // Font properties
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  textDecoration?: TextDecoration;
  textAlign?: TextAlign;
  
  // Spacing
  letterSpacing?: number;
  lineHeight?: number;
  
  // Visual effects
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
  
  // Video-specific animation
  animation?: {
    type: AnimationType;
    duration: number;
    delay?: number;
  };
}
```

### Font Weight Options

```typescript
type FontWeight = 
  | 'normal' | 'bold' 
  | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
```

### Font Style Options

```typescript
type FontStyle = 'normal' | 'italic';
```

### Text Alignment Options

```typescript
type TextAlign = 'left' | 'center' | 'right';
```

### Style Examples

```javascript
// Basic style
const basicStyle = {
  fontFamily: 'Arial',
  fontSize: 24,
  color: '#ffffff'
};

// Advanced style with effects
const advancedStyle = {
  fontFamily: 'Arial',
  fontSize: 32,
  color: '#ffffff',
  fontWeight: 'bold',
  stroke: { color: '#000000', width: 2 },
  shadow: { color: '#000000', blur: 4, offsetX: 2, offsetY: 2 },
  opacity: 0.9
};

// Video animation style
const animatedStyle = {
  fontFamily: 'Arial',
  fontSize: 24,
  color: '#ffffff',
  animation: {
    type: 'fade',
    duration: 1.0,
    delay: 0.5
  }
};
```

## 🤖 AI-Powered Generation

### Content Analysis

The AI system analyzes text content to determine:

- **Content Type**: title, subtitle, caption, watermark, callout, etc.
- **Text Length**: short, medium, long
- **Tone**: formal, casual, urgent, playful, professional
- **Importance**: low, medium, high, critical
- **Target Audience**: general, professional, youth, elderly

### Automatic Style Generation

```javascript
import { generateTextOverlay, analyzeTextContent } from '@/lib/ai-text-overlay-generator';

// AI analyzes content and generates optimal styling
const overlay = generateTextOverlay('URGENT: System Alert!', mediaContext);

// The AI automatically:
// - Detects this is a "callout" with "urgent" tone
// - Sets importance to "critical"
// - Uses red color with white stroke
// - Places text in center position
// - Applies bold font weight
```

### Custom AI Options

```javascript
const overlay = generateTextOverlay('Company Title', mediaContext, {
  contentType: 'title',
  importance: 'high',
  tone: 'professional',
  brandGuidelines: {
    primaryColor: '#0066cc',
    fontFamily: 'Helvetica'
  }
});
```

### Multiple Text Overlays

```javascript
import { generateMultipleTextOverlays } from '@/lib/ai-text-overlay-generator';

const textSegments = [
  { text: 'Main Title', type: 'title' },
  { text: 'Subtitle text', type: 'subtitle' },
  { text: '© 2024 Company', type: 'watermark' }
];

const overlays = generateMultipleTextOverlays(textSegments, mediaContext);
// AI automatically positions overlays to avoid overlap
```

## 🎯 Preset Styles and Placements

### Preset Text Styles

```javascript
import { PRESET_TEXT_STYLES } from '@/lib/text-overlay-types';

// Available presets:
PRESET_TEXT_STYLES.title      // Large, bold title
PRESET_TEXT_STYLES.subtitle   // Medium subtitle
PRESET_TEXT_STYLES.body       // Standard body text
PRESET_TEXT_STYLES.caption    // Small caption
PRESET_TEXT_STYLES.watermark  // Semi-transparent watermark
PRESET_TEXT_STYLES.callout    // High-contrast callout
```

### Preset Placements

```javascript
import { PRESET_PLACEMENTS } from '@/lib/text-overlay-types';

// Available presets:
PRESET_PLACEMENTS.topLeft     // Top left with offset
PRESET_PLACEMENTS.topCenter   // Top center with offset
PRESET_PLACEMENTS.topRight    // Top right with offset
PRESET_PLACEMENTS.centerLeft  // Center left with offset
PRESET_PLACEMENTS.center      // Dead center
PRESET_PLACEMENTS.centerRight // Center right with offset
PRESET_PLACEMENTS.bottomLeft  // Bottom left with offset
PRESET_PLACEMENTS.bottomCenter // Bottom center with offset
PRESET_PLACEMENTS.bottomRight // Bottom right with offset
```

## 🔌 API Usage Examples

### Image Processing API

```javascript
// Single text overlay
const formData = new FormData();
formData.append('action', 'text-overlay');
formData.append('image', imageFile);
formData.append('text', 'Hello World');
formData.append('textPlacement', JSON.stringify({
  position: 'bottom-center'
}));
formData.append('textStyle', JSON.stringify({
  fontFamily: 'Arial',
  fontSize: 24,
  color: '#ffffff',
  fontWeight: 'bold'
}));

const response = await fetch('/api/image', {
  method: 'POST',
  body: formData
});
```

### Video Processing API

```javascript
// Timed text overlay
const formData = new FormData();
formData.append('action', 'text-overlay');
formData.append('video', videoFile);
formData.append('text', 'Video Title');
formData.append('textPlacement', JSON.stringify({
  position: 'top-center',
  startTime: 0,
  endTime: 3
}));
formData.append('textStyle', JSON.stringify({
  fontFamily: 'Arial',
  fontSize: 32,
  color: '#ffffff',
  fontWeight: 'bold',
  stroke: { color: '#000000', width: 2 }
}));

const response = await fetch('/api/video', {
  method: 'POST',
  body: formData
});
```

### Multiple Text Overlays

```javascript
const multipleTexts = [
  {
    text: 'Main Title',
    placement: { position: 'top-center' },
    style: { fontSize: 48, color: '#ffffff', fontWeight: 'bold' }
  },
  {
    text: 'Subtitle',
    placement: { position: 'center' },
    style: { fontSize: 24, color: '#cccccc' }
  },
  {
    text: '© 2024',
    placement: { position: 'bottom-right' },
    style: { fontSize: 16, color: '#ffffff', opacity: 0.7 }
  }
];

formData.append('multipleTexts', JSON.stringify(multipleTexts));
```

## ✅ Best Practices

### 1. Use Preset Positions
```javascript
// ✅ Good - Use preset positions
const placement = { position: 'top-center' };

// ❌ Avoid - Custom coordinates unless necessary
const placement = { x: 50, y: 10 };
```

### 2. Choose Appropriate Font Sizes
```javascript
// ✅ Good - Appropriate sizes
const titleStyle = { fontSize: 48 };    // Titles
const bodyStyle = { fontSize: 24 };     // Body text
const captionStyle = { fontSize: 16 };  // Captions

// ❌ Avoid - Too small or too large
const badStyle = { fontSize: 8 };       // Too small
const badStyle2 = { fontSize: 200 };    // Too large
```

### 3. Ensure Readability
```javascript
// ✅ Good - High contrast
const readableStyle = {
  color: '#ffffff',
  stroke: { color: '#000000', width: 2 }
};

// ❌ Avoid - Low contrast
const unreadableStyle = {
  color: '#cccccc',
  stroke: { color: '#dddddd', width: 1 }
};
```

### 4. Use Timing for Videos
```javascript
// ✅ Good - Appropriate timing
const timedPlacement = {
  position: 'top-center',
  startTime: 0,
  endTime: 3  // Show for 3 seconds
};

// ❌ Avoid - Text showing too long
const badTiming = {
  position: 'center',
  startTime: 0,
  endTime: 30  // Too long for most content
};
```

### 5. Consider Multiple Overlays
```javascript
// ✅ Good - Break up long content
const overlays = [
  { text: 'Title', placement: { position: 'top-center' } },
  { text: 'Subtitle', placement: { position: 'center' } },
  { text: 'Caption', placement: { position: 'bottom-center' } }
];

// ❌ Avoid - One long overlay
const badOverlay = {
  text: 'This is a very long text that should be broken into multiple overlays for better readability and visual hierarchy',
  placement: { position: 'center' }
};
```

## 🔧 Validation and Error Handling

### Validate Placements

```javascript
import { validateTextPlacement } from '@/lib/text-overlay-types';

const placement = { position: 'top-center', x: 150 }; // Invalid: mixing position and coordinates

const validation = validateTextPlacement(placement);
if (!validation.isValid) {
  console.error('Placement errors:', validation.errors);
  // Output: ["Cannot use both position and gravity - use one or the other"]
}
```

### Validate Styles

```javascript
import { validateTextStyle } from '@/lib/text-overlay-types';

const style = { fontSize: 300 }; // Invalid: too large

const validation = validateTextStyle(style);
if (!validation.isValid) {
  console.error('Style errors:', validation.errors);
  // Output: ["Font size must be between 8 and 200 pixels"]
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Text not visible**
   - Check color contrast with background
   - Ensure opacity is not 0
   - Verify font size is appropriate

2. **Text positioned incorrectly**
   - Use preset positions instead of custom coordinates
   - Check offset values
   - Verify position string spelling

3. **Video text timing issues**
   - Ensure startTime < endTime
   - Check video duration
   - Verify timing values are positive

4. **Multiple overlays overlapping**
   - Use AI-generated multiple overlays
   - Add appropriate offsets
   - Consider different positions

### Debug Mode

```javascript
import { generateTextOverlay } from '@/lib/ai-text-overlay-generator';

const overlay = generateTextOverlay('Debug Text', mediaContext);
console.log('Generated overlay:', overlay);
console.log('Content analysis:', overlay.analysis);
```

### Performance Tips

1. **Use preset styles** for common cases
2. **Cache generated overlays** for repeated use
3. **Validate configurations** before processing
4. **Use appropriate image/video formats** for faster processing

## 📚 Additional Resources

- [Cloudinary Text Overlay Documentation](https://cloudinary.com/documentation/text_transformations)
- [Typography Best Practices](https://www.smashingmagazine.com/2011/03/how-to-choose-a-font/)
- [Color Theory for Designers](https://www.smashingmagazine.com/2010/02/color-theory-for-designers-part-1-the-meaning-of-color/)

## 🤝 Contributing

To contribute to the text overlay system:

1. Add new preset styles in `lib/text-overlay-types.ts`
2. Enhance AI analysis in `lib/ai-text-overlay-generator.ts`
3. Add validation rules for new features
4. Update documentation with examples

---

For more information, see the main [README.md](../README.md) or contact the development team. 