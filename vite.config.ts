import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactOkcancel',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.esm.js' : 'index.js'),
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
    cssCodeSplit: false, // CSS를 별도 파일로 분리하지 않고 JS에 인라인으로 포함
    cssMinify: true,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      entryRoot: 'src',
      outDir: 'dist/types',
      insertTypesEntry: true, // dist/types/index.d.ts 생성
      tsconfigPath: 'tsconfig.app.json',
    }),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // SCSS에서도 사용 가능
    },
  },
});
