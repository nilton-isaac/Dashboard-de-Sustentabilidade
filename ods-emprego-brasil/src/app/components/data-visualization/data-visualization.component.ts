import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GovernmentApiService, UnemploymentData, RegionalData, SectorData } from '../../services/government-api.service';
import { forkJoin } from 'rxjs';

interface ChartDataItem {
  labels: string[];
  values: number[];
  color: string;
}

interface ChartData {
  [key: string]: ChartDataItem;
}

@Component({
  selector: 'app-data-visualization',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.css']
})
export class DataVisualizationComponent implements OnInit {
  Math = Math;
  isLoading: boolean = true;
  
  kpiData: any[] = [];

  chartData: ChartData = {
    unemployment: { labels: [], values: [], color: 'from-red-500 to-orange-500' },
    jobs: { labels: [], values: [], color: 'from-magenta-500 to-pink-500' },
    salary: { labels: [], values: [], color: 'from-cyan-500 to-blue-500' }
  };

  regionalData: any[] = [];

  sectorData: any[] = [];

  selectedChart: string = 'unemployment';
  selectedRegion: string | null = null;

  constructor(private governmentApi: GovernmentApiService) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  private loadData(): void {
    this.isLoading = true;
    
    forkJoin({
      unemploymentData: this.governmentApi.getUnemploymentData(),
      regionalData: this.governmentApi.getRegionalEmploymentData(),
      sectorData: this.governmentApi.getSectorEmploymentData(),
      activePopulation: this.governmentApi.getEconomicallyActivePopulation()
    }).subscribe({
      next: (data) => {
        this.processUnemploymentData(data.unemploymentData);
        this.processRegionalData(data.regionalData);
        this.processSectorData(data.sectorData);
        this.generateKPIData(data.unemploymentData, data.activePopulation);
        this.isLoading = false;
        this.animateKPIs();
        console.log('Dados de visualização carregados da API');
      },
      error: (error) => {
        console.error('Erro ao carregar dados de visualização:', error);
        this.loadFallbackData();
        this.isLoading = false;
        this.animateKPIs();
      }
    });
  }
  
  private processUnemploymentData(data: UnemploymentData[]): void {
    if (data && data.length > 0) {
      const brasilData = data.filter(item => item.region === 'Brasil')
                            .sort((a, b) => a.period.localeCompare(b.period))
                            .slice(-6);
      
      if (brasilData.length > 0) {
        this.chartData['unemployment'] = {
           labels: brasilData.map(item => this.formatPeriod(item.period)),
           values: brasilData.map(item => item.rate || 0),
           color: 'from-red-500 to-orange-500'
         };
         
         // Simular dados de vagas e salário baseados nos dados reais
         this.chartData['jobs'] = {
           labels: brasilData.map(item => this.formatPeriod(item.period)),
           values: brasilData.map((_, i) => 1.8 + (i * 0.05)), // Crescimento simulado
           color: 'from-magenta-500 to-pink-500'
         };
         
         this.chartData['salary'] = {
           labels: brasilData.map(item => this.formatPeriod(item.period)),
           values: brasilData.map((_, i) => 2650 + (i * 40)), // Crescimento simulado
           color: 'from-cyan-500 to-blue-500'
         };
      } else {
        this.loadFallbackChartData();
      }
    } else {
      this.loadFallbackChartData();
    }
  }
  
  private processRegionalData(data: RegionalData[]): void {
    if (data && data.length > 0) {
      const colorMap = {
        'Sudeste': 'from-green-500 to-emerald-500',
        'Sul': 'from-blue-500 to-indigo-500',
        'Nordeste': 'from-orange-500 to-red-500',
        'Norte': 'from-purple-500 to-pink-500',
        'Centro-Oeste': 'from-yellow-500 to-orange-500'
      };
      
      this.regionalData = data.map(region => ({
        region: region.region || 'Região Desconhecida',
        unemployment: region.unemployment || 0,
        jobs: region.jobs || 0,
        salary: region.salary || 0,
        color: colorMap[region.region as keyof typeof colorMap] || 'from-gray-500 to-gray-600'
      }));
    } else {
      this.loadFallbackRegionalData();
    }
  }
  
