import React from 'react';
import { GameCategory } from '../types/game';
import { soundManager } from '../utils/sound';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';

interface GameSelectionProps {
  onBack: () => void;
  onSelectGame: (category: GameCategory) => void;
}

interface GameCardItem {
  id: GameCategory;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  gradientBg: string;
  borderColor: string;
  btnColor: string;
  accentBadge: string;
}

export const GameSelection: React.FC<GameSelectionProps> = ({ onBack, onSelectGame }) => {
  const games: GameCardItem[] = [
    {
      id: 'math',
      name: 'Math Challenge',
      icon: '🔢',
      tagline: 'Number Magic & Math Power',
      description: 'Practice addition, subtraction, multiplication, division, number comparison, and counting sequences.',
      features: ['Addition & Subtraction', 'Times Tables & Division', 'Number Patterns'],
      gradientBg: 'from-amber-50 to-orange-50/70',
      borderColor: 'border-amber-300 hover:border-amber-500',
      btnColor: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30',
      accentBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'english',
      name: 'English Fun',
      icon: '🔤',
      tagline: 'Words, Spelling & Stories',
      description: 'Learn words, spelling, vocabulary, opposites, missing words, and sentence building.',
      features: ['Opposites & Rhymes', 'Spelling & Vocabulary', 'Sentence Match'],
      gradientBg: 'from-sky-50 to-blue-50/70',
      borderColor: 'border-sky-300 hover:border-sky-500',
      btnColor: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30',
      accentBadge: 'bg-sky-100 text-sky-900 border-sky-300',
    },
    {
      id: 'general',
      name: 'General Knowledge',
      icon: '🌎',
      tagline: 'Explore Our Big Planet',
      description: 'Answer fun questions about friendly animals, green nature, human body, deep space, weather, and world wonders.',
      features: ['Animals & Habitats', 'Nature & Space', 'Human Body Facts'],
      gradientBg: 'from-emerald-50 to-teal-50/70',
      borderColor: 'border-emerald-300 hover:border-emerald-500',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30',
      accentBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      id: 'memory',
      name: 'Memory Match',
      icon: '🧠',
      tagline: 'Find the Matching Pairs',
      description: 'Flip face-down cards to match friendly animals, fruits, and cute space items. Sharpens attention and recall.',
      features: ['6, 12, or 16 Cards', 'Visual Themes', 'Move & Time Tracker'],
      gradientBg: 'from-purple-50 to-pink-50/70',
      borderColor: 'border-purple-300 hover:border-purple-500',
      btnColor: 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/30',
      accentBadge: 'bg-purple-100 text-purple-900 border-purple-300',
    },
    {
      id: 'puzzle',
      name: 'Puzzle Fun',
      icon: '🧩',
      tagline: 'Brain Teasers & Mysteries',
      description: 'Solve colorful shape patterns, find the odd one out, arrange numbers, and crack playful logic riddles.',
      features: ['Pattern Completers', 'Find the Odd Item', 'Logic Riddles'],
      gradientBg: 'from-rose-50 to-red-50/70',
      borderColor: 'border-rose-300 hover:border-rose-500',
      btnColor: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30',
      accentBadge: 'bg-rose-100 text-rose-900 border-rose-300',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Header with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-900 flex items-center justify-center shadow-xs transition-colors group cursor-pointer"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h1 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-bold text-amber-950">
              Choose Your Game
            </h1>
            <p className="text-amber-800/80 text-xs sm:text-sm font-semibold">
              Pick any learning world you want to explore!
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white border border-amber-300 shadow-xs text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Earn 1–3 Stars in each game!</span>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
        {games.map(game => (
          <div
            key={game.id}
            className={`rounded-3xl border-3 ${game.borderColor} bg-gradient-to-b ${game.gradientBg} p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1`}
          >
            <div>
              {/* Card Top: Icon & Badge */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border-2 border-white flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${game.accentBadge}`}>
                  {game.tagline}
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900 mb-1.5">
                {game.name}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-4">
                {game.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 mb-6">
                {game.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectGame(game.id);
              }}
              className={`w-full py-3.5 px-5 rounded-2xl font-['Fredoka',sans-serif] text-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${game.btnColor}`}
            >
              <span>Play Game</span>
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
