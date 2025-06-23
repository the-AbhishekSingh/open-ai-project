'use client'

import { useState } from 'react'
import RAGChat from '@/components/RAGChat'
import VideoProcessor from '@/components/VideoProcessor'
import { FileText, Video, MessageCircle } from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'documents' | 'videos'>('documents')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                AI RAG Assistant
              </h1>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Documents & Video Processing
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Public Demo Mode
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === 'documents'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Document RAG
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                activeTab === 'videos'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Video className="w-4 h-4" />
              Video Processing
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activeTab === 'documents' && <RAGChat />}
        {activeTab === 'videos' && <VideoProcessor />}
      </div>
    </div>
  )
} 