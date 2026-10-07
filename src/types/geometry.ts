export interface Point {
  x: number;
  y: number;
}

export type GridMode = 'cells' | 'vertices';

export type ActiveTool = 'draw' | 'erase' | 'stamp';

export type StampShape = 'rectangle' | 'square' | 'l_shape' | 't_shape' | 'cross' | 'triangle';

export interface GridDimensions {
  cols: number;
  rows: number;
}

export interface CellKey {
  col: number;
  row: number;
}

export interface EdgeSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  index: number;
}

export interface MeasurementResult {
  area: number;
  perimeter: number;
  cellCount: number;
  edgeSegments: EdgeSegment[];
  boundingBox?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  isSimpleRectangle: boolean;
  explanation: {
    areaText: string;
    perimeterText: string;
    details: string;
  };
}

export interface Mission {
  id: number;
  title: string;
  story: string;
  targetArea?: number;
  targetPerimeter?: number;
  shapeRequirement?: 'any' | 'rectangle' | 'square' | 'l_shape' | 'fixed_area_different_perim';
  minArea?: number;
  maxPerimeter?: number;
  hint: string;
  stars: number;
  difficulty: 'fácil' | 'médio' | 'desafio';
}

export interface QuizQuestion {
  id: number;
  title: string;
  type: 'area' | 'perimeter';
  cells: Point[]; // col, row
  options: number[];
  correctAnswer: number;
  explanation: string;
  unit: string;
}

export interface SavedShape {
  id: string;
  name: string;
  date: string;
  color: string;
  cells: Point[];
  area: number;
  perimeter: number;
}
