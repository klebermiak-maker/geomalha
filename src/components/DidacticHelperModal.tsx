import React from 'react';
import { X, Square, Ruler, Lightbulb, Check } from 'lucide-react';

interface DidacticHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DidacticHelperModal: React.FC<DidacticHelperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Guia Rápido: Área vs Perímetro
              </h3>
              <p className="text-xs text-slate-500">
                Matemática Divertida para o 4º Ano do Ensino Fundamental
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Side-by-side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card: Área */}
          <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-sm">
              <Square className="w-4 h-4 text-sky-600 fill-sky-200" />
              <span>O que é ÁREA?</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              É a <strong>superfície interior</strong> da figura! Pense como colocar <strong>azulejos no chão</strong> de um quarto ou pintar uma parede.
            </p>
            <div className="bg-white border border-sky-200 p-2.5 rounded-lg text-xs space-y-1">
              <div className="text-sky-900 font-semibold">Como medimos na malha?</div>
              <p className="text-slate-600 text-[11px]">
                Contando quantos <strong>quadradinhos de 1×1</strong> cabem dentro da figura.
              </p>
              <div className="text-sky-700 font-mono text-[11px] font-bold">
                Unidade: u² (unidades quadradas)
              </div>
            </div>
          </div>

          {/* Card: Perímetro */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>O que é PERÍMETRO?</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              É o <strong>contorno externo</strong> da figura! Pense como construir uma <strong>cerca ao redor</strong> de um sítio ou passar uma fita métrica na borda.
            </p>
            <div className="bg-white border border-amber-200 p-2.5 rounded-lg text-xs space-y-1">
              <div className="text-amber-900 font-semibold">Como medimos na malha?</div>
              <p className="text-slate-600 text-[11px]">
                Contando os <strong>tracinhos dos lados</strong> dos quadradinhos na borda.
              </p>
              <div className="text-amber-700 font-mono text-[11px] font-bold">
                Unidade: u (unidades lineares)
              </div>
            </div>
          </div>
        </div>

        {/* Retângulo Dica de Ouro */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>O Truque do Retângulo (Para não precisar contar um por um):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 mt-2">
            <div className="bg-white/80 p-2 rounded border border-emerald-100">
              <span className="font-bold text-emerald-800 block">Área do Retângulo:</span>
              <span>Multiplique <strong>Base × Altura</strong></span>
              <p className="text-[11px] text-slate-500 mt-0.5">Ex: 4 colunas × 3 linhas = 12 quadradinhos!</p>
            </div>
            <div className="bg-white/80 p-2 rounded border border-emerald-100">
              <span className="font-bold text-emerald-800 block">Perímetro do Retângulo:</span>
              <span>Some os <strong>4 lados</strong>: (2 × base) + (2 × altura)</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Ex: 4 + 3 + 4 + 3 = 14 unidades de cerca!</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Entendi tudo! Vamos jogar!</span>
        </button>
      </div>
    </div>
  );
};
