/**
 * Social Media Agent
 * 
 * This agent analyzes uploaded content (videos, memes, graphics) and automatically
 * generates engaging social media posts with appropriate text overlays.
 */

import { 
  generateTextOverlay, 
  analyzeMediaContext,
  ContentType,
  MediaContext 
} from './ai-text-overlay-generator';
import { 
  TextPlacement, 
  TextStyle, 
  PRESET_TEXT_STYLES,
  PRESET_PLACEMENTS 
} from './text-overlay-types';

// ============================================================================
// CONTENT TYPES AND CATEGORIES
// ============================================================================

export interface SocialMediaContent {
  id: string;
  type: 'video' | 'meme' | 'graphic';
  category: string;
  title: string;
  description: string;
  tags: string[];
  contentUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  dimensions: {
    width: number;
    height: number;
  };
  uploadDate: Date;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
}

export interface SocialMediaPost {
  id: string;
  contentId: string;
  platform: SocialPlatform;
  textOverlays: Array<{
    text: string;
    placement: TextPlacement;
    style: TextStyle;
  }>;
  caption: string;
  hashtags: string[];
  scheduledTime?: Date;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  analytics?: {
    reach: number;
    engagement: number;
    clicks: number;
  };
}

export type SocialPlatform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook';

// ============================================================================
// CONTENT ANALYSIS AND CATEGORIZATION
// ============================================================================

/**
 * Analyze and categorize uploaded content
 */
export function analyzeContent(content: SocialMediaContent): {
  category: string;
  targetAudience: string[];
  bestPlatforms: SocialPlatform[];
  trendingScore: number;
  suggestedHashtags: string[];
} {
  const analysis = {
    category: '',
    targetAudience: [] as string[],
    bestPlatforms: [] as SocialPlatform[],
    trendingScore: 0,
    suggestedHashtags: [] as string[]
  };

  // Analyze based on content type and category
  switch (content.type) {
    case 'video':
      analysis.category = analyzeVideoCategory(content.category);
      analysis.targetAudience = getVideoTargetAudience(content.category);
      analysis.bestPlatforms = getVideoBestPlatforms(content.category);
      analysis.trendingScore = calculateVideoTrendingScore(content);
      analysis.suggestedHashtags = generateVideoHashtags(content.category);
      break;
    
    case 'meme':
      analysis.category = 'viral-meme';
      analysis.targetAudience = ['gen-z', 'millennials', 'internet-culture'];
      analysis.bestPlatforms = ['instagram', 'twitter', 'tiktok'];
      analysis.trendingScore = calculateMemeTrendingScore(content);
      analysis.suggestedHashtags = generateMemeHashtags(content.category);
      break;
    
    case 'graphic':
      analysis.category = 'brand-graphic';
      analysis.targetAudience = ['general', 'business', 'professional'];
      analysis.bestPlatforms = ['instagram', 'facebook', 'linkedin'];
      analysis.trendingScore = calculateGraphicTrendingScore(content);
      analysis.suggestedHashtags = generateGraphicHashtags(content.category);
      break;
  }

  return analysis;
}

/**
 * Analyze video category and generate appropriate content
 */
function analyzeVideoCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'subway-surfers': 'gaming-entertainment',
    'minecraft': 'gaming-educational',
    'brainrot': 'viral-entertainment',
    'gaming': 'gaming-content',
    'entertainment': 'viral-entertainment'
  };
  
  return categoryMap[category] || 'general-entertainment';
}

/**
 * Get target audience for video content
 */
function getVideoTargetAudience(category: string): string[] {
  const audienceMap: Record<string, string[]> = {
    'subway-surfers': ['gen-z', 'mobile-gamers', 'casual-gamers'],
    'minecraft': ['gen-z', 'millennials', 'gaming-community', 'educational'],
    'brainrot': ['gen-z', 'viral-content', 'entertainment'],
    'gaming': ['gamers', 'gen-z', 'millennials'],
    'entertainment': ['general', 'entertainment', 'viral-content']
  };
  
  return audienceMap[category] || ['general'];
}

/**
 * Get best platforms for video content
 */
