import React from 'react';
import { ScreenState, PlayerProfile } from '../types/game';
import { Volume2, VolumeX, Sparkles, Trophy, BarChart2, Gamepad2, Settings as SettingsIcon, Home } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface TopNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
  profile: PlayerProfile;
  onUpdateProfile: (updater: (prev: PlayerProfile) => PlayerProfile) => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentScreen,
  onNavigate,
  profile,
  onUpdateProfile,
  onOpenSettings,
}) => {
  const toggleSound = () => {
    const nextState = !profile.settings.soundEnabled;
    soundManager.setSoundEnabled(nextState);
    if (nextState) {
      soundManager.playClick();
    }
    onUpdateProfile(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: nextState,
      },
    }));
  };

  const navItems: { screen: ScreenState; label: string; icon: React.ReactNode }[] = [
    { screen: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { screen: 'game-select', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { screen: 'rewards', label: 'Rewards', icon: <Trophy className="w-4 h-4" /> },
    { screen: 'progress', label: 'Progress', icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-4 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark with playful kid accent */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('home');
          }}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-xl select-none">🚀</span>
          </div>
          <div>
            <span className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent whitespace-nowrap">
              Smart Kids Adventure
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-amber-100/60 p-1 rounded-2xl border border-amber-200/60">
          {navItems.map(item => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(item.screen);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-orange-600 shadow-xs scale-102'
                    : 'text-amber-900/70 hover:text-amber-950 hover:bg-white/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Player Badges/Stars Indicator + Sound & Settings Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Stars Ticker */}
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('rewards');
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 hover:border-amber-400 px-3 py-1.5 rounded-2xl shadow-xs transition-transform active:scale-95 group"
            title="View your collected stars"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="font-['Fredoka',sans-serif] text-base font-bold text-amber-900 tabular-nums">
              {profile.stars}
            </span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleSound}
            aria-label={profile.settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-800 transition-colors border border-amber-200"
            title={profile.settings.soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
          >
            {profile.settings.soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            aria-label="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-800 transition-colors border border-amber-200"
            title="Settings & Profile"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
