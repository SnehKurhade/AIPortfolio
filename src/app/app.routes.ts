import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ProjectsComponent } from './pages/projects/projects';
import { SkillsComponent } from './pages/skills/skills';
import { ExperienceComponent } from './pages/experience/experience';
import { AiChatComponent } from './pages/ai-chat/ai-chat';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'chat', component: AiChatComponent },
  { path: '**', redirectTo: 'home' }
];
