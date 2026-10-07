import React from 'react';
import { MeasurementResult } from '../types/geometry';
import { Eye, Ruler, Square, HelpCircle, CheckCircle2 } from 'lucide-react';

interface MeasurementDisplayProps {
  measurements: MeasurementResult;
  showAreaNumbers: boolean;
  setShowAreaNumbers: (show: boolean) => void;
  showPerimeterTicks: boolean;
  setShowPerimeterTicks: (show: boolean) => void;
  targetArea?: number;
  targetPerimeter?: number;
  onOpenHelp: () => void;
}

export const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({
  measurements,
  showAreaNumbers,
  setShowAreaNumbers,
  showPerimeterTicks,
  setShowPerimeterTicks,
  targetArea,
  targetPerimeter,
  onOpenHelp
}) => {
  const { area, perimeter, isSimpleRectangle, boundingBox, explanation } = measurements;

  const isAreaGoalMet = targetArea !== undefined && area === targetArea;
  const isPerimeterGoalMet = targetPerimeter !== undefined && perimeter === targetPerimeter;

  return (
    <div className="flex flex-col gap-3">
      {/* Cards de Medidas Instantâneas */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card: Área */}
        <div
          className={`relative p-3.5 rounded-xl border transition-all ${
            isAreaGoalMet
              ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800">
              <Square className="w-4 h-4 text-sky-600 fill-sky-100" />
              <span>ÁREA (Superfície)</span>
            </div>
            {isAreaGoalMet && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-sky-600" /> Meta atingida!
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {area}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              quadradinhos (u²)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            Espaço que a figura ocupa por dentro.
          </p>

          {/* Toggle para contar quadradinhos */}
          <button
            type="button"
            onClick={() => setShowAreaNumbers(!showAreaNumbers)}
            className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg border transition-colors ${
              showAreaNumbers
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAreaNumbers ? 'Ocultar Números (1, 2...)' : 'Numerar Quadradinhos'}</span>
          </button>
        </div>

        {/* Card: Perímetro */}
        <div
          className={`relative p-3.5 rounded-xl border transition-all ${
            isPerimeterGoalMet
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>PERÍMETRO (Contorno)</span>
            </div>
            {isPerimeterGoalMet && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3 text-amber-600" /> Meta atingida!
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {perimeter}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              unidades de fita (u)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
            Comprimento da linha de volta da figura.
          </p>

          {/* Toggle para contar borda */}
          <button
            type="button"
            onClick={() => setShowPerimeterTicks(!showPerimeterTicks)}
            className={`w-full flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg border transition-colors ${
              showPerimeterTicks
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPerimeterTicks ? 'Ocultar Fita Métrica' : 'Ver Fita Métrica na Borda'}</span>
          </button>
        </div>
      </div>

      {/* Box Didático de Explicação Matemática */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-base">💡</span>
            <h4 className="text-xs font-bold text-slate-800">
              Como Pensar no 4º Ano:
            </h4>
          </div>
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Mini-Aula Ilustrada</span>
          </button>
        </div>

        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="flex items-start gap-2">
            <span className="text-sky-600 font-bold font-mono">Área:</span>
            <span>{explanation.areaText}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 font-bold font-mono">Perímetro:</span>
            <span>{explanation.perimeterText}</span>
          </div>
          {isSimpleRectangle && boundingBox && (
            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
              <span>📐 <strong>Fórmula Rápida:</strong> Como é um retângulo regular ({boundingBox.width} × {boundingBox.height}), você não precisa contar um a um! Basta multiplicar largura × altura para a área.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