function getVideoBestPlatforms(category: string): SocialPlatform[] {
  const platformMap: Record<string, SocialPlatform[]> = {
    'subway-surfers': ['tiktok', 'instagram', 'youtube'],
    'minecraft': ['youtube', 'tiktok', 'instagram'],
    'brainrot': ['tiktok', 'instagram', 'twitter'],
    'gaming': ['youtube', 'tiktok', 'instagram'],
    'entertainment': ['tiktok', 'instagram', 'youtube']
  };
  
  return platformMap[category] || ['tiktok', 'instagram'];
}

// ============================================================================
// TRENDING SCORE CALCULATION
// ============================================================================

/**
 * Calculate trending score for videos
 */
function calculateVideoTrendingScore(content: SocialMediaContent): number {
  let score = 50; // Base score
  
  // Category-based scoring
  switch (content.category) {
    case 'subway-surfers':
      score += 30; // High trending potential
      break;
    case 'minecraft':
      score += 25; // Good trending potential
      break;
    case 'brainrot':
      score += 35; // Very high trending potential
      break;
  }
  
  // Engagement boost
  if (content.engagement) {
    score += Math.min(content.engagement.views / 1000, 20);
    score += Math.min(content.engagement.likes / 100, 15);
  }
  
  return Math.min(score, 100);
}

/**
 * Calculate trending score for memes
 */
function calculateMemeTrendingScore(content: SocialMediaContent): number {
  let score = 60; // Memes have high base trending potential
  
  // Engagement boost
  if (content.engagement) {
    score += Math.min(content.engagement.shares / 50, 25);
    score += Math.min(content.engagement.comments / 20, 15);
  }
  
  return Math.min(score, 100);
}

/**
 * Calculate trending score for graphics
 */
function calculateGraphicTrendingScore(content: SocialMediaContent): number {
  let score = 40; // Graphics have moderate trending potential
  
  // Engagement boost
  if (content.engagement) {
    score += Math.min(content.engagement.likes / 100, 20);
    score += Math.min(content.engagement.shares / 30, 20);
  }
  
  return Math.min(score, 100);
}

// ============================================================================
// HASHTAG GENERATION
// ============================================================================

/**
 * Generate hashtags for videos
 */
function generateVideoHashtags(category: string): string[] {
  const baseHashtags = ['viral', 'trending', 'fyp', 'foryou'];
  
  const categoryHashtags: Record<string, string[]> = {
    'subway-surfers': ['subwaysurfers', 'gaming', 'mobilegame', 'speedrun', 'gamingviral'],
    'minecraft': ['minecraft', 'gaming', 'minecraftbuilds', 'gamingcommunity', 'minecraftviral'],
    'brainrot': ['brainrot', 'viral', 'funny', 'entertainment', 'trending'],
    'gaming': ['gaming', 'gamer', 'videogames', 'gamingcommunity', 'gamingviral'],
    'entertainment': ['entertainment', 'funny', 'viral', 'trending', 'fyp']
  };
  
  return [...baseHashtags, ...(categoryHashtags[category] || ['viral', 'trending'])];
}

/**
 * Generate hashtags for memes
 */
function generateMemeHashtags(category: string): string[] {
  const baseHashtags = ['meme', 'funny', 'viral', 'trending', 'fyp'];
  
  const categoryHashtags: Record<string, string[]> = {
    'dank-memes': ['dankmemes', 'memes', 'funny', 'viral'],
    'viral-meme': ['viral', 'trending', 'funny', 'meme'],
    'classic-meme': ['classic', 'meme', 'nostalgia', 'funny']
  };
  
  return [...baseHashtags, ...(categoryHashtags[category] || ['meme', 'funny'])];
}

/**
 * Generate hashtags for graphics
 */
function generateGraphicHashtags(category: string): string[] {
  const baseHashtags = ['design', 'graphic', 'creative', 'art'];
  
  const categoryHashtags: Record<string, string[]> = {
    'brand-graphic': ['brand', 'design', 'marketing', 'business'],
    'color-graphic': ['color', 'design', 'creative', 'art'],
    'minimal-graphic': ['minimal', 'design', 'clean', 'modern']
  };
  
  return [...baseHashtags, ...(categoryHashtags[category] || ['design', 'creative'])];
}

// ============================================================================
// TEXT OVERLAY GENERATION
// ============================================================================

/**
 * Generate text overlays for social media content
 */
