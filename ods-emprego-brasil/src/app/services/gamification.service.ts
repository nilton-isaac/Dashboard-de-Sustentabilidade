import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  badgeReward?: string;
  completed: boolean;
  type: 'daily' | 'weekly' | 'achievement';
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  lastActiveDate: Date;
  badges: Badge[];
  quests: Quest[];
}

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  private userProgressSubject = new BehaviorSubject<UserProgress>(this.getInitialProgress());
  public userProgress$ = this.userProgressSubject.asObservable();

  private readonly XP_PER_LEVEL = 1000;
  private readonly STORAGE_KEY = 'ods_user_progress';

  constructor() {
    this.loadProgress();
    this.initializeDailyQuests();
  }

  private getInitialProgress(): UserProgress {
    return {
      level: 1,
      xp: 0,
      xpToNextLevel: this.XP_PER_LEVEL,
      totalXp: 0,
      streak: 0,
      lastActiveDate: new Date(),
      badges: this.getAvailableBadges(),
      quests: this.getDefaultQuests()
    };
  }

  private getAvailableBadges(): Badge[] {
    return [
      {
        id: 'first_search',
        name: 'Primeiro Passo',
        description: 'Realizou sua primeira busca por emprego',
        icon: 'search',
        earned: false,
        rarity: 'common'
      },
      {
        id: 'job_hunter',
        name: 'Caçador de Vagas',
        description: 'Visualizou 10 vagas de emprego',
        icon: 'track_changes',
        earned: false,
        rarity: 'common'
      },
      {
        id: 'news_reader',
        name: 'Bem Informado',
        description: 'Leu 5 notícias sobre emprego',
        icon: 'newspaper',
        earned: false,
        rarity: 'common'
      },
      {
        id: 'streak_warrior',
        name: 'Guerreiro da Consistência',
        description: 'Manteve um streak de 7 dias',
        icon: 'local_fire_department',
        earned: false,
        rarity: 'rare'
      },
      {
        id: 'data_analyst',
        name: 'Analista de Dados',
        description: 'Explorou todas as estatísticas de desemprego',
        icon: 'bar_chart',
        earned: false,
        rarity: 'rare'
      },
      {
        id: 'career_explorer',
        name: 'Explorador de Carreiras',
        description: 'Explorou trilhas de carreira',
        icon: 'explore',
        earned: false,
        rarity: 'common'
      },
      {
        id: 'career_planner',
        name: 'Planejador de Carreira',
        description: 'Completou o mapa mental de carreira',
        icon: 'map',
        earned: false,
        rarity: 'epic'
      },
      {
        id: 'master_job_seeker',
        name: 'Mestre da Busca',
        description: 'Alcançou o nível 10',
        icon: 'workspace_premium',
        earned: false,
        rarity: 'legendary'
      }
    ];
  }

  private getDefaultQuests(): Quest[] {
    return [
      {
        id: 'daily_login',
        title: 'Login Diário',
        description: 'Faça login no aplicativo',
        progress: 0,
        target: 1,
        xpReward: 50,
        completed: false,
        type: 'daily'
      },
      {
        id: 'view_jobs',
        title: 'Explorar Vagas',
        description: 'Visualize 3 vagas de emprego',
        progress: 0,
        target: 3,
        xpReward: 100,
        completed: false,
        type: 'daily'
      },
      {
        id: 'read_news',
        title: 'Ficar Informado',
        description: 'Leia 2 notícias sobre emprego',
        progress: 0,
        target: 2,
        xpReward: 75,
        completed: false,
        type: 'daily'
      },
      {
        id: 'explore_careers',
        title: 'Explorador de Carreiras',
        description: 'Explore 3 trilhas de carreira diferentes',
        progress: 0,
        target: 3,
        xpReward: 150,
        completed: false,
        type: 'weekly'
      },
      {
        id: 'weekly_stats',
        title: 'Análise Semanal',
        description: 'Visualize as estatísticas de desemprego 5 vezes esta semana',
        progress: 0,
        target: 5,
        xpReward: 300,
        completed: false,
        type: 'weekly'
      }
    ];
  }

  addXP(amount: number, source: string): void {
    const currentProgress = this.userProgressSubject.value;
    const newXp = currentProgress.xp + amount;
    const newTotalXp = currentProgress.totalXp + amount;
    
    let newLevel = currentProgress.level;
    let xpToNextLevel = currentProgress.xpToNextLevel - amount;
    
    // Check for level up
    while (xpToNextLevel <= 0) {
      newLevel++;
      xpToNextLevel += this.XP_PER_LEVEL;
      this.showLevelUpNotification(newLevel);
    }
    
    const updatedProgress: UserProgress = {
      ...currentProgress,
      level: newLevel,
      xp: newXp,
      xpToNextLevel,
      totalXp: newTotalXp
    };
    
    this.userProgressSubject.next(updatedProgress);
    this.saveProgress();
    
    console.log(`+${amount} XP from ${source}`);
  }

  updateStreak(): void {
    const currentProgress = this.userProgressSubject.value;
    const today = new Date();
    const lastActive = new Date(currentProgress.lastActiveDate);
    
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    let newStreak = currentProgress.streak;
    
    if (daysDiff === 1) {
      // Consecutive day
      newStreak++;
      this.addXP(25, 'streak bonus');
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }
    // If daysDiff === 0, same day, no change
    
    const updatedProgress: UserProgress = {
      ...currentProgress,
      streak: newStreak,
      lastActiveDate: today
    };
    
    this.userProgressSubject.next(updatedProgress);
    this.saveProgress();
    
    // Check streak badges
    if (newStreak >= 7) {
      this.earnBadge('streak_warrior');
    }
  }

  updateQuestProgress(questId: string, increment: number = 1): void {
    const currentProgress = this.userProgressSubject.value;
    const quest = currentProgress.quests.find(q => q.id === questId);
    
    if (quest && !quest.completed) {
      quest.progress = Math.min(quest.progress + increment, quest.target);
      
      if (quest.progress >= quest.target) {
        quest.completed = true;
        this.addXP(quest.xpReward, `quest: ${quest.title}`);
        
        if (quest.badgeReward) {
          this.earnBadge(quest.badgeReward);
        }
        
        this.showQuestCompletedNotification(quest);
      }
      
      this.userProgressSubject.next(currentProgress);
      this.saveProgress();
    }
  }

  earnBadge(badgeId: string): void {
    const currentProgress = this.userProgressSubject.value;
    const badge = currentProgress.badges.find(b => b.id === badgeId);
    
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedAt = new Date();
      
      this.userProgressSubject.next(currentProgress);
      this.saveProgress();
      
      this.showBadgeEarnedNotification(badge);
    }
  }

  private initializeDailyQuests(): void {
    // Reset daily quests if it's a new day
    const currentProgress = this.userProgressSubject.value;
    const today = new Date().toDateString();
    const lastActive = new Date(currentProgress.lastActiveDate).toDateString();
    
    if (today !== lastActive) {
      currentProgress.quests.forEach(quest => {
        if (quest.type === 'daily') {
          quest.progress = 0;
          quest.completed = false;
        }
      });
      
      this.userProgressSubject.next(currentProgress);
      this.saveProgress();
    }
  }

  private showLevelUpNotification(level: number): void {
    console.log(`Level Up! You are now level ${level}!`);
    // Here you could integrate with a toast notification service
  }

  private showBadgeEarnedNotification(badge: Badge): void {
    console.log(`Badge Earned: ${badge.name} - ${badge.description}`);
    // Here you could integrate with a toast notification service
  }

  private showQuestCompletedNotification(quest: Quest): void {
    console.log(`Quest Completed: ${quest.title} (+${quest.xpReward} XP)`);
    // Here you could integrate with a toast notification service
  }

  private saveProgress(): void {
    const progress = this.userProgressSubject.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  private loadProgress(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        this.userProgressSubject.next(progress);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }

  // Public methods for tracking user actions
  trackJobView(): void {
    this.addXP(10, 'job view');
    this.updateQuestProgress('view_jobs');
    this.earnBadge('first_search');
    
    // Check for job hunter badge
    const currentProgress = this.userProgressSubject.value;
    const jobViewCount = currentProgress.totalXp / 10; // Rough estimate
    if (jobViewCount >= 10) {
      this.earnBadge('job_hunter');
    }
  }

  trackNewsRead(): void {
    this.addXP(15, 'news read');
    this.updateQuestProgress('read_news');
    
    // Check for news reader badge
    const currentProgress = this.userProgressSubject.value;
    const newsReadCount = currentProgress.totalXp / 15; // Rough estimate
    if (newsReadCount >= 5) {
      this.earnBadge('news_reader');
    }
  }

  trackStatsView(): void {
    this.addXP(20, 'stats view');
    this.updateQuestProgress('weekly_stats');
    this.earnBadge('data_analyst');
  }

  trackCareerExploration(): void {
    this.addXP(25, 'career exploration');
    this.updateQuestProgress('explore_careers');
    this.earnBadge('career_explorer');
  }

  trackCareerPlanningComplete(): void {
    this.addXP(200, 'career planning');
    this.earnBadge('career_planner');
  }

  trackLogin(): void {
    this.updateStreak();
    this.updateQuestProgress('daily_login');
    
    // Check for master badge
    const currentProgress = this.userProgressSubject.value;
    if (currentProgress.level >= 10) {
      this.earnBadge('master_job_seeker');
    }
  }

  getCurrentProgress(): UserProgress {
    return this.userProgressSubject.value;
  }

  getEarnedBadges(): Badge[] {
    return this.userProgressSubject.value.badges.filter(badge => badge.earned);
  }

  getActiveQuests(): Quest[] {
    return this.userProgressSubject.value.quests.filter(quest => !quest.completed);
  }

  getCompletedQuests(): Quest[] {
    return this.userProgressSubject.value.quests.filter(quest => quest.completed);
  }
}