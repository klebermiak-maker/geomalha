import { Point, GridTheme } from '../types/geometry';
import { calculateCellMeasurements } from './gridCalculations';

export interface ExportImageOptions {
  shapeName?: string;
  cells: Point[];
  cols?: number;
  rows?: number;
  colorHex?: string;
  borderColorHex?: string;
  theme?: GridTheme;
}

/**
 * Generates and downloads a student worksheet PNG image of the grid shape
 */
export function exportPolygonAsPNG({
  shapeName = 'Meu Desenho',
  cells,
  cols = 14,
  rows = 12,
  colorHex = '#38bdf8',
  borderColorHex = '#0284c7',
  theme = 'paper'
}: ExportImageOptions): boolean {
  if (cells.length === 0) {
    return false;
  }

  const isChalk = theme === 'chalkboard';
  const measurements = calculateCellMeasurements(cells);

  // Setup offscreen canvas
  const canvas = document.createElement('canvas');
  const scale = 2; // High resolution
  const canvasWidth = 740;
  const canvasHeight = 840;

  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  ctx.scale(scale, scale);

  // 1. Background
  ctx.fillStyle = isChalk ? '#112a1d' : '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Outer border with subtle card style
  ctx.strokeStyle = isChalk ? '#244b37' : '#cbd5e1';
  ctx.lineWidth = isChalk ? 4 : 2;
  ctx.strokeRect(16, 16, canvasWidth - 32, canvasHeight - 32);

  // 2. Header
  ctx.fillStyle = isChalk ? '#f0fdf4' : '#0f172a';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📐 GeoMalha 4º Ano · Registro de Geometria', 36, 52);

  ctx.fillStyle = isChalk ? '#86efac' : '#64748b';
  ctx.font = '13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Atividade Escolar: Medição de Área e Perímetro na Malha Quadriculada (BNCC)', 36, 74);

  // Divider line
  ctx.strokeStyle = isChalk ? '#244b37' : '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(36, 88);
  ctx.lineTo(canvasWidth - 36, 88);
  ctx.stroke();

  // Shape Name
  ctx.fillStyle = isChalk ? '#ffffff' : '#1e293b';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Figura: ${shapeName}`, 36, 115);

  // 3. Grid Drawing
  const cellSize = 34;
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const gridX = Math.round((canvasWidth - gridWidth) / 2) + 10;
  const gridY = 145;

  // Grid rulers (column numbers on top)
  ctx.fillStyle = isChalk ? '#a7f3d0' : '#94a3b8';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  for (let c = 0; c < cols; c++) {
    ctx.fillText(`${c + 1}`, gridX + c * cellSize + cellSize / 2, gridY - 8);
  }

  // Row numbers on left
  ctx.textAlign = 'right';
  for (let r = 0; r < rows; r++) {
    ctx.fillText(`${r + 1}`, gridX - 8, gridY + r * cellSize + cellSize / 2 + 4);
  }

  // Draw grid background & cells
  ctx.fillStyle = isChalk ? '#0d2217' : '#f8fafc';
  ctx.fillRect(gridX, gridY, gridWidth, gridHeight);

  ctx.strokeStyle = isChalk ? '#244b37' : '#e2e8f0';
  ctx.lineWidth = 1;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(gridX + c * cellSize, gridY);
    ctx.lineTo(gridX + c * cellSize, gridY + gridHeight);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(gridX, gridY + r * cellSize);
    ctx.lineTo(gridX + gridWidth, gridY + r * cellSize);
    ctx.stroke();
  }

  // Draw painted cells
  cells.forEach((cell, idx) => {
    const px = gridX + cell.x * cellSize;
    const py = gridY + cell.y * cellSize;

    ctx.fillStyle = colorHex;
    ctx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

    ctx.strokeStyle = isChalk ? '#ffffff' : borderColorHex;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px + 1, py + 1, cellSize - 2, cellSize - 2);

    // Number inside cell for area visual count
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${idx + 1}`, px + cellSize / 2, py + cellSize / 2 + 4);
  });

  // Draw exposed perimeter edges (orange or yellow chalk border)
  ctx.strokeStyle = isChalk ? '#facc15' : '#ea580c';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  measurements.edgeSegments.forEach((edge) => {
    const x1 = gridX + edge.x1 * cellSize;
    const y1 = gridY + edge.y1 * cellSize;
    const x2 = gridX + edge.x2 * cellSize;
    const y2 = gridY + edge.y2 * cellSize;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // 4. Measurements Results Box (Area and Perimeter)
  const cardY = gridY + gridHeight + 24;
  const cardWidth = (canvasWidth - 72 - 16) / 2;
  const cardHeight = 84;

  // Area Card
  ctx.fillStyle = isChalk ? '#0e261a' : '#f0f9ff';
  ctx.strokeStyle = isChalk ? '#38bdf8' : '#7dd3fc';
  ctx.lineWidth = 1.5;
  roundRect(ctx, 36, cardY, cardWidth, cardHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = isChalk ? '#38bdf8' : '#0369a1';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🟦 ÁREA (Superfície)', 48, cardY + 22);

  ctx.fillStyle = isChalk ? '#ffffff' : '#0f172a';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText(`${measurements.area}`, 48, cardY + 54);

  ctx.fillStyle = isChalk ? '#a7f3d0' : '#64748b';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('quadradinhos (u²)', 100, cardY + 52);

  ctx.fillStyle = isChalk ? '#94a3b8' : '#475569';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Espaço que a figura ocupa por dentro', 48, cardY + 72);

  // Perimeter Card
  const pCardX = 36 + cardWidth + 16;
  ctx.fillStyle = isChalk ? '#0e261a' : '#fff7ed';
  ctx.strokeStyle = isChalk ? '#facc15' : '#fdba74';
  ctx.lineWidth = 1.5;
  roundRect(ctx, pCardX, cardY, cardWidth, cardHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isChalk ? '#facc15' : '#c2410c';
  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📏 PERÍMETRO (Contorno)', pCardX + 12, cardY + 22);

  ctx.fillStyle = isChalk ? '#ffffff' : '#0f172a';
  ctx.font = 'bold 24px "JetBrains Mono", monospace';
  ctx.fillText(`${measurements.perimeter}`, pCardX + 12, cardY + 54);

  ctx.fillStyle = isChalk ? '#a7f3d0' : '#64748b';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('unidades de cerca (u)', pCardX + 68, cardY + 52);

  ctx.fillStyle = isChalk ? '#94a3b8' : '#475569';
  ctx.font = '11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Comprimento total da borda externa', pCardX + 12, cardY + 72);

  // 5. Student & Teacher Identification Footer
  const footerY = cardY + cardHeight + 24;
  ctx.strokeStyle = isChalk ? '#244b37' : '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(36, footerY);
  ctx.lineTo(canvasWidth - 36, footerY);
  ctx.stroke();

  const currentDate = new Date().toLocaleDateString('pt-BR');
  ctx.fillStyle = isChalk ? '#a7f3d0' : '#475569';
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Aluno(a): ________________________________________`, 36, footerY + 24);
  ctx.fillText(`Turma: 4º Ano _____`, 460, footerY + 24);
  ctx.fillText(`Professor(a): _____________________________________`, 36, footerY + 50);
  ctx.fillText(`Data: ${currentDate}`, 460, footerY + 50);

  // Trigger download
  try {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const sanitizedName = shapeName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
    link.download = `geomalha_${sanitizedName || 'poligono'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('Failed to export canvas:', err);
    return false;
  }
}

// Helper for rounded rectangle in 2D context
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
