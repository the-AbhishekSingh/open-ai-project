# AI Content Processor

A comprehensive web application for processing images and videos with advanced text overlays, precise placement controls, AI-powered analysis, and social media automation. Built with Next.js, Cloudinary, OpenAI, and Supabase.

## 🚀 Features

### Image Processing
- **Advanced Text Overlays**: Add text to images with precise positioning
- **Multiple Text Overlays**: Add multiple text elements with different styles
- **Custom Typography**: Full control over fonts, sizes, colors, and effects
- **Position Control**: 9 preset positions + custom coordinates
- **Advanced Styling**: Stroke, shadow, opacity, and background effects
- **OCR Text Extraction**: Extract text from images using AI

### Video Processing
- **Text Overlays with Timing**: Add text with start/end time controls
- **Multiple Text Overlays**: Layer multiple text elements
- **Advanced Positioning**: Precise text placement with offset controls
- **Custom Styling**: Full typography and visual effects control
- **Video Overlays**: Picture-in-picture and video compositing
- **Subtitle Support**: SRT file integration
- **AI Text Extraction**: Extract text from video content

### Social Media Agent
- **Content Analysis**: AI-powered analysis of uploaded content
- **Automatic Post Generation**: Generate platform-specific posts
- **Text Overlay Integration**: Apply text overlays to social media content
- **Multi-Platform Support**: TikTok, Instagram, YouTube, Twitter, Facebook
- **Trending Score Calculation**: Analyze content viral potential
- **Hashtag Generation**: AI-generated relevant hashtags
- **Content Categorization**: Automatic content type detection
- **Batch Processing**: Process multiple content items simultaneously

### Document Processing
- **RAG Chat System**: AI-powered document analysis
- **Vector Search**: Semantic document retrieval
- **Source Citations**: Track information sources
- **Multi-format Support**: PDF, DOCX, TXT, Markdown

## 🛠️ Technologies

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Media Processing**: Cloudinary
- **AI/ML**: OpenAI GPT-4, LangChain
- **Database**: Supabase (PostgreSQL + pgvector)
- **File Upload**: React Dropzone

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-content-processor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up Supabase database**
   ```bash
   # Run the SQL setup script in your Supabase SQL editor
   # Copy the contents of supabase-setup.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🎯 API Endpoints

### Image Processing API

#### POST /api/image
Process images with text overlays and styling.

**Parameters:**
- `action`: Processing action (`text-overlay`, `multiple-text-overlays`, `extract-text`)
- `image`: Image file (JPG, PNG, GIF, WebP, BMP)
- `text`: Text content for overlay
- `textPlacement`: JSON string with placement options
- `textStyle`: JSON string with styling options
- `multipleTexts`: JSON array for multiple overlays

**Text Placement Options:**
```json
{
  "position": "top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right",
  "x": 100,
  "y": 100,
  "offset": {
    "x": 10,
    "y": 10
  }
}
```

**Text Style Options:**
```json
{
  "fontFamily": "Arial",
  "fontSize": 24,
  "color": "#ffffff",
  "backgroundColor": "#000000",
  "opacity": 1.0,
  "fontWeight": "bold",
  "fontStyle": "normal",
  "textAlign": "center",
  "stroke": {
    "color": "#000000",
    "width": 2
  },
  "shadow": {
    "color": "#000000",
    "blur": 5,
    "offsetX": 2,
    "offsetY": 2
  }
}
```

### Video Processing API

#### POST /api/video
Process videos with text overlays and effects.

**Parameters:**
- `action`: Processing action (`text-overlay`, `multiple-text-overlays`, `image-overlay`, `subtitle-overlay`, `video-overlay`, `extract-text`)
- `video`: Video file (MP4, AVI, MOV, WMV, FLV, WebM)
- `text`: Text content for overlay
- `textPlacement`: JSON string with placement and timing options
- `textStyle`: JSON string with styling options
- `multipleTexts`: JSON array for multiple overlays

**Video Text Placement Options:**
```json
{
  "position": "top-left|top-center|top-right|center-left|center|center-right|bottom-left|bottom-center|bottom-right",
  "x": 100,
  "y": 100,
  "offset": {
    "x": 10,
    "y": 10
  },
  "startTime": 0.0,
  "endTime": 10.0
}
```

### Social Media Agent APIs

#### POST /api/social-media/analyze
Analyze uploaded content for social media optimization.

**Parameters:**
```json
{
  "content": {
    "id": "content_123",
    "type": "video|meme|graphic",
    "category": "subway-surfers|minecraft|brainrot|viral-meme|color-graphic",
    "title": "Content Title",
    "description": "Content description",
    "tags": ["gaming", "viral"],
    "contentUrl": "https://example.com/content.mp4",
    "dimensions": {
      "width": 1080,
      "height": 1920
    },
    "duration": 30,
    "uploadDate": "2024-01-01T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "category": "gaming-entertainment",
    "targetAudience": ["gen-z", "mobile-gamers"],
    "bestPlatforms": ["tiktok", "instagram", "youtube"],
    "trendingScore": 85,
    "suggestedHashtags": ["viral", "trending", "fyp", "subwaysurfers", "gaming"]
  }
}
```

#### POST /api/social-media/generate-posts
Generate social media posts for uploaded content.

**Parameters:**
```json
{
  "content": {
    // Content object (same as analyze endpoint)
  },
  "platforms": ["tiktok", "instagram", "youtube"],
  "batch": false
}
```

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "id": "post_123",
      "contentId": "content_123",
      "platform": "tiktok",
      "textOverlays": [
        {
          "text": "SUBWAY SURFERS SPEEDRUN! 🏃‍♂️",
          "placement": {
            "position": "top-center",
            "offset": { "y": 10 }
          },
          "style": {
            "fontSize": 24,
            "color": "#ffffff",
            "fontWeight": "bold"
          }
        }
      ],
      "caption": "🚇 Just broke my personal best in Subway Surfers! Can you beat this score?\n\n🎵 Sound on for the full experience!\n\n#viral #trending #fyp #subwaysurfers #gaming",
      "hashtags": ["viral", "trending", "fyp", "subwaysurfers", "gaming"],
      "status": "draft"
    }
  ],
  "count": 1
}
```

