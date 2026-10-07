import React, { useState } from 'react';
import { MeasurementResult } from '../types/geometry';
import { Eye, Ruler, Square, HelpCircle, CheckCircle2, Lightbulb, Calculator, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

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
  const [showSmartHints, setShowSmartHints] = useState(true);
  const { area, perimeter, isSimpleRectangle, boundingBox, smartHint, explanation } = measurements;

  const isAreaGoalMet = targetArea !== undefined && area === targetArea;
  const isPerimeterGoalMet = targetPerimeter !== undefined && perimeter === targetPerimeter;

  return (
    <div className="flex flex-col gap-3">
      {/* Cards de Medidas Instantâneas */}
      <div data-tutorial="measurements-cards" className="grid grid-cols-2 gap-3">
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

      {/* Box Didático: Dicas Inteligentes & Fórmulas Matemáticas */}
      <div data-tutorial="measurement-helpers" className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>Dicas Inteligentes & Fórmulas</span>
              </h4>
              <p className="text-[10px] text-slate-400">
                {smartHint ? smartHint.shapeLabel : 'Desenhe para identificar a forma'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Dicas Inteligentes */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowSmartHints(!showSmartHints);
              }}
              className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                showSmartHints
                  ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title={showSmartHints ? 'Ocultar fórmulas explicativas' : 'Ativar fórmulas explicativas'}
            >
              <Lightbulb className={`w-3 h-3 ${showSmartHints ? 'fill-white text-white' : ''}`} />
              <span>{showSmartHints ? 'Dicas Ativas' : 'Ativar Dicas'}</span>
            </button>

            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mini-Aula</span>
            </button>
          </div>
        </div>

        {/* Conteúdo das Dicas Inteligentes */}
        {showSmartHints ? (
          area === 0 ? (
            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-lg text-xs text-slate-600 text-center">
              ✏️ Desenhe qualquer figura na malha quadriculada para ver a fórmula matemática correspondente em tempo real!
            </div>
          ) : smartHint ? (
            <div className="flex flex-col gap-2.5 animate-in fade-in duration-150">
              {/* Cards de Fórmulas Matemáticas da Forma Desenhar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Fórmula da Área */}
                <div className="bg-sky-50/80 border border-sky-200 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold text-sky-900 mb-1">
                    <span>{smartHint.formulaAreaName}</span>
                    <span className="font-mono text-[10px] bg-sky-200/70 text-sky-900 px-1.5 py-0.2 rounded font-bold">
                      Área
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-sky-800 bg-white/90 p-1.5 rounded border border-sky-100">
                    {smartHint.formulaAreaFormula}
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 mt-1.5 font-semibold flex items-center justify-between">
                    <span>Cálculo:</span>
                    <strong className="text-sky-700">{smartHint.formulaAreaCalc}</strong>
                  </div>
                </div>

                {/* Fórmula do Perímetro */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                    <span>{smartHint.formulaPerimeterName}</span>
                    <span className="font-mono text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                      Perímetro
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-800 bg-white/90 p-1.5 rounded border border-amber-100">
                    {smartHint.formulaPerimeterFormula}
                  </div>
                  <div className="text-[11px] font-mono text-slate-700 mt-1.5 font-semibold flex items-center justify-between">
                    <span>Cálculo:</span>
                    <strong className="text-amber-700">{smartHint.formulaPerimeterCalc}</strong>
                  </div>
                </div>
              </div>

              {/* Explicação Didática / Dica de Ouro */}
              <div className="p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <p className="leading-relaxed">
                  {smartHint.pedagogicalTip}
                </p>
              </div>

              {/* Passo a Passo de Raciocínio */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  📝 Passo a Passo Matemático:
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {smartHint.arithmeticSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.2">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-xs text-slate-700">
              <div>{explanation.areaText}</div>
              <div>{explanation.perimeterText}</div>
            </div>
          )
        ) : (
          <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-center justify-between">
            <span>Dicas inteligentes pausadas.</span>
            <button
              onClick={() => setShowSmartHints(true)}
              className="text-amber-700 font-bold hover:underline"
            >
              Ativar para ver fórmulas ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