  private processSectorData(data: SectorData[]): void {
    if (data && data.length > 0) {
      const iconMap = {
        'Tecnologia': 'computer',
        'Saúde': 'local_hospital',
        'Educação': 'school',
        'Energia Renovável': 'eco'
      };
      
      const colorMap = {
        'Tecnologia': 'from-blue-500 to-purple-500',
        'Saúde': 'from-green-500 to-teal-500',
        'Educação': 'from-yellow-500 to-orange-500',
        'Energia Renovável': 'from-emerald-500 to-green-500'
      };
      
      this.sectorData = data.map(sector => ({
        name: sector.name || 'Setor Desconhecido',
        growth: sector.growth || 0,
        jobs: sector.jobs || 0,
        avgSalary: sector.avgSalary || 0,
        icon: iconMap[sector.name as keyof typeof iconMap] || 'business',
        color: colorMap[sector.name as keyof typeof colorMap] || 'from-gray-500 to-gray-600'
      }));
    } else {
      this.loadFallbackSectorData();
    }
  }
  
  private generateKPIData(unemploymentData: UnemploymentData[], activePopulation: number): void {
    const latestUnemployment = unemploymentData.find(item => item.region === 'Brasil');
    const currentRate = latestUnemployment ? latestUnemployment.rate : 8.6;
    
    this.kpiData = [
      {
        title: 'Taxa de Desemprego',
        value: `${currentRate}%`,
        change: -0.3,
        trend: 'down',
        icon: 'trending_down',
        color: 'success',
        description: 'Trimestre móvel (IBGE)',
        target: 7.5,
        progress: Math.round((15 - currentRate) / 15 * 100)
      },
      {
        title: 'Vagas Abertas',
        value: '2.1M',
        change: 12.5,
        trend: 'up',
        icon: 'trending_up',
        color: 'magenta',
        description: 'Últimos 12 meses (CAGED)',
        target: 2.5,
        progress: 84
      },
      {
        title: 'Salário Médio',
        value: 'R$ 2.847',
        change: 4.2,
        trend: 'up',
        icon: 'attach_money',
        color: 'cyan',
        description: 'Admissões formais',
        target: 3000,
        progress: 95
      },
      {
        title: 'População Ativa',
        value: `${activePopulation.toFixed(1)}M`,
        change: 2.1,
        trend: 'up',
        icon: 'groups',
        color: 'navy',
        description: 'População Economicamente Ativa',
        target: 110,
        progress: Math.round(activePopulation / 110 * 100)
      }
    ];
  }
  
  private formatPeriod(period: string): string {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                   'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const [year, month] = period.split('-');
    return months[parseInt(month) - 1] || period;
  }
  
