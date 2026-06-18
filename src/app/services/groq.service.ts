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
  private apiKey: string = '';
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private model = 'llama-3.1-8b-instant'; // Fast and capable model

  constructor(private http: HttpClient) {
    // Initialize API key (in production, this should come from environment variables)
    this.apiKey = this.getApiKey();
  }

  /**
   * Get API key from localStorage or environment
   */
  private getApiKey(): string {
    // First try to get from localStorage (set by user)
    const stored = localStorage.getItem('groq_api_key');
    if (stored) {
      return stored;
    }

    // In production, this would come from environment
    // For now, return empty and rely on user providing it
    return '';
  }

  /**
   * Set the API key (can be called from UI to configure)
   */
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('groq_api_key', key);
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Send a message to Groq API
   */
  chat(
    messages: GroqMessage[],
    temperature: number = 0.7,
    maxTokens: number = 1024
  ): Observable<string> {
    if (!this.isConfigured()) {
      return of('API key not configured. Please set your Groq API key.');
    }

    const requestBody: GroqRequestBody = {
      messages,
      model: this.model,
      temperature,
      max_tokens: maxTokens,
      top_p: 1
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<GroqResponse>(this.apiUrl, requestBody, { headers }).pipe(
      map(response => {
        if (response.choices && response.choices.length > 0) {
          return response.choices[0].message.content;
        }
        return 'No response received from Groq API';
      }),
      catchError(error => {
        console.error('Groq API Error:', error);
        
        // Fallback response if API fails
        if (error.status === 401) {
          return of('Invalid API key. Please check your Groq API key configuration.');
        } else if (error.status === 429) {
          return of('Rate limit exceeded. Please try again in a moment.');
        } else if (error.status === 500) {
          return of('Groq API is experiencing issues. Please try again later.');
        }
        
        return of('Error communicating with Groq API. Please try again.');
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
    return [    // Fast, capable
      'llama2-70b-4096',        // Larger, more capable
      'gemma-7b-it'             // Faster, smaller
    ];
  }
}
