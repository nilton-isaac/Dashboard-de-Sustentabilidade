import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  title = 'ODS Emprego Brasil';
  subtitle = 'Dashboard de Oportunidades de Emprego e Desenvolvimento Sustentável';
  
  @Output() tabChanged = new EventEmitter<string>();
  
  activeTab = 'dashboard';
  
  tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      description: 'Visão geral dos dados'
    },
    {
      id: 'unemployment',
      label: 'Desemprego',
      icon: 'trending_up',
      description: 'Estatísticas de desemprego'
    },
    {
      id: 'jobs',
      label: 'Empregos',
      icon: 'work',
      description: 'Notícias e oportunidades'
    },
    {
      id: 'careers',
      label: 'Carreiras',
      icon: 'track_changes',
      description: 'Mapas de carreira'
    },
    {
      id: 'analysis',
      label: 'Análises',
      icon: 'assessment',
      description: 'Custo-benefício'
    }
  ];
  
  selectTab(tabId: string): void {
    this.activeTab = tabId;
    this.tabChanged.emit(tabId);
  }
  
  isTabActive(tabId: string): boolean {
    return this.activeTab === tabId;
  }
  
  trackByTabId(index: number, tab: TabItem): string {
    return tab.id;
  }
  
  getTabClasses(tabId: string): string {
    const baseClasses = 'relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
    const focusClasses = 'focus:outline-none focus:ring-2 focus:ring-mag-500 focus:ring-offset-2 focus:ring-offset-ink-900';
    
    if (this.isTabActive(tabId)) {
      return `${baseClasses} ${focusClasses} text-mag-400 font-semibold`;
    } else {
      return `${baseClasses} ${focusClasses} text-text-base hover:text-mag-400 hover:bg-white/5`;
    }
  }
}
