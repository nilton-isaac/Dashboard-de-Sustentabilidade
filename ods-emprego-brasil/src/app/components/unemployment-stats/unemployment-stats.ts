import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovernmentApiService, UnemploymentData, RegionalData } from '../../services/government-api.service';
import { GamificationService } from '../../services/gamification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-unemployment-stats',
  imports: [CommonModule],
  templateUrl: './unemployment-stats.html',
  styleUrl: './unemployment-stats.css'
})
export class UnemploymentStatsComponent implements OnInit {
  currentUnemploymentRate: number = 8.2;
  economicallyActivePopulation: number = 107.8;
  averageIncome: number = 2850;
  lastUpdateDate: string = 'Janeiro 2024';
  maxRate: number = 15;
  maxRegionalRate: number = 15;
  isLoading: boolean = true;

  unemploymentHistory: { month: string, rate: number }[] = [];
  regionalData: { name: string, rate: number, change: string }[] = [];

  constructor(
    private governmentApi: GovernmentApiService,
    private gamificationService: GamificationService
  ) {}

  ngOnInit(): void {
    this.loadUnemploymentData();
    this.gamificationService.trackStatsView();
  }

  // Helper function para calcular diferença absoluta
  getAbsDifference(value: number, reference: number): number {
    return Math.abs(value - reference);
  }

  private loadUnemploymentData(): void {
    this.isLoading = true;
    
    // Carregar dados de múltiplas APIs em paralelo
    forkJoin({
      unemploymentData: this.governmentApi.getUnemploymentData(),
      regionalData: this.governmentApi.getRegionalEmploymentData(),
      activePopulation: this.governmentApi.getEconomicallyActivePopulation()
    }).subscribe({
      next: (data) => {
        this.processUnemploymentData(data.unemploymentData);
        this.processRegionalData(data.regionalData);
        this.economicallyActivePopulation = data.activePopulation;
        this.isLoading = false;
        console.log('Dados reais carregados da API do IBGE');
      },
      error: (error) => {
        console.error('Erro ao carregar dados:', error);
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }
  
  private processUnemploymentData(data: UnemploymentData[]): void {
    if (data && data.length > 0) {
      // Filtrar dados do Brasil e ordenar por período
      const brasilData = data.filter(item => item.region === 'Brasil')
                            .sort((a, b) => a.period.localeCompare(b.period));
      
      if (brasilData.length > 0) {
        // Pegar a taxa mais recente
        this.currentUnemploymentRate = brasilData[brasilData.length - 1].rate;
        
        // Converter para histórico mensal
        this.unemploymentHistory = brasilData.slice(-12).map(item => ({
          month: this.formatPeriod(item.period),
          rate: item.rate
        }));
        
        // Atualizar data da última atualização
        this.lastUpdateDate = this.formatUpdateDate(brasilData[brasilData.length - 1].period);
      }
    }
  }
  
  private processRegionalData(data: RegionalData[]): void {
    if (data && data.length > 0) {
      this.regionalData = data.map(region => ({
        name: region.region,
        rate: region.unemployment,
        change: this.calculateChange(region.unemployment)
      }));
    }
  }
  
  private formatPeriod(period: string): string {
    // Converter formato YYYY-MM para nome do mês
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const [year, month] = period.split('-');
    return months[parseInt(month) - 1] || period;
  }
  
  private formatUpdateDate(period: string): string {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const [year, month] = period.split('-');
    return `${months[parseInt(month) - 1]} ${year}`;
  }
  
  private calculateChange(currentRate: number): string {
    // Simular mudança baseada na taxa atual
    const change = (Math.random() - 0.5) * 1.0; // Variação de -0.5 a +0.5
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}`;
  }
  
  private loadFallbackData(): void {
    // Dados de fallback em caso de erro na API
    this.unemploymentHistory = [
      { month: 'Jan', rate: 8.2 }, { month: 'Fev', rate: 8.0 },
      { month: 'Mar', rate: 8.5 }, { month: 'Abr', rate: 8.8 },
      { month: 'Mai', rate: 8.3 }, { month: 'Jun', rate: 8.1 },
      { month: 'Jul', rate: 7.9 }, { month: 'Ago', rate: 8.4 },
      { month: 'Set', rate: 8.6 }, { month: 'Out', rate: 8.2 },
      { month: 'Nov', rate: 7.8 }, { month: 'Dez', rate: 8.0 }
    ];
    
    this.regionalData = [
      { name: 'Norte', rate: 9.8, change: '+0.3' },
      { name: 'Nordeste', rate: 11.2, change: '+0.5' },
      { name: 'Sudeste', rate: 7.1, change: '-0.2' },
      { name: 'Sul', rate: 5.9, change: '-0.4' },
      { name: 'Centro-Oeste', rate: 6.8, change: '+0.1' }
    ];
  }
}
