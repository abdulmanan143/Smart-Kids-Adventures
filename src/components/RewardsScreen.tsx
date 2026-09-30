import React from 'react';
import { PlayerProfile } from '../types/game';
import { BADGES_LIST } from '../data/badges';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, Trophy, Sparkles, Award, Lock, CheckCircle2 } from 'lucide-react';

interface RewardsScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
  onGoToGames: () => void;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ profile, onBack, onGoToGames }) => {
  const unlockedSet = new Set(profile.badgesUnlocked || []);

  const handleCelebrate = () => {
    soundManager.playVictory();
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-900 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-bold text-amber-950">
              My Rewards & Badges
            </h1>
            <p className="text-amber-800/80 text-xs sm:text-sm font-semibold">
              Celebrate your learning milestones and collected trophies!
            </p>
          </div>
        </div>

        <button
          onClick={handleCelebrate}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-['Fredoka',sans-serif] text-sm font-bold shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 fill-amber-950" />
          <span>Cheer for Me! 🎉</span>
        </button>
      </div>

      {/* Overview Trophy Shelf Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-3 border-amber-300 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-3 border-amber-300 shadow-md flex items-center justify-center text-4xl sm:text-5xl shrink-0">
            🏆
          </div>
          <div>
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-950 block">
              Trophy Hall of Fame
            </span>
            <p className="text-amber-800 text-xs sm:text-sm font-semibold">
              You have unlocked {unlockedSet.size} of {BADGES_LIST.length} special explorer badges!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 text-center shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block leading-tight">Total Stars</span>
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-900 tabular-nums">
              {profile.stars} ⭐
            </span>
          </div>

          <div className="bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 text-center shadow-xs">
            <span className="text-[11px] font-bold text-slate-500 block leading-tight">Games Won</span>
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-orange-600 tabular-nums">
              {profile.gamesPlayed} 🎮
            </span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 pt-2">
        {BADGES_LIST.map(badge => {
          const isUnlocked = unlockedSet.has(badge.id);

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border-3 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/60 border-amber-300 shadow-md hover:scale-102'
                  : 'bg-slate-50/80 border-slate-200 opacity-60'
              }`}
            >
              {isUnlocked && (
                <div className="absolute top-3 right-3 text-emerald-600 flex items-center gap-1 text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Unlocked</span>
                </div>
              )}
              {!isUnlocked && (
                <div className="absolute top-3 right-3 text-slate-400 flex items-center gap-1 text-[11px] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Locked</span>
                </div>
              )}

              <div>
                <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border-2 border-amber-100 flex items-center justify-center text-3xl mb-3">
                  {badge.icon}
                </div>

                <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-slate-900 mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Requirement:</span>
                <span className={isUnlocked ? 'text-emerald-700' : 'text-slate-600'}>
                  {badge.requiredCount} {badge.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onGoToGames();
          }}
          className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-lg shadow-amber-500/25 cursor-pointer inline-flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span>Play Games to Unlock More! →</span>
        </button>
      </div>
    </div>
  );
};
