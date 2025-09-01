import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
  badge?: string;
  children?: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() itemSelected = new EventEmitter<string>();
  @Output() toggleSidebar = new EventEmitter<boolean>();

  isCollapsed = true;
  activeItem = 'dashboard';
  expandedGroups: Set<string> = new Set();

  sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      description: 'Visão geral dos dados'
    },
    {
      id: 'data-visualization',
      label: 'Visualização de Dados',
      icon: 'bar_chart',
      description: 'Gráficos e estatísticas'
    },
    {
      id: 'job-news',
      label: 'Notícias de Emprego',
      icon: 'article',
      description: 'Últimas oportunidades'
    },
    {
      id: 'career-mindmap',
      label: 'Mapa de Carreira',
      icon: 'account_tree',
      description: 'Trilhas profissionais'
    },
    {
      id: 'cost-benefit',
      label: 'Custo-Benefício',
      icon: 'assessment',
      description: 'Análise de investimento'
    },
    {
      id: 'gamification',
      label: 'Gamificação',
      icon: 'emoji_events',
      description: 'Sistema de conquistas'
    }
  ];

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleSidebar.emit(this.isCollapsed);
  }

  selectItem(itemId: string): void {
    this.activeItem = itemId;
    this.itemSelected.emit(itemId);
    
    // Navegar para a seção correspondente
    this.navigateToSection(itemId);
  }

  private navigateToSection(itemId: string): void {
    // Mapear IDs para elementos ou ações específicas
    const sectionMap: { [key: string]: string } = {
      'dashboard': 'main-content',
      'data-visualization': 'data-visualization-section',
      'job-news': 'job-news-section',
      'career-mindmap': 'career-mindmap-section',
      'cost-benefit': 'cost-benefit-section',
      'gamification': 'gamification-section'
    };

    const targetElement = document.getElementById(sectionMap[itemId]);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Se não encontrar o elemento, rolar para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleGroup(groupId: string): void {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroups.has(groupId);
  }

  isItemActive(itemId: string): boolean {
    return this.activeItem === itemId;
  }

  trackByItemId(index: number, item: SidebarItem): string {
    return item.id;
  }

  getItemClasses(item: SidebarItem): string {
    const baseClasses = 'sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer';
    const activeClasses = this.isItemActive(item.id) 
      ? 'bg-mag-500/20 text-mag-400 border-l-4 border-mag-500' 
      : 'text-text-mute hover:text-text-base hover:bg-white/5';
    
    return `${baseClasses} ${activeClasses}`;
  }

  getGroupClasses(item: SidebarItem): string {
    const baseClasses = 'sidebar-group flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer';
    const expandedClasses = this.isGroupExpanded(item.id)
      ? 'bg-white/5 text-text-base'
      : 'text-text-mute hover:text-text-base hover:bg-white/5';
    
    return `${baseClasses} ${expandedClasses}`;
  }
}