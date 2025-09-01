import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ThemeConfig {
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    accent: string;
  };
}

export interface FontConfig {
  name: string;
  displayName: string;
  fontFamily: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {
  private currentThemeSubject = new BehaviorSubject<string>('default');
  private currentFontSubject = new BehaviorSubject<string>('inter');
  private fontSizeSubject = new BehaviorSubject<string>('medium');
  private lineHeightSubject = new BehaviorSubject<number>(1.5);
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  public currentTheme$ = this.currentThemeSubject.asObservable();
  public currentFont$ = this.currentFontSubject.asObservable();
  public fontSize$ = this.fontSizeSubject.asObservable();
  public lineHeight$ = this.lineHeightSubject.asObservable();
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  private themes: ThemeConfig[] = [
    {
      name: 'default',
      displayName: 'Padrão',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1a202c',
        textMuted: '#4a5568',
        accent: '#48bb78'
      }
    },
    {
      name: 'blue',
      displayName: 'Azul Profissional',
      colors: {
        primary: '#3182ce',
        secondary: '#2c5282',
        background: '#ffffff',
        surface: '#f7fafc',
        text: '#1a202c',
        textMuted: '#4a5568',
        accent: '#38b2ac'
      }
    },
    {
      name: 'green',
      displayName: 'Verde Natureza',
      colors: {
        primary: '#38a169',
        secondary: '#2f855a',
        background: '#ffffff',
        surface: '#f0fff4',
        text: '#1a202c',
        textMuted: '#4a5568',
        accent: '#ed8936'
      }
    },
    {
      name: 'purple',
      displayName: 'Roxo Criativo',
      colors: {
        primary: '#805ad5',
        secondary: '#6b46c1',
        background: '#ffffff',
        surface: '#faf5ff',
        text: '#1a202c',
        textMuted: '#4a5568',
        accent: '#f56565'
      }
    }
  ];

  private fonts: FontConfig[] = [
    {
      name: 'inter',
      displayName: 'Inter (Padrão)',
      fontFamily: 'Inter, sans-serif',
      sizes: {
        small: '14px',
        medium: '16px',
        large: '18px',
        extraLarge: '20px'
      }
    },
    {
      name: 'roboto',
      displayName: 'Roboto',
      fontFamily: 'Roboto, sans-serif',
      sizes: {
        small: '14px',
        medium: '16px',
        large: '18px',
        extraLarge: '20px'
      }
    },
    {
      name: 'opensans',
      displayName: 'Open Sans',
      fontFamily: 'Open Sans, sans-serif',
      sizes: {
        small: '14px',
        medium: '16px',
        large: '18px',
        extraLarge: '20px'
      }
    },
    {
      name: 'poppins',
      displayName: 'Poppins',
      fontFamily: 'Poppins, sans-serif',
      sizes: {
        small: '14px',
        medium: '16px',
        large: '18px',
        extraLarge: '20px'
      }
    }
  ];

  constructor() {
    this.loadSavedPreferences();
    this.applyCurrentSettings();
  }

  // Carrega preferências salvas
  private loadSavedPreferences(): void {
    const savedTheme = localStorage.getItem('customization-theme');
    const savedFont = localStorage.getItem('customization-font');
    const savedFontSize = localStorage.getItem('customization-font-size');
    const savedLineHeight = localStorage.getItem('customization-line-height');
    const savedDarkMode = localStorage.getItem('customization-dark-mode');

    if (savedTheme && this.themes.find(t => t.name === savedTheme)) {
      this.currentThemeSubject.next(savedTheme);
    }

    if (savedFont && this.fonts.find(f => f.name === savedFont)) {
      this.currentFontSubject.next(savedFont);
    }

    if (savedFontSize) {
      this.fontSizeSubject.next(savedFontSize);
    }

    if (savedLineHeight) {
      this.lineHeightSubject.next(parseFloat(savedLineHeight));
    }

    if (savedDarkMode) {
      this.isDarkModeSubject.next(savedDarkMode === 'true');
    }
  }

  // Aplica configurações atuais
  private applyCurrentSettings(): void {
    this.applyTheme(this.currentThemeSubject.value);
    this.applyFont(this.currentFontSubject.value);
    this.applyFontSize(this.fontSizeSubject.value);
    this.applyLineHeight(this.lineHeightSubject.value);
    this.applyDarkMode(this.isDarkModeSubject.value);
  }

