'use client'

import { useState, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  Image, 
  Type, 
  Palette, 
  MapPin, 
  Settings, 
  Loader2, 
  Download,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'

interface ProcessedImage {
  id: string
  originalUrl: string
  processedUrl: string
  action: string
  extractedText?: string
  timestamp: Date
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

export default function ImageProcessor() {
  const [images, setImages] = useState<ProcessedImage[]>([])
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

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (file.type.startsWith('image/')) {
        await processImage(file)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    }
  })

  const processImage = async (imageFile: File) => {
    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('action', selectedAction)
      formData.append('image', imageFile)

      if (selectedAction === 'text-overlay' && textOverlays.length > 0) {
        formData.append('text', textOverlays[0].text)
        formData.append('textPlacement', JSON.stringify(textOverlays[0].placement))
        formData.append('textStyle', JSON.stringify(textOverlays[0].style))
      } else if (selectedAction === 'multiple-text-overlays') {
        formData.append('multipleTexts', JSON.stringify(textOverlays))
      }

      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        const processedImage: ProcessedImage = {
          id: Date.now().toString(),
          originalUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${result.imagePublicId}`,
          processedUrl: result.processedImageUrl,
          action: selectedAction,
          extractedText: result.extractedText,
          timestamp: new Date()
        }

        setImages(prev => [processedImage, ...prev])
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      console.error('Error processing image:', error)
      alert(`Error processing image: ${error.message}`)
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
        color: '#000000',
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

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Image className="w-6 h-6" />
            🎨 Advanced Image Text Processor
          </h1>
          <p className="text-green-100 mt-1">
            Add text to images with precise placement and styling controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column - Image Upload & Processing */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Image Processing</h2>
              
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
                  <option value="extract-text">Extract Text (OCR)</option>
                </select>
              </div>

              {/* File Upload */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDragActive ? 'Drop image here' : 'Upload Image'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Supports: JPG, PNG, GIF, WebP, BMP
                </p>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Processing image...</span>
                </div>
              )}
            </div>

            {/* Processed Images */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Processed Images</h2>
              <div className="space-y-4">
                {images.map((image) => (
                  <div key={image.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {image.action.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {image.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <img
                      src={image.processedUrl}
                      alt="Processed"
                      className="w-full rounded mb-2"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(image.processedUrl, `processed-${image.action}.png`)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>

                    {image.extractedText && (
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                        <strong>Extracted Text:</strong> {image.extractedText}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Columns - Text Configuration */}
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
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
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
                        <h4 className="font-medium text-sm">Advanced Styling</h4>
                        
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
          </div>
        </div>
      </div>
    </div>
  )
} 