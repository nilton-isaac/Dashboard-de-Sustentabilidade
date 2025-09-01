import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private highContrastSubject = new BehaviorSubject<boolean>(false);
  private reducedMotionSubject = new BehaviorSubject<boolean>(false);
  private screenReaderSubject = new BehaviorSubject<boolean>(false);
  private focusVisibleSubject = new BehaviorSubject<boolean>(true);

  public highContrast$ = this.highContrastSubject.asObservable();
  public reducedMotion$ = this.reducedMotionSubject.asObservable();
  public screenReader$ = this.screenReaderSubject.asObservable();
  public focusVisible$ = this.focusVisibleSubject.asObservable();

  private announcements: string[] = [];

  constructor() {
    this.detectUserPreferences();
    this.setupKeyboardNavigation();
  }

  // Detecta preferências do usuário
  private detectUserPreferences(): void {
    // Detecta preferência por movimento reduzido
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reducedMotionSubject.next(true);
      document.documentElement.classList.add('reduce-motion');
    }

    // Detecta preferência por alto contraste
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.highContrastSubject.next(true);
      document.documentElement.classList.add('high-contrast');
    }

    // Detecta se há um leitor de tela ativo
    this.detectScreenReader();
  }

  // Detecta leitor de tela
  private detectScreenReader(): void {
    // Técnica para detectar leitores de tela
    const testElement = document.createElement('div');
    testElement.setAttribute('aria-hidden', 'true');
    testElement.style.position = 'absolute';
    testElement.style.left = '-10000px';
    testElement.style.width = '1px';
    testElement.style.height = '1px';
    testElement.style.overflow = 'hidden';
    testElement.textContent = 'Screen reader test';
    
    document.body.appendChild(testElement);
    
    setTimeout(() => {
      const isScreenReader = testElement.offsetHeight !== 1;
      this.screenReaderSubject.next(isScreenReader);
      document.body.removeChild(testElement);
    }, 100);
  }

  // Configura navegação por teclado
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      // Tab navigation enhancement
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
      
      // Escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        this.closeAllModals();
      }
      
      // Arrow key navigation for custom components
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event);
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // Navegação por setas
  private handleArrowNavigation(event: KeyboardEvent): void {
    const focusedElement = document.activeElement as HTMLElement;
    if (!focusedElement) return;

    // Navegação em listas
    if (focusedElement.getAttribute('role') === 'listitem' || 
        focusedElement.closest('[role="list"]')) {
      this.navigateList(event, focusedElement);
    }

    // Navegação em grids
    if (focusedElement.closest('[role="grid"]')) {
      this.navigateGrid(event, focusedElement);
    }
  }

  // Navegação em listas
  private navigateList(event: KeyboardEvent, element: HTMLElement): void {
    const list = element.closest('[role="list"]') || element.parentElement;
    if (!list) return;

    const items = Array.from(list.querySelectorAll('[role="listitem"], [tabindex]')) as HTMLElement[];
    const currentIndex = items.indexOf(element);

    let nextIndex = currentIndex;
    if (event.key === 'ArrowDown') {
      nextIndex = Math.min(currentIndex + 1, items.length - 1);
    } else if (event.key === 'ArrowUp') {
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    if (nextIndex !== currentIndex) {
      event.preventDefault();
      items[nextIndex].focus();
    }
  }

  // Navegação em grids
  private navigateGrid(event: KeyboardEvent, element: HTMLElement): void {
    const grid = element.closest('[role="grid"]');
    if (!grid) return;

    const rows = Array.from(grid.querySelectorAll('[role="row"]'));
    const currentRow = element.closest('[role="row"]');
    const currentRowIndex = rows.indexOf(currentRow as Element);
    
    if (currentRow) {
      const cells = Array.from(currentRow.querySelectorAll('[role="gridcell"], [tabindex]')) as HTMLElement[];
      const currentCellIndex = cells.indexOf(element);

      let nextRowIndex = currentRowIndex;
      let nextCellIndex = currentCellIndex;

      switch (event.key) {
        case 'ArrowRight':
          nextCellIndex = Math.min(currentCellIndex + 1, cells.length - 1);
          break;
        case 'ArrowLeft':
          nextCellIndex = Math.max(currentCellIndex - 1, 0);
          break;
        case 'ArrowDown':
          nextRowIndex = Math.min(currentRowIndex + 1, rows.length - 1);
          break;
        case 'ArrowUp':
          nextRowIndex = Math.max(currentRowIndex - 1, 0);
          break;
      }

      if (nextRowIndex !== currentRowIndex) {
        const nextRow = rows[nextRowIndex];
        const nextRowCells = Array.from(nextRow.querySelectorAll('[role="gridcell"], [tabindex]')) as HTMLElement[];
        const targetCell = nextRowCells[Math.min(currentCellIndex, nextRowCells.length - 1)];
        if (targetCell) {
          event.preventDefault();
          targetCell.focus();
        }
      } else if (nextCellIndex !== currentCellIndex) {
        event.preventDefault();
        cells[nextCellIndex].focus();
      }
    }
  }

  // Fecha todos os modais
  private closeAllModals(): void {
    const modals = document.querySelectorAll('[role="dialog"], .modal, .dropdown');
    modals.forEach(modal => {
      if (modal instanceof HTMLElement) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Anuncia mensagem para leitores de tela
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    
    document.body.appendChild(announcement);
    
    // Pequeno delay para garantir que o leitor de tela detecte
    setTimeout(() => {
      announcement.textContent = message;
      this.announcements.push(message);
      
      // Remove após 5 segundos
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 5000);
    }, 100);
  }

  // Toggle alto contraste
  toggleHighContrast(): void {
    const current = this.highContrastSubject.value;
    this.highContrastSubject.next(!current);
    
    if (!current) {
      document.documentElement.classList.add('high-contrast');
      this.announceToScreenReader('Alto contraste ativado');
    } else {
      document.documentElement.classList.remove('high-contrast');
      this.announceToScreenReader('Alto contraste desativado');
    }
  }

  // Toggle movimento reduzido
  toggleReducedMotion(): void {
    const current = this.reducedMotionSubject.value;
    this.reducedMotionSubject.next(!current);
    
    if (!current) {
      document.documentElement.classList.add('reduce-motion');
      this.announceToScreenReader('Movimento reduzido ativado');
    } else {
      document.documentElement.classList.remove('reduce-motion');
      this.announceToScreenReader('Movimento reduzido desativado');
    }
  }

  // Foca no primeiro elemento focável
  focusFirstElement(container?: HTMLElement): void {
    const root = container || document;
    const focusableElements = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }

  // Foca no último elemento focável
  focusLastElement(container?: HTMLElement): void {
    const root = container || document;
    const focusableElements = root.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }

  // Trap focus dentro de um container
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    // Retorna função para remover o trap
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  // Verifica se um elemento está visível
  isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Scroll para elemento com anúncio
  scrollToElement(element: HTMLElement, announce: boolean = true): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    if (announce) {
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('title') || 
                   element.textContent?.trim() || 
                   'Elemento';
      this.announceToScreenReader(`Navegado para ${label}`);
    }
  }

  // Obtém estatísticas de acessibilidade
  getAccessibilityStats(): {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    announcementCount: number;
  } {
    return {
      highContrast: this.highContrastSubject.value,
      reducedMotion: this.reducedMotionSubject.value,
      screenReader: this.screenReaderSubject.value,
      announcementCount: this.announcements.length
    };
  }
}