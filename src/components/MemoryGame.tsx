import React, { useState, useEffect } from 'react';
import { Difficulty, GameHistoryItem, MemoryCard } from '../types/game';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  HelpCircle,
  Trophy,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface MemoryGameProps {
  difficulty: Difficulty;
  onFinishRound: (historyItem: GameHistoryItem) => void;
  onBackToMenu: () => void;
  onChangeDifficulty: () => void;
}

interface ThemeItem {
  id: string;
  name: string;
  pairs: { emoji: string; name: string }[];
}

const THEMES: ThemeItem[] = [
  {
    id: 'animals',
    name: 'Safari Animals',
    pairs: [
      { emoji: '🦁', name: 'Lion' },
      { emoji: '🐘', name: 'Elephant' },
      { emoji: '🦒', name: 'Giraffe' },
      { emoji: '🐒', name: 'Monkey' },
      { emoji: '🐼', name: 'Panda' },
      { emoji: '🦊', name: 'Fox' },
      { emoji: '🦓', name: 'Zebra' },
      { emoji: '🐯', name: 'Tiger' },
    ],
  },
  {
    id: 'space',
    name: 'Cosmic Space',
    pairs: [
      { emoji: '🚀', name: 'Rocket' },
      { emoji: '🛸', name: 'UFO' },
      { emoji: '🪐', name: 'Saturn' },
      { emoji: '⭐', name: 'Star' },
      { emoji: '🌙', name: 'Moon' },
      { emoji: '☄️', name: 'Comet' },
      { emoji: '👨‍🚀', name: 'Astronaut' },
      { emoji: '🌌', name: 'Galaxy' },
    ],
  },
  {
    id: 'treats',
    name: 'Sweet Treats',
    pairs: [
      { emoji: '🍓', name: 'Strawberry' },
      { emoji: '🍉', name: 'Watermelon' },
      { emoji: '🍦', name: 'Ice Cream' },
      { emoji: '🍩', name: 'Donut' },
      { emoji: '🧁', name: 'Cupcake' },
      { emoji: '🍪', name: 'Cookie' },
      { emoji: '🍭', name: 'Lollipop' },
      { emoji: '🍎', name: 'Apple' },
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean Friends',
    pairs: [
      { emoji: '🐬', name: 'Dolphin' },
      { emoji: '🐙', name: 'Octopus' },
      { emoji: '🐢', name: 'Turtle' },
      { emoji: '🦀', name: 'Crab' },
      { emoji: '🐳', name: 'Whale' },
      { emoji: '🐠', name: 'Tropical Fish' },
      { emoji: '🦈', name: 'Shark' },
      { emoji: '🦭', name: 'Seal' },
    ],
  },
];

export const MemoryGame: React.FC<MemoryGameProps> = ({
  difficulty,
  onFinishRound,
  onBackToMenu,
  onChangeDifficulty,
}) => {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [totalPairs, setTotalPairs] = useState<number>(3);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Initialize game board based on difficulty
  const startNewGame = (themeIdx = selectedThemeIndex) => {
    let pairCount = 3; // Easy: 6 cards (3 pairs)
    if (difficulty === 'medium') pairCount = 6; // Medium: 12 cards (6 pairs)
    if (difficulty === 'hard') pairCount = 8; // Hard: 16 cards (8 pairs)

    setTotalPairs(pairCount);
    setMoves(0);
    setMatchedPairs(0);
    setTimeElapsed(0);
    setIsTimerRunning(false);
    setIsGameOver(false);
    setFlippedCards([]);
    setStatusFeedback(null);

    const activeTheme = THEMES[themeIdx];
    const chosenPairs = activeTheme.pairs.slice(0, pairCount);

    const deck: MemoryCard[] = [];
    chosenPairs.forEach((item, index) => {
      // First card of pair
      deck.push({
        id: `card_${index}_a`,
        pairId: index,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
      // Second card of pair
      deck.push({
        id: `card_${index}_b`,
        pairId: index,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    const shuffledDeck = deck.sort(() => 0.5 - Math.random());
    setCards(shuffledDeck);
  };

  useEffect(() => {
    startNewGame(selectedThemeIndex);
  }, [difficulty, selectedThemeIndex]);

  // Timer tick
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && !isGameOver) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, isGameOver]);

  const handleCardClick = (index: number) => {
    // Prevent clicking if 2 cards already flipped or card is already revealed/matched
    if (flippedCards.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }

    soundManager.playCardFlip();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If this is the second card flipped:
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = updatedCards[firstIdx];
      const secondCard = updatedCards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        soundManager.playMatch();
        setStatusFeedback('🎉 Match!');

        try {
          confetti({
            particleCount: 20,
            spread: 50,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore
        }

        setTimeout(() => {
          setCards(prevCards => {
            const nextCards = [...prevCards];
            nextCards[firstIdx].isMatched = true;
            nextCards[secondIdx].isMatched = true;
            return nextCards;
          });
          setMatchedPairs(prev => {
            const newCount = prev + 1;
            if (newCount === totalPairs) {
              handleGameVictory(moves + 1);
            }
            return newCount;
          });
          setFlippedCards([]);
          setStatusFeedback(null);
        }, 500);
      } else {
        // NO MATCH -> Try Again! Flip back
        soundManager.playMistake();
        setStatusFeedback('Try Again! 👀');

        setTimeout(() => {
          setCards(prevCards => {
            const nextCards = [...prevCards];
            nextCards[firstIdx].isFlipped = false;
            nextCards[secondIdx].isFlipped = false;
            return nextCards;
          });
          setFlippedCards([]);
          setStatusFeedback(null);
        }, 1000);
      }
    }
  };

  const handleGameVictory = (finalMoves: number) => {
    setIsGameOver(true);
    setIsTimerRunning(false);
    soundManager.playVictory();

    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }

    // Calculate stars:
    // Perfect: moves <= pairs * 1.5 -> 3 stars
    // Good: moves <= pairs * 2.2 -> 2 stars
    // Completed: 1 star
    let earnedStars = 1;
    if (finalMoves <= totalPairs * 1.5) {
      earnedStars = 3;
    } else if (finalMoves <= totalPairs * 2.3) {
      earnedStars = 2;
    }

    const historyItem: GameHistoryItem = {
      id: `memory_${Date.now()}`,
      game: 'memory',
      difficulty,
      score: totalPairs,
      total: totalPairs,
      starsEarned: earnedStars,
      date: new Date().toLocaleDateString(),
      timeSpentSeconds: timeElapsed,
    };

    onFinishRound(historyItem);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Grid styling based on card count
  const getGridCols = () => {
    if (difficulty === 'easy') return 'grid-cols-3 max-w-lg'; // 6 cards (2 rows of 3)
    if (difficulty === 'medium') return 'grid-cols-3 sm:grid-cols-4 max-w-2xl'; // 12 cards (3 rows of 4)
    return 'grid-cols-4 max-w-2xl'; // 16 cards (4 rows of 4)
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-3xl border-3 border-amber-200 shadow-xs">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
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
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <h2 className="font-['Fredoka',sans-serif] text-xl font-bold text-amber-950">
                Memory Match
              </h2>
              <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                {difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Meters: Moves, Matches, Time */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
          <div className="bg-amber-50 px-3 py-1.5 rounded-2xl border-2 border-amber-200 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-900">
            <span>Moves:</span>
            <span className="font-['Fredoka',sans-serif] text-base tabular-nums">{moves}</span>
          </div>

          <div className="bg-emerald-50 px-3 py-1.5 rounded-2xl border-2 border-emerald-200 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-900">
            <span>Pairs:</span>
            <span className="font-['Fredoka',sans-serif] text-base tabular-nums">
              {matchedPairs}/{totalPairs}
            </span>
          </div>

          <div className="bg-sky-50 px-3 py-1.5 rounded-2xl border-2 border-sky-200 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-900">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="font-['Fredoka',sans-serif] text-base tabular-nums">
              {formatTime(timeElapsed)}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              startNewGame();
            }}
            className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors border border-amber-200 cursor-pointer"
            title="Restart board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Theme Picker Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        <span className="text-xs font-bold text-amber-900/70 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          Theme:
        </span>
        {THEMES.map((theme, idx) => (
          <button
            key={theme.id}
            onClick={() => {
              soundManager.playClick();
              setSelectedThemeIndex(idx);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedThemeIndex === idx
                ? 'bg-purple-600 text-white shadow-xs scale-105'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-amber-200'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      {/* Feedback Banner */}
      {statusFeedback && (
        <div className="text-center animate-in zoom-in-95 duration-150">
          <span className="inline-block px-5 py-2 rounded-2xl bg-amber-200 text-amber-950 font-['Fredoka',sans-serif] text-lg font-bold border-2 border-amber-300 shadow-sm">
            {statusFeedback}
          </span>
        </div>
      )}

      {/* Card Grid */}
      <div className={`grid gap-3.5 mx-auto ${getGridCols()}`}>
        {cards.map((card, index) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              disabled={card.isMatched || isGameOver}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-3xl border-4 transition-all duration-300 transform flex flex-col items-center justify-center select-none cursor-pointer ${
                card.isMatched
                  ? 'bg-emerald-100/90 border-emerald-400 scale-95 opacity-80 shadow-inner'
                  : isRevealed
                  ? 'bg-white border-amber-400 shadow-md scale-102'
                  : 'bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 border-amber-300 hover:scale-104 active:scale-95 shadow-lg shadow-orange-500/20'
              }`}
              style={{
                perspective: '1000px',
              }}
            >
              {isRevealed ? (
                <div className="flex flex-col items-center justify-center p-2 animate-in zoom-in-75 duration-200">
                  <span className="text-4xl sm:text-5xl">{card.emoji}</span>
                  <span className="font-['Fredoka',sans-serif] text-xs font-bold text-slate-700 mt-1 truncate max-w-full">
                    {card.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-white/90">
                  <span className="text-3xl sm:text-4xl font-['Fredoka',sans-serif] font-extrabold drop-shadow-xs">
                    ?
                  </span>
                  <Sparkles className="w-4 h-4 text-yellow-200 mt-1" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Game Over Victory Modal */}
      {isGameOver && (
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-400 to-pink-500 text-white flex items-center justify-center text-4xl mx-auto shadow-lg shadow-pink-500/30">
            🎉
          </div>
          <div>
            <h3 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-extrabold text-amber-950">
              Memory Master!
            </h3>
            <p className="text-amber-800 text-sm font-semibold mt-1">
              You found all matching pairs in {moves} moves and {formatTime(timeElapsed)}!
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3].map(st => (
              <span
                key={st}
                className="text-4xl text-amber-400 drop-shadow-xs animate-bounce"
                style={{ animationDelay: `${st * 150}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                startNewGame();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
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
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
