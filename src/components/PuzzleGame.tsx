import React, { useState, useEffect } from 'react';
import { Difficulty, GameHistoryItem } from '../types/game';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Trophy, 
  Lightbulb,
  ArrowRight,
  Puzzle,
  Shuffle
} from 'lucide-react';

interface PuzzleGameProps {
  difficulty: Difficulty;
  onFinishRound: (historyItem: GameHistoryItem) => void;
  onBackToMenu: () => void;
  onChangeDifficulty: () => void;
}

interface PatternPuzzle {
  id: string;
  type: 'pattern';
  title: string;
  sequence: string[];
  options: string[];
  correct: string;
  hint: string;
  explanation: string;
}

interface OddOnePuzzle {
  id: string;
  type: 'odd_one';
  title: string;
  items: { emoji: string; label: string; isOdd: boolean; reason: string }[];
  hint: string;
  explanation: string;
}

interface NumberOrderPuzzle {
  id: string;
  type: 'number_order';
  title: string;
  targetCount: number; // e.g. 5 for easy, 8 for medium, 10 for hard
}

type ActivePuzzle = PatternPuzzle | OddOnePuzzle | NumberOrderPuzzle;

const PUZZLE_ITEMS_EASY: ActivePuzzle[] = [
  {
    id: 'pat_e1',
    type: 'pattern',
    title: 'Complete the Fruit Pattern!',
    sequence: ['🍎', '🍌', '🍎', '🍌', '❓'],
    options: ['🍎', '🍌', '🍇', '🍊'],
    correct: '🍎',
    hint: 'Look closely: Apple, Banana, Apple, Banana... what comes next?',
    explanation: 'The pattern alternates between Apple and Banana. Next is Apple 🍎!',
  },
  {
    id: 'odd_e1',
    type: 'odd_one',
    title: 'Find the Odd One Out!',
    items: [
      { emoji: '🐱', label: 'Cat', isOdd: false, reason: 'Lives on land' },
      { emoji: '🐶', label: 'Dog', isOdd: false, reason: 'Lives on land' },
      { emoji: '🐰', label: 'Rabbit', isOdd: false, reason: 'Lives on land' },
      { emoji: '🐠', label: 'Fish', isOdd: true, reason: 'Swims in water with fins!' },
    ],
    hint: 'Three of these animals walk on land, but one swims underwater!',
    explanation: 'The Fish 🐠 is the odd one out because it swims in water!',
  },
  {
    id: 'num_e1',
    type: 'number_order',
    title: 'Tap the Numbers in Order (1 to 5)!',
    targetCount: 5,
  },
  {
    id: 'pat_e2',
    type: 'pattern',
    title: 'Complete the Star Pattern!',
    sequence: ['⭐', '🌙', '⭐', '🌙', '❓'],
    options: ['⭐', '🌙', '☀️', '☁️'],
    correct: '⭐',
    hint: 'Star, Moon, Star, Moon...',
    explanation: 'Star ⭐ repeats after the Moon!',
  },
  {
    id: 'odd_e2',
    type: 'odd_one',
    title: 'Which one is NOT a sweet fruit?',
    items: [
      { emoji: '🍓', label: 'Strawberry', isOdd: false, reason: 'Fruit' },
      { emoji: '🥦', label: 'Broccoli', isOdd: true, reason: 'A green vegetable!' },
      { emoji: '🍉', label: 'Watermelon', isOdd: false, reason: 'Fruit' },
      { emoji: '🍇', label: 'Grapes', isOdd: false, reason: 'Fruit' },
    ],
    hint: 'Three are sweet juicy fruits, one is a crunchy green vegetable!',
    explanation: 'Broccoli 🥦 is a vegetable, not a fruit!',
  },
];

const PUZZLE_ITEMS_MED: ActivePuzzle[] = [
  {
    id: 'pat_m1',
    type: 'pattern',
    title: 'Complete the Shape Pattern!',
    sequence: ['🔴', '🔷', '⭐', '🔴', '🔷', '❓'],
    options: ['⭐', '🔴', '🔷', '🟢'],
    correct: '⭐',
    hint: 'Three repeating shapes: Circle, Diamond, Star...',
    explanation: 'Circle, Diamond, Star repeats! The missing piece is Star ⭐.',
  },
  {
    id: 'odd_m1',
    type: 'odd_one',
    title: 'Which vehicle travels in the sky?',
    items: [
      { emoji: '🚗', label: 'Car', isOdd: false, reason: 'Road' },
      { emoji: '🚲', label: 'Bicycle', isOdd: false, reason: 'Road' },
      { emoji: '✈️', label: 'Airplane', isOdd: true, reason: 'Flies high in the sky!' },
      { emoji: '🚌', label: 'Bus', isOdd: false, reason: 'Road' },
    ],
    hint: 'Three roll on wheels on roads, but one flies among clouds!',
    explanation: 'The Airplane ✈️ flies through the clouds!',
  },
  {
    id: 'num_m1',
    type: 'number_order',
    title: 'Tap the Numbers in Order (1 to 8)!',
    targetCount: 8,
  },
  {
    id: 'pat_m2',
    type: 'pattern',
    title: 'Count Up Pattern!',
    sequence: ['2️⃣', '4️⃣', '6️⃣', '❓'],
    options: ['8️⃣', '7️⃣', '🔟', '9️⃣'],
    correct: '8️⃣',
    hint: 'Counting by 2s: 2, 4, 6...',
    explanation: '2 + 2 = 4, 4 + 2 = 6, 6 + 2 = 8!',
  },
];

