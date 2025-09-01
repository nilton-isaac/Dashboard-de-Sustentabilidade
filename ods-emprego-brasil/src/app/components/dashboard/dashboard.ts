import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataVisualizationComponent } from '../data-visualization/data-visualization.component';
import { JobNewsComponent } from '../job-news/job-news';
import { CareerMindmapComponent } from '../career-mindmap/career-mindmap';
import { CostBenefitAnalysisComponent } from '../cost-benefit-analysis/cost-benefit-analysis';
import { GamificationComponent } from '../gamification/gamification.component';
import { GamificationService } from '../../services/gamification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DataVisualizationComponent,
    JobNewsComponent,
    CareerMindmapComponent,
    CostBenefitAnalysisComponent,
    GamificationComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private gamificationService: GamificationService) {}

  trackJobView(): void {
    this.gamificationService.trackJobView();
  }

  trackNewsRead(): void {
    this.gamificationService.trackNewsRead();
  }

  trackStatsView(): void {
    this.gamificationService.trackStatsView();
  }

  // Métodos para os botões do dashboard
  onViewUnemploymentData(): void {
    this.trackStatsView();
    // Navegar para a aba de dados de desemprego
    this.scrollToSection('unemployment-stats');
  }

  onExploreOpportunities(): void {
    this.trackJobView();
    // Navegar para a seção de notícias e oportunidades
    this.scrollToSection('job-news');
  }

  onDiscoverCareerPaths(): void {
    this.gamificationService.trackCareerExploration();
    // Navegar para a seção de mapas de carreira
    this.scrollToSection('career-mindmap');
  }

  onViewAllOccupations(): void {
    this.trackStatsView();
    // Expandir ou navegar para lista completa de ocupações
    this.scrollToSection('data-visualization');
  }

  private scrollToSection(sectionId: string): void {
    const element = document.querySelector(`app-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
