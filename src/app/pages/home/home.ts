import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  codeSnippet = `const developer = {
  name: 'Sneh',
  skills: ['Angular', 'Azure', 'AI'],
  status: 'Building awesome stuff'
};

await developer.initialize();
// System ready. Awaiting connection...`;
}
