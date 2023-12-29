import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import typescript2 from 'rollup-plugin-typescript2';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    typescript2({
      check: false,
      include: ['src/components/**/*.vue'],
      tsconfigOverride: {
        compilerOptions: {
          outDir: 'dist',
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      exclude: ['vite.config.ts'],
    }),
  ],
  build: {
    // target: 'esnext',
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/components/main.ts',
      name: 'tsAdminComponents',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `ts-admin-components.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: path.resolve(__dirname, 'src/components/main.ts'),
      },
      external: ['vue'],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'main.css') return 'style.css';
          return assetInfo.name;
        },
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  preview: {
    port: 8080,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'scss': path.resolve(__dirname, 'src/assets/scss'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~primevue': path.resolve(__dirname, 'node_modules/primevue'),
      '~remixicon': path.resolve(__dirname, 'node_modules/remixicon'),
      '~rfs': path.resolve(__dirname, 'node_modules/rfs'),
    },
  },
});
