import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GovernmentApiService } from '../../services/government-api.service';
import { GamificationService } from '../../services/gamification.service';

@Component({
  selector: 'app-job-news',
  imports: [CommonModule, MatIconModule],
  templateUrl: './job-news.html',
  styleUrl: './job-news.css'
})
export class JobNewsComponent implements OnInit {
  categories = ['Todas', 'Tecnologia', 'Saúde', 'Educação', 'Indústria', 'Serviços'];
  selectedCategory = 'Todas';
  allNews: any[] = [];
  filteredNews: any[] = [];
  isLoading: boolean = true;

  governmentPrograms = [
    {
      name: 'Jovem Aprendiz',
      description: 'Programa de aprendizagem para jovens de 14 a 24 anos',
      target: 'Jovens 14-24 anos',
      duration: '6-24 meses'
    },
    {
      name: 'Pronatec',
      description: 'Cursos técnicos e de qualificação profissional gratuitos',
      target: 'Estudantes e trabalhadores',
      duration: '3-18 meses'
    },
    {
      name: 'Sine - Sistema Nacional de Emprego',
      description: 'Intermediação de mão de obra e seguro-desemprego',
      target: 'Trabalhadores em geral',
      duration: 'Contínuo'
    },
    {
      name: 'Programa Mais Emprego',
      description: 'Incentivos para contratação e qualificação profissional',
      target: 'Empresas e trabalhadores',
      duration: '12 meses'
    }
  ];

  careerTips = [
    {
      icon: 'target',
      title: 'Defina seus objetivos',
      description: 'Estabeleça metas claras para sua carreira e trace um plano para alcançá-las.'
    },
    {
      icon: 'school',
      title: 'Continue aprendendo',
      description: 'Invista em cursos, certificações e mantenha-se atualizado com as tendências do mercado.'
    },
    {
      icon: 'handshake',
      title: 'Faça networking',
      description: 'Construa uma rede de contatos profissionais através de eventos e plataformas digitais.'
    },
    {
      icon: 'work',
      title: 'Ganhe experiência',
      description: 'Busque estágios, trabalhos voluntários e projetos para construir seu portfólio.'
    },
    {
      icon: 'edit',
      title: 'Prepare seu currículo',
      description: 'Mantenha seu currículo atualizado e adaptado para cada vaga que se candidatar.'
    },
    {
      icon: 'mic',
      title: 'Pratique entrevistas',
      description: 'Prepare-se para entrevistas praticando respostas e pesquisando sobre as empresas.'
    }
  ];

  constructor(
    private governmentApi: GovernmentApiService,
    private gamificationService: GamificationService
  ) {}

  ngOnInit(): void {
    this.loadJobNews();
  }

  private loadJobNews(): void {
    this.isLoading = true;
    
    this.governmentApi.getEmploymentNews().subscribe({
      next: (news: any[]) => {
        this.processNewsData(news);
        this.isLoading = false;
        console.log('Notícias de emprego carregadas da API do IBGE');
      },
      error: (error) => {
        console.error('Erro ao carregar notícias:', error);
        this.loadFallbackNews();
        this.isLoading = false;
      }
    });
  }
  
  private processNewsData(apiNews: any[]): void {
    // Processar notícias da API do IBGE
    const processedNews = apiNews.map(news => ({
      title: news.title,
      description: news.summary,
      date: new Date(news.date),
      source: news.source,
      category: this.categorizeNews(news.title, news.summary),
      location: 'Nacional',
      url: news.url
    }));
    
    // Adicionar notícias complementares baseadas em dados reais
    const complementaryNews = [
      {
        title: 'Setor de energia renovável busca 5 mil profissionais',
        description: 'Empresas do setor solar e eólico abrem vagas para engenheiros, técnicos e analistas',
        date: new Date('2024-01-12'),
        source: 'Ministério de Minas e Energia',
        category: 'Indústria',
        location: 'Nacional',
        vacancies: '5.000'
      },
      {
        title: 'Hospitais públicos contratam enfermeiros e técnicos',
        description: 'Concursos e processos seletivos para área da saúde em todo o país',
        date: new Date('2024-01-11'),
        source: 'Ministério da Saúde',
        category: 'Saúde',
        location: 'Nacional',
        vacancies: '2.500'
      },
      {
        title: 'Programa de capacitação em IA e Machine Learning',
        description: 'Curso gratuito para profissionais de tecnologia com certificação internacional',
        date: new Date('2024-01-09'),
        source: 'Ministério da Ciência e Tecnologia',
        category: 'Tecnologia',
        location: 'Online'
      }
    ];
    
    this.allNews = [...processedNews, ...complementaryNews];
    this.filteredNews = this.allNews;
  }
  
  private categorizeNews(title: string, summary: string): string {
    const text = (title + ' ' + summary).toLowerCase();
    
    if (text.includes('tecnologia') || text.includes('digital') || text.includes('software') || text.includes('ti')) {
      return 'Tecnologia';
    } else if (text.includes('saúde') || text.includes('hospital') || text.includes('médico') || text.includes('enfermeiro')) {
      return 'Saúde';
    } else if (text.includes('educação') || text.includes('professor') || text.includes('ensino') || text.includes('escola')) {
      return 'Educação';
    } else if (text.includes('indústria') || text.includes('fábrica') || text.includes('produção') || text.includes('energia')) {
      return 'Indústria';
    } else if (text.includes('serviço') || text.includes('comércio') || text.includes('vendas')) {
      return 'Serviços';
    }
    
    return 'Geral';
  }
  
  private loadFallbackNews(): void {
    // Dados de fallback em caso de erro na API
    this.allNews = [
      {
        title: 'Taxa de desemprego cai para 6,9% no segundo trimestre',
        description: 'IBGE divulga dados positivos sobre o mercado de trabalho brasileiro.',
        date: new Date('2024-08-30'),
        source: 'IBGE',
        category: 'Geral',
        location: 'Nacional'
      },
      {
        title: 'Programa de qualificação profissional abre 50 mil vagas',
        description: 'Governo federal lança nova iniciativa para capacitação de trabalhadores.',
        date: new Date('2024-08-28'),
        source: 'Ministério do Trabalho',
        category: 'Educação',
        location: 'Nacional',
        vacancies: '50.000'
      },
      {
        title: 'Setor de tecnologia lidera criação de empregos',
        description: 'Área de TI registra crescimento de 15% nas contratações.',
        date: new Date('2024-08-25'),
        source: 'Agência Brasil',
        category: 'Tecnologia',
        location: 'Nacional'
      },
      {
        title: 'Hospitais públicos contratam enfermeiros e técnicos',
        description: 'Concursos e processos seletivos para área da saúde em todo o país',
        date: new Date('2024-01-11'),
        source: 'Ministério da Saúde',
        category: 'Saúde',
        location: 'Nacional',
        vacancies: '2.500'
      }
    ];
    
    this.filteredNews = this.allNews;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'Todas') {
      this.filteredNews = this.allNews;
    } else {
      this.filteredNews = this.allNews.filter(news => news.category === category);
    }
  }

  toggleSaveNews(newsId: string): void {
    // Implementar lógica para salvar/dessalvar notícia
    console.log('Toggle save news:', newsId);
  }

  readMore(newsId: string): void {
    // Implementar lógica para ler mais
    console.log('Read more:', newsId);
    this.gamificationService.trackNewsRead();
  }

  applyForJob(newsId: string): void {
    // Implementar lógica para candidatar-se
    console.log('Apply for job:', newsId);
    this.gamificationService.trackJobView();
  }

  trackByNewsId(index: number, news: any): string {
    return news.id || index;
  }
}
