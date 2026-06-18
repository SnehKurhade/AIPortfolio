# RAG Pipeline + Groq Integration Guide

## Overview

Your portfolio now includes a **Retrieval-Augmented Generation (RAG) pipeline** integrated with **Groq API** for intelligent, context-aware AI responses. This document explains how it works and how to use it.

## What is RAG?

**RAG (Retrieval-Augmented Generation)** is an AI technique that:
1. **Retrieves** relevant documents/context based on user queries
2. **Augments** the LLM prompt with retrieved context
3. **Generates** more accurate, contextual responses

Benefits:
- Reduces hallucinations (false information)
- Provides cited sources
- Works with current, specific knowledge
- Lower cost than fine-tuning

## Architecture

### Services Overview

```
┌─────────────────────────────────────────────────────┐
│          AI Chat Component (UI)                     │
│  - User input/output                                │
│  - API key configuration                            │
│  - Message history display                          │
└────────────────┬────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │ AiChatService  │
         └───────┬────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
   ┌──▼──┐            ┌─────▼────┐
   │ RAG │            │ Groq API │
   │Serv.│            │ Service  │
   └──┬──┘            └─────┬────┘
      │                     │
   ┌──▼─────────────────┐  │
   │ Document Chunks    │  │
   │ (Knowledge Base)   │  │
   │ - Similarity Score │  │
   └────────────────────┘  │
                           │
                    ┌──────▼─────┐
                    │  Groq API  │
                    │  Endpoint  │
                    └────────────┘
```

### Services

#### 1. **RagService** (`rag.service.ts`)
Manages document chunking and retrieval.

**Key Features:**
- Chunks knowledge base documents for better retrieval
- Calculates similarity between query and chunks
- Retrieves top K relevant chunks
- Supports overlap for context preservation