  // Getters para temas e fontes
  getThemes(): ThemeConfig[] {
    return this.themes;
  }

  getFonts(): FontConfig[] {
    return this.fonts;
  }

  getCurrentTheme(): ThemeConfig | undefined {
    return this.themes.find(t => t.name === this.currentThemeSubject.value);
  }

  getCurrentFont(): FontConfig | undefined {
    return this.fonts.find(f => f.name === this.currentFontSubject.value);
  }

  // Métodos para alterar configurações
  setTheme(themeName: string): void {
    const theme = this.themes.find(t => t.name === themeName);
    if (theme) {
      this.currentThemeSubject.next(themeName);
      this.applyTheme(themeName);
      localStorage.setItem('customization-theme', themeName);
    }
  }

  setFont(fontName: string): void {
    const font = this.fonts.find(f => f.name === fontName);
    if (font) {
      this.currentFontSubject.next(fontName);
      this.applyFont(fontName);
      localStorage.setItem('customization-font', fontName);
    }
  }

  setFontSize(size: string): void {
    this.fontSizeSubject.next(size);
    this.applyFontSize(size);
    localStorage.setItem('customization-font-size', size);
  }

  setLineHeight(height: number): void {
    this.lineHeightSubject.next(height);
    this.applyLineHeight(height);
    localStorage.setItem('customization-line-height', height.toString());
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newValue);
    this.applyDarkMode(newValue);
    localStorage.setItem('customization-dark-mode', newValue.toString());
  }

  // Métodos privados para aplicar configurações
  private applyTheme(themeName: string): void {
    const theme = this.themes.find(t => t.name === themeName);
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Remove classes de tema anteriores
    document.body.classList.remove(...this.themes.map(t => `theme-${t.name}`));
    // Adiciona nova classe de tema
    document.body.classList.add(`theme-${themeName}`);
  }

  private applyFont(fontName: string): void {
    const font = this.fonts.find(f => f.name === fontName);
    if (!font) return;

    const root = document.documentElement;
    root.style.setProperty('--font-family', font.fontFamily);

    // Remove classes de fonte anteriores
    document.body.classList.remove(...this.fonts.map(f => `font-${f.name}`));
    // Adiciona nova classe de fonte
    document.body.classList.add(`font-${fontName}`);
  }

  private applyFontSize(size: string): void {
    const font = this.getCurrentFont();
    if (!font) return;

    const root = document.documentElement;
    const fontSize = font.sizes[size as keyof typeof font.sizes] || font.sizes.medium;
    root.style.setProperty('--font-size-base', fontSize);

    // Remove classes de tamanho anteriores
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    // Adiciona nova classe de tamanho
    document.body.classList.add(`font-${size}`);
  }

  private applyLineHeight(height: number): void {
    const root = document.documentElement;
    root.style.setProperty('--line-height', height.toString());
  }

  private applyDarkMode(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Método para resetar todas as configurações
  resetToDefaults(): void {
    this.setTheme('default');
    this.setFont('inter');
    this.setFontSize('medium');
    this.isDarkModeSubject.next(false);
    this.applyDarkMode(false);
    localStorage.removeItem('customization-theme');
    localStorage.removeItem('customization-font');
    localStorage.removeItem('customization-font-size');
    localStorage.removeItem('customization-dark-mode');
  }

  // Método para exportar configurações
  exportSettings(): string {
    return JSON.stringify({
      theme: this.currentThemeSubject.value,
      font: this.currentFontSubject.value,
      fontSize: this.fontSizeSubject.value,
      darkMode: this.isDarkModeSubject.value
    });
  }

  // Método para importar configurações
  importSettings(settingsJson: string): boolean {
    try {
      const settings = JSON.parse(settingsJson);
      
      if (settings.theme) this.setTheme(settings.theme);
      if (settings.font) this.setFont(settings.font);
      if (settings.fontSize) this.setFontSize(settings.fontSize);
      if (typeof settings.darkMode === 'boolean') {
        this.isDarkModeSubject.next(settings.darkMode);
        this.applyDarkMode(settings.darkMode);
      }
      
      return true;
    } catch {
      return false;
    }
  }
}