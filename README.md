# AI RAG Assistant with Video Processing

A modern web application built with Next.js, TypeScript, Tailwind CSS, and Supabase, featuring AI-powered RAG (Retrieval-Augmented Generation) capabilities for intelligent document Q&A and Cloudinary-powered video processing with overlays.

## Features

- 🔐 User authentication (sign up, sign in, sign out) - *Removed for public demo*
- 🤖 AI-powered RAG (Retrieval-Augmented Generation) system
- 📄 Document upload and processing (PDF, DOCX, TXT, MD)
- 🎥 Video processing with Cloudinary overlays
- 💬 Intelligent chat interface with source citations
- 🎨 Modern, responsive UI with Tailwind CSS
- 📱 Mobile-friendly design
- 🌙 Dark mode support
- ⚡ Fast development with Next.js 14
- 🔒 Type-safe with TypeScript
- 🗄️ Supabase integration with vector database
- 🔍 Semantic search and document retrieval
- 🎬 Video overlay capabilities (text, image, subtitle, video)
- 📹 Multi-format video support (MP4, AVI, MOV, WMV, FLV, WebM)

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- OpenAI API key
- Cloudinary account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
# or
yarn install
```

### 2. Configure Environment Variables

1. Copy the environment example file:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Model Configuration
OPENAI_API_KEY=your_openai_api_key

# Vector Database Configuration
NEXT_PUBLIC_SUPABASE_VECTOR_EXTENSION=pgvector

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Get Your API Keys

#### Supabase Credentials
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings > API
4. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

#### Cloudinary Credentials
1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name, API Key, and API Secret
3. Add them to your environment variables

### 4. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-setup.sql`
4. Run the SQL script to create:
   - Vector database tables
   - Document storage
   - Chat history
   - Public access policies

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

### RAG (Retrieval-Augmented Generation) System

1. **Document Upload**: Users upload documents (PDF, DOCX, TXT, MD)
2. **Document Processing**: Documents are chunked and embedded using OpenAI embeddings
3. **Vector Storage**: Embeddings are stored in Supabase's vector database
4. **Query Processing**: When users ask questions:
   - Question is embedded
   - Similar document chunks are retrieved
   - Context is sent to AI model
   - AI generates answer with source citations

### Video Processing System

1. **Video Upload**: Users upload videos (MP4, AVI, MOV, WMV, FLV, WebM)
2. **Cloudinary Processing**: Videos are uploaded to Cloudinary
3. **Overlay Application**: Various overlays can be applied:
   - Text overlays with custom styling
   - Image overlays
   - Subtitle overlays
   - Video overlays
4. **AI Integration**: Processed videos can be analyzed with RAG system

### Architecture

```
Document Upload → Chunking → OpenAI Embeddings → Supabase Vector DB
                                                           ↓
User Question → Embed Question → Vector Similarity Search → AI Generation → Response

Video Upload → Cloudinary → Overlay Processing → Video Storage → AI Analysis
```

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── chat/          # RAG chat endpoint
│   │   ├── upload/        # Document upload endpoint
│   │   └── video/         # Video processing endpoint
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── RAGChat.tsx        # Document RAG chat interface
│   └── VideoProcessor.tsx # Video processing interface
├── lib/                   # Utility functions
│   ├── supabase.ts        # Supabase client configuration
│   ├── ai.ts              # AI and RAG utilities
│   └── cloudinary.ts      # Cloudinary video processing utilities
├── supabase-setup.sql     # Database setup script
├── .env.local            # Environment variables (create this)
├── env.example           # Environment variables template
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Usage

### Document RAG
1. **Upload documents** by dragging and dropping files
2. **Ask questions** about your documents
3. **Get AI-powered answers** with source citations

### Video Processing
1. **Upload videos** by dragging and dropping video files
2. **Select overlay type**: Text, Image, Subtitle, or Video overlay
3. **Process videos** with Cloudinary transformations
4. **Ask AI questions** about your processed videos
5. **Download processed videos** with overlays

## API Endpoints

### POST /api/chat
Send a question to the RAG system
```json
{
  "question": "What is the main topic of the document?"
}
```

### POST /api/upload
Upload and process a document
```json
{
  "content": "Document content...",
  "filename": "document.pdf"
}
```

### POST /api/video
Process video with overlays
```form-data
action: "text-overlay"
video: [video file]
text: "Overlay text"
```

## Video Overlay Features

Based on [Cloudinary's video overlay guide](https://cloudinary.com/guides/video-effects/text-video-overlays-programmatically-add-text-overlays-to-videos), this application supports:

### Text Overlays
- Custom font families and sizes
- Color customization
- Position control
- Dynamic text content

### Image Overlays
- Logo overlays
- Watermark placement
- Brand integration
- Custom positioning

### Subtitle Overlays
- SRT file support
- Accessibility features
- Multi-language support
- Styling options

### Video Overlays
- Picture-in-picture effects
- Video compositing
- Layered video content
- Creative effects

## Supabase Setup Tips

### Vector Database
- The `pgvector` extension must be enabled
- Documents table stores chunks with embeddings
- Similarity search function for retrieval

### Public Access
- Row Level Security disabled for demo mode
- All documents and videos are publicly accessible
- Suitable for demonstration and testing

## Cloudinary Setup Tips

### Video Processing
- Create an upload preset in Cloudinary dashboard
- Configure video transformations
- Set up proper CORS policies
- Monitor usage and costs

### Best Practices
- Optimize video formats for web delivery
- Use appropriate quality settings
- Implement proper error handling
- Cache frequently used transformations

## Troubleshooting

### Common Issues

1. **Vector extension not enabled**: Run the SQL setup script in Supabase
2. **API key errors**: Ensure all API keys are correctly set in `.env.local`
3. **Document upload fails**: Check file format and size limits
4. **Video processing fails**: Verify Cloudinary credentials and upload preset
5. **Chat not working**: Verify OpenAI API key and quota

### Performance Tips

- Use appropriate chunk sizes for your documents
- Monitor API usage and costs
- Optimize vector search parameters
- Implement caching for frequent queries
- Compress videos before upload
- Use Cloudinary's optimization features

## Next Steps

1. **Add more AI models** (Claude, Gemini, etc.)
2. **Implement document management** (delete, organize)
3. **Add conversation history** persistence
4. **Deploy to Vercel** or your preferred platform
5. **Add advanced video features** like AI-powered editing
6. **Implement user authentication** for production use
7. **Add video analytics** and usage tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 