#### POST /api/social-media/process-content
Complete workflow: analyze content, generate posts, and process media with overlays.

**Parameters:**
```json
{
  "content": {
    // Content object
  },
  "platforms": ["tiktok", "instagram"],
  "generateMedia": true
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    // Analysis results
  },
  "posts": [
    // Generated posts
  ],
  "processedMedia": [
    {
      "postId": "post_123",
      "platform": "tiktok",
      "originalUrl": "https://example.com/original.mp4",
      "processedUrl": "https://res.cloudinary.com/.../processed.mp4",
      "textOverlays": [
        // Applied text overlays
      ]
    }
  ],
  "summary": {
    "totalPosts": 2,
    "platforms": ["tiktok", "instagram"],
    "processedCount": 2,
    "failedCount": 0
  }
}
```

### Document Chat API

#### POST /api/chat
Send questions to the RAG system for document analysis.

**Parameters:**
```json
{
  "question": "What is the main topic of the document?"
}
```

#### POST /api/upload
Upload and process documents for RAG.

**Parameters:**
```json
{
  "content": "Document content...",
  "filename": "document.pdf"
}
```

## 🎨 Usage Examples

### Social Media Content Processing

1. **Upload and Analyze Content**
   ```javascript
   // Upload content
   const content = {
     id: 'subway_1',
     type: 'video',
     category: 'subway-surfers',
     title: 'Subway Surfers Speedrun',
     contentUrl: 'https://example.com/video.mp4',
     dimensions: { width: 1080, height: 1920 },
     duration: 30
   };

   // Analyze content
   const analysisResponse = await fetch('/api/social-media/analyze', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ content })
   });
   const analysis = await analysisResponse.json();
   ```

2. **Generate Social Media Posts**
   ```javascript
   // Generate posts for multiple platforms
   const postsResponse = await fetch('/api/social-media/generate-posts', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       content,
       platforms: ['tiktok', 'instagram', 'youtube']
     })
   });
   const posts = await postsResponse.json();
   ```

3. **Process Media with Overlays**
   ```javascript
   // Complete workflow
   const processResponse = await fetch('/api/social-media/process-content', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       content,
       platforms: ['tiktok', 'instagram'],
       generateMedia: true
     })
   });
   const result = await processResponse.json();
   ```

### Adding Text to Images

1. **Single Text Overlay**
   ```javascript
   const formData = new FormData();
   formData.append('action', 'text-overlay');
   formData.append('image', imageFile);
   formData.append('text', 'Hello World');
   formData.append('textPlacement', JSON.stringify({
     position: 'bottom-center'
   }));
   formData.append('textStyle', JSON.stringify({
     fontSize: 24,
     color: '#ffffff',
     fontWeight: 'bold'
   }));

   const response = await fetch('/api/image', {
     method: 'POST',
     body: formData
   });
   ```

