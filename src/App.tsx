import React, { useState, useEffect } from 'react';
import { 
  ScreenState, 
  GameCategory, 
  Difficulty, 
  PlayerProfile, 
  GameHistoryItem 
} from './types/game';
import { loadProfile, saveProfile, checkNewBadges, DEFAULT_PROFILE } from './utils/storage';
import { soundManager } from './utils/sound';
import { BADGES_LIST } from './data/badges';
import confetti from 'canvas-confetti';

import { TopNav } from './components/TopNav';
import { HomeScreen } from './components/HomeScreen';
import { GameSelection } from './components/GameSelection';
import { DifficultyModal } from './components/DifficultyModal';
import { QuizGame } from './components/QuizGame';
import { MemoryGame } from './components/MemoryGame';
import { PuzzleGame } from './components/PuzzleGame';
import { RewardsScreen } from './components/RewardsScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Trophy, X } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('math');
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('easy');
  const [isDifficultyModalOpen, setIsDifficultyModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // New badge unlocked celebration notification
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);

  // Sync sound setting on mount
  useEffect(() => {
    soundManager.setSoundEnabled(profile.settings?.soundEnabled ?? true);
    soundManager.setSpeechEnabled(profile.settings?.speechEnabled ?? true);
  }, []);

  // Save profile to localStorage whenever it updates
  const handleUpdateProfile = (updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile(prev => {
      const next = updater(prev);
      saveProfile(next);
      return next;
    });
  };

  // Quick Play handler: starts an immediate game (Math Challenge on Easy or current difficulty)
  const handleQuickPlay = () => {
    setActiveCategory('math');
    setIsDifficultyModalOpen(true);
  };

  // When user clicks a game category from Home or Game Selection
  const handleSelectGameCategory = (category: GameCategory) => {
    setActiveCategory(category);
    setIsDifficultyModalOpen(true);
  };

  // When user confirms difficulty from the Difficulty Modal
  const handleStartGame = (diff: Difficulty) => {
    setActiveDifficulty(diff);
    setIsDifficultyModalOpen(false);

    if (activeCategory === 'memory') {
      setCurrentScreen('memory');
    } else if (activeCategory === 'puzzle') {
      setCurrentScreen('puzzle');
    } else {
      // math, english, general
      setCurrentScreen('quiz');
    }
  };

  // When a game round finishes: record history, award stars & check for unlocked badges
  const handleFinishRound = (historyItem: GameHistoryItem) => {
    handleUpdateProfile(prev => {
      const updatedStars = prev.stars + historyItem.starsEarned;
      const updatedPoints = prev.points + historyItem.score * 10;
      const updatedGames = prev.gamesPlayed + 1;
      const updatedHistory = [historyItem, ...prev.history];

      const tempProfile: PlayerProfile = {
        ...prev,
        stars: updatedStars,
        points: updatedPoints,
        gamesPlayed: updatedGames,
        history: updatedHistory,
      };

      const newBadges = checkNewBadges(tempProfile, historyItem);
      let badgesUnlocked = [...prev.badgesUnlocked];

      if (newBadges.length > 0) {
        badgesUnlocked = [...badgesUnlocked, ...newBadges];
        const latestBadge = BADGES_LIST.find(b => b.id === newBadges[0]);
        if (latestBadge) {
          setNewBadgeUnlocked(latestBadge.title);
          try {
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.4 },
            });
          } catch {
            // Ignore
          }
        }
      }

      return {
        ...tempProfile,
        badgesUnlocked,
      };
    });
  };

  // Reset entire profile progress
  const handleResetProgress = () => {
    soundManager.playClick();
    setProfile(DEFAULT_PROFILE);
    saveProfile(DEFAULT_PROFILE);
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-amber-50/60 text-slate-800">
      {/* Top Nav Bar */}
      <TopNav
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* New Badge Unlocked Floating Banner */}
      {newBadgeUnlocked && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-5 py-3 rounded-2xl shadow-xl border-2 border-white flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">
                New Badge Unlocked!
              </span>
              <span className="font-['Fredoka',sans-serif] text-base font-bold">
                {newBadgeUnlocked}
              </span>
            </div>
            <button
              onClick={() => setNewBadgeUnlocked(null)}
              className="ml-2 w-7 h-7 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Content */}
      <main className="flex-1 pb-12">
        {currentScreen === 'home' && (
          <HomeScreen
            profile={profile}
            onNavigate={setCurrentScreen}
            onQuickPlay={handleQuickPlay}
            onSelectGameCategory={handleSelectGameCategory}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentScreen === 'game-select' && (
          <GameSelection
            onBack={() => setCurrentScreen('home')}
            onSelectGame={handleSelectGameCategory}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizGame
            category={activeCategory as 'math' | 'english' | 'general' | 'puzzle'}
            difficulty={activeDifficulty}
            onFinishRound={handleFinishRound}
            onBackToMenu={() => setCurrentScreen('game-select')}
            onChangeDifficulty={() => setIsDifficultyModalOpen(true)}
          />
        )}

        {currentScreen === 'memory' && (
          <MemoryGame
            difficulty={activeDifficulty}
            onFinishRound={handleFinishRound}
            onBackToMenu={() => setCurrentScreen('game-select')}
            onChangeDifficulty={() => setIsDifficultyModalOpen(true)}
          />
        )}

        {currentScreen === 'puzzle' && (
          <PuzzleGame
            difficulty={activeDifficulty}
            onFinishRound={handleFinishRound}
            onBackToMenu={() => setCurrentScreen('game-select')}
            onChangeDifficulty={() => setIsDifficultyModalOpen(true)}
          />
        )}

        {currentScreen === 'rewards' && (
          <RewardsScreen
            profile={profile}
            onBack={() => setCurrentScreen('home')}
            onGoToGames={() => setCurrentScreen('game-select')}
          />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen
            profile={profile}
            onBack={() => setCurrentScreen('home')}
            onPlayGame={handleSelectGameCategory}
          />
        )}
      </main>

      {/* Difficulty Selection Modal */}
      <DifficultyModal
        isOpen={isDifficultyModalOpen}
        gameCategory={activeCategory}
        onSelectDifficulty={handleStartGame}
        onClose={() => setIsDifficultyModalOpen(false)}
      />

      {/* Settings & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
        onSaveProfile={updated => {
          setProfile(updated);
          saveProfile(updated);
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Footer */}
      <footer className="border-t border-amber-200/60 bg-white/50 backdrop-blur-xs py-4 px-4 text-center text-xs font-semibold text-slate-500">
        <p>Smart Kids Adventure • Fun & Interactive Learning for Young Explorers (Ages 5–12)</p>
      </footer>
    </div>
  );
}
