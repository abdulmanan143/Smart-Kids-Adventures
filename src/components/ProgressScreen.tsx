import React from 'react';
import { PlayerProfile, GameCategory } from '../types/game';
import { soundManager } from '../utils/sound';
import { ArrowLeft, BarChart2, Sparkles, Trophy, Clock, CheckCircle2, Flame, Award } from 'lucide-react';

interface ProgressScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
  onPlayGame: (category: GameCategory) => void;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({ profile, onBack, onPlayGame }) => {
  const history = profile.history || [];

  // Metrics
  const totalQuestions = history.reduce((sum, h) => sum + h.total, 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalTimeSeconds = history.reduce((sum, h) => sum + (h.timeSpentSeconds || 0), 0);
  const totalTimeMinutes = Math.round(totalTimeSeconds / 60);

  // Subject Stats
  const subjects: { category: GameCategory; name: string; icon: string; color: string; border: string }[] = [
    { category: 'math', name: 'Math Challenge', icon: '🔢', color: 'from-amber-400 to-orange-400', border: 'border-amber-300' },
    { category: 'english', name: 'English Fun', icon: '🔤', color: 'from-sky-400 to-blue-400', border: 'border-blue-300' },
    { category: 'general', name: 'General Knowledge', icon: '🌎', color: 'from-emerald-400 to-teal-400', border: 'border-teal-300' },
    { category: 'memory', name: 'Memory Match', icon: '🧠', color: 'from-purple-400 to-pink-400', border: 'border-pink-300' },
    { category: 'puzzle', name: 'Puzzle Fun', icon: '🧩', color: 'from-rose-400 to-red-400', border: 'border-rose-300' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
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
            My Learning Progress
          </h1>
          <p className="text-amber-800/80 text-xs sm:text-sm font-semibold">
            Track your accomplishments, accuracy, and practice time!
          </p>
        </div>
      </div>

      {/* Top 4 Stats Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-3xl border-3 border-amber-300 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mx-auto mb-2">
            <Sparkles className="w-5 h-5 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-slate-500 block">Total Stars</span>
          <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-950 tabular-nums">
            {profile.stars} ⭐
          </span>
        </div>

        <div className="bg-white rounded-3xl border-3 border-emerald-300 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 block">Overall Accuracy</span>
          <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-emerald-900 tabular-nums">
            {overallAccuracy}%
          </span>
        </div>

        <div className="bg-white rounded-3xl border-3 border-sky-300 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 mx-auto mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 block">Games Played</span>
          <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-sky-950 tabular-nums">
            {profile.gamesPlayed}
          </span>
        </div>

        <div className="bg-white rounded-3xl border-3 border-purple-300 p-4 shadow-sm text-center">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-500 block">Time Spent</span>
          <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-purple-950 tabular-nums">
            {totalTimeMinutes > 0 ? `${totalTimeMinutes}m` : `${totalTimeSeconds}s`}
          </span>
        </div>
      </div>

      {/* Subject Mastery Breakdown */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 shadow-sm space-y-4">
        <h2 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-amber-600" />
          <span>Subject Activity & Mastery</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {subjects.map(sub => {
            const subHistory = history.filter(h => h.game === sub.category);
            const roundsCount = subHistory.length;
            const subCorrect = subHistory.reduce((s, h) => s + h.score, 0);
            const subTotal = subHistory.reduce((s, h) => s + h.total, 0);
            const subAcc = subTotal > 0 ? Math.round((subCorrect / subTotal) * 100) : 0;

            return (
              <div
                key={sub.category}
                className={`p-4 rounded-2xl border-2 ${sub.border} bg-amber-50/40 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sub.icon}</span>
                      <span className="font-['Fredoka',sans-serif] text-lg font-bold text-slate-900">
                        {sub.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-bold text-slate-600 mt-2">
                    <div className="flex justify-between">
                      <span>Rounds Finished:</span>
                      <span className="text-slate-900 tabular-nums">{roundsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="text-emerald-700 tabular-nums">
                        {roundsCount > 0 ? `${subAcc}%` : 'Not yet played'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onPlayGame(sub.category);
                  }}
                  className="mt-4 w-full py-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 font-['Fredoka',sans-serif] text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  Play {sub.name.split(' ')[0]} →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 shadow-sm space-y-4">
        <h2 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>🎮 Recent Game Sessions</span>
        </h2>

        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold text-sm">
            <span className="text-3xl block mb-2">🚀</span>
            No game sessions yet! Start your first adventure above to see your history.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {history.slice(0, 10).map((item, index) => (
              <div key={item.id || index} className="py-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
                    {item.game === 'math' && '🔢'}
                    {item.game === 'english' && '🔤'}
                    {item.game === 'general' && '🌎'}
                    {item.game === 'memory' && '🧠'}
                    {item.game === 'puzzle' && '🧩'}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 capitalize block">
                      {item.game} Challenge
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium">
                      Level: {item.difficulty.toUpperCase()} • {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="font-['Fredoka',sans-serif] text-base font-bold text-slate-900 tabular-nums block">
                      {item.score} / {item.total}
                    </span>
                    <span className="text-amber-600 text-xs font-bold">
                      +{item.starsEarned} ⭐
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
