import React, { useState } from 'react';
import { SavedShape, Point, GridTheme } from '../types/geometry';
import { Bookmark, Trash2, FolderOpen, Plus, X, Download, Share2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { exportPolygonAsPNG } from '../utils/exportImage';

interface SavedShapesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedShapes: SavedShape[];
  onSaveCurrentShape: (name: string) => void;
  onLoadShape: (cells: Point[]) => void;
  onDeleteShape: (id: string) => void;
  currentArea: number;
  currentPerimeter: number;
  currentCells: Point[];
  currentColor: string;
  theme?: GridTheme;
}

export const SavedShapesModal: React.FC<SavedShapesModalProps> = ({
  isOpen,
  onClose,
  savedShapes,
  onSaveCurrentShape,
  onLoadShape,
  onDeleteShape,
  currentArea,
  currentPerimeter,
  currentCells,
  currentColor,
  theme = 'paper'
}) => {
  const [newShapeName, setNewShapeName] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShapeName.trim()) return;
    onSaveCurrentShape(newShapeName.trim());
    setNewShapeName('');
    soundManager.playStar();
  };

  const handleExportCurrent = () => {
    if (currentCells.length === 0) {
      soundManager.playWrong();
      return;
    }
    const colorMap: Record<string, string> = {
      blue: '#38bdf8',
      emerald: '#34d399',
      amber: '#fbbf24',
      rose: '#fb7185',
      violet: '#a78bfa'
    };
    const fillHex = colorMap[currentColor] || '#38bdf8';
    const success = exportPolygonAsPNG({
      shapeName: newShapeName.trim() || 'Meu Polígono da Malha',
      cells: currentCells,
      colorHex: fillHex,
      theme
    });

    if (success) {
      soundManager.playSuccess();
      setExportNotice('Imagem PNG baixada com sucesso! Você pode enviá-la ao seu professor.');
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  const handleExportSaved = (shape: SavedShape) => {
    const success = exportPolygonAsPNG({
      shapeName: shape.name,
      cells: shape.cells,
      theme
    });
    if (success) {
      soundManager.playSuccess();
      setExportNotice(`Imagem "${shape.name}.png" baixada com sucesso!`);
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-5 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-800">
              Galeria de Desenhos & Compartilhamento
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Current Drawing Section */}
        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-sky-600" />
              <span>Compartilhar Desenho Atual com o Professor</span>
            </span>
            <span className="text-xs font-mono text-sky-700 font-semibold">
              Área: {currentArea}u² | Perímetro: {currentPerimeter}u
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Gera uma ficha escolar em PNG com a malha, cálculo de área, perímetro e espaço para identificação do aluno.
          </p>

          <button
            onClick={handleExportCurrent}
            disabled={currentCells.length === 0}
            className="w-full py-2 px-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Polígono Atual como Imagem PNG</span>
          </button>
        </div>

        {/* Feedback notice after export */}
        {exportNotice && (
          <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-xs text-emerald-800 font-medium text-center">
            ✓ {exportNotice}
          </div>
        )}

        {/* Save Current Drawing Form */}
        <form onSubmit={handleSave} className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900">Salvar na galeria para abrir mais tarde:</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ex: Minha Casa, Foguete, Robô..."
              value={newShapeName}
              onChange={(e) => setNewShapeName(e.target.value)}
              className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              maxLength={24}
            />
            <button
              type="submit"
              disabled={!newShapeName.trim() || currentArea === 0}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Salvar</span>
            </button>
          </div>
        </form>

        {/* List of Saved Shapes */}
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
          <div className="text-xs font-bold text-slate-700 px-1">Desenhos Salvos:</div>
          {savedShapes.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              Nenhum desenho guardado ainda.
            </p>
          ) : (
            savedShapes.map((shape) => (
              <div
                key={shape.id}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-amber-300 transition-all shadow-2xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {shape.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-0.5">
                    <span className="text-sky-700">Área: {shape.area} u²</span>
                    <span>·</span>
                    <span className="text-amber-700">Perímetro: {shape.perimeter} u</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExportSaved(shape)}
                    className="p-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-sky-50 hover:text-sky-700 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Exportar como PNG"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>

                  <button
                    onClick={() => {
                      onLoadShape(shape.cells);
                      soundManager.playPop(520);
                      onClose();
                    }}
                    className="p-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Carregar para a malha"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Abrir</span>
                  </button>

                  <button
                    onClick={() => {
                      onDeleteShape(shape.id);
                      soundManager.playErase();
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
