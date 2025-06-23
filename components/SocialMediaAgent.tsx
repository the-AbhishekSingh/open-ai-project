'use client';

import React, { useState, useCallback } from 'react';
import { 
  SocialMediaContent, 
  SocialMediaPost, 
  SocialPlatform,
  analyzeContent,
  generateSocialMediaPost,
  generateMultiPlatformPosts
} from '@/lib/social-media-agent';
import { TextPlacement, TextStyle } from '@/lib/text-overlay-types';

interface SocialMediaAgentProps {
  onPostGenerated?: (posts: SocialMediaPost[]) => void;
  onMediaProcessed?: (processedMedia: any[]) => void;
}

export default function SocialMediaAgent({ 
  onPostGenerated, 
  onMediaProcessed 
}: SocialMediaAgentProps) {
  const [content, setContent] = useState<SocialMediaContent | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [processedMedia, setProcessedMedia] = useState<any[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['tiktok', 'instagram']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate' | 'process'>('analyze');

  // Sample content templates
  const sampleContent: Record<string, SocialMediaContent> = {
    'subway-surfers': {
      id: 'subway_1',
      type: 'video',
      category: 'subway-surfers',
      title: 'Subway Surfers Speedrun',
      description: 'Insane Subway Surfers gameplay with high score',
      tags: ['gaming', 'subway-surfers', 'speedrun'],
      contentUrl: 'https://example.com/subway-surfers-video.mp4',
      dimensions: { width: 1080, height: 1920 },
      duration: 30,
      uploadDate: new Date()
    },
    'minecraft': {
      id: 'minecraft_1',
      type: 'video',
      category: 'minecraft',
      title: 'Minecraft Build Tutorial',
      description: 'Amazing Minecraft building techniques',
      tags: ['gaming', 'minecraft', 'tutorial'],
      contentUrl: 'https://example.com/minecraft-video.mp4',
      dimensions: { width: 1920, height: 1080 },
      duration: 60,
      uploadDate: new Date()
    },
    'brainrot': {
      id: 'brainrot_1',
      type: 'video',
      category: 'brainrot',
      title: 'Brainrot Compilation',
      description: 'Viral brainrot content compilation',
      tags: ['viral', 'brainrot', 'entertainment'],
      contentUrl: 'https://example.com/brainrot-video.mp4',
      dimensions: { width: 1080, height: 1920 },
      duration: 45,
      uploadDate: new Date()
    },
    'meme': {
      id: 'meme_1',
      type: 'meme',
      category: 'viral-meme',
      title: 'Viral Meme Template',
      description: 'Popular meme template for social media',
      tags: ['meme', 'viral', 'funny'],
      contentUrl: 'https://example.com/meme-image.jpg',
      dimensions: { width: 1080, height: 1080 },
      uploadDate: new Date()
    },
    'graphic': {
      id: 'graphic_1',
      type: 'graphic',
      category: 'color-graphic',
      title: 'Colorful Design',
      description: 'Vibrant graphic design for social media',
      tags: ['design', 'graphic', 'colorful'],
      contentUrl: 'https://example.com/graphic-image.png',
      dimensions: { width: 1080, height: 1080 },
      uploadDate: new Date()
    }
  };

  const platforms: SocialPlatform[] = ['tiktok', 'instagram', 'youtube', 'twitter', 'facebook'];

  const handleContentSelect = useCallback((contentKey: string) => {
    setContent(sampleContent[contentKey]);
    setAnalysis(null);
    setPosts([]);
    setProcessedMedia([]);
  }, []);

  const handleAnalyzeContent = useCallback(async () => {
    if (!content) return;

    setIsAnalyzing(true);
    try {
      const result = analyzeContent(content);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content]);

  const handleGeneratePosts = useCallback(async () => {
    if (!content) return;

    setIsGenerating(true);
    try {
      const generatedPosts = generateMultiPlatformPosts(content, selectedPlatforms);
      setPosts(generatedPosts);
      onPostGenerated?.(generatedPosts);
    } catch (error) {
      console.error('Error generating posts:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [content, selectedPlatforms, onPostGenerated]);

  const handleProcessMedia = useCallback(async () => {
    if (!content || posts.length === 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/social-media/process-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          generateMedia: true
        })
      });

      const result = await response.json();
      if (result.success) {
        setProcessedMedia(result.processedMedia);
        onMediaProcessed?.(result.processedMedia);
      }
    } catch (error) {
      console.error('Error processing media:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [content, posts, selectedPlatforms, onMediaProcessed]);

  const handlePlatformToggle = useCallback((platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Social Media Agent
        </h1>
        <p className="text-gray-600">
          Analyze content, generate engaging posts, and add text overlays automatically
        </p>
      </div>

      {/* Content Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Select Content</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(sampleContent).map(([key, contentItem]) => (
            <button
              key={key}
              onClick={() => handleContentSelect(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                content?.id === contentItem.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {contentItem.type === 'video' && '🎥'}
                  {contentItem.type === 'meme' && '😂'}
                  {contentItem.type === 'graphic' && '🎨'}
                </div>
                <div className="font-medium text-sm capitalize">
                  {key.replace('-', ' ')}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {contentItem.type}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'analyze', label: 'Analyze Content', icon: '📊' },
              { key: 'generate', label: 'Generate Posts', icon: '📝' },
              { key: 'process', label: 'Process Media', icon: '🎬' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Analyze Content Tab */}
          {activeTab === 'analyze' && (
            <div className="space-y-6">
              {content && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Selected Content</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Title:</span> {content.title}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {content.type}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {content.category}
                    </div>
                    <div>
                      <span className="font-medium">Dimensions:</span> {content.dimensions.width}x{content.dimensions.height}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyzeContent}
                disabled={!content || isAnalyzing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>

              {analysis && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3">Analysis Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Category:</span> {analysis.category}
                    </div>
                    <div>
                      <span className="font-medium">Trending Score:</span> {analysis.trendingScore}/100
                    </div>
                    <div>
                      <span className="font-medium">Target Audience:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.targetAudience.map((audience: string) => (
                          <span key={audience} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {audience}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Best Platforms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.bestPlatforms.map((platform: string) => (
                          <span key={platform} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium">Suggested Hashtags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.suggestedHashtags.map((hashtag: string) => (
                        <span key={hashtag} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generate Posts Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Select Platforms</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => handlePlatformToggle(platform)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPlatforms.includes(platform)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">
                          {platform === 'tiktok' && '🎵'}
                          {platform === 'instagram' && '📸'}
                          {platform === 'youtube' && '📺'}
                          {platform === 'twitter' && '🐦'}
                          {platform === 'facebook' && '📘'}
                        </div>
                        <div className="text-sm font-medium capitalize">
                          {platform}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGeneratePosts}
                disabled={!content || selectedPlatforms.length === 0 || isGenerating}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generating Posts...' : `Generate Posts for ${selectedPlatforms.length} Platform(s)`}
              </button>

              {posts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Generated Posts ({posts.length})</h3>
                  {posts.map((post, index) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {post.platform === 'tiktok' && '🎵'}
                            {post.platform === 'instagram' && '📸'}
                            {post.platform === 'youtube' && '📺'}
                            {post.platform === 'twitter' && '🐦'}
                            {post.platform === 'facebook' && '📘'}
                          </span>
                          <span className="font-medium capitalize">{post.platform}</span>
                        </div>
                        <span className="text-sm text-gray-500">Post #{index + 1}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-sm">Caption:</span>
                          <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                            {post.caption}
                          </p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-sm">Text Overlays ({post.textOverlays.length}):</span>
                          <div className="mt-1 space-y-1">
                            {post.textOverlays.map((overlay, overlayIndex) => (
                              <div key={overlayIndex} className="bg-gray-50 p-2 rounded text-sm">
                                <div className="font-medium">"{overlay.text}"</div>
                                <div className="text-xs text-gray-500">
                                  Position: {overlay.placement.position}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="font-medium text-sm">Hashtags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.hashtags.map((hashtag) => (
                              <span key={hashtag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                #{hashtag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Process Media Tab */}
          {activeTab === 'process' && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Process Media with Text Overlays</h3>
                <p className="text-sm text-yellow-700">
                  This will generate the final media files with text overlays applied for each platform.
                </p>
              </div>

              <button
                onClick={handleProcessMedia}
                disabled={!content || posts.length === 0 || isProcessing}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing Media...' : 'Process Media with Overlays'}
              </button>

              {processedMedia.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Processed Media ({processedMedia.length})</h3>
                  {processedMedia.map((media, index) => (
                    <div key={media.postId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {media.platform === 'tiktok' && '🎵'}
                            {media.platform === 'instagram' && '📸'}
                            {media.platform === 'youtube' && '📺'}
                            {media.platform === 'twitter' && '🐦'}
                            {media.platform === 'facebook' && '📘'}
                          </span>
                          <span className="font-medium capitalize">{media.platform}</span>
                        </div>
                        <span className="text-sm text-gray-500">Media #{index + 1}</span>
                      </div>
                      
                      {media.processedUrl ? (
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Status:</span>
                            <span className="text-green-600 ml-2">✅ Processed Successfully</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Processed URL:</span>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-xs break-all">
                              {media.processedUrl}
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Text Overlays Applied:</span>
                            <div className="mt-1 space-y-1">
                              {media.textOverlays.map((overlay: any, overlayIndex: number) => (
                                <div key={overlayIndex} className="bg-green-50 p-2 rounded text-xs">
                                  "{overlay.text}" - {overlay.placement.position}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm">
                          ❌ Failed to process: {media.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 