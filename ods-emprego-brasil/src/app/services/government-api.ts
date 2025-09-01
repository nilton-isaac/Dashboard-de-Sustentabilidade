import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GovernmentApi {

  private ibgeApiUrl = 'https://servicodados.ibge.gov.br/api/v1';
  private cageApiUrl = 'https://api.portaldatransparencia.gov.br/api-de-dados';

  constructor(private http: HttpClient) { }

  // Dados de desemprego do IBGE
  getUnemploymentData(): Observable<any> {
    return this.http.get(`${this.ibgeApiUrl}/pesquisas/indicadores/4099/resultados`);
  }

  // Dados de população economicamente ativa
  getEconomicallyActivePopulation(): Observable<any> {
    return this.http.get(`${this.ibgeApiUrl}/pesquisas/indicadores/4090/resultados`);
  }

  // Dados de rendimento médio
  getAverageIncome(): Observable<any> {
    return this.http.get(`${this.ibgeApiUrl}/pesquisas/indicadores/5434/resultados`);
  }

  // Simulação de dados de notícias de emprego (API fictícia)
  getJobNews(): Observable<any> {
    // Em um cenário real, isso seria uma API do governo ou parceira
    const mockNews = [
      {
        title: 'Programa Jovem Aprendiz abre 10 mil vagas em todo o país',
        description: 'Ministério do Trabalho anuncia novas oportunidades para jovens de 14 a 24 anos',
        date: '2024-01-15',
        source: 'Ministério do Trabalho'
      },
      {
        title: 'Setor de tecnologia registra crescimento de 15% em contratações',
        description: 'Área de desenvolvimento de software lidera criação de novos postos de trabalho',
        date: '2024-01-10',
        source: 'IBGE'
      },
      {
        title: 'Programa de qualificação profissional beneficia 50 mil trabalhadores',
        description: 'Cursos gratuitos em parceria com SENAI e SENAC ampliam oportunidades',
        date: '2024-01-08',
        source: 'Ministério da Educação'
      }
    ];
    
    return new Observable(observer => {
      observer.next(mockNews);
      observer.complete();
    });
  }

  // Dados de áreas emergentes no mercado de trabalho
  getEmergingAreas(): Observable<any> {
    const emergingAreas = [
      {
        area: 'Tecnologia da Informação',
        growth: '+25%',
        averageSalary: 'R$ 8.500',
        description: 'Desenvolvimento de software, análise de dados, cibersegurança',
        skills: ['Programação', 'Análise de Dados', 'Cloud Computing']
      },
      {
        area: 'Saúde Digital',
        growth: '+18%',
        averageSalary: 'R$ 7.200',
        description: 'Telemedicina, análise de dados médicos, biotecnologia',
        skills: ['Telemedicina', 'Bioinformática', 'Gestão Hospitalar']
      },
      {
        area: 'Sustentabilidade',
        growth: '+22%',
        averageSalary: 'R$ 6.800',
        description: 'Energia renovável, gestão ambiental, economia circular',
        skills: ['Gestão Ambiental', 'Energia Solar', 'ESG']
      }
    ];
    
    return new Observable(observer => {
      observer.next(emergingAreas);
      observer.complete();
    });
  }
}
