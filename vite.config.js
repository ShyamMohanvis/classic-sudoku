import { defineConfig } from 'vite';

export default defineConfig({
  base: '/classic-sudoku/',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
