import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface AreaCosts {
  education: number;
  materials: number;
  certifications: number;
}

interface AreaSalary {
  initial: number;
  growthRate: number; // % anual
}

interface QualitativeFactors {
  stability: number; // 1-5
  growth: number; // 1-5
  flexibility: number; // 1-5
}

interface CareerArea {
  id: string;
  name: string;
  category: string;
  icon: string;
  costs: AreaCosts;
  salary: AreaSalary;
  qualitative: QualitativeFactors;
  educationLevel: string[];
}

interface InvestmentTip {
  title: string;
  description: string;
}

@Component({
  selector: 'app-cost-benefit-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './cost-benefit-analysis.html',
  styleUrl: './cost-benefit-analysis.css'
})
export class CostBenefitAnalysisComponent implements OnInit {
  selectedTimeframe: number = 10;
  selectedEducationLevel: string = 'all';
  Math = Math;

  careerAreas: CareerArea[] = [
    {
      id: 'tech-dev',
      name: 'Desenvolvimento de Software',
      category: 'Tecnologia',
      icon: 'computer',
      costs: {
        education: 80000,
        materials: 15000,
        certifications: 8000
      },
      salary: {
        initial: 4500,
        growthRate: 12
      },
      qualitative: {
        stability: 4,
        growth: 5,
        flexibility: 5
      },
      educationLevel: ['undergraduate', 'technical']
    },
    {
      id: 'health-nursing',
      name: 'Enfermagem',
      category: 'Saúde',
      icon: 'medical_services',
      costs: {
        education: 120000,
        materials: 5000,
        certifications: 3000
      },
      salary: {
        initial: 3800,
        growthRate: 8
      },
      qualitative: {
        stability: 5,
        growth: 4,
        flexibility: 3
      },
      educationLevel: ['undergraduate']
    },
    {
      id: 'health-medicine',
      name: 'Medicina',
      category: 'Saúde',
      icon: 'medical_services',
      costs: {
        education: 400000,
        materials: 20000,
        certifications: 15000
      },
      salary: {
        initial: 12000,
        growthRate: 10
      },
      qualitative: {
        stability: 5,
        growth: 4,
        flexibility: 2
      },
      educationLevel: ['undergraduate', 'graduate']
    },
    {
      id: 'tech-data',
      name: 'Ciência de Dados',
      category: 'Tecnologia',
      icon: 'bar_chart',
      costs: {
        education: 90000,
        materials: 12000,
        certifications: 10000
      },
      salary: {
        initial: 6500,
        growthRate: 15
      },
      qualitative: {
        stability: 4,
        growth: 5,
        flexibility: 4
      },
      educationLevel: ['undergraduate', 'graduate']
    },
    {
      id: 'sustain-renewable',
      name: 'Energia Renovável',
      category: 'Sustentabilidade',
      icon: 'eco',
      costs: {
        education: 100000,
        materials: 25000,
        certifications: 12000
      },
      salary: {
        initial: 5500,
        growthRate: 11
      },
      qualitative: {
        stability: 3,
        growth: 5,
        flexibility: 3
      },
      educationLevel: ['undergraduate', 'technical']
    },
    {
      id: 'tech-cyber',
      name: 'Cibersegurança',
      category: 'Tecnologia',
      icon: 'security',
      costs: {
        education: 85000,
        materials: 18000,
        certifications: 15000
      },
      salary: {
        initial: 7000,
        growthRate: 13
      },
      qualitative: {
        stability: 5,
        growth: 5,
        flexibility: 4
      },
      educationLevel: ['undergraduate', 'technical']
    }
  ];

  investmentTips: InvestmentTip[] = [
    {
      title: 'Comece com Cursos Gratuitos',
      description: 'Explore plataformas como Coursera, edX e YouTube para validar seu interesse antes de investir em formação formal.'
    },
    {
      title: 'Busque Bolsas e Financiamentos',
      description: 'Pesquise programas como FIES, ProUni, e bolsas de empresas privadas para reduzir custos educacionais.'
    },
    {
      title: 'Invista em Networking',
      description: 'Participe de eventos, meetups e comunidades online. Conexões podem acelerar sua carreira significativamente.'
    },
    {
      title: 'Mantenha-se Atualizado',
      description: 'Invista continuamente em certificações e cursos para manter-se competitivo no mercado.'
    }
  ];

  ngOnInit(): void {
    // Componente inicializado
  }

  get filteredAreas(): CareerArea[] {
    if (this.selectedEducationLevel === 'all') {
      return this.careerAreas;
    }
    return this.careerAreas.filter(area => 
      area.educationLevel.includes(this.selectedEducationLevel)
    );
  }

  get maxROI(): number {
    return Math.max(...this.filteredAreas.map(area => this.getROI(area)));
  }

  getTotalCost(area: CareerArea): number {
    return area.costs.education + area.costs.materials + area.costs.certifications;
  }

  getProjectedSalary(area: CareerArea): number {
    return area.salary.initial * Math.pow(1 + area.salary.growthRate / 100, this.selectedTimeframe);
  }

  getTotalEarnings(area: CareerArea): number {
    let totalEarnings = 0;
    let currentSalary = area.salary.initial;
    
    for (let year = 0; year < this.selectedTimeframe; year++) {
      totalEarnings += currentSalary * 12; // 12 meses
      currentSalary *= (1 + area.salary.growthRate / 100);
    }
    
    return totalEarnings;
  }

  getROI(area: CareerArea): number {
    const totalCost = this.getTotalCost(area);
    const totalEarnings = this.getTotalEarnings(area);
    const netProfit = totalEarnings - totalCost;
    
    return (netProfit / totalCost) * 100;
  }

  getPaybackTime(area: CareerArea): number {
    const totalCost = this.getTotalCost(area);
    const monthlySalary = area.salary.initial;
    
    return Math.round((totalCost / (monthlySalary * 12)) * 10) / 10;
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getRecommendation(area: CareerArea): string {
    const roi = this.getROI(area);
    const payback = this.getPaybackTime(area);
    
    if (roi > 500 && payback < 3) {
      return 'Altamente Recomendado';
    } else if (roi > 300 && payback < 5) {
      return 'Recomendado';
    } else if (roi > 100) {
      return 'Moderadamente Recomendado';
    } else {
      return 'Considere Outras Opções';
    }
  }

  getRecommendationClass(area: CareerArea): string {
    const recommendation = this.getRecommendation(area);
    
    switch (recommendation) {
      case 'Altamente Recomendado':
        return 'bg-green-100 text-green-800';
      case 'Recomendado':
        return 'bg-blue-100 text-blue-800';
      case 'Moderadamente Recomendado':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  }
}
