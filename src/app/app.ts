import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
isMenuOpen = false;
currentYear = new Date().getFullYear();

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }
}
