import React, { useState } from 'react';
import { Point } from '../types/geometry';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Search, CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface DetectiveQuizProps {
  onLoadShapeToGrid: (cells: Point[]) => void;
}

export const DetectiveQuiz: React.FC<DetectiveQuizProps> = ({ onLoadShapeToGrid }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const question = QUIZ_QUESTIONS[currentIdx] || QUIZ_QUESTIONS[0];

  // When question mounts or changes, load the shape to the grid
  React.useEffect(() => {
    onLoadShapeToGrid(question.cells);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIdx, onLoadShapeToGrid, question]);

  const handleSelectOption = (opt: number) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === question.correctAnswer) {
      soundManager.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setScore(s => s + 10);
      setStreak(st => st + 1);
    } else {
      soundManager.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      // Completed all
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Detetive de Medidas
            </h3>
            <p className="text-xs text-slate-500">
              Questão {currentIdx + 1} de {QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-xs font-bold text-amber-800">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{score} pts</span>
          </div>
          {streak > 1 && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              🔥 {streak} seguidos!
            </span>
          )}
        </div>
      </div>

      {/* Question Prompt */}
      <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
          {question.type === 'area' ? '🟦 Desafio de Área' : '📏 Desafio de Perímetro'}
        </span>
        <h4 className="text-sm font-bold text-slate-800 mt-1">
          {question.type === 'area'
            ? 'Qual é a ÁREA da figura desenhada na malha ao lado?'
            : 'Qual é o PERÍMETRO (contorno) da figura desenhada na malha ao lado?'}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Observe a malha quadriculada. Você pode ativar os contadores para conferir!
        </p>
      </div>

      {/* Multiple Choice Options */}
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((opt) => {
          let btnStyle = 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100';

          if (isAnswered) {
            if (opt === question.correctAnswer) {
              btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
            } else if (opt === selectedOption) {
              btnStyle = 'bg-rose-100 border-rose-300 text-rose-800 line-through';
            } else {
              btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
            }
          }

          return (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt)}
              className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt} {question.unit}</span>
              {isAnswered && opt === question.correctAnswer && (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              )}
              {isAnswered && opt === selectedOption && opt !== question.correctAnswer && (
                <XCircle className="w-4 h-4 text-rose-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box after Answer */}
      {isAnswered && (
        <div className={`p-3 rounded-xl text-xs border leading-relaxed ${
          selectedOption === question.correctAnswer
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="font-bold mb-1 flex items-center gap-1.5">
            {selectedOption === question.correctAnswer ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Excelente dedução, detetive!</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Não foi dessa vez, mas veja a explicação:</span>
              </>
            )}
          </div>
          <p>{question.explanation}</p>
        </div>
      )}

      {/* Next Question Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Próximo Enigma' : 'Recomeçar Quiz'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
