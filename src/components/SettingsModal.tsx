import React, { useState } from 'react';
import { PlayerProfile } from '../types/game';
import { soundManager } from '../utils/sound';
import { X, Volume2, VolumeX, Mic, MicOff, RefreshCw, Check, Sparkles, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  profile: PlayerProfile;
  onClose: () => void;
  onSaveProfile: (updated: PlayerProfile) => void;
  onResetProgress: () => void;
}

const AVATAR_OPTIONS = ['🦊', '🦁', '🐼', '🚀', '🦄', '🦖', '🌟', '🐬', '🐱', '🐶', '🦉', '🐨', '🐯', '🐰'];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
  onResetProgress,
}) => {
  const [name, setName] = useState<string>(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(profile.settings.soundEnabled);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(profile.settings.speechEnabled);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundManager.playClick();
    soundManager.setSoundEnabled(soundEnabled);
    soundManager.setSpeechEnabled(speechEnabled);

    onSaveProfile({
      ...profile,
      name: name.trim() || 'Little Learner',
      avatar: selectedAvatar,
      settings: {
        ...profile.settings,
        soundEnabled,
        speechEnabled,
      },
    });
    onClose();
  };

  const handleSoundToggle = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    soundManager.setSoundEnabled(nextVal);
    if (nextVal) soundManager.playClick();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-200 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors border border-amber-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mx-auto mb-2">
            ⚙️
          </div>
          <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold text-amber-950">
            Game Settings & Profile
          </h2>
          <p className="text-amber-800/80 text-xs sm:text-sm font-semibold mt-1">
            Personalize your adventure experience
          </p>
        </div>

        <div className="space-y-6">
          {/* 1. Kid Name Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Explorer Name:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={e => setName(e.target.value)}
                placeholder="Enter explorer name..."
                className="w-full px-4 py-3 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-['Fredoka',sans-serif] text-lg font-bold text-slate-900 bg-amber-50/30"
              />
            </div>
          </div>

          {/* 2. Avatar Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Choose Avatar:
            </label>
            <div className="grid grid-cols-7 gap-2">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedAvatar(emoji);
                  }}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all cursor-pointer ${
                    selectedAvatar === emoji
                      ? 'bg-amber-100 border-3 border-amber-500 scale-110 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-2 border-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Audio & Speech Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Sound & Voice:
            </label>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-700">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <span className="font-['Fredoka',sans-serif] text-sm font-bold text-slate-900 block">
                    Game Sound Effects
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Play fun chimes, pops, and fanfares
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSoundToggle}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  soundEnabled ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-700">
                  {speechEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-slate-400" />}
                </div>
                <div>
                  <span className="font-['Fredoka',sans-serif] text-sm font-bold text-slate-900 block">
                    Read Questions Aloud
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Spoken audio for younger readers
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSpeechEnabled(prev => !prev)}
                className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                  speechEnabled ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    speechEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. Reset Progress Option */}
          <div className="pt-2 border-t border-slate-100">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Progress (Start Fresh)</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs font-semibold text-rose-950 space-y-2">
                <p>Are you sure? This will clear all collected stars, badges, and history.</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold cursor-pointer"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
            >
              <Check className="w-5 h-5" />
              <span>Save & Continue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
