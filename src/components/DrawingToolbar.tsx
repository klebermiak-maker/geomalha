import React from 'react';
import { GridMode, ActiveTool, StampShape } from '../types/geometry';
import { soundManager } from '../utils/audio';
import {
  Paintbrush,
  Eraser,
  Stamp,
  RotateCcw,
  Sparkles,
  Square,
  Spline,
  Undo2
} from 'lucide-react';

interface DrawingToolbarProps {
  mode: GridMode;
  onModeChange: (mode: GridMode) => void;
  activeTool: ActiveTool;
  onActiveToolChange: (tool: ActiveTool) => void;
  color: string;
  onColorChange: (color: string) => void;
  onClear: () => void;
  onUndo: () => void;
  canUndo: boolean;
  selectedStamp: StampShape;
  onStampSelect: (stamp: StampShape) => void;
  isPolygonClosed: boolean;
  onClosePolygon: () => void;
  vertexCount: number;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  mode,
  onModeChange,
  activeTool,
  onActiveToolChange,
  color,
  onColorChange,
  onClear,
  onUndo,
  canUndo,
  selectedStamp,
  onStampSelect,
  isPolygonClosed,
  onClosePolygon,
  vertexCount
}) => {
  const colors = [
    { id: 'blue', label: 'Azul', bg: 'bg-sky-400', ring: 'ring-sky-500' },
    { id: 'emerald', label: 'Verde', bg: 'bg-emerald-400', ring: 'ring-emerald-500' },
    { id: 'amber', label: 'Laranja', bg: 'bg-amber-400', ring: 'ring-amber-500' },
    { id: 'rose', label: 'Rosa', bg: 'bg-rose-400', ring: 'ring-rose-500' },
    { id: 'violet', label: 'Roxo', bg: 'bg-violet-400', ring: 'ring-violet-500' }
  ];

  const stamps: { id: StampShape; label: string }[] = [
    { id: 'square', label: 'Quadrado (3×3)' },
    { id: 'rectangle', label: 'Retângulo (4×2)' },
    { id: 'l_shape', label: 'Forma em L' },
    { id: 't_shape', label: 'Forma em T' },
    { id: 'cross', label: 'Cruz (+)' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Segmented Mode Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => {
            soundManager.playClick();
            onModeChange('cells');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === 'cells'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Paintbrush className="w-3.5 h-3.5 text-amber-600" />
          <span>Pintar Quadradinhos</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onModeChange('vertices');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === 'vertices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Spline className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ligar Vértices (Polígono)</span>
        </button>
      </div>

      {/* Tools for Mode: Cells */}
      {mode === 'cells' && (
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tool actions */}
          <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onActiveToolChange('draw');
              }}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                activeTool === 'draw'
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Lápis para pintar quadradinhos"
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pincel</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onActiveToolChange('erase');
              }}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                activeTool === 'erase'
                  ? 'bg-rose-100 border-rose-300 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Borracha para apagar"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Borracha</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onActiveToolChange('stamp');
              }}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                activeTool === 'stamp'
                  ? 'bg-teal-100 border-teal-300 text-teal-900'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Carimbar forma pronta"
            >
              <Stamp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Carimbos</span>
            </button>
          </div>

          {/* Stamp selector if stamp tool is active */}
          {activeTool === 'stamp' && (
            <div className="flex items-center gap-1">
              <select
                value={selectedStamp}
                onChange={(e) => onStampSelect(e.target.value as StampShape)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-md py-1 px-2 font-medium text-slate-800 focus:outline-none"
              >
                {stamps.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Color palette */}
          <div className="flex items-center gap-1.5">
            {colors.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  soundManager.playClick();
                  onColorChange(c.id);
                }}
                className={`w-5 h-5 rounded-full ${c.bg} transition-all ${
                  color === c.id ? `ring-2 ring-offset-1 ${c.ring} scale-110` : 'opacity-70 hover:opacity-100'
                }`}
                title={`Cor ${c.label}`}
                aria-label={`Cor ${c.label}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tools for Mode: Vertices */}
      {mode === 'vertices' && (
        <div className="flex items-center gap-2">
          {!isPolygonClosed && vertexCount >= 3 && (
            <button
              onClick={onClosePolygon}
              className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fechar Polígono</span>
            </button>
          )}
          <span className="text-xs text-slate-500 font-mono">
            {vertexCount} {vertexCount === 1 ? 'vértice' : 'vértices'}
          </span>
        </div>
      )}

      {/* Action controls (Undo / Clear) */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Desfazer"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClear}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors"
          title="Limpar toda a malha"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
