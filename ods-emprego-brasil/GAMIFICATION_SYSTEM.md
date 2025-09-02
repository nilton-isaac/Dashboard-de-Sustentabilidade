# Sistema de Gamificação - Dashboard de Emprego Brasil

## Visão Geral

O sistema de gamificação foi desenvolvido para aumentar o engajamento dos usuários na plataforma de emprego, incentivando a exploração de dados, busca por oportunidades e desenvolvimento profissional através de elementos de jogos.

## Componentes Principais


### 1. Sistema de Experiência (XP)
- **XP por Nível**: 1000 pontos
- **Progressão**: Linear, cada nível requer 1000 XP adicionais
- **Fontes de XP**:
  - Visualizar vaga: 10 XP
  - Ler notícia: 15 XP
  - Visualizar estatísticas: 20 XP
  - Explorar carreira: 25 XP
  - Completar planejamento de carreira: 200 XP
  - Bônus de streak: 25 XP

### 2. Sistema de Níveis
- **Nível Inicial**: 1
- **Progressão**: Automática ao atingir XP necessário
- **Benefícios**: Desbloqueio de badges especiais
- **Nível Máximo Especial**: 10 (desbloqueia badge "Mestre da Busca")

### 3. Sistema de Streaks
- **Definição**: Dias consecutivos de login
- **Bônus**: 25 XP por dia de streak mantido
- **Reset**: Quebra automaticamente se não fizer login por mais de 1 dia
- **Badge Especial**: "Guerreiro da Consistência" aos 7 dias

## Badges (Conquistas)

### Badges Comuns
1. **Primeiro Passo**
   - Realizou sua primeira busca por emprego
   - Desbloqueado: Primeira visualização de vaga

2. **Caçador de Vagas**
   - Visualizou 10 vagas de emprego
   - Desbloqueado: Automaticamente após 10 visualizações

3. **Bem Informado** 📰
   - Leu 5 notícias sobre emprego
   - Desbloqueado: Automaticamente após 5 leituras

4. **Explorador de Carreiras** 🧭
   - Explorou trilhas de carreira
   - Desbloqueado: Primeira exploração de carreira

### Badges Raros
1. **Guerreiro da Consistência** 🔥
   - Manteve um streak de 7 dias
   - Desbloqueado: Automaticamente aos 7 dias consecutivos

2. **Analista de Dados**
   - Explorou todas as estatísticas de desemprego
   - Desbloqueado: Primeira visualização de estatísticas

### Badges Épicos
1. **Planejador de Carreira**
   - Completou o mapa mental de carreira
   - Desbloqueado: Completar planejamento de carreira

### Badges Lendários
1. **Mestre da Busca**
   - Alcançou o nível 10
   - Desbloqueado: Automaticamente ao atingir nível 10

## Sistema de Quests (Missões)

### Quests Diárias
1. **Login Diário**
   - Descrição: Faça login no aplicativo
   - Meta: 1 login
   - Recompensa: 50 XP
   - Reset: Diário

2. **Explorar Vagas**
   - Descrição: Visualize 3 vagas de emprego
   - Meta: 3 visualizações
   - Recompensa: 100 XP
   - Reset: Diário

3. **Ficar Informado**
   - Descrição: Leia 2 notícias sobre emprego
   - Meta: 2 leituras
   - Recompensa: 75 XP
   - Reset: Diário

### Quests Semanais
1. **Explorador de Carreiras**
   - Descrição: Explore 3 trilhas de carreira diferentes
   - Meta: 3 explorações
   - Recompensa: 150 XP
   - Reset: Semanal

2. **Análise Semanal**
   - Descrição: Visualize as estatísticas de desemprego 5 vezes esta semana
   - Meta: 5 visualizações
   - Recompensa: 300 XP
   - Reset: Semanal

## Implementação Técnica

