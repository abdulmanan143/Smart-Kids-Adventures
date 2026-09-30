export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameCategory = 'math' | 'english' | 'general' | 'memory' | 'puzzle';

export type ScreenState = 
  | 'home' 
  | 'game-select' 
  | 'quiz' 
  | 'memory' 
  | 'puzzle' 
  | 'rewards' 
  | 'progress' 
  | 'settings';

export interface Question {
  id: string;
  category: 'math' | 'english' | 'general' | 'puzzle';
  difficulty: Difficulty;
  question: string;
  subtext?: string;
  visualEmoji?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  operation?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'all' | 'math' | 'english' | 'general' | 'memory' | 'puzzle' | 'special';
  requiredCount: number;
  type: 'stars' | 'games_played' | 'math_streak' | 'perfect_round' | 'memory_master' | 'puzzle_pro';
  unlockedAt?: string;
}

export interface GameHistoryItem {
  id: string;
  game: GameCategory;
  difficulty: Difficulty;
  score: number;
  total: number;
  starsEarned: number;
  date: string;
  timeSpentSeconds: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  stars: number;
  points: number;
  gamesPlayed: number;
  badgesUnlocked: string[];
  unlockedBadgeObjects?: Badge[];
  history: GameHistoryItem[];
  settings: {
    soundEnabled: boolean;
    speechEnabled: boolean;
    volume: number;
  };
}

export interface MemoryCard {
  id: string;
  pairId: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}
