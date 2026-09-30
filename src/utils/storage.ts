import { PlayerProfile, GameHistoryItem } from '../types/game';
import { BADGES_LIST } from '../data/badges';

const STORAGE_KEY = 'smart_kids_adventure_profile_v1';

export const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Little Learner',
  avatar: '🦊',
  stars: 0,
  points: 0,
  gamesPlayed: 0,
  badgesUnlocked: [],
  history: [],
  settings: {
    soundEnabled: true,
    speechEnabled: true,
    volume: 80,
  },
};

export const loadProfile = (): PlayerProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      settings: {
        ...DEFAULT_PROFILE.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load profile', e);
    return DEFAULT_PROFILE;
  }
};

export const saveProfile = (profile: PlayerProfile): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

export const checkNewBadges = (profile: PlayerProfile, lastHistoryItem?: GameHistoryItem): string[] => {
  const newlyUnlocked: string[] = [];
  const currentBadges = new Set(profile.badgesUnlocked);

  BADGES_LIST.forEach(badge => {
    if (currentBadges.has(badge.id)) return;

    let unlock = false;

    switch (badge.type) {
      case 'stars':
        if (profile.stars >= badge.requiredCount) unlock = true;
        break;
      case 'games_played':
        if (badge.category === 'all') {
          if (profile.gamesPlayed >= badge.requiredCount) unlock = true;
        } else {
          const catCount = profile.history.filter(h => h.game === badge.category).length;
          if (catCount >= badge.requiredCount) unlock = true;
        }
        break;
      case 'math_streak':
        if (profile.history.some(h => h.game === 'math')) unlock = true;
        break;
      case 'perfect_round':
        if (lastHistoryItem && lastHistoryItem.score === lastHistoryItem.total && lastHistoryItem.total >= 5) {
          unlock = true;
        }
        break;
      case 'memory_master':
        if (profile.history.some(h => h.game === 'memory')) unlock = true;
        break;
      case 'puzzle_pro':
        if (profile.history.some(h => h.game === 'puzzle')) unlock = true;
        break;
      default:
        break;
    }

    if (unlock) {
      newlyUnlocked.push(badge.id);
    }
  });

  return newlyUnlocked;
};
