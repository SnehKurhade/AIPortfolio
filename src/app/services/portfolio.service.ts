import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  highlights: string[];
  image?: string;
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  achievements: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  
  private projects: Project[] = [
    {
      id: '1',
      title: 'Enterprise Lending Platform',
      description: 'Full-stack lending platform built with Angular and .NET Core. Implemented responsive UI, REST APIs, and Azure deployments.',
      technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure'],
      highlights: [
        'Responsive platform with modern UI',
        'RESTful APIs for backend operations',
        'Azure cloud deployments',
        'Performance optimization'
      ]
    },
    {
      id: '2',
      title: 'Battleship UI',
      description: 'A multiplayer and single-player Battleship game UI built purely in vanilla JS to improve rendering time. Features real-time gameplay, responsive design, and interactive animations.',
      technologies: ['html', 'css', 'JavaScript'],
      highlights: [
        'Multiplayer and single-player modes',
        'Responsive design for all devices',
        'Interactive animations using SVGs',
        'Optimized rendering for smooth gameplay'
      ]
    },
    {
      id: '3',
      title: 'AI Portfolio Chatbot',
      description: 'Intelligent chatbot that knows everything about your portfolio, experience, and skills.',
      technologies: ['RAG', 'Vector Databases', 'Groq', 'Angular', '.NET'],
      highlights: [
        'Knows your resume and projects',
        'Answers career-related questions',
        'Provides skill-based recommendations',
        'Showcases your expertise'
      ]
    }
  ];

  private skillCategories: SkillCategory[] = [
    {
      category: 'Frontend',
      skills: ['Angular', 'AngularJS', 'React', 'TypeScript', 'JavaScript', 'HTML/CSS']
    },
    {
      category: 'Backend',
      skills: ['C#', '.NET Core', 'ASP.NET MVC', 'REST APIs', 'Entity Framework']
    },
    {
      category: 'Database',
      skills: ['SQL Server', 'Stored Procedures', 'Query Optimization', 'Entity Framework']
    },
    {
      category: 'AI/ML',
      skills: ['OpenAI', 'Groq', 'RAG', 'Vector Databases', 'Prompt Engineering', 'MCP', 'GitHub Copilot']
    },
    {
      category: 'Cloud',
      skills: ['Azure', 'AWS', 'Azure DevOps']
    },
    {
      category: 'Tools',
      skills: ['Git', 'GitHub', 'Docker', 'NUnit Testing']
    }
  ];

  private experiences: Experience[] = [
    {
      id: '1',
      company: 'Nihilent',
      position: 'Full Stack Developer',
      period: '2022 - Present',
      achievements: [
        'Built lending platform for Nedbank',
        'Led AngularJS → Angular migration',
        'Managed Azure deployments',
        'Developed AI chatbot backend',
        'Implemented RAG pipeline',
        'Created NUnit tests',
        'Integrated MCP workflows'
      ]
    },
     {
      id: '2',
      company: 'SPPU',
      position: 'Batchelor of Engineering',
      period: '2018 - 2022',
      achievements: [
      
      ]
    }
  ];

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getSkills(): Observable<SkillCategory[]> {
    return of(this.skillCategories);
  }

  getExperience(): Observable<Experience[]> {
    return of(this.experiences);
  }
}
