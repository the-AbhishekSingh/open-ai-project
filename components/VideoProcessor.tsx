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
  Minus,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Palette,
  MapPin
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

interface TextOverlayConfig {
  id: string
  text: string
  placement: {
    position: 'top-left' | 'top-center' | 'top-right' | 
              'center-left' | 'center' | 'center-right' | 
              'bottom-left' | 'bottom-center' | 'bottom-right'
    x?: number
    y?: number
    offset?: {
      x?: number
      y?: number
    }
    startTime?: number
    endTime?: number
  }
  style: {
    fontFamily: string
    fontSize: number
    color: string
    backgroundColor?: string
    opacity: number
    fontWeight: string
    fontStyle: string
    textAlign: string
    stroke?: {
      color: string
      width: number
    }
    shadow?: {
      color: string
      blur: number
      offsetX: number
      offsetY: number
    }
  }
}

export default function VideoProcessor() {
  const [videos, setVideos] = useState<ProcessedVideo[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAction, setSelectedAction] = useState('text-overlay')
  const [textOverlays, setTextOverlays] = useState<TextOverlayConfig[]>([
    {
      id: '1',
      text: 'Sample Text',
      placement: {
        position: 'bottom-center'
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#ffffff',
        opacity: 1,
        fontWeight: 'bold',
        fontStyle: 'normal',
        textAlign: 'center'
      }
    }
  ])
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
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

      if (selectedAction === 'text-overlay' && textOverlays.length > 0) {
        formData.append('text', textOverlays[0].text)
        formData.append('textPlacement', JSON.stringify(textOverlays[0].placement))
        formData.append('textStyle', JSON.stringify(textOverlays[0].style))
      } else if (selectedAction === 'multiple-text-overlays') {
        formData.append('multipleTexts', JSON.stringify(textOverlays))
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

  const addTextOverlay = () => {
    const newOverlay: TextOverlayConfig = {
      id: Date.now().toString(),
      text: 'New Text',
      placement: {
        position: 'top-left'
      },
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        color: '#ffffff',
        opacity: 1,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left'
      }
    }
    setTextOverlays(prev => [...prev, newOverlay])
  }

  const removeTextOverlay = (id: string) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== id))
  }

  const updateTextOverlay = (id: string, field: string, value: any) => {
    setTextOverlays(prev => prev.map(overlay => {
      if (overlay.id === id) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.')
          return {
            ...overlay,
            [parent]: {
              ...overlay[parent as keyof TextOverlayConfig],
              [child]: value
            }
          }
        }
        return { ...overlay, [field]: value }
      }
      return overlay
    }))
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

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Courier New', 'Impact', 'Comic Sans MS', 'Tahoma', 'Trebuchet MS'
  ]

  const fontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  const fontStyles = ['normal', 'italic']
  const textAligns = ['left', 'center', 'right']
  const positions = [
    'top-left', 'top-center', 'top-right',
    'center-left', 'center', 'center-right',
    'bottom-left', 'bottom-center', 'bottom-right'
  ]

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-6 h-6" />
            🚀 Advanced Video Text Processor
          </h1>
          <p className="text-purple-100 mt-1">
            Upload videos, add text overlays with precise placement, and get crypto-enthusiastic AI analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Video Processing */}
          <div className="lg:col-span-1 space-y-6">
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
                  <option value="text-overlay">Single Text Overlay</option>
                  <option value="multiple-text-overlays">Multiple Text Overlays</option>
                  <option value="image-overlay">Image Overlay</option>
                  <option value="subtitle-overlay">Subtitle Overlay</option>
                  <option value="video-overlay">Video Overlay</option>
                  <option value="extract-text">Extract Text</option>
                </select>
              </div>

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

          {/* Right Columns - Text Configuration & Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Overlays Configuration */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Text Overlays Configuration
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    {showAdvancedOptions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
                  </button>
                  <button
                    onClick={addTextOverlay}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Text
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {textOverlays.map((overlay, index) => (
                  <div key={overlay.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Text Overlay {index + 1}</h3>
                      {textOverlays.length > 1 && (
                        <button
                          onClick={() => removeTextOverlay(overlay.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Basic Text Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Text Content:</label>
                        <input
                          type="text"
                          value={overlay.text}
                          onChange={(e) => updateTextOverlay(overlay.id, 'text', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                          placeholder="Enter text..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Position:</label>
                        <select
                          value={overlay.placement.position}
                          onChange={(e) => updateTextOverlay(overlay.id, 'placement.position', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                        >
                          {positions.map(pos => (
                            <option key={pos} value={pos}>{pos.replace('-', ' ')}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Font Family:</label>
                        <select
                          value={overlay.style.fontFamily}
                          onChange={(e) => updateTextOverlay(overlay.id, 'style.fontFamily', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                        >
                          {fontFamilies.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Font Size:</label>
                        <input
                          type="number"
                          value={overlay.style.fontSize}
                          onChange={(e) => updateTextOverlay(overlay.id, 'style.fontSize', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                          min="8"
                          max="200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Text Color:</label>
                        <input
                          type="color"
                          value={overlay.style.color}
                          onChange={(e) => updateTextOverlay(overlay.id, 'style.color', e.target.value)}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Opacity:</label>
                        <input
                          type="range"
                          value={overlay.style.opacity}
                          onChange={(e) => updateTextOverlay(overlay.id, 'style.opacity', parseFloat(e.target.value))}
                          className="w-full"
                          min="0"
                          max="1"
                          step="0.1"
                        />
                        <span className="text-xs text-gray-500">{overlay.style.opacity}</span>
                      </div>
                    </div>

                    {/* Advanced Options */}
                    {showAdvancedOptions && (
                      <div className="border-t pt-4 space-y-4">
                        <h4 className="font-medium text-sm">Advanced Styling & Timing</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Font Weight:</label>
                            <select
                              value={overlay.style.fontWeight}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.fontWeight', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                            >
                              {fontWeights.map(weight => (
                                <option key={weight} value={weight}>{weight}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Font Style:</label>
                            <select
                              value={overlay.style.fontStyle}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.fontStyle', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                            >
                              {fontStyles.map(style => (
                                <option key={style} value={style}>{style}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Text Align:</label>
                            <select
                              value={overlay.style.textAlign}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.textAlign', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                            >
                              {textAligns.map(align => (
                                <option key={align} value={align}>{align}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Timing Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Start Time (seconds):</label>
                            <input
                              type="number"
                              value={overlay.placement.startTime || 0}
                              onChange={(e) => updateTextOverlay(overlay.id, 'placement.startTime', parseFloat(e.target.value))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">End Time (seconds):</label>
                            <input
                              type="number"
                              value={overlay.placement.endTime || 0}
                              onChange={(e) => updateTextOverlay(overlay.id, 'placement.endTime', parseFloat(e.target.value))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                              min="0"
                              step="0.1"
                            />
                          </div>
                        </div>

                        {/* Stroke Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Stroke Color:</label>
                            <input
                              type="color"
                              value={overlay.style.stroke?.color || '#000000'}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.stroke.color', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Stroke Width:</label>
                            <input
                              type="number"
                              value={overlay.style.stroke?.width || 0}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.stroke.width', parseInt(e.target.value))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                              min="0"
                              max="20"
                            />
                          </div>
                        </div>

                        {/* Shadow Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Shadow Color:</label>
                            <input
                              type="color"
                              value={overlay.style.shadow?.color || '#000000'}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.shadow.color', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Shadow Blur:</label>
                            <input
                              type="number"
                              value={overlay.style.shadow?.blur || 0}
                              onChange={(e) => updateTextOverlay(overlay.id, 'style.shadow.blur', parseInt(e.target.value))}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600"
                              min="0"
                              max="50"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RAG Chat */}
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
    </div>
  )
} 