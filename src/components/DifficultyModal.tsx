import React from 'react';
import { Difficulty, GameCategory } from '../types/game';
import { soundManager } from '../utils/sound';
import { X, Sparkles, Zap, Flame } from 'lucide-react';

interface DifficultyModalProps {
  isOpen: boolean;
  gameCategory: GameCategory;
  onSelectDifficulty: (diff: Difficulty) => void;
  onClose: () => void;
}

export const DifficultyModal: React.FC<DifficultyModalProps> = ({
  isOpen,
  gameCategory,
  onSelectDifficulty,
  onClose,
}) => {
  if (!isOpen) return null;

  const gameTitles: Record<GameCategory, { title: string; icon: string }> = {
    math: { title: 'Math Challenge', icon: '🔢' },
    english: { title: 'English Fun', icon: '🔤' },
    general: { title: 'General Knowledge', icon: '🌎' },
    memory: { title: 'Memory Match', icon: '🧠' },
    puzzle: { title: 'Puzzle Fun', icon: '🧩' },
  };

  const current = gameTitles[gameCategory] || { title: 'Game', icon: '🎮' };

  const options: {
    level: Difficulty;
    title: string;
    ageLabel: string;
    description: string;
    icon: React.ReactNode;
    colorClasses: string;
    borderClasses: string;
    bgAccent: string;
  }[] = [
    {
      level: 'easy',
      title: 'Easy',
      ageLabel: 'Great for Ages 5–7',
      description: gameCategory === 'memory' 
        ? '6 cards (3 pairs) • Gentle pace'
        : 'Friendly numbers, basic words, emojis & hints',
      icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
      colorClasses: 'from-emerald-50 to-teal-50 text-emerald-950',
      borderClasses: 'border-emerald-300 hover:border-emerald-500 hover:shadow-emerald-200/50',
      bgAccent: 'bg-emerald-500 text-white',
    },
    {
      level: 'medium',
      title: 'Medium',
      ageLabel: 'Great for Ages 7–9',
      description: gameCategory === 'memory'
        ? '12 cards (6 pairs) • Steady challenge'
        : 'Two-digit math, richer vocabulary, fun facts',
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      colorClasses: 'from-amber-50 to-yellow-50 text-amber-950',
      borderClasses: 'border-amber-300 hover:border-amber-500 hover:shadow-amber-200/50',
      bgAccent: 'bg-amber-500 text-white',
    },
    {
      level: 'hard',
      title: 'Hard',
      ageLabel: 'Great for Ages 9–12',
      description: gameCategory === 'memory'
        ? '16 cards (8 pairs) • Memory master'
        : 'Multiplication, division, tricky grammar & riddles',
      icon: <Flame className="w-6 h-6 text-rose-600" />,
      colorClasses: 'from-rose-50 to-orange-50 text-rose-950',
      borderClasses: 'border-rose-300 hover:border-rose-500 hover:shadow-rose-200/50',
      bgAccent: 'bg-rose-500 text-white',
    },
  ];

  const handleSelect = (diff: Difficulty) => {
    soundManager.playClick();
    onSelectDifficulty(diff);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-200 p-6 sm:p-8 relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 flex items-center justify-center transition-colors border border-amber-200"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 inline-block select-none">{current.icon}</span>
          <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold text-amber-950">
            {current.title}
          </h2>
          <p className="text-amber-800/80 font-medium text-sm sm:text-base mt-1">
            Choose your challenge level to begin!
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3.5">
          {options.map(opt => (
            <button
              key={opt.level}
              onClick={() => handleSelect(opt.level)}
              className={`w-full p-4 sm:p-5 rounded-2xl border-3 text-left transition-all duration-200 bg-gradient-to-r ${opt.colorClasses} ${opt.borderClasses} hover:scale-102 hover:shadow-lg active:scale-98 flex items-center gap-4 group cursor-pointer`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-['Fredoka',sans-serif] text-xl font-bold">
                    {opt.title}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-amber-200/60 text-slate-700">
                    {opt.ageLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
                  {opt.description}
                </p>
              </div>
              <div className="shrink-0 font-['Fredoka',sans-serif] text-sm font-bold px-3 py-1.5 rounded-xl bg-white/90 text-amber-900 border border-amber-200/80 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                Play →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
