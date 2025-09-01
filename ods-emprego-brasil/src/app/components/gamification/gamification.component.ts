import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { GamificationService, UserProgress, Badge, Quest } from '../../services/gamification.service';

@Component({
  selector: 'app-gamification',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './gamification.component.html',
  styleUrls: ['./gamification.component.css']
})
export class GamificationComponent implements OnInit, OnDestroy {
  userProgress: UserProgress | null = null;
  earnedBadges: Badge[] = [];
  activeQuests: Quest[] = [];
  showBadges = false;
  showQuests = false;
  private subscription: Subscription = new Subscription();

  constructor(private gamificationService: GamificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.gamificationService.userProgress$.subscribe(progress => {
        this.userProgress = progress;
        this.earnedBadges = this.gamificationService.getEarnedBadges();
        this.activeQuests = this.gamificationService.getActiveQuests();
      })
    );

    // Track login
    this.gamificationService.trackLogin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getXpPercentage(): number {
    if (!this.userProgress) return 0;
    const totalXpForCurrentLevel = this.userProgress.level * 1000;
    const xpInCurrentLevel = this.userProgress.xp - ((this.userProgress.level - 1) * 1000);
    return (xpInCurrentLevel / 1000) * 100;
  }

  getBadgeRarityClass(rarity: string): string {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  }

  getQuestProgressPercentage(quest: Quest): number {
    return (quest.progress / quest.target) * 100;
  }

  getQuestTypeIcon(type: string): string {
    switch (type) {
      case 'daily': return 'today';
      case 'weekly': return 'bar_chart';
      case 'achievement': return 'emoji_events';
      default: return 'star';
    }
  }

  toggleBadges(): void {
    this.showBadges = !this.showBadges;
    this.showQuests = false;
  }

  toggleQuests(): void {
    this.showQuests = !this.showQuests;
    this.showBadges = false;
  }

  getStreakIcon(): string {
    if (!this.userProgress) return 'local_fire_department';
    if (this.userProgress.streak >= 30) return 'whatshot';
    if (this.userProgress.streak >= 14) return 'local_fire_department';
    if (this.userProgress.streak >= 7) return 'local_fire_department';
    return 'flash_on';
  }

  getStreakColor(): string {
    if (!this.userProgress) return 'text-orange-500';
    if (this.userProgress.streak >= 30) return 'text-red-500';
    if (this.userProgress.streak >= 14) return 'text-orange-500';
    if (this.userProgress.streak >= 7) return 'text-yellow-500';
    return 'text-gray-500';
  }
}