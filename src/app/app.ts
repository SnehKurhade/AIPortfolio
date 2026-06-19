import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
import { AiChatComponent } from './pages/ai-chat/ai-chat';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, AiChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

isMenuOpen = false;
chatOpen = false;
currentYear = new Date().getFullYear();
 showChatWidget = true;

 constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        this.showChatWidget =
          this.router.url !== '/chat';

      });
  }

  toggleWidget() {
    this.chatOpen = !this.chatOpen;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  

}
