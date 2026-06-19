import { Injectable } from "@angular/core";
import { ChatMessage } from "./ai-chat.service";

@Injectable({
  providedIn: 'root'
})

export class ChatStateService {

  messages: ChatMessage[] = [];

}