**Knowledge Base Documents:**
- Biography
- Frontend Skills (Angular, React, TypeScript)
- Backend Skills (C#, .NET, SQL Server)
- AI/LLM Expertise
- Cloud & DevOps
- Work Experience
- Projects (Lending Platform, AI Resume, Portfolio Chatbot)

#### 2. **GroqService** (`groq.service.ts`)
Handles Groq API communication.

**Key Features:**
- Manages API key (stored in localStorage)
- Sends messages to Groq API
- Handles errors gracefully
- Supports multiple models (Mixtral, Llama 2, Gemma)

**Supported Models:**
- `mixtral-8x7b-32768` (Fast, capable - default)
- `llama2-70b-4096` (Larger, more capable)
- `gemma-7b-it` (Faster, smaller)

#### 3. **AiChatService** (`ai-chat.service.ts`)
Orchestrates RAG + Groq for responses.

**Flow:**
1. User submits question
2. RAG retrieves 5 most relevant document chunks
3. If Groq configured → sends to Groq API with context
4. If Groq not configured → uses local knowledge base (fallback)
5. Returns answer with sources

## Setup Instructions

### Step 1: Get Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Generate API key in dashboard
4. Key format: `gsk_...`

### Step 2: Configure in Your Portfolio

1. Open the Chat page (`/chat`)
2. Click **"⚙️ Configure Groq API"** button
3. Paste your API key
4. Click **"Save"**
5. Your key is stored locally in browser

### Step 3: Enjoy AI-Powered Responses!

- Ask questions naturally
- The RAG pipeline will retrieve relevant context
- Groq will generate intelligent responses in real-time
- Responses include source citations

## API Configuration

### In Component

```typescript
// Check if Groq is configured
if (this.aiChatService.isGroqConfigured()) {
  // Use Groq
} else {
  // Use local knowledge base
}

// Set API key
this.aiChatService.setGroqApiKey(apiKey);
```

### API Key Security

- Keys are stored in **browser localStorage** only
- Never sent to any backend server
- Removed if user clears browser data
- Consider regenerating key if shared

## How Groq Makes it Faster

Groq's unique advantages:

| Feature | Benefit |
|---------|---------|
| **Speed** | 10x faster inference than traditional LLMs |
| **Cost** | ~70% cheaper than OpenAI |
| **Latency** | Response in <500ms vs 3-5s others |
| **Inference** | Specialized inference engine (not just GPUs) |

### Example Response Times

```
Question: "What are your strongest skills?"

With Groq:
- RAG retrieval: 50ms
- API latency: 200ms  
- Response time: ~250ms total ✓ Fast!

Without Groq (Local):
- Keyword matching: 10ms
- Response time: ~100ms total ✓ Faster but less intelligent
```

## System Prompt

The AI uses this context when responding:

```
You are an intelligent AI assistant representing Sneh Kurhade, 
a Full Stack Developer with 4+ years of experience.

You have access to comprehensive information about his skills, 
projects, experience, and expertise in areas like Angular, .NET, 
Azure, and AI/LLM technologies.

Your responsibilities:
1. Answer questions accurately based on the provided context
2. Be conversational and helpful
3. Acknowledge when you don't have specific information
4. Provide relevant examples from projects when applicable
5. Show enthusiasm for technology and problem-solving
6. Maintain a professional yet friendly tone

Always cite your sources when referencing specific projects 
or achievements.
```

## Example Queries

### Good Questions (RAG Works Best)
```
"What are your strongest skills?"
"Tell me about the Enterprise Lending Platform"
"How much experience do you have with Azure?"
"What AI projects have you built?"
"Show me your Angular experience"
```

### Why RAG Helps
- Query matches specific document chunks
- Groq generates contextual answer
- Sources are cited automatically

## Fallback to Local Knowledge Base

If Groq is not configured or fails:

1. RAG still retrieves relevant chunks
2. Local keyword-based response generator creates answer
3. User gets instant response without API calls
4. Sources still included

This ensures the chat always works!

## File Structure

```
src/app/
├── services/
│   ├── ai-chat.service.ts      # Main orchestration service
│   ├── rag.service.ts           # Document chunking & retrieval
│   ├── groq.service.ts          # Groq API integration
│   └── portfolio.service.ts     # Mock portfolio data
├── pages/
│   └── ai-chat/
│       ├── ai-chat.ts          # Component with API config UI
│       ├── ai-chat.html        # Template with API key input
│       └── ai-chat.css         # Styling for chat & config
└── app.ts                       # Root component
```

## Development Tips

### Adding More Knowledge

Edit `RagService.initializeDocuments()` to add documents:

```typescript
const documents: Document[] = [
  {
    id: 'unique-id',
    title: 'Document Title',
    source: 'Document Source',
    content: 'Full document content...'
  },
  // ...
];
```

### Tweaking Similarity Matching

In `RagService.calculateSimilarity()`:
- Adjust word matching logic
- Change chunk size (currently 500 words)
- Modify overlap (currently 100 words)

### Changing Groq Model

```typescript
// In ai-chat component or groq service
this.groqService.setModel('llama2-70b-4096');
```

### Debugging

Check browser console for:
- API errors
- RAG retrieval logs
- Response times
- Missing chunks

## Troubleshooting

### "Invalid API key" error
- Check key format (should start with `gsk_`)
- Verify key is active on [console.groq.com](https://console.groq.com)
- Clear localStorage and try again

### Slow responses
- Check internet connection
- Groq may be experiencing load
- Try changing to `gemma-7b-it` model
- Fallback to local responses works

### Missing sources
- RAG service might not find relevant chunks
- Try rephrasing question
- Check that documents are in knowledge base

### API errors
- 401: Authentication failed (bad key)
- 429: Rate limit (too many requests)
- 500: Groq server error (try again later)

## Future Enhancements

Possible improvements:

1. **Vector Embeddings** - Use OpenAI or local embeddings for better similarity
2. **Pinecone Integration** - Store embeddings in vector DB
3. **Multi-turn Conversations** - Maintain conversation context
4. **Custom Models** - Fine-tune on your data
5. **Analytics** - Track questions and response quality
6. **Caching** - Cache repeated questions
7. **Web Scraping** - Auto-update knowledge base from web
8. **MCP Protocol** - Integrate Model Context Protocol

## Resources

- **Groq Docs**: https://console.groq.com/docs
- **RAG Concepts**: https://docs.llamaindex.ai/
- **Angular Documentation**: https://angular.dev
- **LangChain Docs**: https://docs.langchain.com

## Cost Analysis

### Groq (Free Tier)
- Free: 30 requests/minute
- Perfect for portfolio/demo
- No credit card required
- Paid plans available for production

### vs OpenAI
- Groq: $0.0005/1k tokens
- GPT-3.5: $0.0005/1k tokens (similar)
- GPT-4: $0.03/1k tokens (10x more)
- **Winner: Groq for speed + cost**

## Questions?

The AI chatbot on this portfolio can explain:
- "What is RAG?"
- "How does Groq integration work?"
- "Why is Groq faster?"
- "How do you set up the API key?"

Just ask the chatbot! 🤖

---

**Enjoy your AI-powered portfolio with RAG + Groq!** ⚡
