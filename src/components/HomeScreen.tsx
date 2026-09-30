import React from 'react';
import { PlayerProfile, ScreenState, GameCategory } from '../types/game';
import { soundManager } from '../utils/sound';
import { Play, Sparkles, Trophy, BarChart2, BookOpen, Settings as SettingsIcon, Award, Heart } from 'lucide-react';

interface HomeScreenProps {
  profile: PlayerProfile;
  onNavigate: (screen: ScreenState) => void;
  onQuickPlay: () => void;
  onSelectGameCategory: (category: GameCategory) => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onNavigate,
  onQuickPlay,
  onSelectGameCategory,
  onOpenSettings,
}) => {
  const quickGames: {
    category: GameCategory;
    title: string;
    icon: string;
    color: string;
    border: string;
  }[] = [
    { category: 'math', title: 'Math', icon: '🔢', color: 'from-amber-400 to-orange-400', border: 'border-orange-300' },
    { category: 'english', title: 'English', icon: '🔤', color: 'from-sky-400 to-blue-400', border: 'border-blue-300' },
    { category: 'general', title: 'Knowledge', icon: '🌎', color: 'from-emerald-400 to-teal-400', border: 'border-teal-300' },
    { category: 'memory', title: 'Memory', icon: '🧠', color: 'from-purple-400 to-pink-400', border: 'border-pink-300' },
    { category: 'puzzle', title: 'Puzzle', icon: '🧩', color: 'from-rose-400 to-red-400', border: 'border-rose-300' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Player Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-3 border-amber-300/80 rounded-3xl p-5 sm:p-7 shadow-lg shadow-amber-900/5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/40 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-4.5 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white border-3 border-amber-300 shadow-md flex items-center justify-center text-3xl sm:text-4xl shrink-0 transform hover:scale-105 transition-transform duration-200">
            <span>{profile.avatar || '🦊'}</span>
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-800 text-xs sm:text-sm font-bold tracking-wide">
              <span>Welcome Back</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
            <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold text-amber-950">
              Welcome, {profile.name || 'Little Learner'}!
            </h2>
            <p className="text-amber-800/80 text-xs sm:text-sm font-semibold">
              Ready for today&apos;s learning adventure?
            </p>
          </div>
        </div>

        {/* Stats Pills in Player Area */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
            <div className="text-left">
              <span className="block text-[11px] font-bold text-slate-500 leading-tight">Stars</span>
              <span className="font-['Fredoka',sans-serif] text-lg font-bold text-amber-950 tabular-nums">
                {profile.stars}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-xs">
            <Trophy className="w-5 h-5 text-orange-500" />
            <div className="text-left">
              <span className="block text-[11px] font-bold text-slate-500 leading-tight">Badges</span>
              <span className="font-['Fredoka',sans-serif] text-lg font-bold text-amber-950 tabular-nums">
                {profile.badgesUnlocked?.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold tracking-wide border border-amber-300/80 shadow-xs">
          <span>🌟 The Ultimate Fun Learning Experience for Kids</span>
        </div>
        <h1 className="font-['Fredoka',sans-serif] text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent drop-shadow-xs">
          SMART KIDS ADVENTURE
        </h1>
        <p className="font-['Fredoka',sans-serif] text-lg sm:text-2xl font-bold text-amber-900/90 tracking-wide">
          Learn • Play • Explore • Have Fun!
        </p>
      </div>

      {/* Main Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5 pt-2">
        {/* 🎮 Play Now - Primary Big Action */}
        <button
          onClick={() => {
            soundManager.playClick();
            onQuickPlay();
          }}
          className="sm:col-span-2 lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-600/25 border-4 border-emerald-300 hover:scale-102 active:scale-98 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
              🎮
            </div>
            <span className="px-3 py-1 rounded-full bg-white/30 text-white text-xs font-bold uppercase tracking-wider">
              Instant Action
            </span>
          </div>
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold">
                Play Now
              </span>
              <Play className="w-6 h-6 fill-white" />
            </div>
            <p className="text-emerald-100 text-sm font-semibold mt-1">
              Jump straight into a fun challenge and earn stars!
            </p>
          </div>
        </button>

        {/* 📚 Choose Game */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('game-select');
          }}
          className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-xl shadow-orange-500/25 border-4 border-amber-300 hover:scale-102 active:scale-98 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📚
            </div>
            <BookOpen className="w-5 h-5 text-amber-200" />
          </div>
          <div className="mt-6">
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold block">
              Choose Game
            </span>
            <p className="text-orange-100 text-sm font-semibold mt-1">
              Math, English, General Knowledge, Memory & Puzzles
            </p>
          </div>
        </button>

        {/* 🏆 My Rewards */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('rewards');
          }}
          className="p-6 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/25 border-4 border-purple-300 hover:scale-102 active:scale-98 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🏆
            </div>
            <Award className="w-5 h-5 text-purple-200" />
          </div>
          <div className="mt-6">
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold block">
              My Rewards
            </span>
            <p className="text-purple-100 text-sm font-semibold mt-1">
              View your shiny medals, star collection & badges
            </p>
          </div>
        </button>

        {/* 📊 My Progress */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('progress');
          }}
          className="p-6 rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-xl shadow-sky-500/25 border-4 border-sky-300 hover:scale-102 active:scale-98 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📊
            </div>
            <BarChart2 className="w-5 h-5 text-sky-200" />
          </div>
          <div className="mt-6">
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold block">
              My Progress
            </span>
            <p className="text-sky-100 text-sm font-semibold mt-1">
              See your scores, accuracy, and favorite subjects
            </p>
          </div>
        </button>

        {/* ⚙️ Settings */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSettings();
          }}
          className="p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-xl shadow-pink-500/25 border-4 border-rose-300 hover:scale-102 active:scale-98 transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl group-hover:rotate-45 transition-transform duration-300">
              ⚙️
            </div>
            <SettingsIcon className="w-5 h-5 text-rose-200" />
          </div>
          <div className="mt-6">
            <span className="font-['Fredoka',sans-serif] text-2xl font-bold block">
              Settings
            </span>
            <p className="text-rose-100 text-sm font-semibold mt-1">
              Customize avatar, kid name, voice, & sound effects
            </p>
          </div>
        </button>
      </div>

      {/* Quick Launch Strip: 5 Subject Stations */}
      <div className="bg-white/80 backdrop-blur-xs border-3 border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-amber-950">
              Quick Subject Stations
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('game-select');
            }}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            See All Games →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {quickGames.map(game => (
            <button
              key={game.category}
              onClick={() => {
                soundManager.playClick();
                onSelectGameCategory(game.category);
              }}
              className={`p-3.5 rounded-2xl border-2 ${game.border} bg-gradient-to-b from-white to-amber-50/50 hover:shadow-md hover:scale-103 active:scale-95 transition-all text-center flex flex-col items-center gap-1.5 group cursor-pointer`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {game.icon}
              </span>
              <span className="font-['Fredoka',sans-serif] text-sm font-bold text-slate-800">
                {game.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Fun Did-You-Know Kid Fact of the Day */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-100/70 border-2 border-amber-300/80 flex items-start gap-3.5 text-amber-950">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <span className="font-['Fredoka',sans-serif] text-sm font-bold text-amber-900 block">
            Fun Explorer Fact of the Day:
          </span>
          <p className="text-xs sm:text-sm text-amber-800 font-semibold mt-0.5">
            Did you know honeybees do a special waggle dance to tell their bee friends exactly where the sweetest flowers are?
          </p>
        </div>
      </div>
    </div>
  );
};
