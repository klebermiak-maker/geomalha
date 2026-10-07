import { Mission } from '../types/geometry';

export const MISSIONS_DATA: Mission[] = [
  {
    id: 1,
    title: 'Missão 1: O Primeiro Jardim',
    story: 'O agricultor Bento quer preparar um canteiro com exatamente 6 quadradinhos de terra.',
    targetArea: 6,
    shapeRequirement: 'any',
    hint: 'Pode ser um retângulo de 2 colunas por 3 linhas (2 × 3 = 6) ou uma linha de 6 quadradinhos!',
    stars: 1,
    difficulty: 'fácil'
  },
  {
    id: 2,
    title: 'Missão 2: A Cerca de 12 Metros',
    story: 'Construa uma área cercada cujo contorno (perímetro) meça exatamente 12 unidades de cerca.',
    targetPerimeter: 12,
    shapeRequirement: 'any',
    hint: 'Dica: Um retângulo 4 por 2 tem lados 4 + 2 + 4 + 2 = 12! Ou um quadrado 3 por 3 tem 3 + 3 + 3 + 3 = 12.',
    stars: 1,
    difficulty: 'fácil'
  },
  {
    id: 3,
    title: 'Missão 3: O Quadrado Perfeito',
    story: 'O arquiteto precisa de uma sala quadrada com Área = 9 quadradinhos.',
    targetArea: 9,
    targetPerimeter: 12,
    shapeRequirement: 'square',
    hint: 'Em um quadrado todos os lados são iguais! 3 quadradinhos de largura e 3 de altura formam 3 × 3 = 9.',
    stars: 2,
    difficulty: 'fácil'
  },
  {
    id: 4,
    title: 'Missão 4: A Casa em Formato de L',
    story: 'Desenhe uma figura em formato de letra "L" que ocupe uma área de 7 quadradinhos.',
    targetArea: 7,
    shapeRequirement: 'l_shape',
    hint: 'Desenhe um braço vertical e um pé horizontal conectados, somando 7 quadradinhos no total!',
    stars: 2,
    difficulty: 'médio'
  },
  {
    id: 5,
    title: 'Missão 5: Retângulo Clássico',
    story: 'Crie um retângulo com Área = 10 quadradinhos e Perímetro = 14 unidades.',
    targetArea: 10,
    targetPerimeter: 14,
    shapeRequirement: 'rectangle',
    hint: 'Pense na tabuada: qual multiplicação resulta em 10? Tente 5 de largura por 2 de altura!',
    stars: 2,
    difficulty: 'médio'
  },
  {
    id: 6,
    title: 'Missão 6: Mesma Área, Outro Perímetro!',
    story: 'Incrível: queremos a MESMA Área = 10 quadradinhos da missão anterior, mas agora com Perímetro = 22!',
    targetArea: 10,
    targetPerimeter: 22,
    shapeRequirement: 'any',
    hint: 'Faça um retângulo bem comprido de 1 quadradinho de altura e 10 de comprimento (1 + 10 + 1 + 10 = 22)!',
    stars: 2,
    difficulty: 'médio'
  },
  {
    id: 7,
    title: 'Missão 7: A Cruz de Socorro',
    story: 'Desenhe o símbolo da cruz médica (formato de adição +) com Área = 5 quadradinhos e Perímetro = 12.',
    targetArea: 5,
    targetPerimeter: 12,
    shapeRequirement: 'any',
    hint: 'Pinte 1 quadradinho no centro e 1 em cada uma das 4 direções (cima, baixo, esquerda, direita).',
    stars: 3,
    difficulty: 'médio'
  },
  {
    id: 8,
    title: 'Missão 8: A Escadinha Divertida',
    story: 'Construa uma escada de 3 colunas: 1 quadradinho na 1ª coluna, 2 na 2ª coluna e 3 na 3ª coluna!',
    targetArea: 6,
    targetPerimeter: 12,
    shapeRequirement: 'any',
    hint: 'A área será 1 + 2 + 3 = 6 quadradinhos. Verifique se o contorno dá 12 unidades!',
    stars: 3,
    difficulty: 'desafio'
  },
  {
    id: 9,
    title: 'Missão 9: O Enigma da Área 12 e Perímetro 16',
    story: 'Crie uma figura com Área = 12 quadradinhos e Perímetro = 16 unidades de contorno.',
    targetArea: 12,
    targetPerimeter: 16,
    shapeRequirement: 'any',
    hint: 'Você pode tentar um retângulo em forma de L, ou um retângulo 4×3 modificado com reentrâncias!',
    stars: 3,
    difficulty: 'desafio'
  },
  {
    id: 10,
    title: 'Missão 10: O Mestre Arquiteto (4x4)',
    story: 'Construa um quadrado de 4 por 4. Descubra sua área e perímetro!',
    targetArea: 16,
    targetPerimeter: 16,
    shapeRequirement: 'square',
    hint: 'Um quadrado 4 × 4 tem Área = 16 (4 × 4) e Perímetro = 16 (4 + 4 + 4 + 4). Área e perímetro com o mesmo valor!',
    stars: 3,
    difficulty: 'desafio'
  }
];
