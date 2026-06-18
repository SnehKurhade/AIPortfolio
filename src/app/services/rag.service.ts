import { Injectable } from '@angular/core';

export interface Document {
  id: string;
  content: string;
  title: string;
  source: string;
}

export interface DocumentChunk {
  id: string;
  content: string;
  documentId: string;
  title: string;
  source: string;
  chunkIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private chunks: DocumentChunk[] = [];
  private chunkSize = 500;
  private overlapSize = 100;

  constructor() {
    this.initializeDocuments();
  }

  private initializeDocuments() {
    const documents: Document[] = [
      {
        id: 'bio',
        title: 'Biography',
        source: 'Personal Profile',
        content: `Sneh Kurhade is a Full Stack Developer with 4+ years of professional experience in enterprise software development. 
        Based in India, I specialize in building scalable web applications using modern technologies. 
        I hold a Bachelor's degree in Computer Science and am passionate about clean code, architecture, and leveraging AI to solve complex problems.
        Currently working at Nihilent as a Full Stack Developer, leading various enterprise-level projects.`
      },
      {
        id: 'skills-frontend',
        title: 'Frontend Skills',
        source: 'Technical Skills',
        content: `Frontend Technologies: 
        - Angular (Expert): Extensive experience with Angular 2+, TypeScript, component architecture, services, dependency injection, RxJS, Observables, Forms (reactive and template-driven), routing, guards, interceptors.
        - React: Building dynamic interfaces, hooks, state management, component composition.
        - TypeScript: Strong typing, interfaces, generics, decorators, advanced patterns.
        - HTML/CSS: Semantic HTML, CSS Grid, Flexbox, animations, responsive design, CSS-in-JS.
        - JavaScript: ES6+, async/await, promises, closures, prototypes.
        - Testing: Unit testing with Jasmine/Karma, integration testing, end-to-end testing with Cypress.
        - State Management: NgRx, Akita, RxJS patterns.`
      },
      {
        id: 'skills-backend',
        title: 'Backend Skills',
        source: 'Technical Skills',
        content: `Backend Technologies:
        - C#/.NET: Expert in C#, .NET Core, ASP.NET MVC, Web API development, microservices architecture.
        - API Development: REST APIs, GraphQL, OpenAPI/Swagger, API security, versioning, documentation.
        - Database: SQL Server, Entity Framework ORM, LINQ, query optimization, stored procedures, indexing strategies.
        - Authentication: JWT, OAuth2, Windows Authentication, role-based access control.
        - Async Programming: Async/await patterns, Task Parallel Library, reactive programming.
        - Design Patterns: SOLID principles, dependency injection, factory pattern, strategy pattern.`
      },
      {
        id: 'skills-ai',
        title: 'AI & LLM Skills',
        source: 'Technical Skills',
        content: `Artificial Intelligence & LLM Integration:
        - RAG (Retrieval Augmented Generation): Building RAG pipelines with vector databases, semantic search, context-aware responses.
        - LLM Platforms: Groq (fast inference), OpenAI GPT models, LangChain integration, prompt engineering.
        - Vector Databases: Pinecone, Weaviate, Milvus, vector similarity search, embeddings.
        - AI Chatbots: Building intelligent conversational systems, context management, multi-turn conversations.
        - Prompt Engineering: Crafting effective prompts, few-shot learning, chain-of-thought prompting.
        - MCP Protocol: Model Context Protocol for standardized AI integrations.`
      },
      {
        id: 'skills-cloud',
        title: 'Cloud & DevOps',
        source: 'Technical Skills',
        content: `Cloud & DevOps:
        - Azure: Azure App Service, Azure SQL Database, Azure Storage, Azure DevOps, Azure Functions, Application Insights.
        - AWS: EC2, S3, RDS, Lambda, CloudFront.
        - CI/CD: Azure Pipelines, GitHub Actions, Jenkins, automated testing, deployment automation.
        - Containerization: Docker, Docker Compose, Kubernetes basics.
        - Infrastructure as Code: ARM templates, Terraform.
        - Monitoring & Logging: Application Insights, ELK stack, log aggregation.`
      },
      {
        id: 'experience-1',
        title: 'Current Role - Nihilent',
        source: 'Work Experience',
        content: `Full Stack Developer at Nihilent (2022 - Present):
        - Leading development of enterprise-scale applications serving banking sector (Nedbank).
        - Architected and maintained lending platform serving millions of transactions.
        - Responsible for both frontend (Angular) and backend (.NET Core) development.
        - Mentoring junior developers on best practices and design patterns.
        - Managing deployments and infrastructure on Azure cloud.
        - Implementing RAG pipelines for AI-powered features.
        - Key achievements: Led AngularJS to Angular migration (improved performance by 40%), reduced API response time by 30% through optimization.`
      },
      {
        id: 'project-lending',
        title: 'Enterprise Lending Platform',
        source: 'Projects',
        content: `Enterprise Lending Platform (Nedbank):
        Technology Stack: Angular, .NET Core, SQL Server, Azure.
        Description: Full-stack platform for managing lending operations, loan approvals, customer management, and financial analytics.
        Key Features:
        - Real-time loan processing dashboard with Angular responsive design.
        - RESTful APIs in .NET Core handling complex business logic.
        - SQL Server database with optimized queries serving high-volume transactions.
        - Azure deployment with auto-scaling and disaster recovery.
        - Azure DevOps CI/CD pipeline for automated testing and deployment.
        Impact: Improved loan processing speed by 35%, reduced errors by 50%, managed millions in transactions.
        Team Size: 8 developers, worked as senior developer.`
      },
      {
        id: 'project-ai-resume',
        title: 'AI Resume Assistant',
        source: 'Projects',
        content: `AI Resume Assistant:
        Technology Stack: Groq API, LangChain, .NET Core, Angular, Vector Embeddings.
        Description: Intelligent application that analyzes resumes using AI to extract key information and provide recommendations.
        Key Features:
        - Resume parsing and analysis using Groq LLM for fast processing.
        - Vector embedding generation for semantic understanding.
        - Skill extraction and matching against job descriptions.
        - Career recommendations based on resume analysis.
        - Real-time AI responses using Groq's API.
        Technical Highlights: 
        - Implemented RAG pipeline for document understanding.
        - Integrated Groq for 10x faster inference than traditional LLMs.
        - Built Angular UI for resume upload and analysis.
        - Created .NET backend services for processing and data management.
        Impact: Helps job seekers optimize their resumes in seconds.`
      },
      {
        id: 'project-portfolio-ai',
        title: 'AI Portfolio Chatbot',
        source: 'Projects',
        content: `AI Portfolio Chatbot (This Project):
        Technology Stack: Angular 20, Groq API, RAG Pipeline, TypeScript, TailwindCSS.
        Description: An intelligent chatbot integrated into my portfolio that uses RAG to answer questions about my background, skills, and projects.
        Key Features:
        - Multi-page portfolio showcasing experience, skills, and projects.
        - AI chatbot powered by Groq LLM.
        - RAG pipeline for retrieving relevant information.
        - Real-time responses with context-aware answers.
        - Responsive design for all devices.
        Technical Implementation:
        - Frontend-only Angular application (no backend required).
        - Document chunking and semantic retrieval.
        - Integration with Groq API for intelligent responses.
        - Local knowledge base with 10+ comprehensive documents.
        Benefits: Visitors can learn about my expertise through natural conversation.`
      }
    ];

    documents.forEach(doc => this.chunkDocument(doc));
  }

