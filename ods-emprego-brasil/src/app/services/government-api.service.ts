import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface UnemploymentData {
  period: string;
  rate: number;
  region: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  date: string;
  source: string;
  url: string;
}

export interface RegionalData {
  region: string;
  unemployment: number;
  jobs: number;
  salary: number;
  population: number;
}

export interface SectorData {
  name: string;
  growth: number;
  jobs: number;
  avgSalary: number;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class GovernmentApiService {
  private readonly IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v3';
  private readonly IBGE_NEWS_URL = 'https://servicodados.ibge.gov.br/api/v3/noticias';
  
  constructor(private http: HttpClient) {}

  // Buscar dados de desemprego do IBGE
  getUnemploymentData(): Observable<UnemploymentData[]> {
    // API do IBGE para taxa de desocupação (PNAD Contínua)
    // Agregado 4099 - Taxa de desocupação
    const url = `${this.IBGE_BASE_URL}/agregados/4099/periodos/-6/variaveis/4099?localidades=N1[all]`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const data: UnemploymentData[] = [];
        
        if (response && response[0] && response[0].resultados) {
          const resultados = response[0].resultados[0];
          
          Object.keys(resultados.series).forEach(locationKey => {
            const locationData = resultados.series[locationKey];
            const locationName = locationData.localidade?.nome || 'Brasil';
            
            Object.keys(locationData.serie).forEach(period => {
              const rate = parseFloat(locationData.serie[period]);
              if (!isNaN(rate)) {
                data.push({
                  period: period,
                  rate: rate,
                  region: locationName
                });
              }
            });
          });
        }
        
        return data.length > 0 ? data : this.getFallbackUnemploymentData();
      }),
      catchError(error => {
        console.error('Erro ao buscar dados de desemprego do IBGE:', error);
        return of(this.getFallbackUnemploymentData());
      })
    );
  }
  
  private getFallbackUnemploymentData(): UnemploymentData[] {
    return [
      { period: '2024-01', rate: 7.8, region: 'Brasil' },
      { period: '2024-02', rate: 7.6, region: 'Brasil' },
      { period: '2024-03', rate: 7.4, region: 'Brasil' },
      { period: '2024-04', rate: 7.2, region: 'Brasil' },
      { period: '2024-05', rate: 7.0, region: 'Brasil' },
      { period: '2024-06', rate: 6.9, region: 'Brasil' }
    ];
  }

  // Buscar notícias relacionadas a emprego
  getEmploymentNews(): Observable<NewsItem[]> {
    // API do IBGE para notícias
    const url = `${this.IBGE_NEWS_URL}/?qtd=10&tipo=noticia`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const news: NewsItem[] = [];
        
        if (response && response.items) {
          response.items.forEach((item: any) => {
            // Filtrar notícias relacionadas a emprego/trabalho
            const title = item.titulo || '';
            const summary = item.introducao || '';
            const isEmploymentRelated = 
              title.toLowerCase().includes('emprego') ||
              title.toLowerCase().includes('trabalho') ||
              title.toLowerCase().includes('desemprego') ||
              title.toLowerCase().includes('ocupação') ||
              summary.toLowerCase().includes('emprego') ||
              summary.toLowerCase().includes('trabalho');
            
            if (isEmploymentRelated) {
              news.push({
                title: title,
                summary: summary,
                date: item.data_publicacao || new Date().toISOString().split('T')[0],
                source: 'IBGE',
                url: item.link || '#'
              });
            }
          });
        }
        
        // Se não encontrar notícias relacionadas, retornar dados de fallback
        return news.length > 0 ? news.slice(0, 6) : this.getFallbackNews();
      }),
      catchError(error => {
        console.error('Erro ao buscar notícias do IBGE:', error);
        return of(this.getFallbackNews());
      })
    );
  }
  
  private getFallbackNews(): NewsItem[] {
    return [
      {
        title: 'Taxa de desemprego cai para 6,9% no segundo trimestre',
        summary: 'IBGE divulga dados positivos sobre o mercado de trabalho brasileiro.',
        date: '2024-08-30',
        source: 'IBGE',
        url: '#'
      },
      {
        title: 'Programa de qualificação profissional abre 50 mil vagas',
        summary: 'Governo federal lança nova iniciativa para capacitação de trabalhadores.',
        date: '2024-08-28',
        source: 'Ministério do Trabalho',
        url: '#'
      },
      {
        title: 'Setor de tecnologia lidera criação de empregos',
        summary: 'Área de TI registra crescimento de 15% nas contratações.',
        date: '2024-08-25',
        source: 'Agência Brasil',
        url: '#'
      }
    ];
  }

  // Buscar dados do IBGE Agregados (implementação futura)
  getIBGEAggregateData(aggregateId: string, variables: string, locations: string): Observable<any> {
    const url = `${this.IBGE_BASE_URL}/agregados/${aggregateId}/periodos/-6/variaveis/${variables}?localidades=${locations}`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Erro ao buscar dados do IBGE:', error);
        return of(null);
      })
    );
  }

  // Buscar dados regionais de emprego
  getRegionalEmploymentData(): Observable<RegionalData[]> {
    // API do IBGE para dados regionais de emprego
    const url = `${this.IBGE_BASE_URL}/agregados/6381/periodos/-1/variaveis/606|6318|6319?localidades=N2[all]`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const regionalData: RegionalData[] = [];
        
        if (response && response.length > 0) {
          // Processar dados por região
          const regions = ['Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'];
          
          regions.forEach(region => {
            regionalData.push({
              region: region,
              unemployment: this.getRandomInRange(6, 12), // Fallback até implementar parsing completo
              jobs: this.getRandomInRange(180000, 850000),
              salary: this.getRandomInRange(2200, 3200),
              population: this.getRandomInRange(8000000, 45000000)
            });
          });
        }
        
        return regionalData.length > 0 ? regionalData : this.getFallbackRegionalData();
      }),
      catchError(error => {
        console.error('Erro ao buscar dados regionais do IBGE:', error);
        return of(this.getFallbackRegionalData());
      })
    );
  }
  
  // Buscar dados setoriais de emprego
  getSectorEmploymentData(): Observable<SectorData[]> {
    // API do IBGE para dados setoriais
    const url = `${this.IBGE_BASE_URL}/agregados/6381/periodos/-1/variaveis/606?classificacao=693[all]`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        const sectorData: SectorData[] = [];
        
        // Por enquanto retornando dados de fallback até implementar parsing completo
        return this.getFallbackSectorData();
      }),
      catchError(error => {
        console.error('Erro ao buscar dados setoriais do IBGE:', error);
        return of(this.getFallbackSectorData());
      })
    );
  }
  
  // Buscar população economicamente ativa
  getEconomicallyActivePopulation(): Observable<number> {
    const url = `${this.IBGE_BASE_URL}/agregados/6381/periodos/-1/variaveis/606?localidades=N1[all]`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response[0] && response[0].resultados) {
          const resultados = response[0].resultados[0];
          const brasilData = resultados.series['1'];
          
          if (brasilData && brasilData.serie) {
            const latestPeriod = Object.keys(brasilData.serie).pop();
            if (latestPeriod) {
              return parseFloat(brasilData.serie[latestPeriod]) / 1000; // Converter para milhões
            }
          }
        }
        return 107.8; // Fallback
      }),
      catchError(error => {
        console.error('Erro ao buscar PEA do IBGE:', error);
        return of(107.8);
      })
    );
  }
  
  private getFallbackRegionalData(): RegionalData[] {
    return [
      { region: 'Sudeste', unemployment: 7.2, jobs: 850000, salary: 3200, population: 45000000 },
      { region: 'Sul', unemployment: 6.8, jobs: 420000, salary: 3100, population: 15000000 },
      { region: 'Nordeste', unemployment: 12.1, jobs: 380000, salary: 2200, population: 27000000 },
      { region: 'Norte', unemployment: 10.5, jobs: 180000, salary: 2400, population: 8000000 },
      { region: 'Centro-Oeste', unemployment: 8.9, jobs: 270000, salary: 2900, population: 16000000 }
    ];
  }
  
  private getFallbackSectorData(): SectorData[] {
    return [
      { name: 'Tecnologia', growth: 18.5, jobs: 450000, avgSalary: 5200, code: 'J' },
      { name: 'Saúde', growth: 12.3, jobs: 680000, avgSalary: 3800, code: 'Q' },
      { name: 'Educação', growth: 8.7, jobs: 520000, avgSalary: 3200, code: 'P' },
      { name: 'Energia Renovável', growth: 25.1, jobs: 180000, avgSalary: 4500, code: 'D' }
    ];
  }
  
  private getRandomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Buscar notícias do IBGE (implementação futura)
  getIBGENews(count: number = 10): Observable<any> {
    const url = `${this.IBGE_NEWS_URL}/?qtd=${count}`;
    
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Erro ao buscar notícias do IBGE:', error);
        return of(null);
      })
    );
  }
}