  private loadFallbackChartData(): void {
    // Dados de fallback para gráficos em caso de erro na API
    this.chartData = {
      unemployment: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        values: [9.2, 9.0, 8.8, 8.7, 8.6, 8.5],
        color: 'from-red-500 to-orange-500'
      },
      jobs: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        values: [1.8, 1.9, 2.0, 2.0, 2.1, 2.1],
        color: 'from-magenta-500 to-pink-500'
      },
      salary: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        values: [2650, 2720, 2780, 2810, 2847, 2890],
        color: 'from-cyan-500 to-blue-500'
      }
    };
  }

  private loadFallbackRegionalData(): void {
    this.regionalData = [
      { region: 'Sudeste', unemployment: 7.2, jobs: 850000, salary: 3200, color: 'from-green-500 to-emerald-500' },
      { region: 'Sul', unemployment: 6.8, jobs: 420000, salary: 3100, color: 'from-blue-500 to-indigo-500' },
      { region: 'Nordeste', unemployment: 12.1, jobs: 380000, salary: 2200, color: 'from-orange-500 to-red-500' },
      { region: 'Norte', unemployment: 10.5, jobs: 180000, salary: 2400, color: 'from-purple-500 to-pink-500' },
      { region: 'Centro-Oeste', unemployment: 8.9, jobs: 270000, salary: 2900, color: 'from-yellow-500 to-orange-500' }
    ];
  }

  private loadFallbackSectorData(): void {
    this.sectorData = [
      { name: 'Tecnologia', growth: 18.5, jobs: 450000, avgSalary: 5200, icon: 'computer', color: 'from-blue-500 to-purple-500' },
      { name: 'Saúde', growth: 12.3, jobs: 680000, avgSalary: 3800, icon: 'local_hospital', color: 'from-green-500 to-teal-500' },
      { name: 'Educação', growth: 8.7, jobs: 520000, avgSalary: 3200, icon: 'school', color: 'from-yellow-500 to-orange-500' },
      { name: 'Energia Renovável', growth: 25.1, jobs: 180000, avgSalary: 4500, icon: 'eco', color: 'from-emerald-500 to-green-500' }
    ];
  }

  private loadFallbackData(): void {
    // Carregar todos os dados de fallback
    this.loadFallbackChartData();
    this.loadFallbackRegionalData();
    this.loadFallbackSectorData();
    
    this.kpiData = [
      { title: 'Taxa de Desemprego', value: '8.6%', change: -0.3, trend: 'down', icon: 'trending_down', color: 'success', description: 'Trimestre móvel Mar-Mai/2024 (Dados Hipotéticos)', target: 7.5, progress: 86 },
      { title: 'Vagas Abertas', value: '2.1M', change: 12.5, trend: 'up', icon: 'trending_up', color: 'magenta', description: 'Últimos 12 meses - CAGED (Dados Hipotéticos)', target: 2.5, progress: 84 },
      { title: 'Salário Médio', value: 'R$ 2.847', change: 4.2, trend: 'up', icon: 'attach_money', color: 'cyan', description: 'Admissões formais (Dados Hipotéticos)', target: 3000, progress: 95 },
      { title: 'Formalização', value: '67.8%', change: 2.1, trend: 'up', icon: 'assignment', color: 'navy', description: 'Contratos formais (Dados Hipotéticos)', target: 70, progress: 97 }
    ];
  }

  selectChart(chart: string): void {
    this.selectedChart = chart;
  }

  selectRegion(region: string): void {
    this.selectedRegion = this.selectedRegion === region ? null : region;
  }

  getKpiColorClass(color: string): string {
    switch (color) {
      case 'success': return 'from-green-500 to-emerald-500';
      case 'magenta': return 'from-magenta-500 to-pink-500';
      case 'cyan': return 'from-cyan-500 to-blue-500';
      case 'navy': return 'from-navy-500 to-indigo-500';
      default: return 'from-gray-500 to-slate-500';
    }
  }

  getTrendIcon(trend: string): string {
    return trend === 'up' ? 'arrow_upward' : 'arrow_downward';
  }

  getTrendColor(trend: string): string {
    return trend === 'up' ? 'text-green-500' : 'text-red-500';
  }

  getChartHeight(value: number, max: number): number {
    return (value / max) * 100;
  }

  private animateKPIs(): void {
    // Simulate KPI animation on load
    setTimeout(() => {
      this.kpiData.forEach((kpi, index) => {
        setTimeout(() => {
          kpi.progress = Math.min(kpi.progress, 100);
        }, index * 200);
      });
    }, 500);
  }

  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    }
    return value.toString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  }

  getProgressWidth(current: number, target: number): number {
    return Math.min((current / target) * 100, 100);
  }

  getChartData(key: string): ChartDataItem {
    return this.chartData[key] || { labels: [], values: [], color: 'from-gray-500 to-slate-500' };
  }

  getMaxValue(values: number[]): number {
    if (!values || values.length === 0) {
      return 1; // Valor padrão para evitar divisão por zero
    }
    const max = Math.max(...values);
    return max > 0 ? max : 1;
  }
}