import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(__dirname, 'src');

console.log('__dirname:', __dirname);
console.log('srcPath:', srcPath);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': srcPath,
    },
  },
});
