import { Point, EdgeSegment, MeasurementResult, SmartHintInfo } from '../types/geometry';

/**
 * Calculates area, perimeter, and educational explanations for painted grid cells
 */
export function calculateCellMeasurements(cells: Point[]): MeasurementResult {
  const cellSet = new Set(cells.map(c => `${c.x},${c.y}`));
  const area = cells.length;

  if (area === 0) {
    return {
      area: 0,
      perimeter: 0,
      cellCount: 0,
      edgeSegments: [],
      isSimpleRectangle: false,
      explanation: {
        areaText: 'Nenhum quadradinho pintado ainda.',
        perimeterText: 'O contorno é 0.',
        details: 'Clique ou arraste na malha para desenhar sua figura!'
      }
    };
  }

  // Find bounding box
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cell of cells) {
    if (cell.x < minX) minX = cell.x;
    if (cell.x > maxX) maxX = cell.x;
    if (cell.y < minY) minY = cell.y;
    if (cell.y > maxY) maxY = cell.y;
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const isSolidRectangle = area === width * height;
  const isSquare = isSolidRectangle && width === height;

  // Identify all boundary edges (1 unit each)
  const edgeSegments: EdgeSegment[] = [];
  let edgeIndex = 1;

  // To keep edge ordering somewhat sequential, traverse cells in a sorted order
  const sortedCells = [...cells].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);

  for (const cell of sortedCells) {
    const { x, y } = cell;

    // Top edge: between (x, y) and (x+1, y)
    if (!cellSet.has(`${x},${y - 1}`)) {
      edgeSegments.push({
        id: `top-${x}-${y}`,
        x1: x,
        y1: y,
        x2: x + 1,
        y2: y,
        index: edgeIndex++
      });
    }

    // Right edge: between (x+1, y) and (x+1, y+1)
    if (!cellSet.has(`${x + 1},${y}`)) {
      edgeSegments.push({
        id: `right-${x}-${y}`,
        x1: x + 1,
        y1: y,
        x2: x + 1,
        y2: y + 1,
        index: edgeIndex++
      });
    }

    // Bottom edge: between (x+1, y+1) and (x, y+1)
    if (!cellSet.has(`${x},${y + 1}`)) {
      edgeSegments.push({
        id: `bottom-${x}-${y}`,
        x1: x + 1,
        y1: y + 1,
        x2: x,
        y2: y + 1,
        index: edgeIndex++
      });
    }

    // Left edge: between (x, y+1) and (x, y)
    if (!cellSet.has(`${x - 1},${y}`)) {
      edgeSegments.push({
        id: `left-${x}-${y}`,
        x1: x,
        y1: y + 1,
        x2: x,
        y2: y,
        index: edgeIndex++
      });
    }
  }

  const perimeter = edgeSegments.length;

  // Pedagogical explanations tailored to 4th grade
  let areaText = '';
  let perimeterText = '';
  let details = '';
  let smartHint: SmartHintInfo;

  if (isSquare) {
    areaText = `Área = ${width} × ${width} = ${area} quadradinhos (u²)`;
    perimeterText = `Perímetro = 4 × ${width} = ${perimeter} unidades (u)`;
    details = `Parabéns! É um Quadrado perfeito de lado ${width}. Todos os 4 lados são iguais!`;
    smartHint = {
      shapeLabel: `Quadrado Perfeito (${width} × ${width})`,
      formulaAreaName: 'Área do Quadrado',
      formulaAreaFormula: 'Lado × Lado  (L²)',
      formulaAreaCalc: `${width} × ${width} = ${area} u²`,
      formulaPerimeterName: 'Perímetro do Quadrado',
      formulaPerimeterFormula: '4 × Lado',
      formulaPerimeterCalc: `4 × ${width} = ${perimeter} u`,
      pedagogicalTip: `No quadrado, os 4 lados são idênticos (${width} unidades cada). Para cercar, some os 4 lados (${width} + ${width} + ${width} + ${width} = ${perimeter} u). Para cobrir o chão com azulejos, multiplique lado × lado (${width} × ${width} = ${area} u²).`,
      arithmeticSteps: [
        `Medida de cada lado: ${width} unidades`,
        `Cálculo da Área: ${width} (base) × ${width} (altura) = ${area} quadradinhos`,
        `Cálculo do Perímetro: 4 × ${width} = ${perimeter} unidades de contorno`
      ]
    };
  } else if (isSolidRectangle) {
    areaText = `Área = ${width} (base) × ${height} (altura) = ${area} quadradinhos (u²)`;
    perimeterText = `Perímetro = 2 × (${width} + ${height}) = ${perimeter} unidades (u)`;
    details = `É um Retângulo com ${width} colunas e ${height} linhas. Você pode multiplicar base × altura!`;
    smartHint = {
      shapeLabel: `Retângulo Regular (${width} colunas × ${height} linhas)`,
      formulaAreaName: 'Área do Retângulo',
      formulaAreaFormula: 'Base × Altura',
      formulaAreaCalc: `${width} × ${height} = ${area} u²`,
      formulaPerimeterName: 'Perímetro do Retângulo',
      formulaPerimeterFormula: '2 × (Base + Altura)  ou  Base + Altura + Base + Altura',
      formulaPerimeterCalc: `2 × (${width} + ${height}) = 2 × ${width + height} = ${perimeter} u`,
      pedagogicalTip: `Pense em fileiras organizadas: temos ${height} linhas horizontais com ${width} quadradinhos em cada uma. Em vez de contar um por um, a tabuada ${width} × ${height} dá o total instantâneo!`,
      arithmeticSteps: [
        `Base (comprimento) = ${width} u | Altura (largura) = ${height} u`,
        `Cálculo da Área: ${width} × ${height} = ${area} quadradinhos (u²)`,
        `Cálculo do Perímetro: ${width} (cima) + ${height} (direita) + ${width} (baixo) + ${height} (esquerda) = ${perimeter} u`
      ]
    };
  } else {
    areaText = `Área = Contando todos os ${area} quadradinhos preenchidos = ${area} u²`;
    perimeterText = `Perímetro = Contando os ${perimeter} tracinhos do contorno externo = ${perimeter} u`;
    details = `É uma figura com formato especial! Para achar a área, contamos cada quadradinho. Para o perímetro, contamos os tracinhos da borda.`;
    smartHint = {
      shapeLabel: `Figura Poligonal Composta (${area} quadradinhos)`,
      formulaAreaName: 'Área por Decomposição ou Contagem',
      formulaAreaFormula: 'Soma de todos os quadradinhos (1 u² cada)',
      formulaAreaCalc: `Total = ${area} quadradinhos preenchidos (u²)`,
      formulaPerimeterName: 'Perímetro por Contorno de Bordas',
      formulaPerimeterFormula: 'Soma dos segmentos externos da cerca',
      formulaPerimeterCalc: `Total = ${perimeter} unidades de cerca (u)`,
      pedagogicalTip: `Como a figura tem degraus ou reentrâncias, para achar a área você pode dividir a forma em retângulos menores (decomposição) ou contar quadradinho por quadradinho. Para o contorno, basta seguir a fita métrica pelas bordas expostas!`,
      arithmeticSteps: [
        `Total de quadradinhos internos cobertos = ${area} u²`,
        `Total de tracinhos da borda externa exposta = ${perimeter} u`,
        `Dica: figuras com mesma área (${area} u²) podem ter perímetros bem diferentes!`
      ]
    };
  }

  return {
    area,
    perimeter,
    cellCount: area,
    edgeSegments,
    boundingBox: {
      minX,
      maxX,
      minY,
      maxY,
      width,
      height
    },
    isSimpleRectangle: isSolidRectangle,
    smartHint,
    explanation: {
      areaText,
      perimeterText,
      details
    }
  };
}

