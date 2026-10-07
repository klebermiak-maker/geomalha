import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MeasurementResult, LightningRound } from '../types/geometry';
import { LIGHTNING_ROUNDS } from '../data/lightningData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Zap,
  Timer,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Flame,
  Trophy,
  Lightbulb,
  Pause
} from 'lucide-react';

interface LightningChallengeProps {
  measurements: MeasurementResult;
  onResetGrid: () => void;
}

export const LightningChallenge: React.FC<LightningChallengeProps> = ({
  measurements,
  onResetGrid
}) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'success' | 'timeout' | 'completed'>('idle');
  const [timeLeft, setTimeLeft] = useState(45);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('geomalha_lightning_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [showHint, setShowHint] = useState(false);
  const [roundPointsEarned, setRoundPointsEarned] = useState(0);

  const round = LIGHTNING_ROUNDS[roundIndex] || LIGHTNING_ROUNDS[0];
  const { area, perimeter, isSimpleRectangle, boundingBox } = measurements;

  // Verification
  const areaMatches = round.targetArea === undefined || area === round.targetArea;
  const perimeterMatches = round.targetPerimeter === undefined || perimeter === round.targetPerimeter;

  let shapeMatches = true;
  if (round.shapeRequirement === 'square') {
    shapeMatches = isSimpleRectangle && !!boundingBox && boundingBox.width === boundingBox.height && boundingBox.width > 0;
  } else if (round.shapeRequirement === 'rectangle') {
    shapeMatches = isSimpleRectangle && area > 0;
  } else if (round.shapeRequirement === 'l_shape') {
    shapeMatches = !isSimpleRectangle && area === round.targetArea;
  }

  const isRoundSolved = areaMatches && perimeterMatches && shapeMatches && area > 0;

  // Start round
  const handleStartRound = useCallback(() => {
    onResetGrid();
    setTimeLeft(round.timeLimit);
    setShowHint(false);
    setGameState('playing');
    soundManager.playPop(540);
  }, [round.timeLimit, onResetGrid]);

  // Round success completion
  const handleRoundSuccess = useCallback(() => {
    const timeBonus = timeLeft * 5;
    const earned = round.pointsReward + timeBonus;
    setRoundPointsEarned(earned);

    const newScore = score + earned;
    setScore(newScore);
    const newStreak = streak + 1;
    setStreak(newStreak);

    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem('geomalha_lightning_highscore', newScore.toString());
      } catch {
        // ignore
      }
    }

    setGameState('success');
    soundManager.playSuccess();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, [timeLeft, round.pointsReward, score, streak, highScore]);

  // Next round
  const handleNextRound = () => {
    if (roundIndex < LIGHTNING_ROUNDS.length - 1) {
      setRoundIndex(i => i + 1);
      onResetGrid();
      const nextRound = LIGHTNING_ROUNDS[roundIndex + 1];
      setTimeLeft(nextRound.timeLimit);
      setShowHint(false);
      setGameState('idle');
      soundManager.playClick();
    } else {
      setGameState('completed');
      soundManager.playSuccess();
    }
  };

  // Restart all
  const handleRestartGame = () => {
    setRoundIndex(0);
    setScore(0);
    setStreak(0);
    onResetGrid();
    setTimeLeft(LIGHTNING_ROUNDS[0].timeLimit);
    setGameState('idle');
    soundManager.playClick();
  };

  // Timer interval
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameState('timeout');
          setStreak(0);
          soundManager.playTimeout();
          return 0;
        }

        // Audio ticks
        if (prev <= 5) {
          soundManager.playWarningBeep();
        } else if (prev <= 10) {
          soundManager.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check goal in real-time if playing
  useEffect(() => {
    if (gameState === 'playing' && isRoundSolved) {
      handleRoundSuccess();
    }
  }, [gameState, isRoundSolved, handleRoundSuccess]);

  // Percentage of time remaining
  const timePercent = Math.max(0, Math.min(100, (timeLeft / round.timeLimit) * 100));

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3.5">
      {/* Header with Arcade Score & Streak */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Zap className="w-5 h-5 fill-amber-200" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Desafio Relâmpago ⚡</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                {roundIndex + 1}/{LIGHTNING_ROUNDS.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Desenhe antes do cronômetro zerar!
            </p>
          </div>
        </div>

        {/* Score & Streak Badges */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-700 px-2 py-1 rounded-lg text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-rose-500" />
              <span>{streak}x</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>{score} pts</span>
          </div>
        </div>
      </div>

      {/* Countdown Timer HUD Card */}
      <div className={`p-3.5 rounded-xl border transition-all ${
        gameState === 'timeout'
          ? 'bg-rose-50 border-rose-300'
          : gameState === 'success'
          ? 'bg-emerald-50 border-emerald-300'
          : timeLeft <= 5 && gameState === 'playing'
          ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/50'
          : timeLeft <= 12 && gameState === 'playing'
          ? 'bg-amber-50 border-amber-300'
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Timer className={`w-4 h-4 ${
              timeLeft <= 5 && gameState === 'playing'
                ? 'text-rose-600 animate-spin'
                : 'text-slate-600'
            }`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {gameState === 'playing' ? 'Tempo Restante' : gameState === 'paused' ? 'Jogo Pausado' : 'Cronômetro'}
            </span>
          </div>

          <div className={`text-2xl font-mono font-extrabold tracking-tight ${
            gameState === 'timeout'
              ? 'text-rose-600'
              : timeLeft <= 5 && gameState === 'playing'
              ? 'text-rose-600 animate-pulse'
              : timeLeft <= 12 && gameState === 'playing'
              ? 'text-amber-600'
              : 'text-slate-900'
          }`}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Progress Bar of Timer */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            style={{ width: `${timePercent}%` }}
            className={`h-full transition-all duration-300 ${
              timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 12 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </div>
      </div>

      {/* Round Target Objective */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            {round.title}
          </span>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
            +{round.pointsReward} pts
          </span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 leading-snug">
          {round.instruction}
        </h4>

        {/* Live Targets Checklist */}
        <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
          {round.targetArea !== undefined && (
            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              areaMatches && area > 0
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <span>Área: <strong>{round.targetArea} u²</strong></span>
              <span className="font-mono text-xs">
                {area} / {round.targetArea} {areaMatches && area > 0 ? '✓' : ''}
              </span>
            </div>
          )}

          {round.targetPerimeter !== undefined && (
            <div className={`p-2 rounded-lg border flex items-center justify-between ${
              perimeterMatches && area > 0
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <span>Perímetro: <strong>{round.targetPerimeter} u</strong></span>
              <span className="font-mono text-xs">
                {perimeter} / {round.targetPerimeter} {perimeterMatches && area > 0 ? '✓' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Hint toggle */}
        {showHint ? (
          <div className="p-2 bg-yellow-100/90 border border-yellow-300 rounded-lg text-xs text-yellow-900 flex items-start gap-1.5 mt-1">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{round.hint}</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowHint(true);
              soundManager.playClick();
            }}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 mt-1 w-fit"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Precisa de uma dica rápida?</span>
          </button>
        )}
      </div>

      {/* Game State Control Buttons */}
      <div>
        {gameState === 'idle' && (
          <button
            onClick={handleStartRound}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 animate-bounce"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>LIGAR CRONÔMETRO E COMEÇAR! ⚡</span>
          </button>
        )}

        {gameState === 'playing' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGameState('paused');
                soundManager.playClick();
              }}
              className="p-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Pausar cronômetro"
            >
              <Pause className="w-4 h-4" />
            </button>

            <button
              onClick={onResetGrid}
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              disabled={!isRoundSolved}
              onClick={handleRoundSuccess}
              className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isRoundSolved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isRoundSolved ? 'Meta Atingida! Validar' : 'Desenhe para atingir a meta'}</span>
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <button
            onClick={() => {
              setGameState('playing');
              soundManager.playClick();
            }}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continuar Rodada</span>
          </button>
        )}

        {gameState === 'success' && (
          <div className="flex flex-col gap-2 animate-in fade-in">
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-center">
              <span className="text-sm font-extrabold text-emerald-900 block">
                ⚡ SENSACIONAL! VOCÊ FOI MUITO RÁPIDO!
              </span>
              <span className="text-xs text-emerald-800 mt-0.5 block">
                +{roundPointsEarned} pontos conquistados (+{timeLeft * 5} bônus de tempo)!
              </span>
            </div>

            <button
              onClick={handleNextRound}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 animate-bounce"
            >
              <span>{roundIndex < LIGHTNING_ROUNDS.length - 1 ? 'Próxima Rodada Relâmpago' : 'Ver Resultado Final'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {gameState === 'timeout' && (
          <div className="flex flex-col gap-2 animate-in fade-in">
            <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl text-center">
              <span className="text-sm font-bold text-rose-900 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>O tempo acabou!</span>
              </span>
              <span className="text-xs text-rose-800 mt-0.5 block">
                Não desanime! Na matemática, rapidez vem com a prática.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleStartRound}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Tentar de Novo</span>
              </button>

              <button
                onClick={handleNextRound}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                Pular Rodada
              </button>
            </div>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-center flex flex-col items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h4 className="text-base font-extrabold text-slate-900">
              CAMPEÃO DO DESAFIO RELÂMPAGO!
            </h4>
            <p className="text-xs text-slate-600">
              Você completou todas as 10 rodadas contra o tempo com pontuação final de:
            </p>
            <div className="text-2xl font-mono font-extrabold text-amber-700">
              {score} Pontos!
            </div>
            <button
              onClick={handleRestartGame}
              className="mt-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Jogar Novamente ⚡
            </button>
          </div>
        )}
      </div>

      {/* Record info footer */}
      {highScore > 0 && (
        <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 border-t border-slate-100 pt-2 font-mono">
          <span>Melhor Recorde Pessoal:</span>
          <strong className="text-amber-700">{highScore} pts</strong>
        </div>
      )}
    </div>
  );
};
