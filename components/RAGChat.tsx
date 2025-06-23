'use client'

import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Upload, Send, FileText, MessageCircle, Loader2, Tag, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: any[]
  metadata?: {
    text_content: string
    metadata_tags: string[]
    crypto_sentiment: 'bullish' | 'bearish' | 'neutral'
    confidence_score: number
  }
}

interface UploadedFile {
  name: string
  content: string
  status: 'uploading' | 'success' | 'error'
  message?: string
}

export default function RAGChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const fileInfo: UploadedFile = {
        name: file.name,
        content: '',
        status: 'uploading'
      }
      
      setUploadedFiles(prev => [...prev, fileInfo])

      try {
        const content = await readFileContent(file)
        
        // Upload to API
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, filename: file.name })
        })

        const result = await response.json()

        if (result.success) {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.name === file.name 
                ? { ...f, status: 'success', message: result.message }
                : f
            )
          )
        } else {
          throw new Error(result.error)
        }
      } catch (error: any) {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? { ...f, status: 'error', message: error.message }
              : f
          )
        )
      }
    }
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md']
    }
  })

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('Sending message to API:', input);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      })

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error (${response.status}): ${errorText}`);
      }

      const result = await response.json()
      console.log('API Response:', result);

      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.answer.text_content || result.answer,
          timestamp: new Date(),
          sources: result.sources,
          metadata: result.answer
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(result.error || 'Unknown API error')
      }
    } catch (error: any) {
      console.error('Error in sendMessage:', error);
      
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error.message.includes('<!DOCTYPE')) {
        errorMessage = 'Server error: The API returned an HTML page instead of JSON. Please check if the server is running properly.';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        metadata: {
          text_content: errorMessage,
          metadata_tags: ['error', 'api-error'],
          crypto_sentiment: 'neutral',
          confidence_score: 0
        }
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
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
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Crypto Maxi RAG Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload documents and ask questions to get crypto-enthusiastic AI answers
          </p>
        </div>

        {/* File Upload Area */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Drag & drop files here, or click to select files
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supports: PDF, DOCX, TXT, MD
            </p>
          </div>

          {/* Uploaded Files Status */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    file.status === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : file.status === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="flex-1 text-sm font-medium">{file.name}</span>
                  {file.status === 'uploading' && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {file.message && (
                    <span className="text-xs">{file.message}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation by asking a question</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  >
                    {message.content}
                  </ReactMarkdown>
                  
                  {/* Crypto Maxi Metadata */}
                  {message.metadata && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium">Crypto Analysis:</span>
                        {getSentimentIcon(message.metadata.crypto_sentiment)}
                        <span className={`text-xs px-2 py-1 rounded ${getSentimentColor(message.metadata.crypto_sentiment)}`}>
                          {message.metadata.crypto_sentiment.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Confidence: {Math.round(message.metadata.confidence_score * 100)}%
                        </span>
                      </div>
                      
                      {/* Metadata Tags */}
                      {message.metadata.metadata_tags && message.metadata.metadata_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <Tag className="w-3 h-3 text-gray-400" />
                          {message.metadata.metadata_tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Sources:
                      </p>
                      <div className="space-y-1">
                        {message.sources.map((source, index) => (
                          <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
                            • {source.filename || 'Unknown source'}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Crypto maxi is analyzing... 🚀
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your crypto maxi assistant anything..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 