/**
 * Calculates area & perimeter for a polygon defined by ordered vertices
 */
export function calculatePolygonMeasurements(vertices: Point[]): {
  area: number;
  perimeter: number;
  isClosed: boolean;
  edgeLengths: number[];
} {
  if (vertices.length < 3) {
    return {
      area: 0,
      perimeter: 0,
      isClosed: false,
      edgeLengths: []
    };
  }

  // Shoelace formula for area
  let shoelaceSum = 0;
  const n = vertices.length;
  const edgeLengths: number[] = [];
  let perimeter = 0;

  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const x1 = vertices[i].x;
    const y1 = vertices[i].y;
    const x2 = vertices[next].x;
    const y2 = vertices[next].y;

    shoelaceSum += x1 * y2 - x2 * y1;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Round cleanly for grid math
    const cleanDist = Math.round(dist * 10) / 10;
    edgeLengths.push(cleanDist);
    perimeter += cleanDist;
  }

  const area = Math.abs(shoelaceSum) / 2;

  return {
    area: Math.round(area * 10) / 10,
    perimeter: Math.round(perimeter * 10) / 10,
    isClosed: true,
    edgeLengths
  };
}

/**
 * Stamp templates for quick exploration
 */
export function getStampCells(shape: string, startCol: number, startRow: number): Point[] {
  const cells: Point[] = [];

  switch (shape) {
    case 'square': // 3x3
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push({ x: startCol + c, y: startRow + r });
        }
      }
      break;

    case 'rectangle': // 4x2
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 4; c++) {
          cells.push({ x: startCol + c, y: startRow + r });
        }
      }
      break;

    case 'l_shape': // L shape with 5 cells
      // vertical arm: 3 cells, horizontal foot: 3 cells (sharing 1 corner)
      cells.push({ x: startCol, y: startRow });
      cells.push({ x: startCol, y: startRow + 1 });
      cells.push({ x: startCol, y: startRow + 2 });
      cells.push({ x: startCol + 1, y: startRow + 2 });
      cells.push({ x: startCol + 2, y: startRow + 2 });
      break;

    case 't_shape': // T shape
      cells.push({ x: startCol, y: startRow });
      cells.push({ x: startCol + 1, y: startRow });
      cells.push({ x: startCol + 2, y: startRow });
      cells.push({ x: startCol + 1, y: startRow + 1 });
      cells.push({ x: startCol + 1, y: startRow + 2 });
      break;

    case 'cross': // + shape (5 cells)
      cells.push({ x: startCol + 1, y: startRow });
      cells.push({ x: startCol, y: startRow + 1 });
      cells.push({ x: startCol + 1, y: startRow + 1 });
      cells.push({ x: startCol + 2, y: startRow + 1 });
      cells.push({ x: startCol + 1, y: startRow + 2 });
      break;

    default:
      // Default 2x2
      cells.push({ x: startCol, y: startRow });
      cells.push({ x: startCol + 1, y: startRow });
      cells.push({ x: startCol, y: startRow + 1 });
      cells.push({ x: startCol + 1, y: startRow + 1 });
  }

  return cells;
}
