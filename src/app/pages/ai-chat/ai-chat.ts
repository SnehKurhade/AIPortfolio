import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, Input } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';
import { ChatStateService } from '../../services/chat.state.service';
@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf],
  templateUrl: './ai-chat.html',
  styleUrl: './ai-chat.css'
})
export class AiChatComponent implements OnInit, AfterViewChecked, ChatStateService {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @Input() isWidget = false;
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;
  shouldScroll = false;
  displayedText = '';

  exampleQuestions = [
    'Tell me about Sneh',
    'What are his strongest skills?',
    'Show me Angular projects',
    'Explain his RAG experience',
    'Does he know Azure?',
    'What AI projects has Sneh built?'
  ];

  constructor(
    private aiChatService: AiChatService,
    public chatState: ChatStateService
  ) { }

  ngOnInit() {
    const welcomeMsg =
      "Hi! I'm Sneh.AI Ask me anything about my experience, projects, skills, or AI engineering journey.";

    if (this.chatState.messages.length === 0) {
      this.chatState.messages.push({
        role: 'assistant',
        content: welcomeMsg
      });
    }
    this.messages = this.chatState.messages;
    this.animateText(welcomeMsg);
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

ngAfterViewInit() {
  if (this.isWidget && this.messages.length > 1) {
    this.shouldScroll = true;
  }
}

ngAfterViewChecked() {
  if (this.shouldScroll) {
    this.scrollToBottom();
    this.shouldScroll = false;
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
  setTimeout(() => {
    if (this.messagesContainer?.nativeElement) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }, 50);
}
}