  private chunkDocument(doc: Document) {
    const words = doc.content.split(/\s+/);
    let chunkIndex = 0;
    let i = 0;

    while (i < words.length) {
      const chunkEnd = Math.min(i + this.chunkSize, words.length);
      const chunkWords = words.slice(i, chunkEnd);
      const content = chunkWords.join(' ');

      this.chunks.push({
        id: `${doc.id}-chunk-${chunkIndex}`,
        content,
        documentId: doc.id,
        title: doc.title,
        source: doc.source,
        chunkIndex
      });

      // Move forward with overlap
      i += this.chunkSize - this.overlapSize;
      chunkIndex++;
    }
  }

  /**
   * Retrieve relevant chunks based on query similarity
   */
  retrieveRelevantChunks(query: string, topK: number = 3): DocumentChunk[] {
    const scores = this.chunks.map(chunk => ({
      chunk,
      score: this.calculateSimilarity(query, chunk.content)
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(item => item.chunk);
  }

  /**
   * Simple similarity calculation based on keyword matching and TF-IDF-like approach
   */
  private calculateSimilarity(query: string, text: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const textWords = text.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    let totalWeight = 0;

    queryWords.forEach(word => {
      if (word.length > 3) {
        const count = textWords.filter(w => w.includes(word) || word.includes(w)).length;
        matchCount += count;
        totalWeight += count > 0 ? count * word.length : 0;
      }
    });

    // Normalize by text length
    const textLength = textWords.length;
    return textLength > 0 ? (matchCount * totalWeight) / textLength : 0;
  }

  /**
   * Get all chunks
   */
  getAllChunks(): DocumentChunk[] {
    return this.chunks;
  }

  /**
   * Get chunks by document ID
   */
  getChunksByDocumentId(documentId: string): DocumentChunk[] {
    return this.chunks.filter(chunk => chunk.documentId === documentId);
  }
}
