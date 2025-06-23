'use client'

import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  Video, 
  Type, 
  Image, 
  FileText, 
  Play, 
  Loader2, 
  Download,
  MessageCircle,
  Tag,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'

interface ProcessedVideo {
  id: string
  originalUrl: string
  processedUrl: string
  action: string
  extractedText?: string
  timestamp: Date
}

interface CryptoAnalysis {
  text_content: string
  metadata_tags: string[]
  crypto_sentiment: 'bullish' | 'bearish' | 'neutral'
  confidence_score: number
}

export default function VideoProcessor() {
  const [videos, setVideos] = useState<ProcessedVideo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [overlayText, setOverlayText] = useState('')
  const [selectedAction, setSelectedAction] = useState('text-overlay')
  const [chatMessage, setChatMessage] = useState('')
  const [chatResponse, setChatResponse] = useState<CryptoAnalysis | null>(null)
  const [isChatLoading, setIsChatLoading] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('video/')) {
        await processVideo(file)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    }
  })

  const processVideo = async (videoFile: File) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('action', selectedAction)
      formData.append('video', videoFile)

      // Add additional files based on action
      if (selectedAction === 'text-overlay' && overlayText) {
        formData.append('text', overlayText)
      }

      const response = await fetch('/api/video', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        const processedVideo: ProcessedVideo = {
          id: Date.now().toString(),
          originalUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${result.videoPublicId}`,
          processedUrl: result.processedVideoUrl,
          action: selectedAction,
          extractedText: result.extractedText,
          timestamp: new Date()
        }

        setVideos(prev => [processedVideo, ...prev])
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Error processing video:', error)
      alert(`Error processing video: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const askAboutVideo = async (video: ProcessedVideo) => {
    if (!chatMessage.trim()) return

    setIsChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: chatMessage,
          context: `Video: ${video.action} - ${video.extractedText || 'No text extracted'}`
        })
      })

      const result = await response.json()

      if (result.success) {
        setChatResponse(result.answer)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Error asking about video:', error)
      setChatResponse({
        text_content: `Error: ${error.message}`,
        metadata_tags: ['error'],
        crypto_sentiment: 'neutral',
        confidence_score: 0
      })
    } finally {
      setIsChatLoading(false)
    }
  }

  const downloadVideo = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'bearish':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-6 h-6" />
            🚀 Crypto Maxi Video Processor
          </h1>
          <p className="text-purple-100 mt-1">
            Upload videos, add overlays, and get crypto-enthusiastic AI analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Column - Video Processing */}
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Video Processing</h2>
              
              {/* Action Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Processing Action:</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600"
                >
                  <option value="text-overlay">Text Overlay</option>
                  <option value="image-overlay">Image Overlay</option>
                  <option value="subtitle-overlay">Subtitle Overlay</option>
                  <option value="video-overlay">Video Overlay</option>
                  <option value="extract-text">Extract Text</option>
                </select>
              </div>

              {/* Text Input for Text Overlay */}
              {selectedAction === 'text-overlay' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Overlay Text:</label>
                  <input
                    type="text"
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Enter text to overlay on video..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600"
                  />
                </div>
              )}

              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? 'Drop video here' : 'Upload Video'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supports: MP4, AVI, MOV, WMV, FLV, WebM
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Processing video...</span>
                </div>
              )}
            </div>

            {/* Processed Videos */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Processed Videos</h2>
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {video.action.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {video.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <video
                      src={video.processedUrl}
                      controls
                      className="w-full rounded mb-2"
                      preload="metadata"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadVideo(video.processedUrl, `processed-${video.action}.mp4`)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                    {video.extractedText && (
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                        <strong>Extracted Text:</strong> {video.extractedText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - RAG Chat */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              🚀 Crypto Maxi Video Analyst
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ask about your videos:</label>
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask your crypto maxi about the video content..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 resize-none"
                  rows={3}
                />
              </div>

              <button
                onClick={() => videos.length > 0 && askAboutVideo(videos[0])}
                disabled={!chatMessage.trim() || isChatLoading || videos.length === 0}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isChatLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Crypto maxi analyzing... 🚀
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Ask Crypto Maxi
                  </>
                )}
              </button>

              {chatResponse && (
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <h3 className="font-medium mb-2">🚀 Crypto Maxi Analysis:</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {chatResponse.text_content}
                  </p>
                  
                  {/* Crypto Analysis Metadata */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium">Sentiment:</span>
                    {getSentimentIcon(chatResponse.crypto_sentiment)}
                    <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(chatResponse.crypto_sentiment)}`}>
                      {chatResponse.crypto_sentiment.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(chatResponse.confidence_score * 100)}%
                    </span>
                  </div>
                  
                  {/* Metadata Tags */}
                  {chatResponse.metadata_tags && chatResponse.metadata_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      {chatResponse.metadata_tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {videos.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Upload and process a video to start asking the crypto maxi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 