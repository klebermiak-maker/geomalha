import React, { useState } from 'react';
import { Mission, MeasurementResult } from '../types/geometry';
import { MISSIONS_DATA } from '../data/missionsData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Star, Sparkles, Lightbulb, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';

interface MissionsPanelProps {
  currentMissionIndex: number;
  onSelectMission: (index: number) => void;
  measurements: MeasurementResult;
  completedMissions: number[];
  onCompleteMission: (missionId: number) => void;
  onResetGrid: () => void;
}

export const MissionsPanel: React.FC<MissionsPanelProps> = ({
  currentMissionIndex,
  onSelectMission,
  measurements,
  completedMissions,
  onCompleteMission,
  onResetGrid
}) => {
  const [showHint, setShowHint] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);

  const mission = MISSIONS_DATA[currentMissionIndex] || MISSIONS_DATA[0];
  const { area, perimeter, isSimpleRectangle, boundingBox } = measurements;

  // Verification conditions
  const areaMatches = mission.targetArea === undefined || area === mission.targetArea;
  const perimeterMatches = mission.targetPerimeter === undefined || perimeter === mission.targetPerimeter;

  let shapeMatches = true;
  if (mission.shapeRequirement === 'square') {
    shapeMatches = isSimpleRectangle && !!boundingBox && boundingBox.width === boundingBox.height && boundingBox.width > 0;
  } else if (mission.shapeRequirement === 'rectangle') {
    shapeMatches = isSimpleRectangle && area > 0;
  } else if (mission.shapeRequirement === 'l_shape') {
    // If not a simple rectangle but has non-zero area
    shapeMatches = !isSimpleRectangle && area === mission.targetArea;
  }

  const isSuccess = areaMatches && perimeterMatches && shapeMatches && area > 0;
  const isAlreadyCompleted = completedMissions.includes(mission.id);

  const handleCheckMission = () => {
    if (isSuccess) {
      soundManager.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onCompleteMission(mission.id);
      setCelebrationShown(true);
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    setCelebrationShown(false);
    setShowHint(false);
    onResetGrid();
    if (currentMissionIndex < MISSIONS_DATA.length - 1) {
      onSelectMission(currentMissionIndex + 1);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-4">
      {/* Missions Progress Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Trilha de Desafios do 4º Ano
            </h3>
            <p className="text-xs text-slate-500">
              {completedMissions.length} de {MISSIONS_DATA.length} missões concluídas
            </p>
          </div>
        </div>

        {/* Mission Level Selector Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs py-1">
          {MISSIONS_DATA.map((m, idx) => {
            const isDone = completedMissions.includes(m.id);
            const isCurrent = idx === currentMissionIndex;
            return (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMission(idx);
                  setShowHint(false);
                  setCelebrationShown(false);
                  soundManager.playClick();
                }}
                className={`w-7 h-7 shrink-0 text-xs font-bold rounded-md flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={m.title}
              >
                {isDone ? '✓' : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mission Details */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {mission.title}
              </span>
              <span className="text-[11px] px-1.5 py-0.2 bg-amber-200/70 text-amber-900 rounded font-medium">
                {mission.difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {mission.story}
            </p>
          </div>

          <div className="flex items-center gap-1 text-amber-600 shrink-0">
            {Array.from({ length: mission.stars }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
            ))}
          </div>
        </div>

        {/* Targets Checklist */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {mission.targetArea !== undefined && (
            <div
              className={`p-2 rounded-lg border flex items-center justify-between ${
                areaMatches && area > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span>Meta de Área: <strong>{mission.targetArea} u²</strong></span>
              <span className="font-mono text-xs font-bold">
                {area} / {mission.targetArea}
              </span>
            </div>
          )}

          {mission.targetPerimeter !== undefined && (
            <div
              className={`p-2 rounded-lg border flex items-center justify-between ${
                perimeterMatches && area > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span>Meta de Perímetro: <strong>{mission.targetPerimeter} u</strong></span>
              <span className="font-mono text-xs font-bold">
                {perimeter} / {mission.targetPerimeter}
              </span>
            </div>
          )}
        </div>

        {/* Hint Section */}
        {showHint ? (
          <div className="mt-3 p-2.5 bg-yellow-100/70 border border-yellow-300 rounded-lg text-xs text-yellow-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{mission.hint}</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowHint(true);
              soundManager.playClick();
            }}
            className="mt-2 text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Precisa de uma dica do Professor?</span>
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetGrid}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          title="Limpar malha"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>

        {isSuccess ? (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all animate-bounce"
          >
            <Sparkles className="w-4 h-4" />
            <span>Parabéns! Ir para a Próxima Missão</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleCheckMission}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verificar Meu Desenho</span>
          </button>
        )}
      </div>

      {/* Success banner if solved */}
      {celebrationShown && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-center">
          <p className="text-xs font-bold text-emerald-800">
            🎉 Sensacional! Você acertou em cheio as medidas da figura!
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">
            Área: {area} quadradinhos | Perímetro: {perimeter} unidades de contorno.
          </p>
        </div>
      )}
    </div>
  );
};
