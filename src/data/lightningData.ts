import { LightningRound } from '../types/geometry';

export const LIGHTNING_ROUNDS: LightningRound[] = [
  {
    id: 1,
    title: 'Rodada 1: Aquecimento Rápido',
    instruction: 'Desenhe qualquer figura com Área = 6 quadradinhos (u²)!',
    targetArea: 6,
    shapeRequirement: 'any',
    timeLimit: 45,
    hint: 'Pode ser um retângulo 2×3 ou 1×6, ou 6 quadradinhos conectados!',
    pointsReward: 100
  },
  {
    id: 2,
    title: 'Rodada 2: Cerca Veloz',
    instruction: 'Construa uma figura com Perímetro = 10 unidades de contorno (u)!',
    targetPerimeter: 10,
    shapeRequirement: 'any',
    timeLimit: 40,
    hint: 'Um retângulo de 3 por 2 tem contorno: 3 + 2 + 3 + 2 = 10 u!',
    pointsReward: 120
  },
  {
    id: 3,
    title: 'Rodada 3: Quadrado Relâmpago',
    instruction: 'Construa um quadrado com Área = 4 quadradinhos (u²)!',
    targetArea: 4,
    targetPerimeter: 8,
    shapeRequirement: 'square',
    timeLimit: 35,
    hint: 'Em um quadrado, largura e altura são iguais: 2 × 2 = 4!',
    pointsReward: 140
  },
  {
    id: 4,
    title: 'Rodada 4: Desafio Duplo',
    instruction: 'Desenhe uma figura com Área = 8 u² e Perímetro = 12 u!',
    targetArea: 8,
    targetPerimeter: 12,
    shapeRequirement: 'any',
    timeLimit: 40,
    hint: 'Tente um retângulo de 4 colunas por 2 linhas (4 × 2 = 8, P = 4+2+4+2 = 12)!',
    pointsReward: 160
  },
  {
    id: 5,
    title: 'Rodada 5: Retângulo Turbo',
    instruction: 'Construa um retângulo perfeito com Área = 12 u²!',
    targetArea: 12,
    shapeRequirement: 'rectangle',
    timeLimit: 35,
    hint: 'Você pode fazer 4 colunas × 3 linhas (4 × 3 = 12) ou 6 colunas × 2 linhas!',
    pointsReward: 180
  },
  {
    id: 6,
    title: 'Rodada 6: Contorno Exato',
    instruction: 'Crie uma figura com Perímetro exatamente igual a 14 unidades (u)!',
    targetPerimeter: 14,
    shapeRequirement: 'any',
    timeLimit: 35,
    hint: 'Um retângulo 5×2 ou 4×3 tem perímetro 14 (5+2+5+2 = 14)!',
    pointsReward: 200
  },
  {
    id: 7,
    title: 'Rodada 7: Letra L Relâmpago',
    instruction: 'Desenhe uma figura em formato de letra "L" com Área = 5 quadradinhos!',
    targetArea: 5,
    shapeRequirement: 'l_shape',
    timeLimit: 35,
    hint: 'Faça uma coluna vertical de 3 ou 4 quadradinhos e uma base horizontal conectada!',
    pointsReward: 220
  },
  {
    id: 8,
    title: 'Rodada 8: Super Quadrado',
    instruction: 'Construa um quadrado com Perímetro = 16 unidades de contorno!',
    targetPerimeter: 16,
    targetArea: 16,
    shapeRequirement: 'square',
    timeLimit: 30,
    hint: 'Divida 16 por 4 lados: cada lado mede 4 quadradinhos (4 × 4 = 16)!',
    pointsReward: 250
  },
  {
    id: 9,
    title: 'Rodada 9: Enigma da Área 9',
    instruction: 'Crie qualquer figura com Área = 9 quadradinhos (u²)!',
    targetArea: 9,
    shapeRequirement: 'any',
    timeLimit: 25,
    hint: 'Um quadrado 3×3 tem 9 quadradinhos (3 × 3 = 9)!',
    pointsReward: 280
  },
  {
    id: 10,
    title: 'Rodada 10: Grande Final Relâmpago',
    instruction: 'Crie uma figura com Área = 10 u² E Perímetro = 14 u!',
    targetArea: 10,
    targetPerimeter: 14,
    shapeRequirement: 'any',
    timeLimit: 30,
    hint: 'Pense em 5 colunas por 2 linhas: Área = 5 × 2 = 10, Perímetro = 5+2+5+2 = 14!',
    pointsReward: 350
  }
];