export function generateSocialMediaOverlays(
  content: SocialMediaContent,
  platform: SocialPlatform
): Array<{
  text: string;
  placement: TextPlacement;
  style: TextStyle;
}> {
  const mediaContext = analyzeMediaContext(
    content.dimensions,
    content.type,
    content.duration
  );

  const overlays: Array<{
    text: string;
    placement: TextPlacement;
    style: TextStyle;
  }> = [];

  // Generate overlays based on content type and platform
  switch (content.type) {
    case 'video':
      overlays.push(...generateVideoOverlays(content, platform, mediaContext));
      break;
    case 'meme':
      overlays.push(...generateMemeOverlays(content, platform, mediaContext));
      break;
    case 'graphic':
      overlays.push(...generateGraphicOverlays(content, platform, mediaContext));
      break;
  }

  return overlays;
}

/**
 * Generate text overlays for videos
 */
function generateVideoOverlays(
  content: SocialMediaContent,
  platform: SocialPlatform,
  mediaContext: MediaContext
): Array<{
  text: string;
  placement: TextPlacement;
  style: TextStyle;
}> {
  const overlays: Array<{
    text: string;
    placement: TextPlacement;
    style: TextStyle;
  }> = [];

  // Generate title overlay
  const titleText = generateVideoTitle(content.category);
  const titleOverlay = generateTextOverlay(titleText, mediaContext, {
    contentType: 'title',
    importance: 'high'
  });
  
  overlays.push({
    text: titleOverlay.text,
    placement: titleOverlay.placement,
    style: titleOverlay.style
  });

  // Add platform-specific overlays
  if (platform === 'tiktok') {
    overlays.push({
      text: '🔥 FOLLOW FOR MORE 🔥',
      placement: { position: 'bottom-center', offset: { y: -10 } },
      style: {
        ...PRESET_TEXT_STYLES.callout,
        fontSize: 18,
        opacity: 0.9
      }
    });
  } else if (platform === 'instagram') {
    overlays.push({
      text: 'Double tap ❤️',
      placement: { position: 'bottom-left', offset: { x: 10, y: -10 } },
      style: {
        ...PRESET_TEXT_STYLES.caption,
        fontSize: 16,
        opacity: 0.8
      }
    });
  }

  return overlays;
}

/**
 * Generate text overlays for memes
 */
function generateMemeOverlays(
  content: SocialMediaContent,
  platform: SocialPlatform,
  mediaContext: MediaContext
): Array<{
  text: string;
  placement: TextPlacement;
  style: TextStyle;
}> {
  const overlays: Array<{
    text: string;
    placement: TextPlacement;
    style: TextStyle;
  }> = [];

  // Generate meme text based on category
  const memeText = generateMemeText(content.category);
  const memeOverlay = generateTextOverlay(memeText, mediaContext, {
    contentType: 'callout',
    importance: 'high'
  });

  overlays.push({
    text: memeOverlay.text,
    placement: memeOverlay.placement,
    style: {
      ...memeOverlay.style,
      fontFamily: 'Impact',
      stroke: { color: '#000000', width: 3 }
    }
  });

  // Add viral indicators
  overlays.push({
    text: '🔥 VIRAL 🔥',
    placement: { position: 'top-right', offset: { x: -10, y: 10 } },
    style: {
      ...PRESET_TEXT_STYLES.callout,
      fontSize: 16,
      opacity: 0.9
    }
  });

  return overlays;
}

/**
 * Generate text overlays for graphics
 */
function generateGraphicOverlays(
  content: SocialMediaContent,
  platform: SocialPlatform,
  mediaContext: MediaContext
): Array<{
  text: string;
  placement: TextPlacement;
  style: TextStyle;
}> {
  const overlays: Array<{
    text: string;
    placement: TextPlacement;
    style: TextStyle;
  }> = [];

  // Generate brand message
  const brandText = generateBrandText(content.category);
  const brandOverlay = generateTextOverlay(brandText, mediaContext, {
    contentType: 'title',
    importance: 'high'
  });

  overlays.push({
    text: brandOverlay.text,
    placement: brandOverlay.placement,
    style: brandOverlay.style
  });

  // Add call-to-action
  overlays.push({
    text: 'SHARE THIS! 📱',
    placement: { position: 'bottom-center', offset: { y: -10 } },
    style: {
      ...PRESET_TEXT_STYLES.callout,
      fontSize: 18,
      opacity: 0.9
    }
  });

  return overlays;
}