### Arquivos Principais
- `gamification.service.ts`: Lógica principal do sistema
- `gamification.component.ts`: Interface do usuário
- `gamification.component.html`: Template da interface
- `gamification.component.css`: Estilos da interface

### Estruturas de Dados

#### UserProgress
```typescript
interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  lastActiveDate: Date;
  badges: Badge[];
  quests: Quest[];
}
```

#### Badge
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

#### Quest
```typescript
interface Quest {
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
```

### Métodos Principais

#### Tracking de Ações
- `trackJobView()`: Registra visualização de vaga
- `trackNewsRead()`: Registra leitura de notícia
- `trackStatsView()`: Registra visualização de estatísticas
- `trackCareerExploration()`: Registra exploração de carreira
- `trackCareerPlanningComplete()`: Registra conclusão de planejamento
- `trackLogin()`: Registra login e atualiza streak

#### Gerenciamento de Progresso
- `addXP(amount, source)`: Adiciona XP e verifica level up
- `updateStreak()`: Atualiza streak de dias consecutivos
- `updateQuestProgress(questId, increment)`: Atualiza progresso de quest
- `earnBadge(badgeId)`: Concede badge ao usuário

#### Persistência
- `saveProgress()`: Salva progresso no localStorage
- `loadProgress()`: Carrega progresso do localStorage
- **Chave de Storage**: `ods_user_progress`

## Interface do Usuário

### Elementos Visuais
1. **Barra de XP**: Mostra progresso atual para próximo nível
2. **Nível Atual**: Exibe nível do usuário
3. **Streak Counter**: Mostra dias consecutivos com ícone de fogo
4. **Lista de Badges**: Badges conquistados com raridade colorida
5. **Lista de Quests**: Missões ativas com barra de progresso

### Cores por Raridade
- **Comum**: Cinza (`border-gray-400 bg-gray-50`)
- **Raro**: Azul (`border-blue-400 bg-blue-50`)
- **Épico**: Roxo (`border-purple-400 bg-purple-50`)
- **Lendário**: Dourado (`border-yellow-400 bg-yellow-50`)

### Ícones de Streak
- 1-6 dias: `flash_on` (cinza)
- 7-13 dias: `local_fire_department` (amarelo)
- 14-29 dias: `local_fire_department` (laranja)
- 30+ dias: `whatshot` (vermelho)

## Notificações

O sistema inclui notificações para:
- **Level Up**: Quando o usuário sobe de nível
- **Badge Conquistado**: Quando um novo badge é desbloqueado
- **Quest Completada**: Quando uma missão é finalizada

*Nota: Atualmente as notificações são exibidas no console. Para implementação completa, integre com um serviço de toast notifications.*

## Expansões Futuras

### Funcionalidades Sugeridas
1. **Sistema de Ranking**: Comparação com outros usuários
2. **Badges Sazonais**: Conquistas por tempo limitado
3. **Quests Personalizadas**: Baseadas no perfil do usuário
4. **Recompensas Tangíveis**: Cupons, certificados, etc.
5. **Sistema de Amigos**: Competição social
6. **Achievements Ocultos**: Badges secretos para descobrir

### Melhorias Técnicas
1. **Backend Integration**: Sincronização com servidor
2. **Analytics**: Tracking detalhado de engajamento
3. **A/B Testing**: Otimização de recompensas
4. **Push Notifications**: Lembretes de streak e quests

## Como Usar

### Para Desenvolvedores
1. Injete o `GamificationService` no componente
2. Use os métodos `track*()` para registrar ações do usuário
3. Subscribe ao `userProgress$` para reagir a mudanças
4. Implemente notificações visuais conforme necessário

### Para Usuários
1. Faça login diariamente para manter o streak
2. Complete as quests diárias para XP rápido
3. Explore diferentes seções para desbloquear badges
4. Acompanhe seu progresso na seção de gamificação

---

*Sistema desenvolvido para o Dashboard de Emprego Brasil - ODS 4, 8 e 9*
*Versão: 1.0 | Data: 2024*