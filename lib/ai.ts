import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';
import { supabase } from './supabase';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize LangChain chat model
export const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

// Initialize embeddings model
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Text splitter for chunking documents
export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

// Custom vector store implementation using Supabase
export class SupabaseVectorStore {
  private client: any;
  private tableName: string;
  private queryName: string;

  constructor(embeddings: OpenAIEmbeddings, config: { client: any; tableName: string; queryName: string }) {
    this.client = config.client;
    this.tableName = config.tableName;
    this.queryName = config.queryName;
  }

  async addDocuments(documents: Document[]) {
    const texts = documents.map(doc => doc.pageContent);
    const metadatas = documents.map(doc => doc.metadata);
    
    // Generate embeddings for all texts
    const embeddingsList = await embeddings.embedDocuments(texts);
    
    // Insert documents into Supabase
    const { error } = await this.client
      .from(this.tableName)
      .insert(
        embeddingsList.map((embedding, i) => ({
          content: texts[i],
          metadata: metadatas[i],
          embedding: embedding,
        }))
      );

    if (error) throw error;
  }

  async similaritySearch(query: string, k: number = 5) {
    // Generate embedding for the query
    const queryEmbedding = await embeddings.embedQuery(query);
    
    // Search for similar documents with correct parameter order
    const { data, error } = await this.client.rpc(this.queryName, {
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: k,
    });

    if (error) throw error;

    // Convert to Document format
    return data.map((item: any) => new Document({
      pageContent: item.content,
      metadata: item.metadata,
    }));
  }
}

// Create vector store instance
export const createVectorStore = () => {
  return new SupabaseVectorStore(embeddings, {
    client: supabase,
    tableName: 'documents',
    queryName: 'match_documents',
  });
};

// Document processing utilities
export const processDocument = async (content: string, metadata: any = {}) => {
  const docs = await textSplitter.createDocuments([content], [metadata]);
  return docs;
};

// RAG query function with crypto maxi personality and JSON response
export const queryRAG = async (question: string) => {
  try {
    const vectorStore = createVectorStore();
    
    // Search for relevant documents
    const docs = await vectorStore.similaritySearch(question, 5);
    
    // Create context from documents
    const context = docs.map(doc => doc.pageContent).join('\n\n');
    
    // Create system prompt for crypto maxi personality
    const systemPrompt = `You are a passionate crypto maximalist who believes strongly in the future of cryptocurrency and blockchain technology. You're enthusiastic about Bitcoin, Ethereum, and the broader crypto ecosystem. You should respond with a crypto-positive perspective while being informative.

IMPORTANT: You must ALWAYS respond in valid JSON format with the following structure:
{
  "text_content": "Your detailed response as a crypto maxi, explaining concepts with enthusiasm for crypto",
  "metadata_tags": ["tag1", "tag2", "tag3"],
  "crypto_sentiment": "bullish/bearish/neutral",
  "confidence_score": 0.95
}

Rules:
1. Always respond in valid JSON format
2. Include relevant metadata tags based on the content
3. Be enthusiastic about crypto but factual
4. Use the provided context to inform your response
5. If no context is available, still respond as a crypto maxi with general knowledge

Context from documents:
${context}

Question: ${question}

Remember: Respond ONLY in JSON format with text_content, metadata_tags, crypto_sentiment, and confidence_score fields.`;

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0].message.content || '';
    
    // Try to parse JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (error) {
      // If JSON parsing fails, create a fallback response
      parsedResponse = {
        text_content: responseText || "Sorry, I couldn't process that request properly. But as a crypto maxi, I'm always bullish on the future of blockchain technology! 🚀",
        metadata_tags: ["crypto", "blockchain", "bitcoin"],
        crypto_sentiment: "bullish",
        confidence_score: 0.8
      };
    }

    return {
      answer: parsedResponse,
      sources: docs.map(doc => doc.metadata),
      context: context.substring(0, 500) + '...'
    };
  } catch (error) {
    console.error('Error in RAG query:', error);
    throw error;
  }
};

// Document upload and processing
export const uploadDocument = async (content: string, filename: string) => {
  try {
    const docs = await processDocument(content, {
      filename,
      uploadedAt: new Date().toISOString(),
    });

    const vectorStore = createVectorStore();
    await vectorStore.addDocuments(docs);

    return {
      success: true,
      chunks: docs.length,
      message: `Document uploaded successfully with ${docs.length} chunks`
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}; 