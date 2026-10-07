import { QuizQuestion } from '../types/geometry';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Pergunta 1: Área do Retângulo',
    type: 'area',
    cells: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    options: [5, 6, 8, 10],
    correctAnswer: 6,
    explanation: 'A figura tem 3 colunas e 2 linhas. Contando os quadradinhos: 3 × 2 = 6 quadradinhos (6 u²)!',
    unit: 'quadradinhos (u²)'
  },
  {
    id: 2,
    title: 'Pergunta 2: Perímetro do Retângulo',
    type: 'perimeter',
    cells: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    options: [6, 10, 12, 14],
    correctAnswer: 10,
    explanation: 'O contorno tem: 3 unidades em cima + 2 na direita + 3 embaixo + 2 na esquerda = 3 + 2 + 3 + 2 = 10 unidades de contorno!',
    unit: 'unidades (u)'
  },
  {
    id: 3,
    title: 'Pergunta 3: Área do Quadrado',
    type: 'area',
    cells: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ],
    options: [6, 9, 12, 16],
    correctAnswer: 9,
    explanation: 'Em um quadrado 3 × 3, multiplicamos lado × lado: 3 × 3 = 9 quadradinhos!',
    unit: 'quadradinhos (u²)'
  },
  {
    id: 4,
    title: 'Pergunta 4: Perímetro do Quadrado 3x3',
    type: 'perimeter',
    cells: [
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }
    ],
    options: [9, 12, 15, 18],
    correctAnswer: 12,
    explanation: 'O perímetro é a soma dos 4 lados: 3 + 3 + 3 + 3 = 12 unidades (u)!',
    unit: 'unidades (u)'
  },
  {
    id: 5,
    title: 'Pergunta 5: Área da Letra L',
    type: 'area',
    cells: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    options: [4, 5, 7, 8],
    correctAnswer: 5,
    explanation: 'Contando um a um os quadradinhos preenchidos: temos 3 na coluna vertical e mais 2 na horizontal = 5 quadradinhos!',
    unit: 'quadradinhos (u²)'
  },
  {
    id: 6,
    title: 'Pergunta 6: Perímetro da Letra L',
    type: 'perimeter',
    cells: [
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    options: [10, 12, 14, 16],
    correctAnswer: 12,
    explanation: 'Contando todos os tracinhos do contorno externo: 1 (topo) + 2 (degrau) + 2 (topo horizontal) + 1 (direita) + 3 (base) + 3 (esquerda) = 12 unidades!',
    unit: 'unidades (u)'
  },
  {
    id: 7,
    title: 'Pergunta 7: Área da Cruz (+)',
    type: 'area',
    cells: [
      { x: 3, y: 1 },
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 3, y: 3 }
    ],
    options: [4, 5, 6, 9],
    correctAnswer: 5,
    explanation: 'A cruz é formada por 1 quadradinho no meio e 4 ao redor: 1 + 4 = 5 quadradinhos!',
    unit: 'quadradinhos (u²)'
  },
  {
    id: 8,
    title: 'Pergunta 8: Perímetro da Cruz (+)',
    type: 'perimeter',
    cells: [
      { x: 3, y: 1 },
      { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 3, y: 3 }
    ],
    options: [8, 10, 12, 14],
    correctAnswer: 12,
    explanation: 'Cada uma das 4 pontas tem 3 lados expostos: 4 × 3 = 12 unidades de contorno!',
    unit: 'unidades (u)'
  }
];
