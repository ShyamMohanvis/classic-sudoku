import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateRandomPuzzle } from '../src/sudoku/generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEVELS_PER_DIFFICULTY = 20;
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const levels = {
  easy: [],
  medium: [],
  hard: []
};

console.log('Generating Sudoku Levels...');

for (const diff of DIFFICULTIES) {
  console.log(`Generating ${diff} levels...`);
  for (let i = 1; i <= LEVELS_PER_DIFFICULTY; i++) {
    process.stdout.write(`  Level ${i}/${LEVELS_PER_DIFFICULTY}... `);
    const data = generateRandomPuzzle(diff);
    levels[diff].push({
      id: i,
      difficulty: diff,
      puzzle: data.puzzle,
      solution: data.solution
    });
    console.log('Done.');
  }
}

const outputPath = path.join(__dirname, '..', 'src', 'game', 'levels.js');
const outputContent = `/**
 * Pre-generated Sudoku Levels
 * 60 levels total (20 easy, 20 medium, 20 hard)
 */

export const LEVELS = ${JSON.stringify(levels, null, 2)};
`;

fs.writeFileSync(outputPath, outputContent, 'utf-8');
console.log(`\\nSuccessfully generated ${LEVELS_PER_DIFFICULTY * 3} levels at src/game/levels.js`);
