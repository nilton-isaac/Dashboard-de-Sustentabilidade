import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GamificationService } from '../../services/gamification.service';

@Component({
  selector: 'app-career-mindmap',
  imports: [CommonModule, MatIconModule],
  templateUrl: './career-mindmap.html',
  styleUrl: './career-mindmap.css'
})
export class CareerMindmapComponent implements OnInit {
  selectedArea: any = null;

  constructor(private gamificationService: GamificationService) {}

  ngOnInit(): void {
    // Track career planning view
  }

  careerAreas = [
    {
      name: 'Tecnologia',
      icon: 'computer',
      description: 'Desenvolvimento, análise de dados, cibersegurança',
      careerPaths: [
        {
          title: 'Desenvolvimento de Software',
          description: 'Criação de aplicações web, mobile e desktop',
          levels: [
            { position: 'Júnior', salary: 'R$ 3.500-5.500' },
            { position: 'Pleno', salary: 'R$ 6.000-9.000' },
            { position: 'Sênior', salary: 'R$ 10.000-15.000' }
          ],
          skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git']
        },
        {
          title: 'Ciência de Dados',
          description: 'Análise e interpretação de grandes volumes de dados',
          levels: [
            { position: 'Analista Jr', salary: 'R$ 4.000-6.000' },
            { position: 'Cientista Pl', salary: 'R$ 7.000-11.000' },
            { position: 'Lead Data', salary: 'R$ 12.000-18.000' }
          ],
          skills: ['Python', 'SQL', 'Machine Learning', 'Estatística', 'Tableau']
        },
        {
          title: 'Cibersegurança',
          description: 'Proteção de sistemas e dados contra ameaças',
          levels: [
            { position: 'Analista Jr', salary: 'R$ 4.500-6.500' },
            { position: 'Especialista', salary: 'R$ 8.000-12.000' },
            { position: 'Arquiteto', salary: 'R$ 13.000-20.000' }
          ],
          skills: ['Ethical Hacking', 'Firewall', 'CISSP', 'Linux', 'Redes']
        }
      ],
      education: [
        'Ciência da Computação',
        'Engenharia de Software',
        'Sistemas de Informação',
        'Análise e Desenvolvimento de Sistemas',
        'Bootcamps e cursos online'
      ],
      marketInfo: {
        growth: '+25%',
        averageSalary: 'R$ 8.500',
        demand: 'Muito Alta'
      },
      nextSteps: [
        'Escolha uma linguagem de programação para começar',
        'Faça cursos online gratuitos (Coursera, edX, YouTube)',
        'Crie projetos pessoais e publique no GitHub',
        'Participe de comunidades tech (Discord, Telegram)',
        'Busque estágios ou programas de trainee'
      ]
    },
    {
      name: 'Saúde',
      icon: 'local_hospital',
      description: 'Medicina, enfermagem, fisioterapia, nutrição',
      careerPaths: [
        {
          title: 'Medicina',
          description: 'Diagnóstico, tratamento e prevenção de doenças',
          levels: [
            { position: 'Residente', salary: 'R$ 3.500-4.500' },
            { position: 'Médico', salary: 'R$ 8.000-15.000' },
            { position: 'Especialista', salary: 'R$ 15.000-30.000' }
          ],
          skills: ['Diagnóstico', 'Anatomia', 'Farmacologia', 'Ética Médica', 'Comunicação']
        },
        {
          title: 'Enfermagem',
          description: 'Cuidados diretos ao paciente e gestão de saúde',
          levels: [
            { position: 'Técnico', salary: 'R$ 2.500-3.500' },
            { position: 'Enfermeiro', salary: 'R$ 4.000-7.000' },
            { position: 'Coordenador', salary: 'R$ 8.000-12.000' }
          ],
          skills: ['Cuidados Intensivos', 'Administração', 'Farmacologia', 'Gestão', 'Empatia']
        },
        {
          title: 'Fisioterapia',
          description: 'Reabilitação e prevenção de lesões',
          levels: [
            { position: 'Fisioterapeuta Jr', salary: 'R$ 3.000-4.500' },
            { position: 'Fisioterapeuta', salary: 'R$ 5.000-8.000' },
            { position: 'Especialista', salary: 'R$ 8.000-15.000' }
          ],
          skills: ['Anatomia', 'Biomecânica', 'Reabilitação', 'Pilates', 'Acupuntura']
        }
      ],
      education: [
        'Medicina (6 anos)',
        'Enfermagem (4-5 anos)',
        'Fisioterapia (4-5 anos)',
        'Nutrição (4 anos)',
        'Técnico em Enfermagem (2 anos)'
      ],
      marketInfo: {
        growth: '+18%',
        averageSalary: 'R$ 7.200',
        demand: 'Alta'
      },
      nextSteps: [
        'Pesquise sobre as diferentes especialidades',
        'Faça trabalho voluntário em hospitais ou ONGs',
        'Converse com profissionais da área',
        'Considere cursos técnicos como primeiro passo',
        'Prepare-se para vestibular ou ENEM'
      ]
    },
    {
      name: 'Sustentabilidade',
      icon: 'eco',
      description: 'Energia renovável, gestão ambiental, ESG',
      careerPaths: [
        {
          title: 'Engenharia Ambiental',
          description: 'Desenvolvimento de soluções sustentáveis',
          levels: [
            { position: 'Júnior', salary: 'R$ 4.000-6.000' },
            { position: 'Pleno', salary: 'R$ 7.000-10.000' },
            { position: 'Sênior', salary: 'R$ 11.000-16.000' }
          ],
          skills: ['Gestão Ambiental', 'Legislação', 'Sustentabilidade', 'Projetos', 'Análise']
        },
        {
          title: 'Energia Renovável',
          description: 'Projetos de energia solar, eólica e biomassa',
          levels: [
            { position: 'Técnico', salary: 'R$ 3.500-5.000' },
            { position: 'Engenheiro', salary: 'R$ 6.000-9.000' },
            { position: 'Gerente', salary: 'R$ 10.000-15.000' }
          ],
          skills: ['Energia Solar', 'Energia Eólica', 'Projetos', 'AutoCAD', 'Sustentabilidade']
        },
        {
          title: 'Consultoria ESG',
          description: 'Assessoria em práticas ambientais, sociais e de governança',
          levels: [
            { position: 'Analista', salary: 'R$ 4.500-6.500' },
            { position: 'Consultor', salary: 'R$ 7.500-11.000' },
            { position: 'Sênior', salary: 'R$ 12.000-18.000' }
          ],
          skills: ['ESG', 'Relatórios', 'Compliance', 'Sustentabilidade', 'Comunicação']
        }
      ],
      education: [
        'Engenharia Ambiental',
        'Gestão Ambiental',
        'Engenharia de Energia',
        'Administração com foco em Sustentabilidade',
        'Cursos de especialização em ESG'
      ],
      marketInfo: {
        growth: '+22%',
        averageSalary: 'R$ 6.800',
        demand: 'Crescente'
      },
      nextSteps: [
        'Estude sobre mudanças climáticas e sustentabilidade',
        'Faça cursos sobre energia renovável',
        'Participe de projetos ambientais voluntários',
        'Busque certificações em ESG',
        'Acompanhe tendências do mercado verde'
      ]
    }
  ];

  selectArea(area: any): void {
    this.selectedArea = area;
    if (this.selectedArea) {
      // Track career exploration
      this.gamificationService.trackCareerPlanningComplete();
    }
  }
}
