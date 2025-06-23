'use client';

import React, { useState, useCallback, useRef } from 'react';
import { SocialMediaContent } from '@/lib/social-media-agent';

interface ContentUploadProps {
  onContentUploaded: (content: SocialMediaContent) => void;
}

export default function ContentUpload({ onContentUploaded }: ContentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [contentDetails, setContentDetails] = useState<Partial<SocialMediaContent>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getFileType = useCallback((file: File): 'video' | 'meme' | 'graphic' => {
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) {
      // Simple heuristic: if filename contains 'meme' or it's a common meme format
      if (file.name.toLowerCase().includes('meme') || 
          file.name.toLowerCase().includes('funny') ||
          file.name.toLowerCase().includes('viral')) {
        return 'meme';
      }
      return 'graphic';
    }
    return 'graphic'; // Default fallback
  }, []);

  const getFileDimensions = useCallback(async (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        };
        video.src = URL.createObjectURL(file);
      } else {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.src = URL.createObjectURL(file);
      }
    });
  }, []);

  const handleUpload = useCallback(async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of uploadedFiles) {
        const fileType = getFileType(file);
        const dimensions = await getFileDimensions(file);
        
        // Simulate file upload to cloud storage
        const uploadUrl = await simulateFileUpload(file);
        
        const content: SocialMediaContent = {
          id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: fileType,
          category: getCategoryFromType(fileType, file.name),
          title: contentDetails.title || file.name.replace(/\.[^/.]+$/, ""),
          description: contentDetails.description || `Uploaded ${fileType} content`,
          tags: contentDetails.tags || [fileType, 'uploaded'],
          contentUrl: uploadUrl,
          dimensions,
          duration: fileType === 'video' ? await getVideoDuration(file) : undefined,
          uploadDate: new Date(),
          engagement: {
            likes: 0,
            shares: 0,
            comments: 0,
            views: 0
          }
        };

        onContentUploaded(content);
      }

      // Reset form
      setUploadedFiles([]);
      setContentDetails({});
    } catch (error) {
      console.error('Error uploading content:', error);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles, contentDetails, getFileType, getFileDimensions, onContentUploaded]);

  const simulateFileUpload = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL (in real implementation, this would be the actual uploaded file URL)
    return `https://example.com/uploads/${file.name}`;
  };

  const getCategoryFromType = (type: string, filename: string): string => {
    const name = filename.toLowerCase();
    
    if (type === 'video') {
      if (name.includes('subway') || name.includes('surfers')) return 'subway-surfers';
      if (name.includes('minecraft')) return 'minecraft';
      if (name.includes('brainrot') || name.includes('viral')) return 'brainrot';
      return 'entertainment';
    }
    
    if (type === 'meme') {
      if (name.includes('dank')) return 'dank-memes';
      if (name.includes('classic') || name.includes('nostalgia')) return 'classic-meme';
      return 'viral-meme';
    }
    
    if (type === 'graphic') {
      if (name.includes('brand') || name.includes('logo')) return 'brand-graphic';
      if (name.includes('color') || name.includes('vibrant')) return 'color-graphic';
      if (name.includes('minimal') || name.includes('clean')) return 'minimal-graphic';
      return 'color-graphic';
    }
    
    return 'general';
  };

  const getVideoDuration = async (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Your Content</h2>
      
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your files here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supports videos, images, and graphics up to 100MB
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Selected Files ({uploadedFiles.length})</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {file.type.startsWith('video/') && '🎥'}
                    {file.type.startsWith('image/') && '🖼️'}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {getFileType(file)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Details Form */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Content Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={contentDetails.title || ''}
              onChange={(e) => setContentDetails(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter content title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={contentDetails.description || ''}
              onChange={(e) => setContentDetails(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter content description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={contentDetails.tags?.join(', ') || ''}
              onChange={(e) => setContentDetails(prev => ({ 
                ...prev, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              }))}
              placeholder="gaming, viral, entertainment"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? 'Uploading...' : `Upload ${uploadedFiles.length} File(s)`}
          </button>
        </div>
      )}

      {/* Upload Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Upload Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Videos work best in vertical format (9:16) for TikTok and Instagram</li>
          <li>• Images should be high quality and at least 1080x1080 pixels</li>
          <li>• Add descriptive titles and tags for better content analysis</li>
          <li>• Supported formats: MP4, MOV, AVI, JPG, PNG, GIF</li>
        </ul>
      </div>
    </div>
  );
} 