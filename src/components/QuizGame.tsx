import React, { useState, useEffect } from 'react';
import { Difficulty, GameCategory, Question, GameHistoryItem } from '../types/game';
import { QUESTIONS_BANK } from '../data/questions';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  CheckCircle2, 
  Heart,
  Smile,
  ListOrdered
} from 'lucide-react';

interface QuizGameProps {
  category: 'math' | 'english' | 'general' | 'puzzle';
  difficulty: Difficulty;
  onFinishRound: (historyItem: GameHistoryItem) => void;
  onBackToMenu: () => void;
  onChangeDifficulty: () => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({
  category,
  difficulty,
  onFinishRound,
  onBackToMenu,
  onChangeDifficulty,
}) => {
  // Filter questions by category and difficulty
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<{
    question: Question;
    selected: string;
    isCorrect: boolean;
  }[]>([]);
  const [startTime] = useState<number>(Date.now());

  // Setup questions round (10 questions max, shuffled)
  useEffect(() => {
    let pool = QUESTIONS_BANK.filter(
      q => q.category === category && q.difficulty === difficulty
    );

    // If pool is small, supplement with same category
    if (pool.length < 5) {
      pool = QUESTIONS_BANK.filter(q => q.category === category);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const roundQuestions = shuffled.slice(0, 10);
    setQuestions(roundQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setShowHint(false);
    setIsCompleted(false);
    setAnswersLog([]);
  }, [category, difficulty]);

  const currentQ: Question | undefined = questions[currentIndex];

  const handleSpeak = (text: string) => {
    soundManager.speak(text);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked || !currentQ) return;
    soundManager.playClick();
    setSelectedOption(option);
    setIsAnswerChecked(true);

    const isCorrect = option.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      soundManager.playSuccess();
      setScore(prev => prev + 1);
      // Small celebratory confetti burst for correct answers
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
        });
      } catch {
        // Ignore
      }
    } else {
      soundManager.playMistake();
    }

    setAnswersLog(prev => [
      ...prev,
      {
        question: currentQ,
        selected: option,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setShowHint(false);
    } else {
      // Completed round
      finishRound();
    }
  };

  const finishRound = () => {
    setIsCompleted(true);
    soundManager.playVictory();

    // Trigger big celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignore
    }

    const totalQuestions = questions.length || 10;
    const finalScore = score + (selectedOption === currentQ?.correctAnswer ? 1 : 0);

    // Calculate stars: 3 stars for >= 80%, 2 stars for >= 50%, 1 star for participating
    let earnedStars = 1;
    const ratio = finalScore / totalQuestions;
    if (ratio >= 0.8) earnedStars = 3;
    else if (ratio >= 0.5) earnedStars = 2;

    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    const historyItem: GameHistoryItem = {
      id: `quiz_${Date.now()}`,
      game: category,
      difficulty,
      score: finalScore,
      total: totalQuestions,
      starsEarned: earnedStars,
      date: new Date().toLocaleDateString(),
      timeSpentSeconds: timeSpent,
    };

    onFinishRound(historyItem);
  };

  const categoryNames: Record<string, { title: string; icon: string; theme: string }> = {
    math: { title: 'Math Challenge', icon: '🔢', theme: 'from-amber-500 to-orange-500' },
    english: { title: 'English Fun', icon: '🔤', theme: 'from-sky-500 to-blue-500' },
    general: { title: 'General Knowledge', icon: '🌎', theme: 'from-emerald-500 to-teal-500' },
    puzzle: { title: 'Puzzle Fun', icon: '🧩', theme: 'from-rose-500 to-red-500' },
  };

  const currentTheme = categoryNames[category] || { title: 'Quiz Challenge', icon: '🎮', theme: 'from-amber-500 to-orange-500' };

  if (!currentQ && !isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 animate-spin">
          ⏳
        </div>
        <p className="font-['Fredoka',sans-serif] text-xl text-amber-950 font-bold">
          Setting up your adventure questions...
        </p>
      </div>
    );
  }

  // Summary / Victory Screen at end of 10 questions
  if (isCompleted) {
    const totalQ = questions.length || 10;
    const stars = score >= 8 ? 3 : score >= 5 ? 2 : 1;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center space-y-6">
          {/* Trophy Header */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-300 mx-auto flex items-center justify-center text-5xl shadow-lg shadow-amber-400/30">
            🏆
          </div>

          <div>
            <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-extrabold text-amber-950">
              {score >= 8 ? 'Outstanding Adventure!' : score >= 5 ? 'Super Job, Explorer!' : 'Great Effort! Keep Going!'}
            </h2>
            <p className="text-amber-800/80 font-bold text-sm sm:text-base mt-1">
              You completed the {currentTheme.title} ({difficulty.toUpperCase()})
            </p>
          </div>

          {/* Stars Awarded */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3].map(st => (
              <div
                key={st}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-3 transition-all duration-300 ${
                  st <= stars
                    ? 'bg-amber-100 border-amber-400 text-amber-500 scale-110 shadow-md'
                    : 'bg-slate-100 border-slate-200 text-slate-300'
                }`}
              >
                ★
              </div>
            ))}
          </div>

          {/* Score Box */}
          <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-4 max-w-sm mx-auto flex items-center justify-around">
            <div>
              <span className="text-xs font-bold text-slate-500 block">Score</span>
              <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-950 tabular-nums">
                {score} / {totalQ}
              </span>
            </div>
            <div className="w-px h-8 bg-amber-200" />
            <div>
              <span className="text-xs font-bold text-slate-500 block">Stars Earned</span>
              <span className="font-['Fredoka',sans-serif] text-2xl font-bold text-amber-600 tabular-nums">
                +{stars} ⭐
              </span>
            </div>
          </div>

          {/* Quick Review List */}
          <div className="text-left bg-slate-50 rounded-2xl p-4 border border-slate-200 max-h-56 overflow-y-auto space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
              <ListOrdered className="w-4 h-4 text-amber-600" />
              <span>Round Summary Review</span>
            </div>
            {answersLog.map((log, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 ${
                  log.isCorrect
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/80 border-rose-200 text-rose-950'
                }`}
              >
                <div className="truncate flex-1">
                  <span className="font-bold mr-1">Q{idx + 1}:</span>
                  <span>{log.question.question}</span>
                </div>
                <div className="shrink-0 flex items-center gap-1 font-bold">
                  {log.isCorrect ? (
                    <span className="text-emerald-700">✓ Correct</span>
                  ) : (
                    <span className="text-rose-700">Ans: {log.question.correctAnswer}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                // Restart same quiz
                setCurrentIndex(0);
                setScore(0);
                setSelectedOption(null);
                setIsAnswerChecked(false);
                setShowHint(false);
                setIsCompleted(false);
                setAnswersLog([]);
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
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-900 font-['Fredoka',sans-serif] text-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Change Level</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onBackToMenu();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-['Fredoka',sans-serif] text-lg font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Other Games</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const isCorrect = selectedOption?.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* HUD Header */}
      <div className="flex items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-3xl border-3 border-amber-200 shadow-xs">
        {/* Back Button */}
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

        {/* Game & Question Progress Indicator */}
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">{currentTheme.icon}</span>
            <span className="font-['Fredoka',sans-serif] text-base sm:text-lg font-bold text-amber-950">
              {currentTheme.title}
            </span>
            <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {difficulty}
            </span>
          </div>
          <span className="font-['Fredoka',sans-serif] text-sm font-bold text-orange-600 block mt-0.5 tabular-nums">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Current Round Score */}
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="font-['Fredoka',sans-serif] text-base font-bold text-amber-900 tabular-nums">
            {score}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Read Aloud Button & Visual Emoji */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(`${currentQ.question}. ${currentQ.options.join(', ')}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-amber-200"
              title="Click to hear question read aloud!"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Read to Me 🔊</span>
            </button>
          </div>

          {/* Hint Trigger */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowHint(prev => !prev);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-yellow-100 hover:bg-yellow-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer border border-yellow-300"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint? 💡'}</span>
          </button>
        </div>

        {/* Hint Box (if active) */}
        {showHint && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 text-xs sm:text-sm text-amber-900 font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
            <span className="text-xl shrink-0">💡</span>
            <div className="flex-1">
              <strong className="block text-amber-950 font-bold mb-0.5">Helpful Clue:</strong>
              {currentQ.hint}
            </div>
          </div>
        )}

        {/* Visual Cue or Illustrated Emoji */}
        {currentQ.visualEmoji && (
          <div className="text-center py-2">
            <div className="inline-block px-5 py-3 rounded-2xl bg-amber-50/80 border-2 border-amber-200 text-3xl sm:text-4xl shadow-inner select-none">
              {currentQ.visualEmoji}
            </div>
          </div>
        )}

        {/* Question Text */}
        <div className="text-center space-y-2">
          <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
            {currentQ.question}
          </h2>
          {currentQ.subtext && (
            <p className="text-sm font-semibold text-slate-500">
              {currentQ.subtext}
            </p>
          )}
        </div>

        {/* Multiple Choice Options Grid (A, B, C, D) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {currentQ.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
            const isSelected = selectedOption === opt;
            const isTargetCorrect = opt.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

            let optionStyle = 'bg-white border-3 border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800 shadow-xs';
            let badgeStyle = 'bg-amber-100 text-amber-900';

            if (isAnswerChecked) {
              if (isSelected) {
                if (isTargetCorrect) {
                  optionStyle = 'bg-emerald-100 border-3 border-emerald-500 text-emerald-950 shadow-md scale-102';
                  badgeStyle = 'bg-emerald-500 text-white';
                } else {
                  optionStyle = 'bg-rose-100 border-3 border-rose-400 text-rose-950 shadow-md';
                  badgeStyle = 'bg-rose-500 text-white';
                }
              } else if (isTargetCorrect) {
                // Highlight the correct answer gently so the child learns!
                optionStyle = 'bg-emerald-50 border-3 border-emerald-400 text-emerald-900';
                badgeStyle = 'bg-emerald-400 text-white';
              } else {
                optionStyle = 'opacity-50 border-slate-200 bg-slate-50 text-slate-400';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswerChecked}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 sm:p-5 rounded-2xl text-left font-['Fredoka',sans-serif] text-lg sm:text-xl font-bold flex items-center gap-3.5 transition-all duration-200 cursor-pointer ${optionStyle}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${badgeStyle}`}>
                  {letter}
                </div>
                <span className="flex-1 break-words">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Box & Explanation */}
        {isAnswerChecked && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 space-y-4 pt-3">
            <div
              className={`p-4 sm:p-5 rounded-2xl border-3 flex items-start gap-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                  : 'bg-amber-50 border-amber-400 text-amber-950'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                {isCorrect ? '🎉' : '💡'}
              </div>
              <div className="flex-1">
                <h3 className="font-['Fredoka',sans-serif] text-xl font-bold flex items-center gap-2">
                  {isCorrect ? (
                    <>
                      <span>Great Job!</span>
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                    </>
                  ) : (
                    <>
                      <span>Nice Try!</span>
                      <Smile className="w-5 h-5 text-amber-600" />
                    </>
                  )}
                </h3>
                <p className="text-sm font-semibold mt-1 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            {/* Next Question Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-['Fredoka',sans-serif] text-lg font-bold shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Next Question →' : 'See Round Results! 🏆'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
