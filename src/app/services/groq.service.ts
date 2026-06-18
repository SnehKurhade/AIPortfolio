import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqRequestBody {
  messages: GroqMessage[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private model = 'llama-3.1-8b-instant'; // Fast and capable model

  constructor(private http: HttpClient) {
  }

  /**
   * Send a message to Groq API
   */
 chat(
  messages: GroqMessage[],
  temperature: number = 0.7,
  maxTokens: number = 1024
): Observable<string> {

  return this.http.post<any>(
    '/api/chat',
    {
      messages,
      temperature,
      maxTokens
    }
  ).pipe(
    map(response => response.content),
    catchError(error => {
      console.error(error);
      return of('Error communicating with AI service.');
    })
  );
}

  /**
   * Generate a response with system prompt and context
   */
  generateWithContext(
    userQuery: string,
    context: string,
    systemPrompt: string = ''
  ): Observable<string> {
    const defaultSystemPrompt = `You are an AI assistant helping visitors learn about Sneh Kurhade, a Full Stack Developer with expertise in Angular, .NET, Azure, and AI/LLM technologies.
You have access to specific information about Sneh's experience, projects, and skills.
Provide accurate, helpful, and conversational responses based on the provided context.
If the context doesn't contain relevant information, acknowledge it and provide general knowledge about the topic if possible.`;

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: systemPrompt || defaultSystemPrompt
      },
      {
        role: 'user',
        content: `Context information:\n${context}\n\nUser question: ${userQuery}`
      }
    ];

    return this.chat(messages, 0.7, 1024);
  }

  /**
   * Get model information
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Set model (for switching between Groq models)
   */
  setModel(model: string) {
    this.model = model;
  }

  /**
   * List of available Groq models for this service
   */
  getAvailableModels(): string[] {
    return [ 
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'deepseek-r1-distill-llama-70b'
    ]
}}
