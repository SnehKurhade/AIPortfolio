import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;
  shouldScroll = false;
  showApiKeyInput = false;
  apiKeyInput = '';
  isGroqConfigured = false;
  displayedText = '';

  exampleQuestions = [
    'Tell me about Sneh',
    'What are his strongest skills?',
    'Show me Angular projects',
    'Explain his RAG experience',
    'Does he know Azure?',
    'What AI projects has Sneh built?'
  ];

  constructor(private aiChatService: AiChatService) {}

  ngOnInit() {
    // Check if Groq is already configured
    this.isGroqConfigured = this.aiChatService.isGroqConfigured();

    // Welcome message
    const welcomeMsg = this.isGroqConfigured
      ? "Hi! I'm AI Sneh, powered by Groq AI. Ask me anything about my experience, skills, projects, or background!"
      : "Hi! I'm AI Sneh. I can provide responses locally, or you can configure my Groq API key for faster, more intelligent answers. Ask me anything!";

    this.messages.push({
      role: 'assistant',
      content: welcomeMsg
    });
  }
  

animateText(text: string) {
  this.displayedText = '';

  let index = 0;

  const interval = setInterval(() => {
    this.displayedText += text.charAt(index);
    index++;

    if (index >= text.length) {
      clearInterval(interval);
    }
  }, 20); // typing speed in ms
}

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  /**
   * Toggle API key input visibility
   */
  toggleApiKeyInput() {
    this.showApiKeyInput = !this.showApiKeyInput;
    if (!this.showApiKeyInput) {
      this.apiKeyInput = '';
    }
  }

  /**
   * Configure Groq API key
   */
  configureApiKey() {
    if (this.apiKeyInput.trim()) {
      this.aiChatService.setGroqApiKey(this.apiKeyInput.trim());
      this.isGroqConfigured = true;
      this.showApiKeyInput = false;
      this.apiKeyInput = '';

      // Add confirmation message
      this.messages.push({
        role: 'assistant',
        content: "✅ Groq API configured successfully! I'll now use Groq for faster, more intelligent responses."
      });
      this.shouldScroll = true;
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({
      role: 'user',
      content: this.userInput
    });

    const userMessage = this.userInput;
    this.userInput = '';
    this.loading = true;
    this.shouldScroll = true;

    // Get AI response
    this.aiChatService.chat(userMessage).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.answer
        });
        this.loading = false;
        this.shouldScroll = true;
      },
      error: (error) => {
        console.error('Error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        });
        this.loading = false;
        this.shouldScroll = true;
      }
    });
  }

  askQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
