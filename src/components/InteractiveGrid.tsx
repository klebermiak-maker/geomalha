import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Point, EdgeSegment, GridMode, ActiveTool, StampShape } from '../types/geometry';
import { soundManager } from '../utils/audio';
import { getStampCells } from '../utils/gridCalculations';

interface InteractiveGridProps {
  cols: number;
  rows: number;
  mode: GridMode;
  activeTool: ActiveTool;
  color: string;
  cells: Point[];
  onCellsChange: (newCells: Point[]) => void;
  vertices: Point[];
  onVerticesChange: (newVertices: Point[]) => void;
  showAreaNumbers: boolean;
  showPerimeterTicks: boolean;
  edgeSegments: EdgeSegment[];
  isPolygonClosed: boolean;
  onClosePolygon: () => void;
  selectedStamp: StampShape;
}

export const InteractiveGrid: React.FC<InteractiveGridProps> = ({
  cols,
  rows,
  mode,
  activeTool,
  color,
  cells,
  onCellsChange,
  vertices,
  onVerticesChange,
  showAreaNumbers,
  showPerimeterTicks,
  edgeSegments,
  isPolygonClosed,
  onClosePolygon,
  selectedStamp
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [hoverPos, setHoverPos] = useState<{ col: number; row: number } | null>(null);
  const [hoverVertex, setHoverVertex] = useState<Point | null>(null);
  const [dragAction, setDragAction] = useState<'add' | 'remove'>('add');

  const cellSize = 36; // px per cell
  const width = cols * cellSize;
  const height = rows * cellSize;

  // Set of painted cells for fast lookup
  const cellSet = new Set(cells.map(c => `${c.x},${c.y}`));

  // Convert client coordinates to grid cell coordinates
  const getCellCoords = useCallback((e: React.PointerEvent): { col: number; row: number } | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x >= width || y < 0 || y >= height) return null;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    return { col: Math.max(0, Math.min(cols - 1, col)), row: Math.max(0, Math.min(rows - 1, row)) };
  }, [width, height, cols, rows, cellSize]);

  // Convert client coordinates to nearest vertex (grid intersection)
  const getVertexCoords = useCallback((e: React.PointerEvent): Point | null => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < -10 || x > width + 10 || y < -10 || y > height + 10) return null;

    const col = Math.round(x / cellSize);
    const row = Math.round(y / cellSize);
    return { x: Math.max(0, Math.min(cols, col)), y: Math.max(0, Math.min(rows, row)) };
  }, [width, height, cols, rows, cellSize]);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsPointerDown(true);

    if (mode === 'cells') {
      const coords = getCellCoords(e);
      if (!coords) return;

      if (activeTool === 'stamp') {
        const stampCells = getStampCells(selectedStamp, coords.col, coords.row);
        const validStampCells = stampCells.filter(c => c.x < cols && c.y < rows);
        const combined = [...cells];
        validStampCells.forEach(sc => {
          if (!combined.some(c => c.x === sc.x && c.y === sc.y)) {
            combined.push(sc);
          }
        });
        soundManager.playPop(580);
        onCellsChange(combined);
        return;
      }

      const key = `${coords.col},${coords.row}`;
      const exists = cellSet.has(key);

      if (activeTool === 'erase' || (activeTool === 'draw' && exists && e.shiftKey)) {
        setDragAction('remove');
        const next = cells.filter(c => !(c.x === coords.col && c.y === coords.row));
        soundManager.playErase();
        onCellsChange(next);
      } else {
        setDragAction(exists ? 'remove' : 'add');
        if (exists) {
          const next = cells.filter(c => !(c.x === coords.col && c.y === coords.row));
          soundManager.playErase();
          onCellsChange(next);
        } else {
          soundManager.playPop(480 + (cells.length % 12) * 20);
          onCellsChange([...cells, { x: coords.col, y: coords.row }]);
        }
      }
    } else if (mode === 'vertices') {
      const v = getVertexCoords(e);
      if (!v) return;

      // Check if clicking near first vertex to close polygon
      if (vertices.length >= 3 && !isPolygonClosed) {
        const start = vertices[0];
        if (start.x === v.x && start.y === v.y) {
          soundManager.playSuccess();
          onClosePolygon();
          return;
        }
      }

      if (isPolygonClosed) {
        // Start new polygon
        soundManager.playPop(440);
        onVerticesChange([v]);
      } else {
        // Add vertex
        soundManager.playPop(440 + vertices.length * 40);
        onVerticesChange([...vertices, v]);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (mode === 'cells') {
      const coords = getCellCoords(e);
      setHoverPos(coords);

      if (isPointerDown && coords && activeTool !== 'stamp') {
        const key = `${coords.col},${coords.row}`;
        const exists = cellSet.has(key);

        if (dragAction === 'add' && !exists) {
          soundManager.playPop(500 + (cells.length % 8) * 25);
          onCellsChange([...cells, { x: coords.col, y: coords.row }]);
        } else if (dragAction === 'remove' && exists) {
          soundManager.playErase();
          onCellsChange(cells.filter(c => !(c.x === coords.col && c.y === coords.row)));
        }
      }
    } else if (mode === 'vertices') {
      const v = getVertexCoords(e);
      setHoverVertex(v);
    }
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
  };

  // Keyboard navigation & accessibility escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'vertices' && !isPolygonClosed) {
        if (vertices.length > 0) {
          onVerticesChange(vertices.slice(0, -1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, isPolygonClosed, vertices, onVerticesChange]);

  // Color classes map
  const colorMap: Record<string, { fill: string; border: string; bgSoft: string }> = {
    blue: { fill: '#38bdf8', border: '#0284c7', bgSoft: 'rgba(56, 189, 248, 0.45)' },
    emerald: { fill: '#34d399', border: '#059669', bgSoft: 'rgba(52, 211, 153, 0.45)' },
    amber: { fill: '#fbbf24', border: '#d97706', bgSoft: 'rgba(251, 191, 36, 0.45)' },
    rose: { fill: '#fb7185', border: '#e11d48', bgSoft: 'rgba(251, 113, 133, 0.45)' },
    violet: { fill: '#a78bfa', border: '#7c3aed', bgSoft: 'rgba(167, 139, 250, 0.45)' }
  };
  const activeColorTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="relative select-none flex flex-col items-center">
      {/* Top ruler with column numbers */}
      <div className="flex ml-7 mb-1 text-[11px] font-mono text-slate-500 font-medium">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} style={{ width: cellSize }} className="text-center">
            {i + 1}
          </div>
        ))}
      </div>

      <div className="flex">
        {/* Left ruler with row numbers */}
        <div className="flex flex-col mr-1 text-[11px] font-mono text-slate-500 font-medium justify-around">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ height: cellSize }} className="flex items-center justify-end pr-1">
              {i + 1}
            </div>
          ))}
        </div>

        {/* The Grid Canvas Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            setIsPointerDown(false);
            setHoverPos(null);
            setHoverVertex(null);
          }}
          style={{
            width,
            height,
            touchAction: 'none'
          }}
          className="relative bg-white rounded-md shadow-sm border-2 border-slate-300 overflow-hidden cursor-crosshair"
        >
          {/* SVG Layer for Grid Lines, Polygons & Perimeter Measurements */}
          <svg
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              {/* Pattern for grid squares */}
              <pattern
                id="grid-pattern"
                width={cellSize}
                height={cellSize}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            {/* Background Grid Lines */}
            <rect width={width} height={height} fill="url(#grid-pattern)" />

            {/* Intersections/Dots for vertices */}
            {Array.from({ length: cols + 1 }).map((_, c) =>
              Array.from({ length: rows + 1 }).map((_, r) => (
                <circle
                  key={`dot-${c}-${r}`}
                  cx={c * cellSize}
                  cy={r * cellSize}
                  r={mode === 'vertices' ? 2.5 : 1.2}
                  fill={mode === 'vertices' ? '#94a3b8' : '#cbd5e1'}
                />
              ))
            )}

            {/* Painted Cells Layer (mode === 'cells') */}
            {mode === 'cells' &&
              cells.map((cell, idx) => {
                const px = cell.x * cellSize;
                const py = cell.y * cellSize;
                return (
                  <g key={`cell-${cell.x}-${cell.y}`}>
                    <rect
                      x={px + 1}
                      y={py + 1}
                      width={cellSize - 2}
                      height={cellSize - 2}
                      rx={3}
                      fill={activeColorTheme.fill}
                      fillOpacity={0.88}
                      stroke={activeColorTheme.border}
                      strokeWidth={1.5}
                    />
                    {/* Area Counter: Number printed inside each square */}
                    {showAreaNumbers && (
                      <text
                        x={px + cellSize / 2}
                        y={py + cellSize / 2 + 4}
                        textAnchor="middle"
                        fontSize={cellSize > 30 ? 12 : 10}
                        fontWeight="bold"
                        fill="#0f172a"
                        className="font-mono select-none pointer-events-none"
                      >
                        {idx + 1}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* Exposed Perimeter Edge Highlights (mode === 'cells') */}
            {mode === 'cells' && edgeSegments.length > 0 && (
              <g className="perimeter-layer">
                {edgeSegments.map((edge) => {
                  const x1 = edge.x1 * cellSize;
                  const y1 = edge.y1 * cellSize;
                  const x2 = edge.x2 * cellSize;
                  const y2 = edge.y2 * cellSize;
                  const midX = (x1 + x2) / 2;
                  const midY = (y1 + y2) / 2;

                  return (
                    <g key={edge.id}>
                      {/* Bold perimeter outline segment */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#f97316"
                        strokeWidth={showPerimeterTicks ? 4 : 2.5}
                        strokeLinecap="round"
                      />

                      {/* Perimeter step indicator */}
                      {showPerimeterTicks && (
                        <g>
                          <circle
                            cx={midX}
                            cy={midY}
                            r={6.5}
                            fill="#ea580c"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                          />
                          <text
                            x={midX}
                            y={midY + 2.5}
                            textAnchor="middle"
                            fontSize={7.5}
                            fontWeight="bold"
                            fill="#ffffff"
                            className="font-mono select-none"
                          >
                            {edge.index}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            )}

            {/* Vertices / Geoboard Polygon Mode */}
            {mode === 'vertices' && (
              <g className="vertices-polygon-layer">
                {/* Polygon Fill if Closed */}
                {isPolygonClosed && vertices.length >= 3 && (
                  <polygon
                    points={vertices.map(v => `${v.x * cellSize},${v.y * cellSize}`).join(' ')}
                    fill={activeColorTheme.bgSoft}
                    stroke={activeColorTheme.border}
                    strokeWidth={3}
                  />
                )}

                {/* Drawn Segments */}
                {vertices.length > 1 && (
                  <polyline
                    points={vertices.map(v => `${v.x * cellSize},${v.y * cellSize}`).join(' ')}
                    fill="none"
                    stroke={activeColorTheme.border}
                    strokeWidth={3}
                    strokeDasharray={isPolygonClosed ? 'none' : '4 2'}
                  />
                )}

                {/* Rubber-band line to cursor if currently drawing */}
                {!isPolygonClosed && vertices.length > 0 && hoverVertex && (
                  <line
                    x1={vertices[vertices.length - 1].x * cellSize}
                    y1={vertices[vertices.length - 1].y * cellSize}
                    x2={hoverVertex.x * cellSize}
                    y2={hoverVertex.y * cellSize}
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                )}

                {/* Vertices Points / Pins */}
                {vertices.map((v, i) => {
                  const isStart = i === 0;
                  return (
                    <g key={`v-${i}`}>
                      <circle
                        cx={v.x * cellSize}
                        cy={v.y * cellSize}
                        r={isStart && !isPolygonClosed ? 7 : 5}
                        fill={isStart && !isPolygonClosed ? '#ef4444' : '#1e293b'}
                        stroke="#ffffff"
                        strokeWidth={2}
                        className={isStart && !isPolygonClosed ? 'animate-pulse' : ''}
                      />
                      <text
                        x={v.x * cellSize}
                        y={v.y * cellSize - 9}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight="bold"
                        fill="#334155"
                        className="font-mono bg-white"
                      >
                        V{i + 1}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Hover preview for Stamp */}
            {mode === 'cells' && activeTool === 'stamp' && hoverPos && (
              <g opacity={0.5} className="pointer-events-none">
                {getStampCells(selectedStamp, hoverPos.col, hoverPos.row)
                  .filter(c => c.x < cols && c.y < rows)
                  .map((c, i) => (
                    <rect
                      key={`preview-stamp-${i}`}
                      x={c.x * cellSize + 2}
                      y={c.y * cellSize + 2}
                      width={cellSize - 4}
                      height={cellSize - 4}
                      fill={activeColorTheme.fill}
                      stroke={activeColorTheme.border}
                      strokeDasharray="2 2"
                    />
                  ))}
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Mode hint under grid */}
      <div className="mt-2 text-xs text-slate-500 flex items-center gap-3">
        {mode === 'cells' ? (
          <span>
            {activeTool === 'stamp'
              ? '✨ Clique na malha para carimbar a forma escolhida.'
              : activeTool === 'erase'
              ? '🧹 Passe o mouse/dedo para apagar quadradinhos.'
              : '✏️ Clique ou arraste para pintar quadradinhos. Dica: use o Shift para apagar!'}
          </span>
        ) : (
          <span>
            {isPolygonClosed
              ? '✨ Polígono completo! Clique em qualquer ponto para começar um novo.'
              : vertices.length < 3
              ? `📍 Clique nos pontos da malha para criar vértices (${vertices.length} marcados).`
              : '🎯 Clique no ponto vermelho inicial (V1) ou use o botão para fechar o polígono!'}
          </span>
        )}
      </div>
    </div>
  );
};