const PUZZLE_ITEMS_HARD: ActivePuzzle[] = [
  {
    id: 'pat_h1',
    type: 'pattern',
    title: 'Double Trouble Pattern!',
    sequence: ['🍎', '🍎', '🍌', '🍎', '🍎', '❓'],
    options: ['🍌', '🍎', '🍇', '🍍'],
    correct: '🍌',
    hint: 'Two apples, one banana, two apples...',
    explanation: 'Two apples then one banana! Next is Banana 🍌.',
  },
  {
    id: 'num_h1',
    type: 'number_order',
    title: 'Number Sprint (1 to 10)!',
    targetCount: 10,
  },
  {
    id: 'odd_h1',
    type: 'odd_one',
    title: 'Which shape is a 3D solid?',
    items: [
      { emoji: '⬛', label: 'Square', isOdd: false, reason: 'Flat 2D shape' },
      { emoji: '🔺', label: 'Triangle', isOdd: false, reason: 'Flat 2D shape' },
      { emoji: '📦', label: 'Cube Box', isOdd: true, reason: '3D solid object with volume!' },
      { emoji: '⚪', label: 'Circle', isOdd: false, reason: 'Flat 2D shape' },
    ],
    hint: 'Three are flat drawings, one can hold things inside it!',
    explanation: 'A Cube Box 📦 is 3D, while squares, triangles, and circles are flat 2D shapes!',
  },
  {
    id: 'pat_h2',
    type: 'pattern',
    title: 'Directional Logic Pattern!',
    sequence: ['⬆️', '➡️', '⬇️', '⬅️', '⬆️', '❓'],
    options: ['➡️', '⬇️', '⬅️', '↗️'],
    correct: '➡️',
    hint: 'Clockwise turn: Up, Right, Down, Left, Up...',
    explanation: 'Turning clockwise like hands of a clock! Next is Right ➡️.',
  },
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  difficulty,
  onFinishRound,
  onBackToMenu,
  onChangeDifficulty,
}) => {
  const [puzzleList, setPuzzleList] = useState<ActivePuzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Number order minigame specific state
  const [numberTiles, setNumberTiles] = useState<{ num: number; tapped: boolean }[]>([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState<number>(1);

  // Initialize round
  useEffect(() => {
    let pool = PUZZLE_ITEMS_EASY;
    if (difficulty === 'medium') pool = PUZZLE_ITEMS_MED;
    if (difficulty === 'hard') pool = PUZZLE_ITEMS_HARD;

    setPuzzleList(pool);
    setCurrentIndex(0);
    setScore(0);
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setShowHint(false);
    setIsComplete(false);

    setupPuzzle(pool[0]);
  }, [difficulty]);

  const setupPuzzle = (puzzle: ActivePuzzle) => {
    setIsAnswerChecked(false);
    setSelectedAnswer(null);
    setShowHint(false);

    if (puzzle && puzzle.type === 'number_order') {
      const count = puzzle.targetCount;
      const tiles = Array.from({ length: count }, (_, i) => ({
        num: i + 1,
        tapped: false,
      })).sort(() => 0.5 - Math.random());
      setNumberTiles(tiles);
      setNextExpectedNumber(1);
    }
  };

  const currentPuzzle = puzzleList[currentIndex];

  const handleSelectPatternOption = (opt: string) => {
    if (isAnswerChecked || !currentPuzzle || currentPuzzle.type !== 'pattern') return;
    soundManager.playClick();
    setSelectedAnswer(opt);
    setIsAnswerChecked(true);

    const isCorrect = opt === currentPuzzle.correct;
    if (isCorrect) {
      soundManager.playSuccess();
      setScore(prev => prev + 1);
      try {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignore
      }
    } else {
      soundManager.playMistake();
    }
  };

  const handleSelectOddItem = (itemEmoji: string, isOdd: boolean) => {
    if (isAnswerChecked || !currentPuzzle || currentPuzzle.type !== 'odd_one') return;
    soundManager.playClick();
    setSelectedAnswer(itemEmoji);
    setIsAnswerChecked(true);

    if (isOdd) {
      soundManager.playSuccess();
      setScore(prev => prev + 1);
      try {
        confetti({ particleCount: 25, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignore
      }
    } else {
      soundManager.playMistake();
    }
  };

  const handleNumberTileClick = (num: number) => {
    if (isAnswerChecked) return;

    if (num === nextExpectedNumber) {
      soundManager.playClick();
      const updated = numberTiles.map(t => (t.num === num ? { ...t, tapped: true } : t));
      setNumberTiles(updated);

      if (num === (currentPuzzle as NumberOrderPuzzle).targetCount) {
        // Completed number train!
        soundManager.playSuccess();
        setScore(prev => prev + 1);
        setIsAnswerChecked(true);
        try {
          confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
        } catch {
          // Ignore
        }
      } else {
        setNextExpectedNumber(prev => prev + 1);
      }
    } else {
      // Wrong number tapped
      soundManager.playMistake();
    }
  };

  const handleNextPuzzle = () => {
    soundManager.playClick();
    if (currentIndex + 1 < puzzleList.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupPuzzle(puzzleList[nextIdx]);
    } else {
      // Completed all puzzles
      finishRound();
    }
  };

  const finishRound = () => {
    setIsComplete(true);
    soundManager.playVictory();

    try {
      confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
    } catch {
      // Ignore
    }

    const total = puzzleList.length;
    let starsEarned = 1;
    if (score >= total * 0.8) starsEarned = 3;
    else if (score >= total * 0.5) starsEarned = 2;

    const historyItem: GameHistoryItem = {
      id: `puzzle_${Date.now()}`,
      game: 'puzzle',
      difficulty,
      score,
      total,
      starsEarned,
      date: new Date().toLocaleDateString(),
      timeSpentSeconds: 60,
    };

    onFinishRound(historyItem);
  };

  if (!currentPuzzle && !isComplete) return null;

  if (isComplete) {
    const total = puzzleList.length;
    const stars = score >= total * 0.8 ? 3 : score >= total * 0.5 ? 2 : 1;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 mx-auto flex items-center justify-center text-5xl shadow-lg shadow-rose-400/30">
            🧩
          </div>

          <div>
            <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-extrabold text-amber-950">
              Puzzle Detective Super Solved!
            </h2>
            <p className="text-amber-800/80 font-bold text-sm sm:text-base mt-1">
              You finished all {difficulty.toUpperCase()} puzzles!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3].map(st => (
              <span
                key={st}
                className={`text-4xl sm:text-5xl ${st <= stars ? 'text-amber-400 animate-bounce' : 'text-slate-200'}`}
                style={{ animationDelay: `${st * 150}ms` }}
              >
                ★
              </span>
            ))}
          </div>

          <div className="bg-rose-50 rounded-2xl border-2 border-rose-200 p-4 max-w-sm mx-auto flex items-center justify-around">
            <div>
              <span className="text-xs font-bold text-slate-500 block">Puzzles Solved</span>
              <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-rose-950 tabular-nums">
                {score} / {total}
              </span>
            </div>
            <div className="w-px h-8 bg-rose-200" />
            <div>
              <span className="text-xs font-bold text-slate-500 block">Stars Won</span>
              <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-600 tabular-nums">
                +{stars} ⭐
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setCurrentIndex(0);
                setScore(0);
                setIsComplete(false);
                setupPuzzle(puzzleList[0]);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Play Again</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onChangeDifficulty();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-900 font-['Fredoka',sans-serif] text-lg font-bold cursor-pointer"
            >
              <span>Change Level</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onBackToMenu();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-['Fredoka',sans-serif] text-lg font-bold cursor-pointer"
            >
              <span>Game Selection</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* Header HUD */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-3xl border-3 border-amber-200 shadow-xs">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="w-10 h-10 rounded-2xl bg-amber-100/80 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors cursor-pointer border border-amber-200"
          aria-label="Back to menu"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🧩</span>
            <span className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-amber-950">
              Puzzle Fun
            </span>
            <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
              {difficulty}
            </span>
          </div>
          <span className="font-['Fredoka',sans-serif] text-sm font-bold text-rose-600 block mt-0.5 tabular-nums">
            Puzzle {currentIndex + 1} of {puzzleList.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-['Fredoka',sans-serif] text-base font-bold text-amber-900 tabular-nums">
            {score}
          </span>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentPuzzle.title}
          </h2>
        </div>

        {/* 1. PATTERN PUZZLE */}
        {currentPuzzle.type === 'pattern' && (
          <div className="space-y-6">
            {/* Visual Sequence Train */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-3xl bg-amber-50/70 border-3 border-amber-200 shadow-inner flex-wrap">
              {currentPuzzle.sequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-sm border-2 ${
                    item === '❓'
                      ? 'bg-rose-100 border-rose-300 text-rose-600 font-extrabold animate-pulse'
                      : 'bg-white border-amber-200'
                  }`}
                >
                  {item === '❓' && isAnswerChecked && selectedAnswer ? selectedAnswer : item}
                </div>
              ))}
            </div>

            {/* Hint Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(prev => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-yellow-300"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{showHint ? 'Hide Clue' : 'Need a Clue? 💡'}</span>
              </button>
            </div>

            {showHint && (
              <p className="text-xs sm:text-sm text-center font-bold text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                {currentPuzzle.hint}
              </p>
            )}

            {/* Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              {currentPuzzle.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === currentPuzzle.correct;

                let btnStyle = 'bg-white hover:bg-amber-50 border-3 border-amber-200 hover:border-amber-400 text-slate-800 shadow-xs';
                if (isAnswerChecked) {
                  if (isSelected) {
                    btnStyle = isCorrect
                      ? 'bg-emerald-100 border-3 border-emerald-500 scale-105'
                      : 'bg-rose-100 border-3 border-rose-400';
                  } else if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-3 border-emerald-400';
                  } else {
                    btnStyle = 'opacity-40 border-slate-200 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={opt}
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectPatternOption(opt)}
                    className={`p-4 sm:p-5 rounded-3xl flex items-center justify-center text-4xl transition-all duration-200 cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ODD ONE OUT PUZZLE */}
        {currentPuzzle.type === 'odd_one' && (
          <div className="space-y-6">
            <p className="text-center text-xs sm:text-sm font-bold text-slate-600">
              Tap the one that does not belong with the others!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {currentPuzzle.items.map((item) => {
                const isSelected = selectedAnswer === item.emoji;

                let cardStyle = 'bg-white hover:bg-amber-50 border-3 border-amber-200 hover:border-amber-400';
                if (isAnswerChecked) {
                  if (isSelected) {
                    cardStyle = item.isOdd
                      ? 'bg-emerald-100 border-3 border-emerald-500 scale-105'
                      : 'bg-rose-100 border-3 border-rose-400';
                  } else if (item.isOdd) {
                    cardStyle = 'bg-emerald-50 border-3 border-emerald-400';
                  } else {
                    cardStyle = 'opacity-40 border-slate-200 bg-slate-50';
                  }
                }

                return (
                  <button
                    key={item.label}
                    disabled={isAnswerChecked}
                    onClick={() => handleSelectOddItem(item.emoji, item.isOdd)}
                    className={`p-5 rounded-3xl flex flex-col items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer ${cardStyle}`}
                  >
                    <span className="text-5xl">{item.emoji}</span>
                    <span className="font-['Fredoka',sans-serif] text-base font-bold text-slate-800">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(prev => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-yellow-300"
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{showHint ? 'Hide Clue' : 'Need a Clue? 💡'}</span>
              </button>
            </div>

            {showHint && (
              <p className="text-xs sm:text-sm text-center font-bold text-amber-800 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                {currentPuzzle.hint}
              </p>
            )}
          </div>
        )}

        {/* 3. NUMBER ORDER MINIGAME */}
        {currentPuzzle.type === 'number_order' && (
          <div className="space-y-6">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-slate-500 block">Next Target Number</span>
              <span className="font-['Fredoka',sans-serif] text-3xl font-extrabold text-orange-600 tabular-nums">
                {nextExpectedNumber <= currentPuzzle.targetCount ? nextExpectedNumber : 'All Done! 🎉'}
              </span>
            </div>

            {/* Scrambled Number Tiles */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {numberTiles.map(tile => (
                <button
                  key={tile.num}
                  disabled={tile.tapped || isAnswerChecked}
                  onClick={() => handleNumberTileClick(tile.num)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-bold flex items-center justify-center transition-all cursor-pointer ${
                    tile.tapped
                      ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 opacity-60 scale-95'
                      : 'bg-white hover:bg-amber-100 border-3 border-amber-300 text-slate-900 shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {tile.num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback & Explanation Drawer */}
        {isAnswerChecked && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-4 pt-3">
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-3 border-amber-300 flex items-start gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="font-['Fredoka',sans-serif] text-xl font-bold text-amber-950">
                  {currentPuzzle.type === 'number_order'
                    ? 'Super Fast Number Ordering!'
                    : 'Puzzle Solved!'}
                </h3>
                <p className="text-sm font-semibold text-amber-900 mt-1">
                  {currentPuzzle.type === 'pattern' && currentPuzzle.explanation}
                  {currentPuzzle.type === 'odd_one' && currentPuzzle.explanation}
                  {currentPuzzle.type === 'number_order' && 'You tapped every number in perfect counting order!'}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextPuzzle}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>
                  {currentIndex + 1 < puzzleList.length ? 'Next Puzzle →' : 'See Results! 🏆'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