// ============================================================================
// CONTENT TEXT GENERATION
// ============================================================================

/**
 * Generate video titles based on category
 */
function generateVideoTitle(category: string): string {
  const titleTemplates: Record<string, string[]> = {
    'subway-surfers': [
      'SUBWAY SURFERS SPEEDRUN! 🏃‍♂️',
      'INSANE SUBWAY SURFERS SCORE! 🔥',
      'SUBWAY SURFERS WORLD RECORD! 🏆',
      'SUBWAY SURFERS FAIL COMPILATION! 😂',
      'SUBWAY SURFERS PRO TIPS! 💡'
    ],
    'minecraft': [
      'MINECRAFT BUILD TUTORIAL! 🏗️',
      'MINECRAFT SURVIVAL MODE! ⚔️',
      'MINECRAFT REDSTONE HACKS! 🔴',
      'MINECRAFT PVP BATTLE! ⚔️',
      'MINECRAFT CREATIVE BUILD! 🎨'
    ],
    'brainrot': [
      'BRAINROT COMPILATION! 🧠',
      'VIRAL BRAINROT CONTENT! 🔥',
      'BRAINROT MOMENTS! 😵',
      'BRAINROT TRENDING! 📈',
      'BRAINROT GOLD! 🏆'
    ]
  };

  const templates = titleTemplates[category] || ['VIRAL CONTENT! 🔥'];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate meme text based on category
 */
function generateMemeText(category: string): string {
  const memeTemplates: Record<string, string[]> = {
    'dank-memes': [
      'WHEN YOU FINALLY GET IT',
      'ME VS THE GUY SHE TOLD ME NOT TO WORRY ABOUT',
      'NOBODY: \nABSOLUTELY NOBODY: \nME:',
      'POV: YOU JUST REALIZED',
      'THAT MOMENT WHEN'
    ],
    'viral-meme': [
      'VIRAL MOMENT! 🔥',
      'THIS IS GOLD! 💯',
      'CAN\'T STOP LAUGHING! 😂',
      'RELATABLE CONTENT! 👏',
      'MOOD! 😭'
    ],
    'classic-meme': [
      'CLASSIC! 👑',
      'NOSTALGIA HITS! 🎯',
      'GOOD OLD TIMES! ⏰',
      'THROWBACK! 📼',
      'LEGENDARY! 🏆'
    ]
  };

  const templates = memeTemplates[category] || ['VIRAL MEME! 🔥'];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate brand text for graphics
 */
function generateBrandText(category: string): string {
  const brandTemplates: Record<string, string[]> = {
    'brand-graphic': [
      'BRAND NEW! 🆕',
      'EXCLUSIVE OFFER! 💎',
      'LIMITED TIME! ⏰',
      'SPECIAL DEAL! 🎯',
      'PREMIUM QUALITY! ✨'
    ],
    'color-graphic': [
      'BOLD COLORS! 🎨',
      'VIBRANT DESIGN! 🌈',
      'COLOR POP! 💥',
      'STUNNING VISUALS! 👀',
      'ARTISTIC VIBES! 🎭'
    ],
    'minimal-graphic': [
      'CLEAN DESIGN! ✨',
      'MINIMAL VIBES! 🧘‍♀️',
      'SIMPLE ELEGANCE! 💫',
      'MODERN LOOK! 🔥',
      'SOPHISTICATED! 👔'
    ]
  };

  const templates = brandTemplates[category] || ['AMAZING DESIGN! ✨'];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ============================================================================
// CAPTION GENERATION
// ============================================================================

/**
 * Generate social media captions
 */
export function generateSocialMediaCaption(
  content: SocialMediaContent,
  platform: SocialPlatform,
  hashtags: string[]
): string {
  const baseCaption = generateBaseCaption(content);
  const platformCaption = generatePlatformCaption(platform);
  const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
  
  return `${baseCaption}\n\n${platformCaption}\n\n${hashtagString}`;
}

/**
 * Generate base caption for content
 */
function generateBaseCaption(content: SocialMediaContent): string {
  const captionTemplates: Record<string, string[]> = {
    'subway-surfers': [
      '🚇 Just broke my personal best in Subway Surfers! Can you beat this score?',
      '🏃‍♂️ Subway Surfers is getting intense! Who else is addicted?',
      '🔥 Another day, another Subway Surfers record! This game never gets old!',
      '⚡ Speed running through the subway like a pro! Subway Surfers is life!',
      '🎮 Subway Surfers challenge: Can you survive longer than me?'
    ],
    'minecraft': [
      '⛏️ Building something epic in Minecraft! This game is pure creativity!',
      '🏗️ Minecraft survival mode is the best! Who else loves this game?',
      '🔴 Redstone engineering at its finest! Minecraft never ceases to amaze!',
      '⚔️ PVP battles in Minecraft are intense! The competition is real!',
      '🎨 Creative mode in Minecraft is where magic happens!'
    ],
    'brainrot': [
      '🧠 This brainrot content is too good! Can\'t stop watching!',
      '😵 The level of brainrot is unreal! This is peak entertainment!',
      '🔥 Viral brainrot moment! You won\'t believe what happens next!',
      '📈 This is trending for a reason! Brainrot content is the future!',
      '🏆 This brainrot compilation is pure gold!'
    ]
  };

  const templates = captionTemplates[content.category] || [
    '🔥 Amazing content that you need to see!',
    '💯 This is absolutely incredible!',
    '👀 You won\'t believe what happens in this video!',
    '🎯 This content is pure fire!',
    '✨ Something special just for you!'
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Generate platform-specific caption additions
 */
function generatePlatformCaption(platform: SocialPlatform): string {
  const platformCaptions: Record<SocialPlatform, string[]> = {
    tiktok: [
      '🎵 Sound on for the full experience!',
      '💃 Don\'t forget to follow for more!',
      '🔥 This is going viral!',
      '📱 Double tap if you love this!',
      '🎯 FYP material right here!'
    ],
    instagram: [
      '📸 Double tap to show some love! ❤️',
      '🔥 This is Instagram worthy!',
      '💫 Follow for daily content!',
      '📱 Share with your friends!',
      '🎯 This is pure Instagram gold!'
    ],
    youtube: [
      '🎥 Subscribe for more content like this!',
      '🔔 Hit the bell for notifications!',
      '👍 Like and share if you enjoyed!',
      '💬 Comment your thoughts below!',
      '📺 This is YouTube worthy content!'
    ],
    twitter: [
      '🐦 Retweet if you agree!',
      '🔥 This is Twitter gold!',
      '💯 Facts!',
      '📱 Follow for more!',
      '🎯 This tweet is going viral!'
    ],
    facebook: [
      '👍 Like and share if you love this!',
      '📘 Follow our page for more!',
      '🔥 This is Facebook worthy!',
      '💬 Comment what you think!',
      '📱 Share with your friends!'
    ]
  };

  const templates = platformCaptions[platform];
  return templates[Math.floor(Math.random() * templates.length)];
}

// ============================================================================
// SOCIAL MEDIA POST GENERATION
// ============================================================================

/**
 * Generate complete social media post
 */
export function generateSocialMediaPost(
  content: SocialMediaContent,
  platform: SocialPlatform
): SocialMediaPost {
  const analysis = analyzeContent(content);
  const textOverlays = generateSocialMediaOverlays(content, platform);
  const hashtags = analysis.suggestedHashtags;
  const caption = generateSocialMediaCaption(content, platform, hashtags);

  return {
    id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    contentId: content.id,
    platform,
    textOverlays,
    caption,
    hashtags,
    status: 'draft',
    scheduledTime: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000) // Random time within 24 hours
  };
}

/**
 * Generate multiple posts for different platforms
 */
export function generateMultiPlatformPosts(
  content: SocialMediaContent,
  platforms: SocialPlatform[]
): SocialMediaPost[] {
  return platforms.map(platform => generateSocialMediaPost(content, platform));
}

/**
 * Batch generate posts for multiple content items
 */
export function batchGeneratePosts(
  contents: SocialMediaContent[],
  platforms: SocialPlatform[] = ['tiktok', 'instagram', 'youtube']
): SocialMediaPost[] {
  const posts: SocialMediaPost[] = [];
  
  contents.forEach(content => {
    const contentPosts = generateMultiPlatformPosts(content, platforms);
    posts.push(...contentPosts);
  });
  
  return posts;
} 