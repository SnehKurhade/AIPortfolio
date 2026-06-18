import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, switchMap, catchError } from 'rxjs/operators';
import { RagService, DocumentChunk } from './rag.service';
import { GroqService } from './groq.service';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
  isUsingGroq?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private messageHistory: ChatMessage[] = [];
  private systemPrompt = `You are an intelligent AI assistant representing Sneh Kurhade, a Full Stack Developer with 4+ years of experience.
You have access to comprehensive information about his skills, projects, experience, and expertise in areas like Angular, .NET, Azure, and AI/LLM technologies.

Your responsibilities:
1. Answer questions accurately based on the provided context
2. Be conversational and helpful
3. Acknowledge when you don't have specific information
4. Provide relevant examples from projects when applicable
5. Show enthusiasm for technology and problem-solving
6. Maintain a professional yet friendly tone`;

  constructor(
    private ragService: RagService,
    private groqService: GroqService
  ) {}

  /**
   * Main chat method - uses RAG + Groq for intelligent responses
   */
  chat(question: string): Observable<ChatResponse> {
    // Retrieve relevant context from RAG
    const relevantChunks = this.ragService.retrieveRelevantChunks(question, 5);
    
    // Add user message to history
    this.messageHistory.push({
      role: 'user',
      content: question
    });

 return this.chatWithGroq(question, relevantChunks);
  }

  /**
   * Chat using Groq API with RAG context
   */
  private chatWithGroq(question: string, chunks: any[]): Observable<ChatResponse> {
    // Build context from retrieved chunks
    const context = this.buildContext(chunks);

    // Prepare messages for Groq
    const messages: any[] = [
      {
        role: 'system',
        content: this.systemPrompt
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}`
      }
    ];

    // Call Groq API
    return this.groqService.chat(messages).pipe(
      switchMap(answer => {
        // Add assistant response to history
        this.messageHistory.push({
          role: 'assistant',
          content: answer
        });

        // Extract sources from chunks
        const sources = [...new Set(chunks.map((c: any) => c.source))];
        return of({
          answer,
          sources,
          isUsingGroq: true
        });
      }),
      catchError(error => {
        console.error('Groq chat error:', error);
        // Fallback to local knowledge base on error
        return this.chatWithLocalKnowledge(question, chunks);
      })
    );
  }

  /**
   * Fallback: Chat using local knowledge base
   */
  private chatWithLocalKnowledge(question: string, chunks: any[]): Observable<ChatResponse> {
    const context = this.buildContext(chunks);
    const answer = this.generateLocalResponse(question, context);

    this.messageHistory.push({
      role: 'assistant',
      content: answer
    });

    const sources = [...new Set(chunks.map((c: any) => c.source))];
    
    return of({
      answer,
      sources,
      isUsingGroq: false
    });
  }

  /**
   * Build context string from document chunks
   */
  private buildContext(chunks: any[]): string {
    return chunks
      .map(chunk => `[${chunk.title}]\n${chunk.content}`)
      .join('\n\n---\n\n');
  }

  /**
   * Generate response using local knowledge base (fallback)
   */
  private generateLocalResponse(question: string, context: string): string {
    const lowerQuestion = question.toLowerCase();

    // Knowledge-based routing
    if (this.matches(lowerQuestion, ['who', 'tell me', 'about sneh', 'introduce', 'yourself'])) {
      return "I'm Sneh Kurhade, a Full Stack Developer with 4+ years of experience in enterprise software development. I specialize in building scalable applications using Angular and .NET, with recent expertise in AI/LLM technologies like RAG pipelines and Groq integration. I'm passionate about clean code, architecture, and leveraging technology to solve complex problems.";
    }

    if (this.matches(lowerQuestion, ['skills', 'expertise', 'what can you do', 'technologies', 'proficient'])) {
      return "My expertise spans:\n\n**Frontend:** Angular (expert level), React, TypeScript, RxJS, responsive design\n\n**Backend:** C#, .NET Core, ASP.NET, REST APIs, Entity Framework\n\n**Database:** SQL Server, query optimization, stored procedures\n\n**AI/LLM:** RAG pipelines, Groq API, OpenAI, vector databases, prompt engineering\n\n**Cloud:** Azure (App Service, SQL, DevOps), AWS basics\n\n**DevOps:** CI/CD pipelines, Docker, Azure DevOps, GitHub Actions\n\nI'm particularly strong in full-stack enterprise development and modern AI integration.";
    }

    if (this.matches(lowerQuestion, ['azure', 'cloud', 'deployment', 'infrastructure'])) {
      return "I have extensive Azure experience! I've worked with:\n• Azure App Service for hosting web applications\n• Azure SQL Database for data management\n• Azure DevOps for CI/CD automation\n• Application Insights for monitoring\n• Azure Storage and CDN\n\nI've deployed and managed multiple enterprise applications on Azure, handling scaling, disaster recovery, and cost optimization. Azure DevOps pipelines are a core part of my development workflow.";
    }

    if (this.matches(lowerQuestion, ['project', 'portfolio', 'work', 'built'])) {
      return "I've worked on several key projects:\n\n**1. Enterprise Lending Platform** - A full-stack banking platform for Nedbank serving millions of transactions. Built with Angular, .NET Core, SQL Server on Azure infrastructure.\n\n**2. AI Resume Assistant** - An intelligent resume analyzer using Groq LLM, RAG pipelines, and .NET backend for extracting insights and matching against job descriptions.\n\n**3. AI Portfolio Chatbot** - This project! An Angular-based portfolio with an integrated AI assistant powered by Groq and RAG for intelligent Q&A.\n\nEach demonstrates full-stack and AI capabilities.";
    }

    if (this.matches(lowerQuestion, ['rag', 'retrieval', 'vector', 'embedding', 'ai', 'llm'])) {
      return "I'm actively working with RAG (Retrieval-Augmented Generation) technology:\n\n• **RAG Pipelines:** Implementing systems that retrieve relevant context before generating responses\n• **Groq Integration:** Using Groq's fast inference API (10x faster than traditional LLMs)\n• **Vector Databases:** Experience with semantic search and vector embeddings\n• **LLMs:** Working with Mixtral, Llama 2, Gemma models\n• **Prompt Engineering:** Crafting effective prompts for specific tasks\n\nRAG enables AI to provide accurate, contextual responses with cited sources - which is exactly what you're experiencing right now!";
    }

    if (this.matches(lowerQuestion, ['groq', 'api', 'integration'])) {
      return "Groq is a fantastic LLM inference platform that I'm actively using! It offers:\n\n• **Speed:** 10x faster than traditional LLM APIs\n• **Models:** Mixtral-8x7b, Llama 2, Gemma and more\n• **Cost-effective:** Great for high-volume applications\n• **Reliable:** Production-ready infrastructure\n\nI've integrated Groq into multiple projects, including this portfolio chatbot. The combination of Groq's speed with RAG pipelines creates an excellent user experience with real-time intelligent responses.";
    }

    if (this.matches(lowerQuestion, ['experience', 'work', 'career', 'background', 'nihilent'])) {
      return "I'm currently a Full Stack Developer at Nihilent (2022-Present), where I lead development of enterprise-scale applications. Key achievements:\n\n• Led an AngularJS to Angular migration (improved performance by 40%)\n• Built and maintained the Enterprise Lending Platform\n• Reduced API response times by 30% through optimization\n• Managed Azure cloud infrastructure and deployments\n• Implemented RAG pipelines for AI features\n• Mentored junior developers on best practices\n\nWith 4+ years in the industry, I've grown from individual contributor to technical leader, now focusing on AI-powered solutions.";
    }

    if (this.matches(lowerQuestion, ['frontend', 'angular', 'react', 'ui', 'component'])) {
      return "My frontend expertise is primarily in **Angular** where I excel at:\n\n• Building scalable component architecture\n• State management with RxJS and services\n• Reactive forms and validation\n• Angular routing and lazy loading\n• Performance optimization\n• TypeScript best practices\n• Responsive design with CSS/Grid/Flexbox\n\nI led a major AngularJS to Angular migration, significantly improving performance and maintainability. While I have React experience, Angular is my core framework where I can architect complex, enterprise-grade applications.";
    }

    if (this.matches(lowerQuestion, ['backend', '.net', 'c#', 'api', 'database'])) {
      return "I have strong backend expertise in C# and .NET:\n\n• **C#/.NET Core:** Building scalable REST APIs and microservices\n• **ASP.NET MVC:** Web application development\n• **Entity Framework:** Object-relational mapping\n• **SQL Server:** Database design, optimization, and advanced querying\n• **Design Patterns:** SOLID principles, dependency injection\n• **Async Programming:** Async/await patterns for responsive APIs\n\nMy backend work focuses on building clean, performant, maintainable code that scales with enterprise applications and can handle high-volume transactions.";
    }

    // Default response with context
    return `That's a great question! I'm happy to discuss my experience with Angular, .NET, Azure cloud, AI/LLM technologies, and enterprise application development. What specific area interests you most?`;
  }

  /**
   * Keyword matching helper
   */
  private matches(question: string, keywords: string[]): boolean {
    return keywords.some(keyword => question.includes(keyword));
  }

  /**
   * Get message history
   */
  getMessageHistory(): ChatMessage[] {
    return this.messageHistory;
  }

  /**
   * Clear message history
   */
  clearHistory() {
    this.messageHistory = [];
  }
}