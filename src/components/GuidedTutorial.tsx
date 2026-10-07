import React, { useState, useEffect, useCallback } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle, GraduationCap } from 'lucide-react';

export interface TutorialStep {
  id: string;
  targetSelector?: string; // CSS selector of element to highlight
  title: string;
  description: string;
  tip?: string;
  icon: string;
  placement?: 'bottom' | 'top' | 'center';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bem-vindo ao GeoMalha 4º Ano!',
    description: 'Aqui você vai aprender e explorar Área e Perímetro de figuras geométricas de forma divertida, visual e prática.',
    tip: 'Este tutorial dura menos de 1 minuto e vai te mostrar onde fica cada superpoder da ferramenta!',
    icon: '🦉',
    placement: 'center'
  },
  {
    id: 'grid',
    targetSelector: '[data-tutorial="grid-canvas"]',
    title: 'Sua Malha Quadriculada',
    description: 'Este é o seu espaço de trabalho com 14 colunas e 12 linhas. Cada quadradinho da malha vale 1 unidade de área (1 u²).',
    tip: 'Passe o mouse ou toque nos quadradinhos para ver as coordenadas!',
    icon: '📐',
    placement: 'top'
  },
  {
    id: 'modes',
    targetSelector: '[data-tutorial="drawing-modes"]',
    title: 'Modos: Blocos ou Geoplano',
    description: 'Você pode escolher pintar "Quadradinhos" (como peças de mosaico) ou "Ligar Vértices" (para criar polígonos fechados com pontos, como em um geoplano).',
    tip: 'Clique nos botões para alternar o estilo de desenho a qualquer momento.',
    icon: '🎨',
    placement: 'bottom'
  },
  {
    id: 'tools',
    targetSelector: '[data-tutorial="drawing-tools"]',
    title: 'Ferramentas & Carimbos Rápidos',
    description: 'Use o Pincel para pintar, a Borracha para apagar, ou use os Carimbos para estampar quadrados, retângulos e formatos em L instantaneamente!',
    tip: 'Você também pode escolher entre 5 cores vibrantes!',
    icon: '✏️',
    placement: 'bottom'
  },
  {
    id: 'measurements',
    targetSelector: '[data-tutorial="measurements-cards"]',
    title: 'Cálculo Instantâneo!',
    description: 'Conforme você desenha, estes cartões calculam na mesma hora a ÁREA (espaço interno em u²) e o PERÍMETRO (tamanho do contorno em u).',
    tip: 'Você não precisa adivinhar nada: a matemática acontece em tempo real!',
    icon: '⚡',
    placement: 'bottom'
  },
  {
    id: 'helpers',
    targetSelector: '[data-tutorial="measurement-helpers"]',
    title: 'Contadores Didáticos Mágicos',
    description: 'Clique em "Numerar Quadradinhos" para ver a contagem (1, 2, 3...) dentro de cada célula, ou "Ver Fita Métrica" para contar cada tracinho da cerca do perímetro!',
    tip: 'Excelente para conferir lições e ter certeza das suas respostas!',
    icon: '👁️',
    placement: 'top'
  },
  {
    id: 'actions',
    targetSelector: '[data-tutorial="header-controls"]',
    title: 'Modo Lousa & Exportação para o Professor',
    description: 'Ative o "Modo Lousa" para visualização verde de alto contraste em sala de aula, e use o "Exportar PNG" para salvar uma ficha escolar com seu nome!',
    tip: 'Sua folha sai com cabeçalho BNCC e espaço para nota do professor.',
    icon: '🏫',
    placement: 'bottom'
  },
  {
    id: 'nav',
    targetSelector: '[data-tutorial="nav-tabs"]',
    title: 'Missões, Desafio Relâmpago e Quiz',
    description: 'Enfrente as 10 fases da "Trilha de Missões", corra contra o tempo no "Desafio Relâmpago ⚡", vire um detetive de medidas no "Quiz", ou explore as "Comparações"!',
    tip: 'Você está 100% pronto para ser um mestre da geometria!',
    icon: '🏆',
    placement: 'bottom'
  }
];

interface GuidedTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GuidedTutorial: React.FC<GuidedTutorialProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = TUTORIAL_STEPS[currentStepIndex] || TUTORIAL_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  // Measure target bounding rect whenever step changes or window resizes
  const updateTargetRect = useCallback(() => {
    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [step.targetSelector]);

  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();
    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen, currentStepIndex, updateTargetRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, isFirst, isLast]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (isLast) {
      soundManager.playSuccess();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete();
      onClose();
    } else {
      soundManager.playPop(520 + currentStepIndex * 30);
      setCurrentStepIndex(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      soundManager.playClick();
      setCurrentStepIndex(i => i - 1);
    }
  };

  // Calculate card position relative to viewport or target
  let cardTop = '50%';
  let cardLeft = '50%';
  let cardTransform = 'translate(-50%, -50%)';

  if (targetRect && step.placement !== 'center') {
    const padding = 12;
    const cardWidth = 380;
    const cardHeight = 220;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;

    // Default placement: try bottom first, then top
    let preferredTop = targetRect.bottom + padding;
    if (step.placement === 'top' || (preferredTop + cardHeight > viewportH - 20 && targetRect.top - cardHeight - padding > 10)) {
      preferredTop = Math.max(16, targetRect.top - cardHeight - padding);
    }

    // Horizontal centering relative to target with viewport clamping
    let preferredLeft = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    preferredLeft = Math.max(16, Math.min(viewportW - cardWidth - 16, preferredLeft));

    cardTop = `${preferredTop}px`;
    cardLeft = `${preferredLeft}px`;
    cardTransform = 'none';
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none">
      {/* Dark overlay SVG backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300">
        <defs>
          <mask id="tutorial-spotlight-mask">
            {/* White covers entire screen (opaque) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black hole cuts out the target element */}
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx={12}
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Backdrop rect using the cutout mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.72)"
          mask="url(#tutorial-spotlight-mask)"
        />
      </svg>

      {/* Target spotlight glowing boundary outline */}
      {targetRect && (
        <div
          style={{
            position: 'absolute',
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
          className="rounded-xl border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] pointer-events-none animate-pulse transition-all duration-300"
        />
      )}

      {/* Tutorial Floating Card */}
      <div
        style={{
          position: 'absolute',
          top: cardTop,
          left: cardLeft,
          transform: cardTransform
        }}
        className="w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl border-2 border-amber-300 p-5 flex flex-col gap-3 pointer-events-auto transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Header with Mascot and Step Counter */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{step.icon}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Tutorial Guiado
                </span>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  {currentStepIndex + 1}/{TUTORIAL_STEPS.length}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Fechar tutorial"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Body */}
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {step.description}
        </p>

        {/* Friendly Didactic Tip */}
        {step.tip && (
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 leading-normal flex items-start gap-1.5">
            <span className="shrink-0 text-sm">💡</span>
            <span>{step.tip}</span>
          </div>
        )}

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1 py-1">
          {TUTORIAL_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playClick();
                setCurrentStepIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-6 bg-amber-500'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Ir para passo ${idx + 1}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1.5 rounded transition-colors"
          >
            Pular Tutorial
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
            >
              <span>{isLast ? 'Começar a Explorar!' : 'Próximo'}</span>
              {isLast ? <CheckCircle className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
