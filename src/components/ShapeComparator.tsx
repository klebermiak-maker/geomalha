import React from 'react';
import { Point } from '../types/geometry';
import { soundManager } from '../utils/audio';
import { ArrowUpDown, Sparkles } from 'lucide-react';

interface ShapeComparatorProps {
  onLoadShape: (cells: Point[]) => void;
}

export const ShapeComparator: React.FC<ShapeComparatorProps> = ({ onLoadShape }) => {
  const comparisonSets = [
    {
      title: 'Descoberta 1: Mesma Área (12 u²), Perímetros Diferentes!',
      description: 'Observe como três figuras com a mesma quantidade de quadradinhos podem ter cercas de tamanhos completamente diferentes!',
      shapes: [
        {
          name: 'Retângulo 3 × 4',
          area: 12,
          perimeter: 14,
          tag: 'Mais compacto (P = 14)',
          cells: [
            { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
            { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }
          ]
        },
        {
          name: 'Retângulo 2 × 6',
          area: 12,
          perimeter: 16,
          tag: 'Mais alongado (P = 16)',
          cells: [
            { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 }, { x: 7, y: 2 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }, { x: 7, y: 3 }
          ]
        },
        {
          name: 'Fita Esticada 1 × 12',
          area: 12,
          perimeter: 26,
          tag: 'Perímetro gigante (P = 26)',
          cells: Array.from({ length: 12 }).map((_, i) => ({ x: 1 + i, y: 4 }))
        }
      ]
    },
    {
      title: 'Descoberta 2: Mesmo Perímetro (16 u), Áreas Diferentes!',
      description: 'Todas estas figuras usam exatamente 16 unidades de contorno, mas cobrem espaços bem diferentes!',
      shapes: [
        {
          name: 'Quadrado 4 × 4',
          area: 16,
          perimeter: 16,
          tag: 'Maior Área Possível! (A = 16)',
          cells: [
            { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
            { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 },
            { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }
          ]
        },
        {
          name: 'Retângulo 5 × 3',
          area: 15,
          perimeter: 16,
          tag: 'Área = 15 u²',
          cells: [
            { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 6, y: 2 },
            { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
            { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }
          ]
        },
        {
          name: 'Retângulo Fino 7 × 1',
          area: 7,
          perimeter: 16,
          tag: 'Menor Área (A = 7 u²)',
          cells: Array.from({ length: 7 }).map((_, i) => ({ x: 2 + i, y: 3 }))
        }
      ]
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
          <ArrowUpDown className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Laboratório de Comparações
          </h3>
          <p className="text-xs text-slate-500">
            Descubra os segredos da geometria do 4º ano!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {comparisonSets.map((set, setIdx) => (
          <div key={setIdx} className="bg-slate-50/70 border border-slate-200 rounded-xl p-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>{set.title}</span>
            </h4>
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              {set.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {set.shapes.map((shape, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white border border-slate-200 hover:border-teal-400 p-2.5 rounded-lg flex flex-col justify-between transition-colors shadow-2xs"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {shape.name}
                    </span>
                    <span className="text-[10px] text-teal-700 font-medium">
                      {shape.tag}
                    </span>
                  </div>

                  <div className="my-2 text-[11px] font-mono space-y-0.5">
                    <div className="flex justify-between text-sky-700">
                      <span>Área:</span>
                      <strong>{shape.area} u²</strong>
                    </div>
                    <div className="flex justify-between text-amber-700">
                      <span>Perímetro:</span>
                      <strong>{shape.perimeter} u</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playPop(520);
                      onLoadShape(shape.cells);
                    }}
                    className="w-full py-1 text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors"
                  >
                    Ver na Malha ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
