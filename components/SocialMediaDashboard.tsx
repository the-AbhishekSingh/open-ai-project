'use client';

import React, { useState, useCallback } from 'react';
import { SocialMediaContent, SocialMediaPost } from '@/lib/social-media-agent';
import ContentUpload from './ContentUpload';
import SocialMediaAgent from './SocialMediaAgent';

export default function SocialMediaDashboard() {
  const [uploadedContent, setUploadedContent] = useState<SocialMediaContent[]>([]);
  const [generatedPosts, setGeneratedPosts] = useState<SocialMediaPost[]>([]);
  const [processedMedia, setProcessedMedia] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'agent' | 'dashboard'>('upload');

  const handleContentUploaded = useCallback((content: SocialMediaContent) => {
    setUploadedContent(prev => [...prev, content]);
    setActiveView('agent'); // Switch to agent view after upload
  }, []);

  const handlePostGenerated = useCallback((posts: SocialMediaPost[]) => {
    setGeneratedPosts(prev => [...prev, ...posts]);
  }, []);

  const handleMediaProcessed = useCallback((media: any[]) => {
    setProcessedMedia(prev => [...prev, ...media]);
  }, []);

  const getContentStats = () => {
    const videoCount = uploadedContent.filter(c => c.type === 'video').length;
    const memeCount = uploadedContent.filter(c => c.type === 'meme').length;
    const graphicCount = uploadedContent.filter(c => c.type === 'graphic').length;
    const totalPosts = generatedPosts.length;
    const processedCount = processedMedia.filter(m => m.processedUrl).length;

    return { videoCount, memeCount, graphicCount, totalPosts, processedCount };
  };

  const stats = getContentStats();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Social Media Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Upload content, analyze performance, and generate engaging social media posts automatically
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{uploadedContent.length}</div>
          <div className="text-sm text-gray-600">Total Content</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.videoCount}</div>
          <div className="text-sm text-gray-600">Videos</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.memeCount}</div>
          <div className="text-sm text-gray-600">Memes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.graphicCount}</div>
          <div className="text-sm text-gray-600">Graphics</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalPosts}</div>
          <div className="text-sm text-gray-600">Posts Generated</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'upload', label: 'Upload Content', icon: '📁' },
              { key: 'agent', label: 'Social Media Agent', icon: '🤖' },
              { key: 'dashboard', label: 'Content Dashboard', icon: '📊' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === key
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
          {/* Upload Content View */}
          {activeView === 'upload' && (
            <ContentUpload onContentUploaded={handleContentUploaded} />
          )}

          {/* Social Media Agent View */}
          {activeView === 'agent' && (
            <SocialMediaAgent 
              onPostGenerated={handlePostGenerated}
              onMediaProcessed={handleMediaProcessed}
            />
          )}

          {/* Content Dashboard View */}
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Uploaded Content */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Uploaded Content</h3>
                {uploadedContent.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📁</div>
                    <p>No content uploaded yet</p>
                    <button
                      onClick={() => setActiveView('upload')}
                      className="mt-2 text-blue-600 hover:text-blue-700"
                    >
                      Upload your first content
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedContent.map((content) => (
                      <div key={content.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">
                              {content.type === 'video' && '🎥'}
                              {content.type === 'meme' && '😂'}
                              {content.type === 'graphic' && '🎨'}
                            </span>
                            <span className="font-medium text-sm capitalize">
                              {content.type}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {content.category}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{content.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{content.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {content.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {content.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{content.tags.length - 3} more</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {content.dimensions.width}x{content.dimensions.height}
                          {content.duration && ` • ${Math.round(content.duration)}s`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Generated Posts */}
              {generatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Generated Posts</h3>
                  <div className="space-y-3">
                    {generatedPosts.slice(0, 5).map((post, index) => (
                      <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
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
                          <span className="text-xs text-gray-500">Post #{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {post.caption}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {post.hashtags.slice(0, 5).map((hashtag) => (
                            <span key={hashtag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              #{hashtag}
                            </span>
                          ))}
                          {post.hashtags.length > 5 && (
                            <span className="text-xs text-gray-500">+{post.hashtags.length - 5} more</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {generatedPosts.length > 5 && (
                      <div className="text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          View all {generatedPosts.length} posts
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Processed Media */}
              {processedMedia.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Processed Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {processedMedia.slice(0, 6).map((media, index) => (
                      <div key={media.postId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
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
                          <span className="text-xs text-gray-500">Media #{index + 1}</span>
                        </div>
                        {media.processedUrl ? (
                          <div className="space-y-2">
                            <div className="text-xs text-green-600">✅ Processed Successfully</div>
                            <div className="text-xs text-gray-600">
                              {media.textOverlays.length} overlay(s) applied
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-red-600">❌ Processing Failed</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveView('upload')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Upload More Content
                  </button>
                  <button
                    onClick={() => setActiveView('agent')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Generate More Posts
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                    Export All Posts
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 