import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Point, GridMode, ActiveTool, StampShape, SavedShape, GridTheme } from './types/geometry';
import { Header, AppTab } from './components/Header';
import { InteractiveGrid } from './components/InteractiveGrid';
import { DrawingToolbar } from './components/DrawingToolbar';
import { MeasurementDisplay } from './components/MeasurementDisplay';
import { MissionsPanel } from './components/MissionsPanel';
import { LightningChallenge } from './components/LightningChallenge';
import { DetectiveQuiz } from './components/DetectiveQuiz';
import { ShapeComparator } from './components/ShapeComparator';
import { DidacticHelperModal } from './components/DidacticHelperModal';
import { SavedShapesModal } from './components/SavedShapesModal';
import { GuidedTutorial } from './components/GuidedTutorial';
import { calculateCellMeasurements, calculatePolygonMeasurements } from './utils/gridCalculations';
import { soundManager } from './utils/audio';
import { MISSIONS_DATA } from './data/missionsData';
import { Bookmark, Sparkles, HelpCircle, Download, Presentation } from 'lucide-react';
import { exportPolygonAsPNG } from './utils/exportImage';

const COLS = 14;
const ROWS = 12;

// Initial sample shape (a friendly 4x3 rectangle so the app opens with an instant example)
const INITIAL_CELLS: Point[] = [
  { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, { x: 5, y: 2 },
  { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
  { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }
];

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('free');

  // Drawing mode & tools
  const [mode, setMode] = useState<GridMode>('cells');
  const [activeTool, setActiveTool] = useState<ActiveTool>('draw');
  const [color, setColor] = useState<string>('blue');
  const [selectedStamp, setSelectedStamp] = useState<StampShape>('rectangle');

  // Grid Cells state with undo stack
  const [cells, setCells] = useState<Point[]>(INITIAL_CELLS);
  const [cellHistory, setCellHistory] = useState<Point[][]>([INITIAL_CELLS]);

  // Polygon Vertices state
  const [vertices, setVertices] = useState<Point[]>([]);
  const [isPolygonClosed, setIsPolygonClosed] = useState(false);

  // Overlay Helpers
  const [showAreaNumbers, setShowAreaNumbers] = useState(true);
  const [showPerimeterTicks, setShowPerimeterTicks] = useState(false);
  const [gridTheme, setGridTheme] = useState<GridTheme>('paper');

  // Sound & Modals
  const [isMuted, setIsMuted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Auto-launch tutorial on first visit for new 4th-grade students
  useEffect(() => {
    try {
      const seen = localStorage.getItem('geomalha_tutorial_completed');
      if (!seen) {
        const timer = setTimeout(() => {
          setIsTutorialOpen(true);
        }, 700);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  // Missions state (persisted in localStorage)
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [completedMissions, setCompletedMissions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('geomalha_completed_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved custom shapes (persisted in localStorage)
  const [savedShapes, setSavedShapes] = useState<SavedShape[]>(() => {
    try {
      const saved = localStorage.getItem('geomalha_saved_shapes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compute live measurements
  const cellMeasurements = useMemo(() => {
    return calculateCellMeasurements(cells);
  }, [cells]);

  const polygonMeasurements = useMemo(() => {
    return calculatePolygonMeasurements(vertices);
  }, [vertices]);

  // Combined measurements depending on mode
  const currentMeasurements = useMemo(() => {
    if (mode === 'vertices' && isPolygonClosed) {
      const isTriangle = vertices.length === 3;
      return {
        area: polygonMeasurements.area,
        perimeter: polygonMeasurements.perimeter,
        cellCount: Math.round(polygonMeasurements.area),
        edgeSegments: [],
        isSimpleRectangle: false,
        smartHint: {
          shapeLabel: isTriangle
            ? 'Triângulo no Geoplano (3 vértices)'
            : `Polígono Fechado (${vertices.length} vértices/lados)`,
          formulaAreaName: isTriangle ? 'Área do Triângulo' : 'Área do Polígono na Malha',
          formulaAreaFormula: isTriangle ? '(Base × Altura) ÷ 2' : 'Fórmula de Pick / Agrimensor',
          formulaAreaCalc: `${polygonMeasurements.area} u²`,
          formulaPerimeterName: 'Perímetro do Polígono',
          formulaPerimeterFormula: 'Soma do comprimento de todos os lados',
          formulaPerimeterCalc: `${polygonMeasurements.perimeter} u`,
          pedagogicalTip: isTriangle
            ? 'A área de um triângulo na malha é sempre a metade do retângulo que o envolve! Por isso dividimos por 2.'
            : `Em polígonos fechados na malha com ${vertices.length} lados, somamos as distâncias de cada lado para achar o perímetro.`,
          arithmeticSteps: [
            `Número de lados do polígono: ${vertices.length}`,
            `Superfície interior coberta: ${polygonMeasurements.area} quadradinhos (u²)`,
            `Contorno total (soma dos lados): ${polygonMeasurements.perimeter} unidades (u)`
          ]
        },
        explanation: {
          areaText: `Área do Polígono = ${polygonMeasurements.area} u²`,
          perimeterText: `Perímetro do Polígono = ${polygonMeasurements.perimeter} u`,
          details: `Polígono fechado com ${vertices.length} lados!`
        }
      };
    }
    return cellMeasurements;
  }, [mode, isPolygonClosed, polygonMeasurements, cellMeasurements, vertices.length]);

  // Handle cell changes with history tracking
  const handleCellsChange = useCallback((newCells: Point[]) => {
    setCells(newCells);
    setCellHistory(prev => [...prev.slice(-20), newCells]);
  }, []);

  const handleUndo = useCallback(() => {
    if (mode === 'cells') {
      if (cellHistory.length > 1) {
        soundManager.playClick();
        const prevHistory = cellHistory.slice(0, -1);
        const lastState = prevHistory[prevHistory.length - 1];
        setCellHistory(prevHistory);
        setCells(lastState);
      }
    } else if (mode === 'vertices') {
      if (vertices.length > 0) {
        soundManager.playClick();
        setIsPolygonClosed(false);
        setVertices(v => v.slice(0, -1));
      }
    }
  }, [mode, cellHistory, vertices.length]);

  const handleClear = useCallback(() => {
    soundManager.playErase();
    if (mode === 'cells') {
      setCells([]);
      setCellHistory(prev => [...prev, []]);
    } else {
      setVertices([]);
      setIsPolygonClosed(false);
    }
  }, [mode]);

  const handleClosePolygon = useCallback(() => {
    if (vertices.length >= 3) {
      setIsPolygonClosed(true);
    }
  }, [vertices.length]);

  const handleToggleMute = useCallback(() => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  }, [isMuted]);

  const handleCompleteMission = useCallback((missionId: number) => {
    setCompletedMissions(prev => {
      if (!prev.includes(missionId)) {
        const next = [...prev, missionId];
        try {
          localStorage.setItem('geomalha_completed_missions', JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      }
      return prev;
    });
  }, []);

  const handleSaveCurrentShape = useCallback((name: string) => {
    const newShape: SavedShape = {
      id: Date.now().toString(),
      name,
      date: new Date().toLocaleDateString('pt-BR'),
      color,
      cells: [...cells],
      area: cellMeasurements.area,
      perimeter: cellMeasurements.perimeter
    };
    const next = [newShape, ...savedShapes];
    setSavedShapes(next);
    try {
      localStorage.setItem('geomalha_saved_shapes', JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [color, cells, cellMeasurements, savedShapes]);

  const handleDeleteShape = useCallback((id: string) => {
    const next = savedShapes.filter(s => s.id !== id);
    setSavedShapes(next);
    try {
      localStorage.setItem('geomalha_saved_shapes', JSON.stringify(next));
    } catch {
      // ignore
    }
  }, [savedShapes]);

  const handleLoadShape = useCallback((loadedCells: Point[]) => {
    setMode('cells');
    setCells(loadedCells);
    setCellHistory(prev => [...prev, loadedCells]);
  }, []);

  const handleQuickExport = useCallback(() => {
    if (cells.length === 0) {
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
    const fillHex = colorMap[color] || '#38bdf8';
    const success = exportPolygonAsPNG({
      shapeName: 'Poligono_4o_Ano',
      cells,
      colorHex: fillHex,
      theme: gridTheme
    });
    if (success) {
      soundManager.playSuccess();
    }
  }, [cells, color, gridTheme]);

  // When switching missions, check if target mission requirements should update
  const currentMission = MISSIONS_DATA[currentMissionIndex];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-900 font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        completedMissionsCount={completedMissions.length}
      />

      {/* Main Sandbox Stage - Two-Zone Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-5">
        {/* Responsive Mobile Tab Switcher */}
        <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-slate-200/80 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('free')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all whitespace-nowrap ${
              activeTab === 'free' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Oficina
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all whitespace-nowrap ${
              activeTab === 'missions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Missões ({completedMissions.length})
          </button>
          <button
            onClick={() => setActiveTab('speed')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all whitespace-nowrap ${
              activeTab === 'speed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            ⚡ Relâmpago
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Detetive
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all whitespace-nowrap ${
              activeTab === 'compare' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Comparar
          </button>
        </div>

        {/* Two-Zone Layout: Left Stage (60%) + Right Concept Deck (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ZONE 1: INTERACTIVE STAGE (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Drawing Toolbar */}
            <DrawingToolbar
              mode={mode}
              onModeChange={(m) => {
                setMode(m);
                if (m === 'vertices') {
                  setVertices([]);
                  setIsPolygonClosed(false);
                }
              }}
              activeTool={activeTool}
              onActiveToolChange={setActiveTool}
              color={color}
              onColorChange={setColor}
              onClear={handleClear}
              onUndo={handleUndo}
              canUndo={mode === 'cells' ? cellHistory.length > 1 : vertices.length > 0}
              selectedStamp={selectedStamp}
              onStampSelect={setSelectedStamp}
              isPolygonClosed={isPolygonClosed}
              onClosePolygon={handleClosePolygon}
              vertexCount={vertices.length}
            />

            {/* The Grid Canvas Container */}
            <div className={`p-3 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center ${
              gridTheme === 'chalkboard'
                ? 'bg-[#0b1f14] border-[#1d4530] text-emerald-100 shadow-md'
                : 'bg-white/80 border-slate-200/90 shadow-xs'
            }`}>
              <div className="w-full flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className={`text-xs font-bold flex items-center gap-1.5 ${
                  gridTheme === 'chalkboard' ? 'text-emerald-200' : 'text-slate-700'
                }`}>
                  <span>📐 Malha Quadriculada (14 × 12)</span>
                  <span className={`text-[10px] font-normal ${
                    gridTheme === 'chalkboard' ? 'text-emerald-400/80' : 'text-slate-400'
                  }`}>
                    · Cada quadradinho = 1 u² e lado = 1 u
                  </span>
                </span>

                <div data-tutorial="header-controls" className="flex items-center gap-1.5 flex-wrap">
                  {/* Classroom Presentation / Chalkboard Mode Toggle */}
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setGridTheme(t => t === 'paper' ? 'chalkboard' : 'paper');
                    }}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold border px-2.5 py-1 rounded-lg transition-all ${
                      gridTheme === 'chalkboard'
                        ? 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                    title={
                      gridTheme === 'chalkboard'
                        ? 'Alternar para tema Papel Caderno'
                        : 'Alternar para Modo Lousa Verde (ideal para projetores e sala de aula)'
                    }
                  >
                    <Presentation className="w-3.5 h-3.5" />
                    <span>{gridTheme === 'chalkboard' ? 'Modo Papel' : 'Modo Lousa'}</span>
                  </button>

                  <button
                    onClick={handleQuickExport}
                    disabled={cells.length === 0}
                    className={`flex items-center gap-1 text-[11px] font-semibold border px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40 ${
                      gridTheme === 'chalkboard'
                        ? 'bg-sky-950/70 hover:bg-sky-900 text-sky-200 border-sky-800'
                        : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                    }`}
                    title="Exportar polígono atual como imagem PNG para o professor"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar PNG</span>
                  </button>

                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className={`flex items-center gap-1 text-[11px] font-semibold border px-2.5 py-1 rounded-lg transition-colors ${
                      gridTheme === 'chalkboard'
                        ? 'bg-amber-950/70 hover:bg-amber-900 text-amber-200 border-amber-800'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Galeria</span>
                  </button>
                </div>
              </div>

              {/* Interactive Grid Element */}
              <div data-tutorial="grid-canvas" className="w-full flex justify-center">
                <InteractiveGrid
                  cols={COLS}
                  rows={ROWS}
                  mode={mode}
                  theme={gridTheme}
                  activeTool={activeTool}
                  color={color}
                  cells={cells}
                  onCellsChange={handleCellsChange}
                  vertices={vertices}
                  onVerticesChange={setVertices}
                  showAreaNumbers={showAreaNumbers}
                  showPerimeterTicks={showPerimeterTicks}
                  edgeSegments={cellMeasurements.edgeSegments}
                  isPolygonClosed={isPolygonClosed}
                  onClosePolygon={handleClosePolygon}
                  selectedStamp={selectedStamp}
                />
              </div>
            </div>
          </div>

          {/* ZONE 2: CONTROL & CONCEPT DECK (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Instant Measurements (Area & Perimeter) always visible */}
            <MeasurementDisplay
              measurements={currentMeasurements}
              showAreaNumbers={showAreaNumbers}
              setShowAreaNumbers={setShowAreaNumbers}
              showPerimeterTicks={showPerimeterTicks}
              setShowPerimeterTicks={setShowPerimeterTicks}
              targetArea={activeTab === 'missions' ? currentMission.targetArea : undefined}
              targetPerimeter={activeTab === 'missions' ? currentMission.targetPerimeter : undefined}
              onOpenHelp={() => setIsHelpOpen(true)}
            />

            {/* Contextual Deck based on Active Tab */}
            {activeTab === 'speed' && (
              <LightningChallenge
                measurements={currentMeasurements}
                onResetGrid={handleClear}
              />
            )}

            {activeTab === 'missions' && (
              <MissionsPanel
                currentMissionIndex={currentMissionIndex}
                onSelectMission={setCurrentMissionIndex}
                measurements={currentMeasurements}
                completedMissions={completedMissions}
                onCompleteMission={handleCompleteMission}
                onResetGrid={handleClear}
              />
            )}

            {activeTab === 'quiz' && (
              <DetectiveQuiz onLoadShapeToGrid={handleLoadShape} />
            )}

            {activeTab === 'compare' && (
              <ShapeComparator onLoadShape={handleLoadShape} />
            )}

            {activeTab === 'free' && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-slate-800">
                    Sugestões para Explorar:
                  </h4>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span>🔹</span>
                    <span><strong>Desenhe seu próprio nome ou inicial</strong> e descubra qual é a área e perímetro de cada letra!</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>🔹</span>
                    <span><strong>Construa um robô</strong> desenhando a cabeça, corpo e braços na malha.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>🔹</span>
                    <span>Ative o <strong>botão "Numerar Quadradinhos"</strong> para ver a prova visual da área somando cada unidade!</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span>🔹</span>
                    <span>Ative a <strong>"Fita Métrica na Borda"</strong> para contar cada tracinho da cerca do perímetro.</span>
                  </li>
                </ul>

                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="mt-1 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Ver Exemplo Ilustrado: Área × Perímetro</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer adhering to guidelines (quiet copyright and student encouragement) */}
      <footer className="border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          GeoMalha 4º Ano · Alinhado às habilidades da BNCC (EF04MA20 e EF04MA21: Medição de área e perímetro em malhas quadriculadas).
        </p>
      </footer>

      {/* Modals */}
      <DidacticHelperModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <SavedShapesModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        savedShapes={savedShapes}
        onSaveCurrentShape={handleSaveCurrentShape}
        onLoadShape={handleLoadShape}
        onDeleteShape={handleDeleteShape}
        currentArea={cellMeasurements.area}
        currentPerimeter={cellMeasurements.perimeter}
        currentCells={cells}
        currentColor={color}
        theme={gridTheme}
      />

      <GuidedTutorial
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onComplete={() => {
          try {
            localStorage.setItem('geomalha_tutorial_completed', 'true');
          } catch {
            // ignore
          }
          setIsTutorialOpen(false);
        }}
      />
    </div>
  );
}
