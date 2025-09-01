import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../services/accessibility.service';
import { CustomizationService, ThemeConfig, FontConfig } from '../../services/customization.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accessibility-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accessibility-settings.component.html',
  styleUrls: ['./accessibility-settings.component.css']
})
export class AccessibilitySettingsComponent implements OnInit {
  highContrast$: Observable<boolean>;
  reducedMotion$: Observable<boolean>;
  screenReader$: Observable<boolean>;
  focusVisible$: Observable<boolean>;
  
  currentTheme$: Observable<string>;
  currentFont$: Observable<string>;
  fontSize$: Observable<string>;
  isDarkMode$: Observable<boolean>;
  
  isOpen = false;
  stats: any = {};
  activeTab = 'accessibility'; // 'accessibility', 'theme', 'font'
  
  themes: ThemeConfig[] = [];
  fonts: FontConfig[] = [];
  fontSizes = [
    { value: 'small', label: 'Pequena' },
    { value: 'medium', label: 'Média' },
    { value: 'large', label: 'Grande' },
    { value: 'extraLarge', label: 'Extra Grande' }
  ];

  constructor(
    private accessibilityService: AccessibilityService,
    public customizationService: CustomizationService
  ) {
    this.highContrast$ = this.accessibilityService.highContrast$;
    this.reducedMotion$ = this.accessibilityService.reducedMotion$;
    this.screenReader$ = this.accessibilityService.screenReader$;
    this.focusVisible$ = this.accessibilityService.focusVisible$;
    
    this.currentTheme$ = this.customizationService.currentTheme$;
    this.currentFont$ = this.customizationService.currentFont$;
    this.fontSize$ = this.customizationService.fontSize$;
    this.isDarkMode$ = this.customizationService.isDarkMode$;
  }

  ngOnInit(): void {
    this.updateStats();
    this.themes = this.customizationService.getThemes();
    this.fonts = this.customizationService.getFonts();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    this.accessibilityService.announceToScreenReader(
      this.isOpen ? 'Painel de acessibilidade aberto' : 'Painel de acessibilidade fechado'
    );
  }

  toggleHighContrast(): void {
    this.accessibilityService.toggleHighContrast();
    this.updateStats();
  }

  toggleReducedMotion(): void {
    this.accessibilityService.toggleReducedMotion();
    this.updateStats();
  }

  // Métodos de personalização
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setTheme(themeName: string): void {
    this.customizationService.setTheme(themeName);
  }

  setFont(fontName: string): void {
    this.customizationService.setFont(fontName);
  }

  setFontFamily(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.customizationService.setFont(target.value);
  }

  setFontSize(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.customizationService.setFontSize(target.value);
  }

  setLineHeight(event: Event): void {
    const target = event.target as HTMLInputElement;
    const height = parseFloat(target.value);
    this.customizationService.setLineHeight(height);
  }

  toggleDarkMode(): void {
    this.customizationService.toggleDarkMode();
  }

  resetSettings(): void {
    this.customizationService.resetToDefaults();
    this.accessibilityService.announceToScreenReader('Configurações restauradas para o padrão');
  }

  exportSettings(): void {
    const settings = this.customizationService.exportSettings();
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes-personalizacao.json';
    a.click();
    URL.revokeObjectURL(url);
    this.accessibilityService.announceToScreenReader('Configurações exportadas');
  }

  importSettings(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const success = this.customizationService.importSettings(content);
        this.accessibilityService.announceToScreenReader(
          success ? 'Configurações importadas com sucesso' : 'Erro ao importar configurações'
        );
      };
      reader.readAsText(file);
    }
  }

  private updateStats(): void {
    this.stats = this.accessibilityService.getAccessibilityStats();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen = false;
      this.accessibilityService.announceToScreenReader('Painel de acessibilidade fechado');
    }
  }

  focusFirstButton(): void {
    const firstButton = document.querySelector('.accessibility-panel button') as HTMLElement;
    if (firstButton) {
      firstButton.focus();
    }
  }
}