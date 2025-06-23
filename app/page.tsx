'use client'

import { useState } from 'react'
import VideoProcessor from '@/components/VideoProcessor'
import ImageProcessor from '@/components/ImageProcessor'
import RAGChat from '@/components/RAGChat'
import SocialMediaDashboard from '@/components/SocialMediaDashboard'
import { Video, Image, MessageCircle, Share2 } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('video')

  const tabs = [
    { id: 'video', label: 'Video Processing', icon: Video },
    { id: 'image', label: 'Image Processing', icon: Image },
    { id: 'social', label: 'Social Media Agent', icon: Share2 },
    { id: 'chat', label: 'Document Chat', icon: MessageCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Content Processor
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Powered by Cloudinary & OpenAI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'video' && <VideoProcessor />}
        {activeTab === 'image' && <ImageProcessor />}
        {activeTab === 'social' && <SocialMediaDashboard />}
        {activeTab === 'chat' && <RAGChat />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Content Processor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Advanced text overlay processing for images and videos with precise placement controls, AI-powered analysis, and social media automation.
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Advanced text placement on images and videos</li>
                <li>• Multiple text overlays with timing control</li>
                <li>• Custom styling and typography options</li>
                <li>• AI-powered content analysis</li>
                <li>• Social media agent with auto-post generation</li>
                <li>• Document processing with RAG</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                Technologies
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Cloudinary for media processing</li>
                <li>• OpenAI for AI analysis</li>
                <li>• Supabase for vector storage</li>
                <li>• Tailwind CSS for styling</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2024 AI Content Processor. Built with modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 