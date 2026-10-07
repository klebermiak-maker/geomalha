import React from 'react';
import { Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type AppTab = 'free' | 'missions' | 'quiz' | 'compare';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  completedMissionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  isMuted,
  onToggleMute,
  onOpenHelp,
  completedMissionsCount
}) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <span className="text-xl">📐</span>
        <button
          onClick={() => onTabChange('free')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-amber-600 transition-colors text-left"
        >
          GeoMalha 4º Ano
        </button>
      </div>

      {/* Zone 2: 4 clean navigation links/tabs */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('free');
          }}
          className={`hover:text-slate-900 transition-colors ${
            activeTab === 'free' ? 'text-amber-600 font-bold border-b-2 border-amber-600 pb-0.5' : ''
          }`}
        >
          Oficina Livre
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('missions');
          }}
          className={`hover:text-slate-900 transition-colors flex items-center gap-1.5 ${
            activeTab === 'missions' ? 'text-amber-600 font-bold border-b-2 border-amber-600 pb-0.5' : ''
          }`}
        >
          <span>Trilha de Missões</span>
          {completedMissionsCount > 0 && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
              {completedMissionsCount}★
            </span>
          )}
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('quiz');
          }}
          className={`hover:text-slate-900 transition-colors ${
            activeTab === 'quiz' ? 'text-amber-600 font-bold border-b-2 border-amber-600 pb-0.5' : ''
          }`}
        >
          Detetive de Medidas
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            onTabChange('compare');
          }}
          className={`hover:text-slate-900 transition-colors ${
            activeTab === 'compare' ? 'text-amber-600 font-bold border-b-2 border-amber-600 pb-0.5' : ''
          }`}
        >
          Comparações
        </button>
      </nav>

      {/* Zone 3: Primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          className={`p-2 rounded-lg border transition-colors ${
            isMuted
              ? 'bg-slate-100 border-slate-200 text-slate-400'
              : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
          }`}
          title={isMuted ? 'Ativar sons' : 'Desativar sons'}
          aria-label={isMuted ? 'Ativar sons' : 'Desativar sons'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenHelp();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guia Didático</span>
          <span className="sm:hidden">Ajuda</span>
        </button>
      </div>
    </header>
  );
};