2. **Multiple Text Overlays**
   ```javascript
   const multipleTexts = [
     {
       text: 'Title',
       placement: { position: 'top-center' },
       style: { fontSize: 32, color: '#ffffff' }
     },
     {
       text: 'Subtitle',
       placement: { position: 'center' },
       style: { fontSize: 18, color: '#cccccc' }
     }
   ];

   formData.append('multipleTexts', JSON.stringify(multipleTexts));
   ```

### Video Processing

1. **Text Overlay with Timing**
   ```javascript
   const formData = new FormData();
   formData.append('action', 'text-overlay');
   formData.append('video', videoFile);
   formData.append('text', 'Welcome!');
   formData.append('textPlacement', JSON.stringify({
     position: 'center',
     startTime: 0,
     endTime: 5
   }));
   ```

2. **Multiple Text Overlays**
   ```javascript
   const multipleTexts = [
     {
       text: 'Opening',
       placement: { position: 'top-center', startTime: 0, endTime: 3 },
       style: { fontSize: 24, color: '#ffffff' }
     },
     {
       text: 'Closing',
       placement: { position: 'bottom-center', startTime: 7, endTime: 10 },
       style: { fontSize: 20, color: '#ffffff' }
     }
   ];
   ```

## 🎯 Content Types Supported

### Videos
- **Subway Surfers**: Gaming entertainment content
- **Minecraft**: Educational gaming content  
- **Brainrot**: Viral entertainment content
- **General Gaming**: Various gaming content
- **Entertainment**: General entertainment videos

### Memes
- **Viral Memes**: Trending meme templates
- **Dank Memes**: Internet culture memes
- **Classic Memes**: Nostalgic meme content

### Graphics
- **Brand Graphics**: Business and marketing content
- **Color Graphics**: Vibrant design content
- **Minimal Graphics**: Clean, modern designs

## 📊 Social Media Platforms

### TikTok
- **Best for**: Short-form video content
- **Optimal format**: 9:16 vertical videos
- **Text overlays**: Large, bold text with high contrast
- **Hashtags**: Trending and viral hashtags

### Instagram
- **Best for**: Visual content and stories
- **Optimal format**: Square (1:1) or vertical (4:5)
- **Text overlays**: Clean, readable typography
- **Hashtags**: Niche and branded hashtags

### YouTube
- **Best for**: Longer-form content
- **Optimal format**: 16:9 horizontal videos
- **Text overlays**: Subtle, professional styling
- **Hashtags**: SEO-focused hashtags

### Twitter
- **Best for**: Quick updates and memes
- **Optimal format**: Square images or short videos
- **Text overlays**: Bold, attention-grabbing text
- **Hashtags**: Trending and topical hashtags

### Facebook
- **Best for**: Community engagement
- **Optimal format**: Square or horizontal content
- **Text overlays**: Clear, readable text
- **Hashtags**: Community and interest-based hashtags

## 🔧 Configuration

### Text Overlay Presets

The system includes predefined text styles and placements:

```typescript
// Preset text styles
PRESET_TEXT_STYLES = {
  title: { fontSize: 32, fontWeight: 'bold', color: '#ffffff' },
  subtitle: { fontSize: 24, fontWeight: 'normal', color: '#cccccc' },
  caption: { fontSize: 16, fontWeight: 'normal', color: '#999999' },
  callout: { fontSize: 28, fontWeight: 'bold', color: '#ff6b6b' }
};

// Preset placements
PRESET_PLACEMENTS = {
  'top-center': { position: 'top-center', offset: { y: 10 } },
  'bottom-center': { position: 'bottom-center', offset: { y: -10 } },
  'center': { position: 'center' }
};
```

### AI Text Overlay Generator

The AI-powered text overlay generator analyzes content and automatically suggests optimal text placement and styling:

```typescript
// Generate text overlay with AI
const overlay = await generateTextOverlay(text, mediaContext, {
  contentType: 'title',
  importance: 'high',
  platform: 'tiktok'
});
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main branch**

### Environment Variables for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloudinary** for media processing capabilities
- **OpenAI** for AI-powered text analysis
- **Supabase** for database and vector storage
- **Next.js** for the amazing React framework
- **Tailwind CSS** for utility-first styling 